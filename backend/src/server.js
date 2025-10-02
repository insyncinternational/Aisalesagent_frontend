import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { sequelize } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import voiceRoutes from './routes/voices.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/uploads.js';
import experienceRoutes from './routes/experience.js';
import webhookRoutes from './routes/webhooks.js';
import conversationRoutes from './routes/conversations.js';
import calendlyRoutes from './routes/calendly.js';
import aiDemoRoutes from './routes/ai-demo.js';
import knowledgeBaseRoutes from './routes/knowledge-base.js';

// Import models
import { CallLog } from './models/index.js';

// Import services
import twilioService from './services/twilioService.js';
import intelligentCallService from './services/intelligentCallService.js';
import openaiService from './services/openaiService.js';
import elevenlabsService from './services/elevenlabsService.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

// WebSocket server setup
const wss = new WebSocketServer({ server });

// Active connections for media streaming
const activeConnections = new Map();

// Connection parameters storage for campaigns
const connectionParams = new Map();

// WebSocket connection handler for outbound media streaming
wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', 'ws://localhost');
  const pathname = url.pathname;

  console.log('WebSocket connection established:', pathname);

  // Handle /outbound-media-stream/:campaignId pattern
  const mediaStreamMatch = pathname.match(/^\/outbound-media-stream\/(.+)$/);
  if (mediaStreamMatch) {
    const campaignId = mediaStreamMatch[1];
    handleOutboundMediaStream(ws, req, campaignId);
  } else {
    console.log('Unknown WebSocket path:', pathname);
    ws.close(1008, 'Unknown endpoint');
  }
});

// Handle outbound media streaming (Twilio <-> ElevenLabs)
async function handleOutboundMediaStream(ws, req, campaignIdFromUrl) {
  let elevenLabsWs = null;
  let callLogId = null;
  let campaignId = campaignIdFromUrl;
  let campaign = null;
  let firstName = null;
  let isTestCall = false;
  let useElevenLabs = true;

  console.log('New outbound media stream connection for campaign:', campaignId);

  // server finds params via connectionParams
  const campaignParams = connectionParams.get(`${campaignId || 'default'}_params`);
  if (campaignParams) {
    ({ isTestCall, firstName, useElevenLabs } = campaignParams);
    console.log('Found connection params:', campaignParams);
  } else {
    console.log('❌ No connection params found for key:', `${campaignId || 'default'}_params`);
  }

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.event === 'start') {
        // on "start": capture streamSid/callSid
        const streamSid = data.start.streamSid;
        const callSid = data.start.callSid;
        
        // Get callLogId from connection params if available
        if (campaignParams && campaignParams.callLogId) {
          callLogId = campaignParams.callLogId;
        }

        console.log('🚀 Media stream started:', { streamSid, callSid, callLogId, campaignId, firstName, useElevenLabs });
        console.log('🔍 Connection params retrieved:', campaignParams);
        console.log('🔍 Full start event data:', JSON.stringify(data.start, null, 2));

        // Update call log status to 'answered'
        if (callLogId) {
          try {
            const callLog = await CallLog.findByPk(callLogId);
            if (callLog) {
              await callLog.update({ status: 'answered' });
              console.log('Updated call log to answered:', callLogId);
            }
          } catch (error) {
            console.error('Failed to update call log:', error);
          }
        }

        // Fetch campaign details if campaignId is provided
        if (campaignId && campaignId !== 'default') {
          try {
            const { Campaign } = await import('./models/index.js');
            campaign = await Campaign.findByPk(campaignId);
            console.log('Campaign loaded for conversation:', campaign?.name);
          } catch (error) {
            console.error('Failed to load campaign:', error);
          }
        }

        // call setupElevenLabsConnection(lead, ws, streamSid, callSid, campaignId)
        if (useElevenLabs) {
          console.log('🔗 Setting up ElevenLabs connection...', { firstName, campaignId, callLogId });
          const lead = { firstName: firstName || 'there' };
          elevenLabsWs = await setupElevenLabsConnection(lead, ws, streamSid, callSid, campaignId, campaign, callLogId);
          
          if (elevenLabsWs) {
            console.log('✅ ElevenLabs WebSocket connection established successfully');
          } else {
            console.log('❌ Failed to establish ElevenLabs WebSocket connection');
          }
        } else {
          console.log('⚠️ ElevenLabs not configured for this call');
        }

      } else if (data.event === 'media') {
        // Twilio "media" → send to ElevenLabs as { type: user_audio_chunk }
        if (elevenLabsWs && elevenLabsWs.readyState === WebSocket.OPEN) {
          const elevenLabsMessage = {
            type: 'user_audio_chunk',
            chunk: data.media.payload
          };
          console.log('Sending audio chunk to ElevenLabs, length:', data.media.payload.length);
          elevenLabsWs.send(JSON.stringify(elevenLabsMessage));
        }

      } else if (data.event === 'stop') {
        console.log('Media stream stopped');
        // Send End of Sequence message to ElevenLabs before closing
        if (elevenLabsWs && elevenLabsWs.readyState === WebSocket.OPEN) {
          const eosMessage = {
            text: ""
          };
          elevenLabsWs.send(JSON.stringify(eosMessage));
        }
        
        // Clean up ElevenLabs connection
        if (elevenLabsWs) {
          elevenLabsWs.close();
        }
      }

    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Twilio WebSocket closed');
    if (elevenLabsWs) {
      elevenLabsWs.close();
    }

    // Update call log to completed if it exists
    if (callLogId) {
      CallLog.findByPk(callLogId).then(callLog => {
        if (callLog && callLog.status === 'answered') {
          callLog.update({ status: 'completed' });
          console.log('Updated call log to completed:', callLogId);
        }
      }).catch(error => {
        console.error('Failed to update call log on close:', error);
      });
    }
  });

  ws.on('error', (error) => {
    console.error('Twilio WebSocket error:', error);
    if (elevenLabsWs) {
      elevenLabsWs.close();
    }
  });
}

// setupElevenLabsConnection function
async function setupElevenLabsConnection(lead, ws, streamSid, callSid, campaignId, campaign, callLogId) {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    console.log('ElevenLabs config check:', {
      hasAgentId: !!agentId,
      hasApiKey: !!apiKey,
      agentId: agentId ? `${agentId.substring(0, 8)}...` : 'missing'
    });
    
    if (!agentId || !apiKey) {
      console.error('ElevenLabs configuration missing - Agent ID or API Key not found');
      return null;
    }

    // get signed URL from GET /v1/convai/conversation/get_signed_url?agent_id=...
    console.log('Getting signed URL from ElevenLabs...');
    const signedUrlResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!signedUrlResponse.ok) {
      console.error('Failed to get signed URL:', signedUrlResponse.status);
      // Fallback to direct WebSocket connection
      var elevenLabsWsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`;
    } else {
      const signedUrlData = await signedUrlResponse.json();
      console.log('Received signed URL:', signedUrlData);
      var elevenLabsWsUrl = signedUrlData.signed_url;
    }

    // Prepare knowledge base documents for this campaign (if any)
    let knowledgeBaseDocuments = [];
    try {
      if (campaignId && campaignId !== 'default') {
        const { KnowledgeBase } = await import('./models/index.js');
        const kbFiles = await KnowledgeBase.findAll({ where: { campaignId } });
        const kbDocIds = kbFiles.map(kb => kb.elevenlabsDocId).filter(Boolean);
        knowledgeBaseDocuments = kbDocIds.map(id => ({ type: 'file', id }));

        // Best-effort: patch the agent to include these docs before the call
        if (kbDocIds.length > 0) {
          try {
            await elevenlabsService.updateAgentKnowledgeBase(agentId, kbDocIds);
            console.log('Agent knowledge base patched for campaign before call');
          } catch (kbErr) {
            console.warn('Failed to patch agent KB before call:', kbErr?.message || kbErr);
          }
        }
      }
    } catch (kbFetchErr) {
      console.warn('Failed to prepare campaign knowledge base documents:', kbFetchErr?.message || kbFetchErr);
    }

    // open WS to ElevenLabs
    console.log('Connecting to ElevenLabs WebSocket:', elevenLabsWsUrl);
    const elevenLabsWs = new WebSocket(elevenLabsWsUrl, [], {
      headers: {
        'xi-api-key': apiKey
      }
    });

    elevenLabsWs.on('open', () => {
      console.log('Connected to ElevenLabs WebSocket');
      
      // send { type: conversation_initiation_client_data, conversation_config_override, dynamic_variables{first_name} }
      const conversationInitPayload = {
        type: "conversation_initiation_client_data",
        dynamic_variables: {
          first_name: lead.firstName || 'there'
        }
      };
      
      // Add campaign-specific configuration if available
      if (campaign && (campaign.firstPrompt || campaign.systemPersona)) {
        const prompt = campaign.firstPrompt || campaign.systemPersona;
        conversationInitPayload.conversation_config_override = {
          agent: {
            prompt: {
              prompt: prompt
            }
          }
        };
        console.log('Using campaign prompt:', prompt);
      }

      // Include knowledge base documents for this campaign if available
      if (knowledgeBaseDocuments.length > 0) {
        if (!conversationInitPayload.conversation_config_override) {
          conversationInitPayload.conversation_config_override = {};
        }
        conversationInitPayload.conversation_config_override.knowledge_base = {
          documents: knowledgeBaseDocuments
        };
      }
      
      console.log('🚀 Sending conversation initiation to ElevenLabs:', JSON.stringify(conversationInitPayload, null, 2));
      elevenLabsWs.send(JSON.stringify(conversationInitPayload));
      console.log('✅ Conversation initiation message sent to ElevenLabs');
    });

    elevenLabsWs.on('message', (elevenLabsMessage) => {
      try {
        const elevenLabsData = JSON.parse(elevenLabsMessage.toString());
        console.log('🎧 ElevenLabs message type:', elevenLabsData.type);
        
        // Only log full message for important types to avoid spam
        if (elevenLabsData.type === 'conversation_initiation_metadata' || elevenLabsData.type === 'error') {
          console.log('🎧 Full ElevenLabs message:', JSON.stringify(elevenLabsData, null, 2));
        }

        if (elevenLabsData.type === 'audio') {
          // ElevenLabs "audio" → send to Twilio as { event: media, payload }
          console.log('🎤 Received audio from ElevenLabs, length:', elevenLabsData.audio?.length || 0);
          const twilioMessage = {
            event: 'media',
            streamSid: streamSid,
            media: {
              payload: elevenLabsData.audio
            }
          };
          ws.send(JSON.stringify(twilioMessage));
          console.log('📤 Sent audio to Twilio, payload length:', elevenLabsData.audio?.length || 0);
        } else if (elevenLabsData.type === 'conversation_initiation_metadata') {
          // on conversation_initiation_metadata: extract conversation_id → storage.updateCallLog(..., elevenLabsConversationId)
          const conversationId = elevenLabsData.conversation_id || 
                               elevenLabsData.conversationId || 
                               elevenLabsData.id ||
                               elevenLabsData.conversation_initiation_metadata_event?.conversation_id;
          
          if (callLogId && conversationId) {
            console.log('🔄 Updating call log ID:', callLogId, 'with ElevenLabs conversation ID:', conversationId);
            
            CallLog.findByPk(callLogId).then(callLog => {
              if (callLog) {
                return callLog.update({
                  elevenlabsConversationId: conversationId
                });
              } else {
                console.error('❌ Call log not found for ID:', callLogId);
                return null;
              }
            }).then(updatedCallLog => {
              if (updatedCallLog) {
                console.log('✅ Successfully updated call log with ElevenLabs conversation ID:', conversationId);
              }
            }).catch(error => {
              console.error('❌ Failed to update ElevenLabs conversation ID:', error);
            });
          } else {
            console.log('⚠️ Missing callLogId or conversation_id:', { 
              callLogId, 
              conversationId,
              availableFields: Object.keys(elevenLabsData)
            });
          }
        }
      } catch (error) {
        console.error('Error processing ElevenLabs message:', error);
      }
    });

    elevenLabsWs.on('error', (error) => {
      console.error('ElevenLabs WebSocket error:', error);
    });

    elevenLabsWs.on('close', (code, reason) => {
      console.log('ElevenLabs WebSocket closed with code:', code, 'reason:', reason?.toString());
      
      // ElevenLabs "conversation_ended"/WS close → update lead status + callLog + campaign stats
      if (callLogId) {
        CallLog.findByPk(callLogId).then(async callLog => {
          if (callLog && callLog.status === 'answered') {
            await callLog.update({ status: 'completed' });
            console.log('Updated call log to completed on ElevenLabs WS close:', callLogId);
            
            // Update lead status if applicable
            if (callLog.leadId) {
              const { Lead } = await import('./models/index.js');
              const lead = await Lead.findByPk(callLog.leadId);
              if (lead) {
                await lead.update({ status: 'completed' });
                console.log('Updated lead to completed:', callLog.leadId);
              }
            }
            
            // Update campaign stats
            if (callLog.campaignId) {
              await elevenlabsService.updateCampaignStatistics(callLog.campaignId);
            }
          }
        }).catch(error => {
          console.error('Failed to update call log on ElevenLabs close:', error);
        });
      }
    });

    return elevenLabsWs;

  } catch (error) {
    console.error('Failed to setup ElevenLabs connection:', error);
    return null;
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL,
    'https://yourdomain.com' // Add your production domain
  ].filter(Boolean), // Remove null/undefined values
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/voices', voiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/experience-call', experienceRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/calendly', calendlyRoutes);
app.use('/api/ai-demo', aiDemoRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);

app.get('/api/calls/:callSid/recording', async (req, res) => {
  try {
    const { callSid } = req.params;
    const result = await twilioService.getRecordingUrl(callSid); // Note: function name in service is now different
    if (result.success) {
      res.setHeader('Content-Type', 'audio/mpeg');
      result.stream.pipe(res);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    console.error('Failed to retrieve recording:', error);
    res.status(500).json({ error: 'Failed to retrieve recording.' });
  }
});

// TODO: REMOVE THIS AFTER FRONTEND IS UPDATED
app.use('/api/calls', conversationRoutes);

// TwiML endpoint for outbound calls
app.all('/outbound-call-twiml', (req, res) => {
  try {
    const { callLogId, firstName, isTestCall, useElevenLabs, campaignId } = req.query;

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
    const wsUrl = baseUrl.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');

    // build wss URL: wss://.../outbound-media-stream/:campaignId
    const streamUrl = `${wsUrl}/outbound-media-stream/${campaignId || 'default'}`;
    const escapedStreamUrl = streamUrl.replace(/&/g, '&amp;');

    // store connectionParams[campaignId_params] = { isTestCall, firstName, campaignId, useElevenLabs }
    connectionParams.set(`${campaignId || 'default'}_params`, {
      isTestCall: isTestCall === 'true',
      firstName: firstName || 'there',
      campaignId: campaignId || 'default',
      useElevenLabs: useElevenLabs === 'true',
      callLogId: callLogId
    });

    console.log('🔧 TwiML requested for callLogId:', callLogId);
    console.log('🌐 Stream URL:', escapedStreamUrl);
    console.log('💾 Stored connection params for campaign:', campaignId || 'default');
    console.log('🔑 Connection params key:', `${campaignId || 'default'}_params`);

    // return <Connect><Stream url="wss://.../outbound-media-stream/:campaignId"/>
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <Stream url="${escapedStreamUrl}" track="inbound_track" />
      </Connect>
    </Response>`;

    res.type('text/xml').send(twimlResponse);
  } catch (error) {
    console.error('TwiML generation error:', error);
    res.status(500).type('text/xml').send('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>');
  }
});

// Twilio status callback endpoint
app.post('/api/twilio/status', async (req, res) => {
  try {
    const { CallSid, CallStatus, CallDuration, Timestamp } = req.body;

    console.log('Twilio status callback:', { CallSid, CallStatus, CallDuration });

    if (!CallSid) {
      return res.status(400).send('Missing CallSid');
    }

    // Find call log by Twilio SID
    const callLog = await CallLog.findOne({
      where: { twilioCallSid: CallSid }
    });

    if (!callLog) {
      console.warn('Call log not found for Twilio SID:', CallSid);
      return res.status(200).send('OK'); // Still acknowledge to prevent retries
    }

    // Update call log
    const updateData = {
      status: CallStatus,
    };

    if (CallDuration) {
      updateData.duration = parseInt(CallDuration);
    }

    // If call is completed, update timestamp
    if (CallStatus === 'completed') {
      updateData.completedAt = new Date();
    }

    await callLog.update(updateData);

    console.log('Updated call log:', callLog.id, 'with status:', CallStatus);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Twilio status callback error:', error);
    res.status(500).send('ERROR');
  }
});

// Additional API routes for frontend compatibility
app.use('/api', campaignRoutes);
app.use('/api', voiceRoutes);
// update-agent is now under /api/campaigns/:id/update-agent via campaignRoutes

// AI Services endpoints
// Keep voices under router; remove duplicate direct handler to avoid mismatch

app.post('/api/generate-message', async (req, res) => {
  try {
    const { campaignData, leadData } = req.body;
    const message = await intelligentCallService.generateOpeningMessage(campaignData, leadData);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

app.get('/api/calls/active', (req, res) => {
  const activeCalls = intelligentCallService.getActiveCalls();
  res.json(activeCalls);
});

app.get('/api/calls/:callId/status', (req, res) => {
  const callStatus = intelligentCallService.getCallStatus(req.params.callId);
  if (callStatus) {
    res.json(callStatus);
  } else {
    res.status(404).json({ error: 'Call not found' });
  }
});

app.post('/api/calls/:callId/end', async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await intelligentCallService.endCall(req.params.callId, reason);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to end call' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      twilio: !!process.env.TWILIO_ACCOUNT_SID,
      openai: !!process.env.OPENAI_API_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
      database: !!process.env.DATABASE_URL
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    if (process.env.DATABASE_URL) {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
      
      // Sync database tables in production
      if (process.env.NODE_ENV === 'production') {
        await sequelize.sync({ force: false });
        console.log('✅ Database tables synced.');
      }
    } else {
      console.log('⚠️  Database not configured, using mock data.');
    }
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 API Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 AI Services: Twilio=${!!process.env.TWILIO_ACCOUNT_SID}, OpenAI=${!!process.env.OPENAI_API_KEY}, ElevenLabs=${!!process.env.ELEVENLABS_API_KEY}`);
      console.log(`🔊 WebSocket server ready for real-time audio streaming`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();