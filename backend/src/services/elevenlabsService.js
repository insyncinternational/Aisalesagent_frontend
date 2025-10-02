import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';
import { KnowledgeBase } from '../models/index.js';

dotenv.config();

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.agentId = process.env.ELEVENLABS_AGENT_ID;
    this.phoneNumberId = process.env.ELEVENLABS_PHONE_NUMBER_ID;
    this.webhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;
    this.baseURL = 'https://api.elevenlabs.io/v1';
  }

  async getVoices() {
    try {
      const response = await axios.get(`${this.baseURL}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return {
        success: true,
        voices: response.data.voices
      };
    } catch (error) {
      console.error('ElevenLabs get voices error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async cloneVoice(audioFile, name, description) {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description || '');
      formData.append('files', audioFile);

      const response = await axios.post(`${this.baseURL}/voices/add`, formData, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        voice: response.data
      };
    } catch (error) {
      console.error('ElevenLabs clone voice error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async makeCall(phoneNumber, campaignData) {
    try {
      // Use the selected voice from campaign data, or fallback to default
      const selectedVoice = campaignData.selectedVoice || "21m00Tcm4TlvDq8ikWAM";
      
      // Create a highly conversational AI agent configuration
      const agentConfig = {
        voice_id: selectedVoice,
        voice_settings: {
          stability: 0.3, // Very natural variation
          similarity_boost: 0.6, // Less rigid, more natural
          style: 0.4, // More expressive and emotional
          use_speaker_boost: true
        },
        model_id: "eleven_multilingual_v2",
        language: "en",
        accent: "american",
        // Enhanced conversational settings
        conversation_style: "natural",
        emotional_range: "high",
        response_style: "conversational"
      };

      // Enhanced conversational prompt
      const conversationalPrompt = this.generateConversationalPrompt(campaignData);

      const payload = {
        phone_number: phoneNumber,
        agent_id: this.agentId,
        phone_number_id: this.phoneNumberId,
        agent_config: agentConfig,
        first_message: conversationalPrompt.opening,
        system_prompt: conversationalPrompt.system,
        conversation_config: {
          max_duration: 600, // 10 minutes max for longer conversations
          end_call_phrases: [
            "thank you for your time",
            "have a great day",
            "goodbye",
            "talk to you later",
            "thanks for chatting",
            "take care"
          ],
          interruption_threshold: 0.2, // More sensitive to interruptions
          silence_timeout: 2, // Shorter silence timeout for more responsive
          background_sound: "office",
          // Enhanced conversation settings
          conversation_flow: "natural",
          response_delay: 0.5, // Natural response delay
          emotional_responses: true,
          follow_up_questions: true,
          active_listening: true
        },
        metadata: {
          campaign_id: campaignData.campaignId,
          lead_id: campaignData.leadId,
          lead_name: campaignData.leadName,
          campaign_type: "sales"
        }
      };

      console.log('🤖 Making conversational AI call with ElevenLabs...');
      console.log('📞 Opening message:', conversationalPrompt.opening);
      console.log('🎤 Using voice:', selectedVoice);
      console.log('📋 Agent ID:', this.agentId);
      console.log('📞 Phone Number ID:', this.phoneNumberId);

      const response = await axios.post(`${this.baseURL}/calls`, payload, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ ElevenLabs call response:', response.data);

      return {
        success: true,
        call: response.data,
        agent_config: agentConfig
      };
    } catch (error) {
      console.error('ElevenLabs make call error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  generateConversationalPrompt(campaignData) {
    const leadName = campaignData.leadName || 'there';
    
    // Use the campaign's script opening if available, otherwise use default
    let opening;
    if (campaignData.scriptOpening) {
      opening = campaignData.scriptOpening.replace(/{name}/g, leadName);
    } else {
      opening = `Hi ${leadName}, this is Sarah calling. I hope I'm not catching you at a bad time? I wanted to reach out about something that might be really helpful for you. Do you have a quick moment to chat?`;
    }

    // Enhanced system prompt with campaign context
    const knowledgeBase = campaignData.knowledgeBase || [];
    const knowledgeContext = knowledgeBase.length > 0 ? 
      `\n\nKnowledge Base Information:\n${knowledgeBase.map(kb => `- ${kb.name || kb.description || 'Product information'}`).join('\n')}` : '';

    const system = `You are Sarah, a warm, friendly, and highly conversational sales representative. You're having a genuine, human conversation over the phone.

CONVERSATION STYLE:
- Be extremely natural and human-like - use "um", "you know", "actually", "really"
- Show genuine interest in what they're saying
- React emotionally to their responses (excited, concerned, understanding)
- Use their name naturally throughout the conversation
- Ask follow-up questions that show you're listening
- Share brief personal touches when appropriate
- Use conversational fillers and natural speech patterns

RESPONSE GUIDELINES:
- Keep responses natural and conversational (10-20 seconds)
- Ask open-ended questions to keep them talking
- Show empathy and understanding
- Use phrases like "I totally understand", "That makes sense", "I hear you"
- If they seem busy, offer to call back at a better time
- If interested, guide them naturally toward next steps
- If not interested, gracefully end the call

KNOWLEDGE & CONTEXT:
Campaign Context: ${campaignData.firstPrompt || 'General business outreach'}
System Persona: ${campaignData.systemPersona || 'Professional sales representative'}${knowledgeContext}

CRITICAL: This is a REAL conversation. Listen actively, respond naturally, and be genuinely helpful. Use the knowledge base to provide accurate, helpful information when relevant.`;

    return { opening, system };
  }

  async getCallStatus(callId) {
    try {
      const response = await axios.get(`${this.baseURL}/calls/${callId}`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return {
        success: true,
        call: response.data
      };
    } catch (error) {
      console.error('ElevenLabs get call status error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async handleWebhook(req, res) {
    try {
      const signature = req.headers['x-elevenlabs-signature'];
      
      // Skip validation if configured to do so
      if (process.env.ELEVENLABS_WEBHOOK_SKIP_VALIDATION === 'true') {
        console.log('Webhook signature validation skipped');
      } else {
        // TODO: Implement proper webhook signature validation
        // This would involve verifying the signature using the webhook secret
      }

      const webhookData = req.body;
      console.log('ElevenLabs webhook received:', webhookData);

      // Handle different webhook events
      switch (webhookData.event) {
        case 'call_started':
          await this.handleCallStarted(webhookData);
          break;
        case 'call_ended':
        case 'conversation_ended':
          await this.handleCallEnded(webhookData);
          break;
        case 'call_analysis':
          await this.handleCallAnalysis(webhookData);
          break;
        case 'post_call_transcription':
          await this.handleTranscriptionWebhook(webhookData);
          break;
        case 'post_call_audio':
          await this.handleAudioWebhook(webhookData);
          break;
        default:
          console.log('Unknown webhook event:', webhookData.event);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  async handleCallStarted(webhookData) {
    // TODO: Update call status in database
    console.log('Call started:', webhookData.call_id);
  }

  async handleCallEnded(webhookData) {
    try {
      console.log('Call ended/conversation ended:', webhookData.call_id || webhookData.conversation_id);
      
      // Import models here to avoid circular imports
      const { CallLog, Lead, Campaign } = await import('../models/index.js');
      
      // Find the call log using ElevenLabs conversation ID
      let callLog = await CallLog.findOne({
        where: { elevenlabsConversationId: webhookData.call_id || webhookData.conversation_id }
      });

      // If not found by conversation ID, try to find by batch ID or other identifiers
      if (!callLog && webhookData.batch_id) {
        console.log(`🔍 Searching for call log by batch ID: ${webhookData.batch_id}`);
        callLog = await CallLog.findOne({
          where: { 
            campaignId: webhookData.metadata?.campaign_id,
            status: ['initiated', 'calling', 'ringing']
          },
          order: [['created_at', 'DESC']]
        });
        
        if (callLog) {
          console.log(`✅ Found call log ${callLog.id} by batch ID, updating conversation ID`);
          await callLog.update({
            elevenlabsConversationId: webhookData.call_id || webhookData.conversation_id
          });
        }
      }

      if (!callLog) {
        console.log(`No call log found for conversation ${webhookData.call_id || webhookData.conversation_id}`);
        return;
      }

      // Update basic call information
      const updateData = {
        status: webhookData.status || 'completed',
        duration: webhookData.duration || webhookData.duration_seconds || 0
      };

      // Extract and store transcription if available
      if (webhookData.transcript || webhookData.transcription) {
        updateData.transcription = JSON.stringify(webhookData.transcript || webhookData.transcription);
        console.log(`[Call Ended] Stored transcription for ${webhookData.call_id || webhookData.conversation_id}`);
        
        // Detect appointment intent in transcription
        await this.detectAndHandleAppointmentIntent(callLog, webhookData.transcript || webhookData.transcription);
      }

      // Update the call log
      await callLog.update(updateData);

      // ElevenLabs "conversation_ended"/WS close → update lead status + callLog + campaign stats
      // Update lead status if applicable
      if (callLog.leadId) {
        const lead = await Lead.findByPk(callLog.leadId);
        if (lead) {
          await lead.update({ 
            status: webhookData.status === 'completed' ? 'completed' : 'failed',
            call_duration: updateData.duration
          });
        }
      }

      // update campaign stats
      if (callLog.campaignId) {
        await this.updateCampaignStatistics(callLog.campaignId);
      }

      console.log(`Call log updated for conversation ${webhookData.call_id || webhookData.conversation_id}`);
    } catch (error) {
      console.error('Error handling call ended webhook:', error);
    }
  }

  async handleCallAnalysis(webhookData) {
    try {
      console.log('Call analysis received:', webhookData.call_id);
      
      // Import models here to avoid circular imports  
      const { CallLog } = await import('../models/index.js');
      
      // Find the call log and store analysis data
      const callLog = await CallLog.findOne({
        where: { elevenlabsConversationId: webhookData.call_id }
      });

      if (callLog && webhookData.transcript) {
        // If we get transcription data in analysis, store it
        const updateData = {
          transcription: JSON.stringify(webhookData.transcript)
        };
        
        await callLog.update(updateData);
        
        // Detect appointment intent in transcription
        await this.detectAndHandleAppointmentIntent(callLog, webhookData.transcript);
        
        console.log(`Call analysis stored for conversation ${webhookData.call_id}`);
      }
    } catch (error) {
      console.error('Error handling call analysis webhook:', error);
    }
  }

  async detectAndHandleAppointmentIntent(callLog, transcript) {
    try {
      const openaiService = await import('./openaiService.js');
      
      // Extract text from transcript
      let conversationText = '';
      if (Array.isArray(transcript)) {
        conversationText = transcript
          .map(entry => `${entry.speaker}: ${entry.text}`)
          .join('\n');
      } else if (typeof transcript === 'string') {
        conversationText = transcript;
      } else if (transcript.messages) {
        conversationText = transcript.messages
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
      }

      if (!conversationText) {
        console.log('No conversation text found for appointment detection');
        return;
      }

      console.log(`[Appointment Detection] Analyzing conversation for appointment intent...`);
      
      // Use OpenAI to analyze the conversation for appointment-related content
      const appointmentAnalysis = await openaiService.default.analyzeForAppointmentIntent(conversationText);
      
      if (appointmentAnalysis.hasAppointmentIntent) {
        console.log(`[Appointment Detection] ✅ Appointment intent detected!`);
        console.log(`Intent: ${appointmentAnalysis.intent}`);
        console.log(`Suggested time: ${appointmentAnalysis.suggestedTime || 'Not specified'}`);
        
        // Store appointment-related data in call log
        await this.storeAppointmentData(callLog, appointmentAnalysis);
        
        // Integrate with calendar system
        await this.scheduleAppointmentWithCalendar(callLog, appointmentAnalysis);
      } else {
        console.log(`[Appointment Detection] No appointment intent detected`);
      }
    } catch (error) {
      console.error('Error detecting appointment intent:', error);
    }
  }

  async storeAppointmentData(callLog, appointmentAnalysis) {
    try {
      // For now, we'll store appointment data in the transcription field as part of the JSON
      // In a production system, you might want to add dedicated appointment fields to the database
      let existingTranscription = {};
      if (callLog.transcription) {
        try {
          existingTranscription = JSON.parse(callLog.transcription);
        } catch (e) {
          existingTranscription = { originalTranscription: callLog.transcription };
        }
      }

      existingTranscription.appointmentAnalysis = appointmentAnalysis;
      existingTranscription.appointmentDetectedAt = new Date().toISOString();
      
      await callLog.update({
        transcription: JSON.stringify(existingTranscription)
      });
      
      console.log(`[Appointment Data] Stored appointment analysis for call log ${callLog.id}`);
    } catch (error) {
      console.error('Error storing appointment data:', error);
    }
  }

  async scheduleAppointmentWithCalendar(callLog, appointmentAnalysis) {
    try {
      const calendarService = await import('./calendarService.js');
      const { Lead, Campaign } = await import('../models/index.js');
      
      // Get additional lead and campaign information
      const lead = callLog.leadId ? await Lead.findByPk(callLog.leadId) : null;
      const campaign = await Campaign.findByPk(callLog.campaignId);
      
      const appointmentData = {
        conversationId: callLog.elevenlabsConversationId,
        callLogId: callLog.id,
        leadInfo: lead ? {
          id: lead.id,
          first_name: lead.first_name,
          last_name: lead.last_name,
          contact_no: lead.contact_no,
          email: lead.email
        } : null,
        campaignInfo: campaign ? {
          id: campaign.id,
          name: campaign.name,
          userId: campaign.userId
        } : null,
        appointmentAnalysis
      };
      
      const result = await calendarService.default.scheduleAppointment(appointmentData);
      
      if (result.success) {
        console.log(`[Appointment Scheduling] ✅ Successfully scheduled appointment for conversation ${callLog.elevenlabsConversationId}`);
        
        // Update the call log with appointment scheduling information
        let existingTranscription = {};
        if (callLog.transcription) {
          try {
            existingTranscription = JSON.parse(callLog.transcription);
          } catch (e) {
            existingTranscription = { originalTranscription: callLog.transcription };
          }
        }
        
        existingTranscription.appointmentScheduled = {
          appointmentId: result.appointment.id,
          scheduledAt: new Date().toISOString(),
          status: 'pending_confirmation'
        };
        
        await callLog.update({
          transcription: JSON.stringify(existingTranscription)
        });
      } else {
        console.error(`[Appointment Scheduling] ❌ Failed to schedule appointment: ${result.error}`);
      }
    } catch (error) {
      console.error('Error scheduling appointment with calendar service:', error);
    }
  }

  async getConversationTranscription(conversationId) {
    try {
      console.log(`🎙️ Fetching transcription from ElevenLabs for conversation: ${conversationId}`);
      
      const response = await axios.get(`${this.baseURL}/convai/conversations/${conversationId}`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (response.data && response.data.transcript) {
        console.log(`✅ Retrieved transcription from ElevenLabs for ${conversationId}`);
        return {
          success: true,
          transcription: response.data.transcript
        };
      } else {
        console.log(`⚠️ No transcription data available for ${conversationId}`);
        return {
          success: false,
          error: 'No transcription data available'
        };
      }
    } catch (error) {
      console.error('ElevenLabs get conversation transcription error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  // Get conversation details (duration, status, transcript) - used by campaign polling
  async getConversationDetails(conversationId) {
    try {
      console.log(`🔍 Fetching conversation details from ElevenLabs for: ${conversationId}`);
      
      const response = await axios.get(`${this.baseURL}/convai/conversations/${conversationId}`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (response.data) {
        console.log(`✅ Retrieved conversation details for ${conversationId}`);
        return {
          success: true,
          data: {
            duration: response.data.duration_seconds || response.data.duration || 0,
            status: response.data.status || 'completed',
            transcript: response.data.transcript || null,
            startTime: response.data.start_time || null,
            endTime: response.data.end_time || null
          }
        };
      } else {
        console.log(`⚠️ No conversation data available for ${conversationId}`);
        return {
          success: false,
          error: 'No conversation data available'
        };
      }
    } catch (error) {
      console.error('ElevenLabs get conversation details error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  // Get batch calling status - equivalent to batchCalls.get(batchId)
  async getBatchCallStatus(batchId) {
    try {
      console.log(`📊 Fetching batch call status from ElevenLabs for: ${batchId}`);
      
      const response = await axios.get(`${this.baseURL}/convai/batch-calling/${batchId}`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (response.data) {
        console.log(`✅ Retrieved batch status for ${batchId}: ${response.data.status}`);
        return {
          success: true,
          data: response.data
        };
      } else {
        console.log(`⚠️ No batch data available for ${batchId}`);
        return {
          success: false,
          error: 'No batch data available'
        };
      }
    } catch (error) {
      console.error('ElevenLabs get batch status error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  // Knowledge Base Management
  async handleKnowledgeBaseUpload(file, campaignId) {
    try {
      // 1. Delete existing knowledge base files for the campaign
      const existingFiles = await KnowledgeBase.findAll({ where: { campaignId } });
      for (const existingFile of existingFiles) {
        if (existingFile.elevenlabsDocId) {
          await this.deleteKnowledgeBase(existingFile.elevenlabsDocId);
        }
        await existingFile.destroy();
      }

      // 2. Upload new file to ElevenLabs
      const fileBuffer = fs.readFileSync(file.path);
      const formData = new FormData();
      formData.append('file', fileBuffer, file.originalname);
      formData.append('name', file.originalname);
      
      const uploadResponse = await axios.post(`${this.baseURL}/convai/knowledge-base/file`, formData, {
        headers: {
          ...formData.getHeaders(),
          'xi-api-key': this.apiKey,
        }
      });

      const elevenlabsDocId = uploadResponse.data.id;

      // 3. Create new entry in our database
      const newKnowledgeBaseFile = await KnowledgeBase.create({
        campaignId,
        filename: file.originalname,
        fileUrl: file.path, // Store local path for reference
        elevenlabsDocId,
      });

      // Clean up the uploaded file from local storage
      fs.unlinkSync(file.path);

      return { success: true, knowledgeBase: newKnowledgeBaseFile };

    } catch (error) {
      console.error('Full knowledge base upload process error:', error.response ? error.response.data : error.message);
      // Clean up the file if an error occurs
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
      return { success: false, error: 'Failed to process knowledge base file.' };
    }
  }

  async uploadKnowledgeBase(fileBuffer, fileName, campaignId) {
    try {
      console.log(`📚 Uploading knowledge base to ElevenLabs: ${fileName}`);
      
      // Create a knowledge base in ElevenLabs
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer]), fileName);
      formData.append('name', `Campaign_${campaignId}_${fileName}`);
      formData.append('description', `Knowledge base for campaign ${campaignId}`);

      const response = await axios.post(`${this.baseURL}/convai/knowledge-base/file`, formData, {
        headers: {
          'xi-api-key': this.apiKey,
        }
      });

      console.log(`✅ Knowledge base uploaded to ElevenLabs: ${response.data.id}`);
      
      return {
        success: true,
        knowledgeBaseId: response.data.id,
        name: response.data.name,
        fileName: fileName
      };
    } catch (error) {
      console.error('ElevenLabs knowledge base upload error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async deleteKnowledgeBase(knowledgeBaseId) {
    try {
      console.log(`🗑️ Deleting knowledge base from ElevenLabs: ${knowledgeBaseId}`);
      
      const response = await axios.delete(`${this.baseURL}/convai/knowledge-base/${knowledgeBaseId}?force=true`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      console.log(`✅ Knowledge base deleted from ElevenLabs: ${knowledgeBaseId}`);
      
      return {
        success: true,
        message: 'Knowledge base deleted successfully'
      };
    } catch (error) {
      console.error('ElevenLabs knowledge base delete error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async getKnowledgeBases() {
    try {
      const response = await axios.get(`${this.baseURL}/knowledge-base`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return {
        success: true,
        knowledgeBases: response.data
      };
    } catch (error) {
      console.error('ElevenLabs get knowledge bases error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async updateAgentKnowledgeBase(agentId, knowledgeBaseIds) {
    try {
      console.log(`🔄 Updating agent knowledge base: ${agentId}`);
      
      // Build documents list; prompt schema requires a name per document
      let documentsForPrompt = [];
      let documentsBasic = knowledgeBaseIds.map(id => ({ type: "file", id }));
      try {
        const kbRecords = await KnowledgeBase.findAll({ where: { elevenlabsDocId: knowledgeBaseIds } });
        const nameById = new Map(kbRecords.map(kb => [kb.elevenlabsDocId, kb.filename]));
        documentsForPrompt = knowledgeBaseIds.map(id => ({
          type: "file",
          id,
          name: nameById.get(id) || `Document_${id}`
        }));
      } catch (lookupErr) {
        console.warn('KB name lookup failed, falling back to basic docs:', lookupErr?.message || lookupErr);
        documentsForPrompt = documentsBasic.map(d => ({ ...d, name: `Document_${d.id}` }));
      }

      // Prefer the conversation_config.agent.prompt.knowledge_base schema first
      try {
        const promptSchemaPayload = {
          conversation_config: {
            agent: {
              prompt: {
                knowledge_base: documentsForPrompt
              }
            }
          }
        };
        const respPrompt = await axios.patch(`${this.baseURL}/convai/agents/${agentId}`, promptSchemaPayload, {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        });
        console.log(`✅ Agent knowledge base updated (prompt schema): ${agentId}`);
        return { success: true, agent: respPrompt.data };
      } catch (errPrompt) {
        const status = errPrompt?.response?.status;
        const detail = errPrompt?.response?.data;
        console.warn('Prompt schema KB update failed, trying alternate schemas:', status, detail);

        // Alternate A: conversation_config.knowledge_base.documents
        try {
          const fallbackA = {
            conversation_config: {
              knowledge_base: {
                documents: documentsBasic
              }
            }
          };
          const respA = await axios.patch(`${this.baseURL}/convai/agents/${agentId}`, fallbackA, {
            headers: {
              'xi-api-key': this.apiKey,
              'Content-Type': 'application/json'
            }
          });
          console.log(`✅ Agent knowledge base updated (fallback A): ${agentId}`);
          return { success: true, agent: respA.data };
        } catch (errA) {
          console.warn('Fallback A failed, trying top-level schema:', errA?.response?.status, errA?.response?.data);

          // Alternate B: top-level knowledge_base
          const topLevelPayload = {
            knowledge_base: {
              documents: documentsBasic
            }
          };
          const respTop = await axios.patch(`${this.baseURL}/convai/agents/${agentId}`, topLevelPayload, {
            headers: {
              'xi-api-key': this.apiKey,
              'Content-Type': 'application/json'
            }
          });
          console.log(`✅ Agent knowledge base updated (top-level schema): ${agentId}`);
          return { success: true, agent: respTop.data };
        }
      }
    } catch (error) {
      console.error('ElevenLabs update agent knowledge base error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async updateAgentVoice(agentId, voiceId) {
    try {
      console.log(`🎤 [ElevenLabs] Starting voice update for agent: ${agentId}`);
      console.log(`🎤 [ElevenLabs] New voice ID: ${voiceId}`);
      console.log(`🔑 [ElevenLabs] API Key configured: ${this.apiKey ? 'Yes' : 'No'}`);
      console.log(`🌐 [ElevenLabs] Base URL: ${this.baseURL}`);
      
      if (!agentId || !voiceId) {
        const errorMsg = `Missing required parameters: agentId=${agentId}, voiceId=${voiceId}`;
        console.error(`❌ [ElevenLabs] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const payload = {
        conversation_config: {
          tts: {
            voice_id: voiceId
          }
        }
      };

      console.log(`📋 [ElevenLabs] Request payload:`, JSON.stringify(payload, null, 2));
      console.log(`📡 [ElevenLabs] Making PATCH request to: ${this.baseURL}/convai/agents/${agentId}`);

      const response = await axios.patch(`${this.baseURL}/convai/agents/${agentId}`, payload, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ [ElevenLabs] Voice update successful!`);
      console.log(`✅ [ElevenLabs] Response status: ${response.status}`);
      
      // Verify the voice was actually updated
      const updatedVoiceId = response.data?.conversation_config?.tts?.voice_id;
      if (updatedVoiceId === voiceId) {
        console.log(`✅ [ElevenLabs] VERIFIED: Agent voice successfully updated to ${voiceId} for agent ${agentId}`);
      } else {
        console.warn(`⚠️ [ElevenLabs] WARNING: Voice update may have failed!`);
        console.warn(`⚠️ [ElevenLabs] Expected voice ID: ${voiceId}`);
        console.warn(`⚠️ [ElevenLabs] Actual voice ID: ${updatedVoiceId}`);
      }
      
      console.log(`✅ [ElevenLabs] Response data:`, JSON.stringify(response.data, null, 2));
      
      return { success: true, agent: response.data };
    } catch (error) {
      console.error(`❌ [ElevenLabs] Voice update failed for agent ${agentId} with voice ${voiceId}`);
      console.error(`❌ [ElevenLabs] Error status:`, error?.response?.status);
      console.error(`❌ [ElevenLabs] Error headers:`, error?.response?.headers);
      console.error(`❌ [ElevenLabs] Error data:`, error?.response?.data);
      console.error(`❌ [ElevenLabs] Error message:`, error?.message);
      console.error(`❌ [ElevenLabs] Full error:`, error);
      
      return {
        success: false,
        error: error.response?.data?.detail || error?.response?.data?.message || error.message,
        statusCode: error?.response?.status,
        fullError: error?.response?.data
      };
    }
  }

  // handleTranscriptionWebhook stores transcript/status/duration
  async handleTranscriptionWebhook(webhookData) {
    try {
      console.log('Post-call transcription webhook received:', webhookData.call_id || webhookData.conversation_id);
      
      // Import models here to avoid circular imports
      const { CallLog, Lead, Campaign } = await import('../models/index.js');
      
      // Find the call log using ElevenLabs conversation ID
      const callLog = await CallLog.findOne({
        where: { elevenlabsConversationId: webhookData.call_id || webhookData.conversation_id }
      });

      if (!callLog) {
        console.log(`No call log found for conversation ${webhookData.call_id || webhookData.conversation_id}`);
        return;
      }

      // Update call log with transcription data
      const updateData = {};
      
      if (webhookData.transcript || webhookData.transcription) {
        updateData.transcription = JSON.stringify(webhookData.transcript || webhookData.transcription);
        console.log(`[Transcription Webhook] Stored transcription for ${webhookData.call_id || webhookData.conversation_id}`);
      }
      
      if (webhookData.status) {
        updateData.status = webhookData.status;
      }
      
      if (webhookData.duration || webhookData.duration_seconds) {
        updateData.duration = webhookData.duration || webhookData.duration_seconds;
      }

      // Update the call log
      await callLog.update(updateData);

      // Update lead status if applicable
      if (callLog.leadId) {
        const lead = await Lead.findByPk(callLog.leadId);
        if (lead) {
          await lead.update({ 
            status: 'completed',
            call_duration: updateData.duration || lead.call_duration
          });
        }
      }

      // update campaign stats
      if (callLog.campaignId) {
        await this.updateCampaignStatistics(callLog.campaignId);
      }

      console.log(`[Transcription Webhook] Updated call log for conversation ${webhookData.call_id || webhookData.conversation_id}`);
    } catch (error) {
      console.error('Error handling transcription webhook:', error);
    }
  }

  async handleAudioWebhook(webhookData) {
    try {
      console.log('Post-call audio webhook received:', webhookData.call_id || webhookData.conversation_id);
      
      // Import models here to avoid circular imports
      const { CallLog } = await import('../models/index.js');
      
      // Find the call log using ElevenLabs conversation ID
      const callLog = await CallLog.findOne({
        where: { elevenlabsConversationId: webhookData.call_id || webhookData.conversation_id }
      });

      if (!callLog) {
        console.log(`No call log found for conversation ${webhookData.call_id || webhookData.conversation_id}`);
        return;
      }

      // Store audio URL or reference if provided
      if (webhookData.audio_url || webhookData.recording_url) {
        let existingTranscription = {};
        if (callLog.transcription) {
          try {
            existingTranscription = JSON.parse(callLog.transcription);
          } catch (e) {
            existingTranscription = { originalTranscription: callLog.transcription };
          }
        }
        
        existingTranscription.audioUrl = webhookData.audio_url || webhookData.recording_url;
        existingTranscription.audioStoredAt = new Date().toISOString();
        
        await callLog.update({
          transcription: JSON.stringify(existingTranscription)
        });
        
        console.log(`[Audio Webhook] Stored audio reference for ${webhookData.call_id || webhookData.conversation_id}`);
      }

      // update campaign stats
      if (callLog.campaignId) {
        await this.updateCampaignStatistics(callLog.campaignId);
      }

    } catch (error) {
      console.error('Error handling audio webhook:', error);
    }
  }

  async updateCampaignStatistics(campaignId) {
    try {
      const { Campaign, Lead, CallLog } = await import('../models/index.js');
      
      const leads = await Lead.findAll({ where: { campaignId } });
      const callLogs = await CallLog.findAll({ where: { campaignId } });
      
      const completedLeads = leads.filter(l => l.status === 'completed');
      const failedLeads = leads.filter(l => l.status === 'failed');
      const completedCallLogs = callLogs.filter(log => log.status === 'completed' && log.duration);
      
      const totalDuration = completedCallLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      const averageDuration = completedCallLogs.length > 0
        ? Math.round(totalDuration / completedCallLogs.length)
        : 0;
      
      await Campaign.update({
        totalLeads: leads.length,
        completedLeads: completedLeads.length,
        failedLeads: failedLeads.length,
        averageCallDuration: averageDuration
      }, {
        where: { id: campaignId }
      });

      console.log(`Updated campaign statistics for campaign ${campaignId}`);
    } catch (error) {
      console.error('Error updating campaign statistics:', error);
    }
  }
}

export default new ElevenLabsService();
