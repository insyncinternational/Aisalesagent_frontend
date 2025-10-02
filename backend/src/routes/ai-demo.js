import express from 'express';
import rateLimit from 'express-rate-limit';
import openaiService from '../services/openaiService.js';
import elevenlabsService from '../services/elevenlabsService.js';
import { getKnowledgeBaseFilePath, getAvailableIndustries, getUseCasesForIndustry } from '../config/knowledgeBaseMapping.js';
import { getFirstMessage } from '../config/firstMessageMapping.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Rate limiting for demo calls
const demoCallLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 demo calls per 5 minutes
  message: {
    success: false,
    error: 'Too many demo requests. Please wait a few minutes before requesting another demo call.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Upload knowledge base file to ElevenLabs and update agent
 * @param {string} filePath - Relative path to the PDF file
 * @param {string} agentId - ElevenLabs agent ID to update
 * @param {string} firstMessage - The first message for the agent to say
 * @returns {Promise<Object>} - Object with docId and fileName
 */
async function uploadAndUpdateKnowledgeBase(filePath, agentId, firstMessage) {
  try {
    // Construct full path to the PDF file
    // __dirname is backend/src/routes, so we need to go up 3 levels to reach project root
    const projectRoot = path.join(__dirname, '../../..');
    const fullPath = path.join(projectRoot, 'frontend/public', filePath);
    
    console.log(`🔍 Resolving file path...`);
    console.log(`   Project root: ${projectRoot}`);
    console.log(`   Full path: ${fullPath}`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Knowledge base file not found: ${fullPath}`);
    }
    
    console.log(`✅ File found at: ${fullPath}`);

    console.log(`📤 Uploading knowledge base file: ${filePath}`);
    console.log(`📋 Agent ID: ${agentId}`);

    // Step 1: Get current agent configuration to find existing KB files
    let existingDocIds = [];
    try {
      console.log(`🔍 Step 1: Getting current agent configuration...`);
      const agentResponse = await axios.get(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        {
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY
          }
        }
      );

      console.log(`📊 Agent name: ${agentResponse.data.name || 'Unknown'}`);
      
      // Debug: Check ALL possible locations where KB might be stored
      console.log(`🔍 Checking all possible KB locations...`);
      console.log(`   - knowledge_base.document_ids:`, agentResponse.data.knowledge_base?.document_ids);
      console.log(`   - knowledge_base.documents:`, agentResponse.data.knowledge_base?.documents);
      console.log(`   - conversation_config.knowledge_base:`, agentResponse.data.conversation_config?.knowledge_base);
      console.log(`   - conversation_config.agent.prompt.knowledge_base:`, agentResponse.data.conversation_config?.agent?.prompt?.knowledge_base);
      
      // Try all possible locations to find existing KB documents
      existingDocIds = agentResponse.data.knowledge_base?.document_ids || 
                      agentResponse.data.knowledge_base?.documents?.map(d => d.id) ||
                      agentResponse.data.conversation_config?.knowledge_base?.documents?.map(d => d.id) ||
                      agentResponse.data.conversation_config?.agent?.prompt?.knowledge_base?.map(d => d.id) ||
                      [];
      
      console.log(`📚 Current KB document count: ${existingDocIds.length}`);
      if (existingDocIds.length > 0) {
        console.log(`📚 Existing document IDs:`, existingDocIds);
      }
      
      // Step 2: Detach current documents from agent (required before deletion)
      if (existingDocIds.length > 0) {
        console.log(`🔓 Step 2: Detaching ${existingDocIds.length} document(s) from agent...`);
        
        // Detach from the correct nested location
        await axios.patch(
          `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
          {
            conversation_config: {
              agent: {
                prompt: {
                  knowledge_base: [] // Empty array to detach all documents
                }
              }
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
          }
        );
        
        console.log(`✅ Documents detached from conversation_config.agent.prompt.knowledge_base`);
        
        // Step 3: Delete the detached documents
        console.log(`🗑️  Step 3: Deleting ${existingDocIds.length} detached document(s)...`);
        
        for (const docId of existingDocIds) {
          try {
            console.log(`🗑️  Attempting to delete: ${docId}`);
            await axios.delete(
              `https://api.elevenlabs.io/v1/convai/knowledge-base/${docId}`,
              {
                headers: {
                  'xi-api-key': process.env.ELEVENLABS_API_KEY
                }
              }
            );
            console.log(`✅ Successfully deleted: ${docId}`);
          } catch (deleteError) {
            console.error(`❌ Failed to delete KB doc ${docId}:`, {
              status: deleteError.response?.status,
              data: deleteError.response?.data,
              message: deleteError.message
            });
          }
        }
        
      } else {
        console.log(`ℹ️  No existing knowledge base documents to delete`);
      }
    } catch (getAgentError) {
      console.error(`⚠️  Could not get/update current agent config:`, {
        status: getAgentError.response?.status,
        data: getAgentError.response?.data,
        message: getAgentError.message
      });
      console.log(`ℹ️  Continuing with upload...`);
    }

    // Step 3: Upload new file to ElevenLabs
    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(filePath);
    
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);
    formData.append('name', fileName);
    
    const uploadResponse = await axios.post(
      `https://api.elevenlabs.io/v1/convai/knowledge-base/file`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        }
      }
    );

    const docId = uploadResponse.data.id;
    console.log(`✅ Step 4: Knowledge base file uploaded, doc ID: ${docId}, file: ${fileName}`);

    // Step 5: Attach the new document AND update first message
    // Using the same pattern as campaign's updateAgentKnowledgeBase
    console.log(`🔗 Step 5: Attaching new KB document and updating first message...`);
    console.log(`   Document ID: ${docId}`);
    console.log(`   First message: ${firstMessage.substring(0, 80)}...`);
    
    // Build document structure matching campaign pattern
    const documentsForPrompt = [{
      type: 'file',
      id: docId,
      name: fileName
    }];

    // Try the conversation_config.agent.prompt.knowledge_base schema (same as campaign)
    try {
      const promptSchemaPayload = {
        first_message: firstMessage,
        conversation_config: {
          agent: {
            first_message: firstMessage,
            prompt: {
              knowledge_base: documentsForPrompt
            }
          }
        }
      };
      
      const response = await axios.patch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        promptSchemaPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY
          }
        }
      );

      console.log(`✅ Step 6: Agent updated successfully (prompt schema - landing page):`);
      console.log(`   - Knowledge base attached: ${fileName} (${docId})`);
      console.log(`   - First message updated: ${firstMessage.substring(0, 80)}...`);
      
    } catch (errPrompt) {
      console.warn('Prompt schema KB update failed, trying alternate schema:', errPrompt?.response?.status, errPrompt?.response?.data);
      
      // Fallback: conversation_config.knowledge_base.documents (same as campaign fallback)
      try {
        const fallbackPayload = {
          first_message: firstMessage,
          conversation_config: {
            knowledge_base: {
              documents: [{
                type: 'file',
                id: docId
              }]
            }
          }
        };
        
        await axios.patch(
          `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
          fallbackPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
          }
        );
        
        console.log(`✅ Step 6: Agent updated successfully (fallback schema - landing page):`);
        console.log(`   - Knowledge base attached: ${fileName} (${docId})`);
        console.log(`   - First message updated: ${firstMessage.substring(0, 80)}...`);
        
      } catch (errFallback) {
        console.error('All KB update schemas failed:', errFallback?.response?.status, errFallback?.response?.data);
        throw errFallback;
      }
    }
    
    return { docId, fileName };

  } catch (error) {
    console.error('❌ Knowledge base upload error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Failed to upload knowledge base: ${error.message}`);
  }
}

// Industry-specific script prompts
const INDUSTRY_PROMPTS = {
  'real-estate': {
    'lead-qualification': 'Create a real estate lead qualification script where the AI agent calls a potential buyer to understand their property requirements, budget, timeline, and financing status.',
    'property-inquiries': 'Create a script for an AI agent responding to property inquiries, providing details about listings, scheduling viewings, and capturing buyer interest.',
    'appointment-scheduling': 'Create a script for scheduling property showings, confirming availability, and providing property details to interested buyers.',
    'follow-up-calls': 'Create a follow-up script for nurturing real estate leads, checking on their property search progress, and moving them through the sales pipeline.',
    'market-updates': 'Create a script for providing market updates, new listings, and investment opportunities to existing real estate clients.'
  },
  'healthcare': {
    'appointment-booking': 'Create a healthcare appointment booking script where the AI agent helps patients schedule appointments, confirms insurance, and provides pre-visit instructions.',
    'patient-reminders': 'Create a script for appointment reminder calls, confirming patient availability, and providing preparation instructions.',
    'insurance-verification': 'Create a script for verifying patient insurance information, explaining coverage, and collecting necessary documentation.',
    'prescription-refills': 'Create a script for handling prescription refill requests, checking with pharmacy, and scheduling follow-up appointments if needed.',
    'wellness-checkups': 'Create a proactive script for wellness check-up outreach, explaining preventive care benefits and scheduling routine health screenings.'
  },
  'e-commerce': {
    'abandoned-cart': 'Create an abandoned cart recovery script where the AI agent calls customers who left items in their cart, addresses concerns, and offers incentives to complete purchase.',
    'order-follow-up': 'Create a post-purchase follow-up script for checking customer satisfaction, suggesting related products, and encouraging repeat purchases.',
    'customer-support': 'Create a customer support script for handling returns, exchanges, and product inquiries with empathy and solution-focused responses.',
    'product-recommendations': 'Create a script for proactive product recommendations based on purchase history, seasonal trends, and customer preferences.',
    'loyalty-programs': 'Create a script for enrolling customers in loyalty programs, explaining benefits, and encouraging program engagement.'
  },
  'financial-services': {
    'loan-applications': 'Create a loan application follow-up script for checking application status, gathering missing documents, and guiding customers through approval process.',
    'investment-consultation': 'Create a script for booking investment consultation calls, qualifying investor profile, and explaining service offerings.',
    'payment-reminders': 'Create a friendly payment reminder script that maintains customer relationships while encouraging timely payments.',
    'account-verification': 'Create a security-focused script for account verification, fraud prevention, and updating customer information.',
    'financial-planning': 'Create a script for financial planning outreach, assessing customer needs, and scheduling advisory consultations.'
  },
  'automotive': {
    'service-reminders': 'Create a service reminder script for scheduling vehicle maintenance, explaining service needs, and offering convenient appointment times.',
    'sales-follow-up': 'Create a script for following up with car buyers, scheduling test drives, and addressing financing or feature questions.',
    'parts-availability': 'Create a script for checking parts availability, providing pricing, and coordinating installation services.',
    'warranty-calls': 'Create a script for warranty and service update calls, explaining coverage and scheduling necessary repairs.',
    'trade-in-evaluation': 'Create a script for trade-in value assessment, gathering vehicle information, and scheduling appraisal appointments.'
  },
  'education': {
    'enrollment-follow-up': 'Create an enrollment follow-up script for prospective students, addressing admission questions and guiding through application process.',
    'course-recommendations': 'Create a script for recommending courses based on student interests, career goals, and academic background.',
    'parent-engagement': 'Create a script for parent engagement calls, discussing student progress and educational opportunities.',
    'scholarship-outreach': 'Create a script for scholarship and financial aid outreach, explaining opportunities and application processes.',
    'event-invitations': 'Create a script for inviting students and families to educational events, workshops, and campus visits.'
  },
  'hospitality': {
    'booking-confirmations': 'Create a booking confirmation script that also identifies upselling opportunities for room upgrades, amenities, and services.',
    'guest-experience': 'Create a post-stay follow-up script for gathering feedback, addressing concerns, and encouraging future bookings.',
    'event-planning': 'Create a script for event planning consultations, understanding requirements, and presenting venue capabilities.',
    'loyalty-rewards': 'Create a script for loyalty program enrollment and rewards redemption, encouraging repeat visits.',
    'reservation-management': 'Create a script for managing reservations, handling changes, and providing guest service support.'
  },
  'legal': {
    'consultation-booking': 'Create a legal consultation booking script that gathers case basics, schedules appointments, and explains fee structures.',
    'case-updates': 'Create a script for providing case status updates, explaining legal processes, and scheduling follow-up meetings.',
    'document-collection': 'Create a script for collecting required legal documents, explaining their importance, and setting submission deadlines.',
    'client-intake': 'Create an initial client intake script for gathering case information, assessing legal needs, and determining service fit.',
    'payment-reminders': 'Create a professional payment reminder script for legal services that maintains client relationships.'
  }
};

/**
 * POST /api/ai-demo/schedule-call
 * Schedule an AI demo call with custom script generation
 */
router.post('/schedule-call', demoCallLimiter, async (req, res) => {
  try {
    const { name, phone, industry, useCase } = req.body;

    // Validate input
    if (!name || !phone || !industry || !useCase) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, phone, industry, and useCase are required'
      });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\+\d\s\(\)\-]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format'
      });
    }

    console.log(`🤖 Starting AI demo call process for ${name} (${industry}/${useCase})`);

    // Step 1: Get knowledge base file for the industry and use case
    console.log('📚 Getting knowledge base file for industry and use case...');
    const knowledgeBaseFilePath = getKnowledgeBaseFilePath(industry, useCase);
    
    if (!knowledgeBaseFilePath) {
      return res.status(400).json({
        success: false,
        error: 'No knowledge base file found for this industry and use case combination'
      });
    }

    console.log(`✅ Knowledge base file found: ${knowledgeBaseFilePath}`);

    // Get dynamic first message based on industry and use case FIRST
    const firstMessage = getFirstMessage(industry, useCase, name);
    console.log(`📝 First message: ${firstMessage.substring(0, 100)}...`);
    
    // Step 2: Upload knowledge base to ElevenLabs and update agent (with first message)
    const landingPageAgentId = process.env.ELEVENLABS_LANDING_PAGE_AGENT_ID || process.env.ELEVENLABS_AGENT_ID;
    
    let knowledgeBaseDocId = null;
    let knowledgeBaseFileName = null;
    try {
      console.log('📚 Uploading and updating knowledge base + first message for agent...');
      const result = await uploadAndUpdateKnowledgeBase(knowledgeBaseFilePath, landingPageAgentId, firstMessage);
      knowledgeBaseDocId = result.docId;
      knowledgeBaseFileName = result.fileName;
      console.log(`✅ Knowledge base updated with doc ID: ${knowledgeBaseDocId}`);
      console.log(`✅ First message updated for agent`);
    } catch (kbError) {
      console.error('⚠️ Knowledge base upload failed:', kbError.message);
      // Continue without knowledge base - the call will still work but without KB
    }
    
    const scriptText = firstMessage;

    // Step 3: Place demo call using ElevenLabs Batch Calling (works for single calls too)
    console.log('📞 Placing demo call with ElevenLabs Agent Sarah via batch calling...');
    try {
      // Create a unique identifier for this demo call
      const demoId = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Wait for agent update to propagate (ElevenLabs caching)
      if (knowledgeBaseDocId) {
        console.log(`⏳ Waiting 5 seconds for agent configuration to propagate...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verify the agent configuration was updated
        try {
          const verifyResponse = await axios.get(
            `https://api.elevenlabs.io/v1/convai/agents/${landingPageAgentId}`,
            {
              headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY
              }
            }
          );
          
          const currentKB = verifyResponse.data.conversation_config?.agent?.prompt?.knowledge_base || [];
          console.log(`🔍 Verification - Current KB attached to agent:`, currentKB.map(doc => ({
            id: doc.id,
            name: doc.name
          })));
          
          // Check all possible locations for first_message (NOT system prompt)
          const firstMessageLocations = {
            'top-level': verifyResponse.data.first_message,
            'conversation_config.agent.first_message': verifyResponse.data.conversation_config?.agent?.first_message
          };
          
          console.log(`🔍 Verification - First message locations check:`);
          for (const [location, value] of Object.entries(firstMessageLocations)) {
            if (value) {
              console.log(`   ${location}: ${value.substring(0, 80)}...`);
            }
          }
          
          // Log system prompt separately to ensure it's NOT being changed
          const systemPrompt = verifyResponse.data.conversation_config?.agent?.prompt?.prompt;
          if (systemPrompt) {
            console.log(`📋 System prompt (unchanged): ${systemPrompt.substring(0, 80)}...`);
          }
          
          const hasNewKB = currentKB.some(doc => doc.id === knowledgeBaseDocId);
          if (!hasNewKB) {
            console.warn(`⚠️ WARNING: New KB (${knowledgeBaseDocId}) not found in agent config! Agent may be using cached config.`);
          } else {
            console.log(`✅ Verification successful: New KB (${knowledgeBaseFileName}) is attached to agent`);
          }
        } catch (verifyError) {
          console.warn(`⚠️ Could not verify agent configuration:`, verifyError.message);
        }
      }

      // Use batch calling API (agent is already updated with KB and first message)
      const batchPayload = {
        call_name: `Demo_${name}_${Date.now()}`,
        agent_id: landingPageAgentId,
        agent_phone_number_id: process.env.ELEVENLABS_PHONE_NUMBER_ID,
        scheduled_time_unix: Math.floor(Date.now() / 1000), // Start immediately
        recipients: [{
          phone_number: phone,
          conversation_initiation_client_data: {
            dynamic_variables: {
              first_name: name,
              industry: industry,
              use_case: useCase,
              demo_id: demoId,
              knowledge_base_file: knowledgeBaseFileName || path.basename(knowledgeBaseFilePath)
            }
          }
        }]
      };

      console.log('📋 Demo call payload:', {
        call_name: batchPayload.call_name,
        agent_id: landingPageAgentId,
        phone: phone,
        using_landing_page_agent: !!process.env.ELEVENLABS_LANDING_PAGE_AGENT_ID,
        knowledge_base_file: knowledgeBaseFilePath,
        first_message_length: scriptText.length,
        kb_doc_id: knowledgeBaseDocId,
        kb_file_name: knowledgeBaseFileName,
        agent_already_updated: true
      });

      const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        body: JSON.stringify(batchPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs batch submit failed: ${response.status} - ${errorText}`);
      }

      const callResult = await response.json();
      
      // Extract batch ID from response
      const batchId = callResult.batch_id || callResult.id || callResult.batchId || callResult.batch_calling_id;
      
      if (!batchId) {
        console.error('❌ No batch ID found in response:', Object.keys(callResult));
        return res.status(500).json({
          success: false,
          error: 'Failed to get batch ID from ElevenLabs'
        });
      }

      console.log('✅ Demo call submitted successfully to ElevenLabs:', batchId);

      // Log the demo call for analytics
      console.log(`📊 Demo Call Analytics:`, {
        demoId,
        batchId,
        customerName: name,
        phone,
        industry,
        useCase,
        firstMessageLength: scriptText.length,
        agentId: landingPageAgentId,
        usingLandingPageAgent: !!process.env.ELEVENLABS_LANDING_PAGE_AGENT_ID,
        knowledgeBaseFile: knowledgeBaseFilePath,
        knowledgeBaseFileName: knowledgeBaseFileName,
        knowledgeBaseDocId: knowledgeBaseDocId,
        knowledgeBaseUploaded: !!knowledgeBaseDocId,
        agentUpdatedBeforeCall: true,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: knowledgeBaseDocId 
          ? 'Demo call scheduled successfully with ElevenLabs Agent using industry-specific knowledge base'
          : 'Demo call scheduled successfully with ElevenLabs Agent',
        demoId: demoId,
        batchId: batchId,
        estimatedDuration: '60 seconds',
        industry: industry,
        useCase: useCase,
        agent: 'ElevenLabs AI Agent',
        agentId: landingPageAgentId,
        usingLandingPageAgent: !!process.env.ELEVENLABS_LANDING_PAGE_AGENT_ID,
        knowledgeBaseFile: knowledgeBaseFilePath,
        knowledgeBaseDocId: knowledgeBaseDocId,
        knowledgeBaseUploaded: !!knowledgeBaseDocId
      });

    } catch (error) {
      console.error('ElevenLabs demo call failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to place demo call with Agent Sarah'
      });
    }

  } catch (error) {
    console.error('AI Demo Call Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during demo call setup'
    });
  }
});

/**
 * GET /api/ai-demo/config-check
 * Check ElevenLabs configuration
 */
router.get('/config-check', (req, res) => {
  const config = {
    hasApiKey: !!process.env.ELEVENLABS_API_KEY,
    hasAgentId: !!process.env.ELEVENLABS_AGENT_ID,
    hasPhoneNumberId: !!process.env.ELEVENLABS_PHONE_NUMBER_ID,
    hasWebhookSecret: !!process.env.ELEVENLABS_WEBHOOK_SECRET,
    agentIdLength: process.env.ELEVENLABS_AGENT_ID?.length || 0,
    phoneNumberIdLength: process.env.ELEVENLABS_PHONE_NUMBER_ID?.length || 0,
    apiKeyPrefix: process.env.ELEVENLABS_API_KEY?.substring(0, 8) + '...' || 'NOT_SET'
  };

  res.json({
    success: true,
    config,
    message: 'Check if all values are true and have reasonable lengths'
  });
});

/**
 * GET /api/ai-demo/industries
 * Get available industries and their use cases
 */
router.get('/industries', (req, res) => {
  try {
    const industries = getAvailableIndustries().map(industry => ({
      ...industry,
      useCases: getUseCasesForIndustry(industry.value)
    }));

    res.json({
      success: true,
      industries
    });
  } catch (error) {
    console.error('Error getting industries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get industries'
    });
  }
});

/**
 * POST /api/ai-demo/webhook
 * Handle ElevenLabs webhooks for demo call status updates
 * Note: ElevenLabs webhooks are configured in your ElevenLabs dashboard
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const webhookData = req.body;
    
    console.log(`📞 ElevenLabs Demo Call Status Update:`, {
      callId: webhookData.call_id,
      status: webhookData.status,
      metadata: webhookData.metadata,
      timestamp: new Date().toISOString()
    });

    // Handle different ElevenLabs call statuses
    switch (webhookData.status) {
      case 'completed':
      case 'ended':
        console.log('✅ Demo call completed successfully');
        console.log('📊 Call duration:', webhookData.duration, 'seconds');
        break;
      case 'failed':
      case 'error':
        console.log('❌ Demo call failed:', webhookData.error_message);
        break;
      case 'no_answer':
        console.log('📵 Customer did not answer');
        break;
      case 'busy':
        console.log('📵 Customer line was busy');
        break;
      case 'in_progress':
        console.log('📞 Demo call in progress...');
        break;
    }

    // Extract demo metadata
    const demoId = webhookData.metadata?.demo_id;
    const customerName = webhookData.metadata?.customer_name;
    const industry = webhookData.metadata?.industry;
    const useCase = webhookData.metadata?.use_case;

    if (demoId) {
      console.log(`🎭 Demo Call Details:`, {
        demoId,
        customerName,
        industry,
        useCase
      });
    }

    // TODO: Update database with call status and analytics
    // TODO: Send follow-up email based on call result
    // TODO: Track conversion metrics

    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Demo webhook error:', error);
    res.status(200).json({ success: true, message: 'Webhook acknowledged' }); // Still return 200
  }
});

export default router;
