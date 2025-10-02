import express from 'express';
import { body, validationResult } from 'express-validator';
import { Campaign, Lead, KnowledgeBase, CallLog, User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import twilioService from '../services/twilioService.js';
import elevenlabsService from '../services/elevenlabsService.js';
import fs from 'fs';
import { Op } from 'sequelize';

// Track campaigns currently being processed to prevent duplicates
const runningCampaigns = new Set();

const router = express.Router();

// Helper function to cleanup CSV files for campaigns
function cleanupCampaignCSV(campaign) {
  if (campaign.csvFilePath && fs.existsSync(campaign.csvFilePath)) {
    try {
      fs.unlinkSync(campaign.csvFilePath);
      console.log('Cleaned up CSV file for campaign:', campaign.csvFileName);
    } catch (error) {
      console.warn('Warning: Failed to clean up CSV file:', error);
    }
  }
}

// Helper function to update campaign statistics
async function updateCampaignStatistics(campaignId) {
  try {
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
      completedCalls: completedLeads.length + failedLeads.length,
      successfulCalls: completedLeads.length,
      failedCalls: failedLeads.length,
      averageDuration
    }, { where: { id: campaignId } });
    
    console.log(`✅ Updated campaign statistics for campaign ${campaignId}`);
  } catch (error) {
    console.error('Error updating campaign statistics:', error);
  }
}

// Helper function to update agent knowledge base for campaign
async function updateAgentKnowledgeBase(apiKey, campaignId) {
  try {
    const knowledgeBaseFiles = await KnowledgeBase.findAll({ 
      where: { campaignId },
      attributes: ['elevenlabsDocId']
    });
    
    const knowledgeBaseIds = knowledgeBaseFiles
      .filter(kb => kb.elevenlabsDocId)
      .map(kb => kb.elevenlabsDocId);
    
    if (knowledgeBaseIds.length > 0) {
      const agentId = process.env.ELEVENLABS_AGENT_ID;
      if (agentId) {
        const result = await elevenlabsService.updateAgentKnowledgeBase(agentId, knowledgeBaseIds);
        if (result.success) {
          console.log(`✅ Updated agent knowledge base for campaign ${campaignId}`);
        } else {
          console.warn(`⚠️ Failed to update agent knowledge base: ${result.error}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating agent knowledge base:', error);
  }
}

// Submit batch calling job to ElevenLabs
async function submitBatchCall(campaignId, leads, campaign, apiKey, agentId, phoneNumberId) {
  try {
    console.log(`📤 Submitting batch call for campaign ${campaignId} with ${leads.length} leads`);
    
    const recipients = leads.map(lead => ({
      phone_number: lead.contactNo,
      conversation_initiation_client_data: {
        dynamic_variables: {
          first_name: lead.firstName || '',
          last_name: lead.lastName || '',
          lead_id: lead.id.toString()
        }
      }
    }));

    const batchPayload = {
      call_name: `Campaign_${campaignId}_${Date.now()}`,
      agent_id: agentId,
      agent_phone_number_id: phoneNumberId,
      scheduled_time_unix: Math.floor(Date.now() / 1000), // Start immediately
      recipients
    };

    console.log(`📋 Batch payload:`, {
      call_name: batchPayload.call_name,
      agent_id: agentId,
      agent_phone_number_id: phoneNumberId,
      recipient_count: recipients.length
    });

    const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(batchPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs batch submit failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Batch job response received:`, result);
    
    // Try different possible field names for batch ID
    const batchId = result.batch_id || result.id || result.batchId || result.batch_calling_id;
    
    if (!batchId) {
      console.error('❌ No batch ID found in response. Response structure:', Object.keys(result));
      throw new Error('ElevenLabs API response missing batch ID. Response keys: ' + Object.keys(result).join(', '));
    }
    
    console.log(`✅ Batch job submitted successfully with ID:`, batchId);
    return batchId;

  } catch (error) {
    console.error('Error submitting batch call:', error);
    throw error;
  }
}

// Process batch status and update leads/call logs
async function processBatchStatus(campaignId, batchInfo) {
  console.log(`📊 Processing batch status for campaign ${campaignId}`);
  console.log(`📋 Batch info structure:`, {
    status: batchInfo.status,
    recipientCount: batchInfo.recipients?.length || 0,
    hasRecipients: !!batchInfo.recipients
  });

  // Debug: Log the full structure to understand what we're getting
  if (batchInfo.recipients && Array.isArray(batchInfo.recipients) && batchInfo.recipients.length > 0) {
    console.log(`📋 Sample recipient structure:`, JSON.stringify(batchInfo.recipients[0], null, 2));
  }
  
  // Process each recipient/call status
  if (batchInfo.recipients && Array.isArray(batchInfo.recipients)) {
    for (const recipient of batchInfo.recipients) {
      console.log(`📞 Processing recipient:`, {
        phone: recipient.phone_number,
        status: recipient.status,
        conversationId: recipient.conversation_id,
        leadId: recipient.conversation_initiation_client_data?.dynamic_variables?.lead_id
      });

      if (recipient.conversation_initiation_client_data?.dynamic_variables?.lead_id) {
        const leadId = parseInt(recipient.conversation_initiation_client_data.dynamic_variables.lead_id);
        
        // Map by phone_number → lead
        const lead = await Lead.findOne({
          where: { id: leadId, campaignId }
        });

        if (!lead) {
          console.warn(`Lead ${leadId} not found for campaign ${campaignId}`);
          continue;
        }

        // Optionally fetch conversation details to compute best duration
        let finalDuration = recipient.duration_seconds;
        if (!finalDuration && recipient.conversation_id) {
          console.log(`🔍 Fetching conversation details for ${recipient.conversation_id} to get duration`);
          try {
            const conversationDetails = await fetchConversationDetails(recipient.conversation_id);
            if (conversationDetails && conversationDetails.duration) {
              finalDuration = conversationDetails.duration;
              console.log(`✅ Retrieved duration from conversation API: ${finalDuration}s`);
            }
          } catch (error) {
            console.warn(`Failed to fetch conversation details for ${recipient.conversation_id}:`, error.message);
          }
        }

        // Map EL status → lead.status (pending/in_progress→calling, completed→completed if duration>0 else failed, failed/cancelled→failed)
        let leadStatus = 'calling'; // default for pending/in_progress
        
        if (recipient.status === 'pending' || recipient.status === 'in_progress' || recipient.status === 'calling') {
          leadStatus = 'calling';
        } else if (recipient.status === 'completed' || recipient.status === 'ended') {
          // completed→completed if duration>0 else failed
          leadStatus = (finalDuration && finalDuration > 0) ? 'completed' : 'failed';
        } else if (recipient.status === 'failed' || recipient.status === 'cancelled' || recipient.status === 'no_answer') {
          leadStatus = 'failed';
        }

        // Update lead status
        await Lead.update(
          { 
            status: leadStatus,
            callDuration: finalDuration || 0
          },
          { where: { id: leadId, campaignId } }
        );

        // Update call log if exists - find the most recent one for this lead
        const callLog = await CallLog.findOne({
          where: { leadId, campaignId },
          order: [['created_at', 'DESC']]
        });

        if (callLog) {
          const updateData = {
            status: recipient.status || 'completed',
            duration: finalDuration || 0
          };

          // Add conversation ID if available
          if (recipient.conversation_id) {
            updateData.elevenlabsConversationId = recipient.conversation_id;
            console.log(`✅ Setting conversation ID ${recipient.conversation_id} for call log ${callLog.id}`);
          }

          // Ensure phone number is set if missing
          if (!callLog.phoneNumber && recipient.phone_number) {
            updateData.phoneNumber = recipient.phone_number;
            console.log(`📞 Setting phone number ${recipient.phone_number} for call log ${callLog.id}`);
          }

          await callLog.update(updateData);
          console.log(`✅ Updated call log ${callLog.id} for lead ${leadId}: status=${updateData.status}, duration=${updateData.duration}s, phone=${updateData.phoneNumber || callLog.phoneNumber}`);
          
          // Update lead status based on call result
          if (callLog.leadId) {
            const lead = await Lead.findByPk(callLog.leadId);
            if (lead) {
              const leadStatus = recipient.status === 'completed' ? 'completed' : 
                               recipient.status === 'failed' ? 'failed' : 
                               recipient.status === 'no_answer' ? 'failed' : 'calling';
              
              await lead.update({ 
                status: leadStatus,
                call_duration: updateData.duration
              });
              console.log(`👤 Updated lead ${leadId} status to: ${leadStatus}`);
            }
          }
          
          // If call completed and has conversation ID, fetch transcription and audio
          if (recipient.conversation_id && (recipient.status === 'completed' || recipient.status === 'ended')) {
            await fetchAndStoreTranscriptionAudio(recipient.conversation_id, callLog);
          }
        } else {
          console.warn(`❌ No call log found for lead ${leadId} in campaign ${campaignId}`);
        }
      }
    }
  }
  
  // Update campaign statistics after processing all recipients
  await updateCampaignStatistics(campaignId);
}

// Fetch conversation details from ElevenLabs API
async function fetchConversationDetails(conversationId) {
  try {
    const result = await elevenlabsService.getConversationDetails(conversationId);
    
    if (result.success) {
      return {
        duration: result.data.duration,
        transcript: result.data.transcript,
        status: result.data.status
      };
    } else {
      console.warn(`Failed to fetch conversation details for ${conversationId}: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching conversation details for ${conversationId}:`, error);
    return null;
  }
}

// Fetch and store transcription and audio for completed calls
async function fetchAndStoreTranscriptionAudio(conversationId, callLog) {
  try {
    console.log(`🎯 Fetching transcription and audio for conversation ${conversationId}`);
    
    // Fetch conversation details with transcription
    const conversationDetails = await fetchConversationDetails(conversationId);
    
    if (conversationDetails) {
      const updateData = {};
      
      // Store transcription if available
      if (conversationDetails.transcript) {
        updateData.transcription = JSON.stringify(conversationDetails.transcript);
        console.log(`✅ Retrieved transcription for conversation ${conversationId}`);
      }
      
      // Update duration if more accurate
      if (conversationDetails.duration && conversationDetails.duration > 0) {
        updateData.duration = conversationDetails.duration;
        console.log(`✅ Updated duration to ${conversationDetails.duration}s for conversation ${conversationId}`);
      }
      
      // Update status if needed
      if (conversationDetails.status) {
        updateData.status = conversationDetails.status;
      }
      
      // Update the call log with transcription and audio info
      if (Object.keys(updateData).length > 0) {
        await callLog.update(updateData);
        console.log(`✅ Updated call log ${callLog.id} with transcription and details`);
      }
      
      // Update the associated lead's call duration
      if (callLog.leadId && conversationDetails.duration) {
        await Lead.update(
          { callDuration: conversationDetails.duration },
          { where: { id: callLog.leadId } }
        );
      }
    }
  } catch (error) {
    console.error(`❌ Error fetching transcription/audio for ${conversationId}:`, error);
  }
}

// Poll batch status and update leads/call logs
async function pollBatchStatus(campaignId, batchId, apiKey) {
  const pollInterval = 30000; // 30 seconds
  const maxPollTime = 3600000; // 1 hour
  const startTime = Date.now();
  
  console.log(`🔄 Starting to poll batch status for campaign ${campaignId}, batch ${batchId}`);

  const pollFunction = async () => {
    try {
      // Check if we've exceeded max poll time
      if (Date.now() - startTime > maxPollTime) {
        console.log(`⏰ Max poll time exceeded for batch ${batchId}, stopping polling`);
        runningCampaigns.delete(campaignId);
        return;
      }

      // ElevenLabs SDK: batchCalls.get(batchId) - using elevenlabsService as equivalent
      const batchResult = await elevenlabsService.getBatchCallStatus(batchId);
      
      if (!batchResult.success) {
        console.error(`Failed to get batch status: ${batchResult.error}`);
        setTimeout(pollFunction, pollInterval);
        return;
      }

      const batchInfo = batchResult.data;
      console.log(`📊 Batch ${batchId} status: ${batchInfo.status}`);

      // processBatchStatus(campaignId, batchInfo)
      await processBatchStatus(campaignId, batchInfo);

      // Stop when status final and no active calls
      const isComplete = batchInfo.status === 'completed' || batchInfo.status === 'failed';
      
      if (isComplete) {
        console.log(`✅ Batch ${batchId} completed with status: ${batchInfo.status}`);
        
      // Finalize: backfill durations and transcriptions from conversation API if missing
      await backfillMissingDurations(campaignId);
      await backfillMissingTranscriptions(campaignId);
        
        // Set campaign.status to completed (if any completed) else failed
        const leads = await Lead.findAll({ where: { campaignId } });
        const completedLeads = leads.filter(l => l.status === 'completed');
        const hasAnyCompleted = completedLeads.length > 0;
        
        const finalCampaignStatus = hasAnyCompleted ? 'completed' : 'failed';
        
        await Campaign.update(
          { status: finalCampaignStatus },
          { where: { id: campaignId } }
        );
        
        // Remove from running campaigns
        runningCampaigns.delete(campaignId);
        
        console.log(`🏁 Campaign ${campaignId} processing completed with status: ${finalCampaignStatus}`);
        console.log(`📈 Results: ${completedLeads.length} completed out of ${leads.length} total leads`);
      } else {
        // Schedule next poll
        setTimeout(pollFunction, pollInterval);
      }

    } catch (error) {
      console.error(`Error polling batch status for ${batchId}:`, error);
      // Continue polling on error, don't stop
      setTimeout(pollFunction, pollInterval);
    }
  };

  // Start polling
  setTimeout(pollFunction, pollInterval);
}

// Backfill missing durations from conversation API
async function backfillMissingDurations(campaignId) {
  try {
    console.log(`🔄 Backfilling missing durations for campaign ${campaignId}`);
    
    // Find call logs with missing durations but have conversation IDs
    const callLogsWithMissingDuration = await CallLog.findAll({
      where: {
        campaignId,
        elevenlabsConversationId: { [Op.ne]: null },
        duration: { [Op.or]: [null, 0] }
      }
    });

    if (callLogsWithMissingDuration.length === 0) {
      console.log(`✅ No missing durations found for campaign ${campaignId}`);
      return;
    }

    console.log(`🔍 Found ${callLogsWithMissingDuration.length} call logs with missing durations`);

    let backfilledCount = 0;
    for (const callLog of callLogsWithMissingDuration) {
      try {
        console.log(`🔍 Fetching conversation details for ${callLog.elevenlabsConversationId}`);
        
        const conversationDetails = await fetchConversationDetails(callLog.elevenlabsConversationId);
        
        if (conversationDetails && conversationDetails.duration) {
          await callLog.update({
            duration: conversationDetails.duration
          });
          
          // Also update the lead's call duration
          if (callLog.leadId) {
            await Lead.update(
              { callDuration: conversationDetails.duration },
              { where: { id: callLog.leadId } }
            );
          }
          
          backfilledCount++;
          console.log(`✅ Backfilled duration for call log ${callLog.id}: ${conversationDetails.duration}s`);
        } else {
          console.warn(`⚠️ Could not get duration for conversation ${callLog.elevenlabsConversationId}`);
        }
      } catch (error) {
        console.error(`❌ Failed to backfill duration for call log ${callLog.id}:`, error.message);
      }
    }

    console.log(`✅ Backfill completed: ${backfilledCount} of ${callLogsWithMissingDuration.length} durations updated`);
    
    // Update campaign statistics after backfilling
    await updateCampaignStatistics(campaignId);
    
  } catch (error) {
    console.error(`Error backfilling missing durations for campaign ${campaignId}:`, error);
  }
}

// Backfill missing transcriptions by fetching conversation details
async function backfillMissingTranscriptions(campaignId) {
  console.log(`🔍 Backfilling missing transcriptions for campaign ${campaignId}`);
  
  try {
    // Find call logs with conversation IDs but missing transcriptions
    const callLogsToUpdate = await CallLog.findAll({
      where: {
        campaignId,
        elevenlabsConversationId: { [Op.not]: null },
        [Op.or]: [
          { transcription: null },
          { transcription: '' }
        ]
      }
    });

    console.log(`📊 Found ${callLogsToUpdate.length} call logs needing transcription backfill`);

    for (const callLog of callLogsToUpdate) {
      try {
        await fetchAndStoreTranscriptionAudio(callLog.elevenlabsConversationId, callLog);
      } catch (error) {
        console.error(`Error backfilling transcription for call log ${callLog.id}:`, error);
      }
    }
    
  } catch (error) {
    console.error(`Error backfilling missing transcriptions for campaign ${campaignId}:`, error);
  }
}

// Main batch processing function
async function processcamp(campaignId) {
  if (runningCampaigns.has(campaignId)) {
    console.log(`⚠️ Campaign ${campaignId} is already being processed`);
    return;
  }

  runningCampaigns.add(campaignId);
  console.log(`🚀 Starting batch processing for campaign ${campaignId}`);

  try {
    // Get campaign details
    const campaign = await Campaign.findByPk(campaignId, {
      include: [{ model: KnowledgeBase, as: 'knowledgeBase' }]
    });

    if (!campaign) {
      console.error(`Campaign ${campaignId} not found`);
      runningCampaigns.delete(campaignId);
      return;
    }

    // Get all leads for this campaign
    const leads = await Lead.findAll({ where: { campaignId } });
    const pendingLeads = leads.filter(lead => lead.status === 'pending');

    if (pendingLeads.length === 0) {
      console.log(`No pending leads found for campaign ${campaignId}`);
      runningCampaigns.delete(campaignId);
      return;
    }

    console.log(`📋 Found ${pendingLeads.length} pending leads for campaign ${campaignId}`);

    // Update agent knowledge base for this campaign
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;
    const agentPhoneNumberId = process.env.ELEVENLABS_PHONE_NUMBER_ID;

    if (!elevenLabsApiKey || !elevenLabsAgentId || !agentPhoneNumberId) {
      throw new Error('Missing ElevenLabs configuration');
    }

    await updateAgentKnowledgeBase(elevenLabsApiKey, campaignId);

    // Create call logs and mark leads as calling
    for (const lead of pendingLeads) {
      console.log(`📝 Creating call log for lead ${lead.id}: ${lead.firstName} (${lead.contactNo})`);
      
      const callLog = await CallLog.create({
        campaignId,
        leadId: lead.id,
        phoneNumber: lead.contactNo,
        status: 'initiated',
        duration: null,
        twilioCallSid: null,
        elevenlabsConversationId: null
      });

      console.log(`✅ Created call log ${callLog.id} for lead ${lead.id}`);

      await Lead.update(
        { status: 'calling' },
        { where: { id: lead.id } }
      );
    }

    console.log(`✅ Created ${pendingLeads.length} call logs and updated lead statuses`);

    // Submit batch calling job to ElevenLabs
    const batchId = await submitBatchCall(
      campaignId,
      pendingLeads,
      campaign,
      elevenLabsApiKey,
      elevenLabsAgentId,
      agentPhoneNumberId
    );

    if (batchId) {
      // Update campaign with batch job ID
      await Campaign.update(
        { 
          status: 'active',
          batchJobId: batchId 
        },
        { where: { id: campaignId } }
      );

      console.log(`✅ Campaign ${campaignId} updated with batch job ID: ${batchId}`);

      // Start polling for batch status
      pollBatchStatus(campaignId, batchId, elevenLabsApiKey);
    } else {
      throw new Error('Failed to get batch job ID from ElevenLabs');
    }

  } catch (error) {
    console.error(`Error processing campaign ${campaignId}:`, error);
    runningCampaigns.delete(campaignId);
    
    // Reset campaign to draft status and clear any partial batch data
    await Campaign.update(
      { 
        status: 'draft',
        batchJobId: null // Clear any invalid batch ID
      }, 
      { where: { id: campaignId } }
    ).catch(err => console.error('Error updating campaign status:', err));
    
    // Also reset any leads that were marked as 'calling' back to 'pending'
    await Lead.update(
      { status: 'pending' },
      { where: { campaignId, status: 'calling' } }
    ).catch(err => console.error('Error resetting lead statuses:', err));
    
    throw error;
  }
}

// Get all campaigns for a user
router.get('/', requireAuth, async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      where: { userId: req.user.id },
      include: [
        { model: KnowledgeBase, as: 'knowledgeBase' },
        { model: Lead, as: 'leads' },
        { model: CallLog, as: 'callLogs' }
      ],
      order: [['created_at', 'DESC']]
    });

    const campaignsWithRealStats = campaigns.map(campaign => {
      const leads = campaign.leads || [];
      const callLogs = campaign.callLogs || [];
      
      // Calculate real stats from actual data
      const totalLeads = leads.length;
      const completedLeads = leads.filter(l => l.status === 'completed');
      const failedLeads = leads.filter(l => l.status === 'failed');

      const completedCalls = completedLeads.length + failedLeads.length;
      const successfulCalls = completedLeads.length;
      const failedCalls = failedLeads.length;

      // Calculate average duration from call logs
      const completedCallLogs = callLogs.filter(log => log.status === 'completed' && log.duration);
      const totalDuration = completedCallLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      const averageDuration = completedCallLogs.length > 0
        ? Math.round(totalDuration / completedCallLogs.length)
        : 0;
      
      return {
        ...campaign.toJSON(),
        knowledgeBase: campaign.knowledgeBase,
        totalLeads,
        completedCalls,
        successfulCalls,
        failedCalls,
        averageDuration
      };
    });

    res.json(campaignsWithRealStats);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get single campaign
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [
        { model: Lead, as: 'leads' },
        { model: KnowledgeBase, as: 'knowledgeBase' }
      ]
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Add CSV file info for frontend display
    const campaignData = campaign.toJSON();
    if (campaign.csvFileName) {
      campaignData.csvFile = {
        name: campaign.csvFileName,
        uploadedAt: campaign.csvUploadedAt,
        hasFile: true
      };
    }

    res.json(campaignData);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Get Campaign Details with Full Data
router.get('/:id/details', requireAuth, async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id, 10);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    console.log(`🔍 [Campaign Details] Fetching details for campaign ${campaignId} by user ${req.user.id}`);

    const campaign = await Campaign.findOne({
      where: { 
        id: campaignId,
        userId: req.user.id 
      },
      include: [
        { model: KnowledgeBase, as: 'knowledgeBase', required: false }
      ]
    });

    if (!campaign) {
      console.log(`❌ [Campaign Details] Campaign ${campaignId} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    console.log(`✅ [Campaign Details] Campaign found: ${campaign.name}`);

    // Fetch related data with error handling
    let leads = [];
    let callLogs = [];
    
    try {
      console.log(`🔍 [Campaign Details] Fetching leads for campaign ${campaignId}`);
      leads = await Lead.findAll({ where: { campaignId } }) || [];
      console.log(`✅ [Campaign Details] Found ${leads.length} leads`);
    } catch (leadsError) {
      console.error(`❌ [Campaign Details] Error fetching leads:`, leadsError);
      // Continue without leads data
    }
    
    try {
      console.log(`🔍 [Campaign Details] Fetching call logs for campaign ${campaignId}`);
      callLogs = await CallLog.findAll({ 
        where: { campaignId },
        order: [['created_at', 'DESC']]
      }) || [];
      console.log(`✅ [Campaign Details] Found ${callLogs.length} call logs`);
    } catch (callLogsError) {
      console.error(`❌ [Campaign Details] Error fetching call logs:`, callLogsError);
      // Continue without call logs data
    }
    
    // Debug: Log ElevenLabs conversation IDs for call logs (with error handling)
    try {
      console.log(`🔍 [Campaign Details] Call logs for campaign ${campaignId}:`);
      callLogs.forEach((log, index) => {
        console.log(`  ${index + 1}. ID: ${log.id}, Status: ${log.status}, ElevenLabs ID: ${log.elevenlabsConversationId || 'NULL'}`);
      });
    } catch (debugError) {
      console.error('Debug logging error:', debugError);
    }

    // Calculate real stats from actual data
    const totalLeads = leads.length;
    const completedLeads = leads.filter(l => l.status === 'completed');
    const failedLeads = leads.filter(l => l.status === 'failed');
    const pendingLeads = leads.filter(l => l.status === 'pending');
    const callingLeads = leads.filter(l => l.status === 'calling');

    const completedCalls = completedLeads.length + failedLeads.length;
    const successfulCalls = completedLeads.length;
    const failedCalls = failedLeads.length;

    // Calculate average duration from call logs
    const completedCallLogs = callLogs.filter(log => log.status === 'completed' && log.duration);
    const totalDuration = completedCallLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const averageDuration = completedCallLogs.length > 0
      ? Math.round(totalDuration / completedCallLogs.length)
      : 0;
      
    const callLogsWithConversations = callLogs.filter(log => log.transcription);

    // Prepare campaign data with CSV file info
    const campaignData = {
      ...campaign.toJSON(),
      totalLeads,
      completedCalls,
      successfulCalls,
      failedCalls
    };
    
    // Add CSV file info for draft campaigns
    if (campaign.csvFileName) {
      campaignData.csvFile = {
        name: campaign.csvFileName,
        uploadedAt: campaign.csvUploadedAt,
        hasFile: true
      };
    }

    res.json({
      campaign: campaignData,
      leads,
      callLogs,
      stats: {
        totalLeads,
        completed: completedLeads.length,
        failed: failedLeads.length,
        pending: pendingLeads.length,
        calling: callingLeads.length,
        averageDuration,
        conversationsWithAudio: callLogsWithConversations.length
      }
    });

  } catch (error) {
    console.error('Get campaign details error:', error);
    
    // Provide more specific error information
    const errorMessage = error.message || 'Failed to fetch campaign details';
    
    res.status(500).json({ 
      error: 'Failed to fetch campaign details',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Create new campaign
router.post('/', requireAuth, [
  body('name').notEmpty().trim(),
  body('firstPrompt').notEmpty().trim(),
  body('systemPersona').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, firstPrompt, systemPersona, selectedVoiceId } = req.body;

    const campaign = await Campaign.create({
      name,
      firstPrompt,
      systemPersona,
      selectedVoiceId,
      userId: req.user.id
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Check if campaign can be edited (must be draft with no completed calls)
    const canEdit = campaign.status === 'draft' && campaign.completedCalls === 0;
    
    if (!canEdit) {
      return res.status(400).json({ 
        error: 'Campaign cannot be edited',
        message: campaign.status !== 'draft' 
          ? 'Only draft campaigns can be edited' 
          : 'Cannot edit campaigns with completed calls'
      });
    }

    const { name, firstPrompt, systemPersona, selectedVoiceId, status } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (firstPrompt !== undefined) updateData.firstPrompt = firstPrompt;
    if (systemPersona !== undefined) updateData.systemPersona = systemPersona;
    if (selectedVoiceId !== undefined) updateData.selectedVoiceId = selectedVoiceId;
    if (status !== undefined) updateData.status = status;

    await campaign.update(updateData);

    res.json(campaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id, 10);

    // 1. Authentication & Ownership Check
    const campaign = await Campaign.findOne({
      where: { 
        id: campaignId,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // 2. CSV File Cleanup for draft campaigns
    cleanupCampaignCSV(campaign);

    // 3. ElevenLabs Knowledge Base Cleanup
    const knowledgeBaseFiles = await KnowledgeBase.findAll({ where: { campaignId } });
    for (const kbFile of knowledgeBaseFiles) {
      if (kbFile.elevenlabsDocId) {
        await elevenlabsService.deleteKnowledgeBase(kbFile.elevenlabsDocId);
      }
    }
    // Clear agent's knowledge base as a final cleanup step
    if (elevenlabsService.agentId) {
      await elevenlabsService.updateAgentKnowledgeBase(elevenlabsService.agentId, []);
    }
    
    // 4. Database Deletion (in specific order)
    await CallLog.destroy({ where: { campaignId } });
    await Lead.destroy({ where: { campaignId } });
    await KnowledgeBase.destroy({ where: { campaignId } });

    // Finally, delete the campaign itself
    await campaign.destroy();

    // 5. Deletion Verification
    const verifyDeleted = await Campaign.findByPk(campaignId);
    if (verifyDeleted) {
      console.error(`[Delete Campaign] Deletion failed - campaign ${campaignId} still exists.`);
      return res.status(500).json({ error: "Failed to delete campaign" });
    }

    res.json({ message: 'Campaign and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Start campaign
router.post('/:id/start', requireAuth, async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id, 10);
    console.log(`🚀 [Start Campaign] Starting campaign ${campaignId} by user ${req.user.id}`);

    const campaign = await Campaign.findOne({
      where: { 
        id: campaignId,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      console.log(`❌ [Start Campaign] Campaign ${campaignId} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Check if campaign is already running
    if (runningCampaigns.has(campaignId)) {
      console.log(`⚠️ [Start Campaign] Campaign ${campaignId} is already running`);
      return res.status(400).json({ error: 'Campaign is already running' });
    }

    // Check if campaign has leads
    const leads = await Lead.findAll({ where: { campaignId } });
    if (leads.length === 0) {
      console.log(`❌ [Start Campaign] No leads found for campaign ${campaignId}`);
      return res.status(400).json({ error: 'No leads found for this campaign. Please upload leads first.' });
    }

    const pendingLeads = leads.filter(lead => lead.status === 'pending');
    if (pendingLeads.length === 0) {
      console.log(`❌ [Start Campaign] No pending leads found for campaign ${campaignId}`);
      return res.status(400).json({ error: 'No pending leads found. All leads have already been processed.' });
    }

    console.log(`📋 [Start Campaign] Found ${pendingLeads.length} pending leads out of ${leads.length} total leads`);

    // Clean up CSV file when campaign transitions from draft to active
    if (campaign.status === 'draft') {
      cleanupCampaignCSV(campaign);
    }

    // Update campaign status and total leads count, clear CSV file info since it's now active
    await campaign.update({ 
      status: 'active', 
      totalLeads: leads.length,
      csvFileName: null,
      csvFilePath: null,
      csvUploadedAt: null
    });

    // Update campaign statistics
    await updateCampaignStatistics(campaignId);

    console.log(`✅ [Start Campaign] Campaign ${campaignId} status updated to active`);

    // Start processing calls asynchronously
    processcamp(campaignId);

    res.json({ 
      message: 'Campaign started successfully',
      campaignId: campaignId,
      totalLeads: leads.length,
      pendingLeads: pendingLeads.length,
      status: 'active'
    });

  } catch (error) {
    console.error('Start campaign error:', error);
    res.status(500).json({ error: 'Failed to start campaign' });
  }
});

// Test call schema validation
const testCallSchema = [
  body('phoneNumber').notEmpty().trim().withMessage('Phone number is required'),
  body('campaignId').optional().isInt({ min: 1 }).withMessage('Campaign ID must be a positive integer'),
  body('firstName').optional().trim().isLength({ max: 100 }).withMessage('First name must be less than 100 characters')
];

// Make an outbound call (test call)
router.post('/make-outbound-call', requireAuth, testCallSchema, async (req, res) => {
  console.log('🚀 MAKE OUTBOUND CALL ENDPOINT HIT');
  try {
    console.log('🔥 TEST CALL REQUEST RECEIVED AT ENDPOINT');
    console.log('🔥 REQUEST BODY:', JSON.stringify(req.body, null, 2));
    console.log('🔥 REQUEST HEADERS:', JSON.stringify(req.headers, null, 2));
    console.log('🔥 USER AUTH:', req.user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');

    // Validate with testCallSchema
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phoneNumber, campaignId, firstName } = req.body;
    console.log('📞 REQUEST DATA:', { phoneNumber, campaignId, firstName });

    if (!phoneNumber) {
      console.log('❌ No phone number provided');
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate and format phone number
    let cleanPhone = phoneNumber.replace(/[^+\d]/g, '');
    console.log('Original phone:', phoneNumber, 'Cleaned phone:', cleanPhone, 'Length:', cleanPhone.length);

    // If phone number doesn't start with +, assume it's missing country code
    if (!cleanPhone.startsWith('+')) {
      // Try to add +1 for US numbers or ask for proper format
      if (cleanPhone.length === 10) {
        // Assume US number
        cleanPhone = '+1' + cleanPhone;
        console.log('Added +1 prefix, new phone:', cleanPhone);
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        // US number with country code but no +
        cleanPhone = '+' + cleanPhone;
        console.log('Added + prefix, new phone:', cleanPhone);
      } else {
        console.log('Phone number format invalid - missing country code');
        return res.status(400).json({
          error: 'Invalid phone number format. Please include country code (e.g., +1 for US, +971 for UAE, +44 for UK)'
        });
      }
    }

    // Final validation for international format
    if (!cleanPhone.match(/^\+[\d]{10,15}$/)) {
      console.log('Final phone validation failed:', cleanPhone);
      return res.status(400).json({
        error: 'Invalid phone number format. Use international format like +971xxxxxxxx or +15551234567'
      });
    }

    // Fetch campaign if provided
    let campaign = null;
    if (campaignId && campaignId !== 'undefined' && campaignId !== 'null') {
      const campaignIdNum = parseInt(campaignId);
      console.log('Looking for campaign:', campaignId, 'type:', typeof campaignId, 'parsed:', campaignIdNum, 'for user:', req.user.id);

      if (isNaN(campaignIdNum)) {
        console.log('❌ Invalid campaignId format:', campaignId);
        return res.status(400).json({ error: 'Invalid campaign ID format' });
      }

      campaign = await Campaign.findOne({
        where: { id: campaignIdNum, userId: req.user.id }
      });
      if (!campaign) {
        console.log('❌ Campaign not found:', campaignIdNum);
        return res.status(404).json({ error: 'Campaign not found' });
      }
      console.log('✅ Campaign found:', campaign.name);
    } else {
      console.log('⚠️ No valid campaignId provided - this is a test call without campaign');
    }

    // Create call log entry
    const callLog = await CallLog.create({
      campaignId: campaignId ? parseInt(campaignId) : null,
      leadId: null, // Test call, no specific lead
      status: 'initiated',
      twilioCallSid: null,
      elevenlabsConversationId: null,
      duration: null,
      transcription: null,
      userId: req.user.id
    });

    // Use ElevenLabs for test calls (same as working modules)
    console.log('📞 Using ElevenLabs for test call...');
    
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;
    const agentPhoneNumberId = process.env.ELEVENLABS_PHONE_NUMBER_ID;

    console.log('ElevenLabs config check:', {
      hasApiKey: !!elevenLabsApiKey,
      hasAgentId: !!elevenLabsAgentId,
      hasPhoneNumberId: !!agentPhoneNumberId
    });

    if (!elevenLabsApiKey || !elevenLabsAgentId || !agentPhoneNumberId) {
      console.log('❌ ElevenLabs not configured');
      return res.status(500).json({ error: 'ElevenLabs not configured on server' });
    }

    // Prepare test call data
    const testCallData = {
      campaignId: campaignId ? parseInt(campaignId) : 'test',
      leadId: `test_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      leadName: firstName || 'Test User',
      selectedVoice: campaign?.selectedVoice || process.env.DEMO_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
      scriptOpening: campaign?.scriptOpening || "Hello! This is a test call from Spark AI. How are you doing today?",
      scriptSystem: campaign?.scriptSystem || "You are Sarah from Spark AI conducting a test call. Be friendly and professional.",
      systemPersona: campaign?.systemPersona || 'Professional AI sales agent',
      firstPrompt: campaign?.scriptOpening || "Hello! This is a test call from Spark AI. How are you doing today?",
      knowledgeBase: campaign?.knowledgeBase || [],
      scriptType: 'test'
    };

    console.log('📋 Test call data:', {
      leadName: testCallData.leadName,
      phone: cleanPhone,
      campaignId: testCallData.campaignId
    });

    // Use ElevenLabs batch calling (works for single calls too)
    const batchPayload = {
      call_name: `Test_${firstName || 'User'}_${Date.now()}`,
      agent_id: elevenLabsAgentId,
      agent_phone_number_id: agentPhoneNumberId,
      scheduled_time_unix: Math.floor(Date.now() / 1000), // Start immediately
      recipients: [{
        phone_number: cleanPhone,
        conversation_initiation_client_data: {
          dynamic_variables: {
            first_name: firstName || 'there',
            test_call: 'true',
            campaign_id: testCallData.campaignId,
            lead_id: testCallData.leadId
          }
        }
      }]
    };

    console.log('📤 Submitting test call to ElevenLabs batch calling...');

    let batchId;
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify(batchPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ElevenLabs batch submit failed:', response.status, errorText);
        throw new Error(`ElevenLabs batch submit failed: ${response.status} - ${errorText}`);
      }

      const callResult = await response.json();
      batchId = callResult.batch_id || callResult.id || callResult.batchId || callResult.batch_calling_id;
      
      if (!batchId) {
        console.error('❌ No batch ID found in response:', Object.keys(callResult));
        throw new Error('Failed to get batch ID from ElevenLabs');
      }

      console.log('✅ Test call submitted successfully to ElevenLabs:', batchId);

      // Update call log with batch ID
      await callLog.update({
        elevenlabsConversationId: batchId,
        status: 'initiated',
        phoneNumber: cleanPhone
      });

      console.log('✅ Updated call log with batch ID:', batchId);

    } catch (error) {
      console.error('❌ ElevenLabs test call failed:', error);
      return res.status(500).json({ 
        error: 'Failed to place test call with ElevenLabs',
        details: error.message 
      });
    }

    res.json({
      success: true,
      message: 'Test call initiated successfully with ElevenLabs Agent Sarah',
      batchId: batchId,
      callLogId: callLog.id,
      phoneNumber: cleanPhone,
      firstName: firstName || 'there',
      status: 'initiated',
      provider: 'elevenlabs'
    });

  } catch (error) {
    console.error('Make outbound call error:', error);
    res.status(500).json({ error: error.message || 'Failed to make outbound call' });
  }
});

// Debug endpoint to check call logs
router.get('/debug/call-logs', requireAuth, async (req, res) => {
  try {
    const callLogs = await CallLog.findAll({
      where: { userId: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 10,
      attributes: ['id', 'campaignId', 'status', 'twilioCallSid', 'elevenlabsConversationId', 'created_at']
    });
    
    console.log('🔍 Recent call logs for user:', req.user.id);
    callLogs.forEach(log => {
      console.log(`  ID: ${log.id}, ElevenLabs ID: ${log.elevenlabsConversationId}, Status: ${log.status}`);
    });
    
    res.json({
      total: callLogs.length,
      callLogs: callLogs.map(log => ({
        id: log.id,
        campaignId: log.campaignId,
        status: log.status,
        twilioCallSid: log.twilioCallSid,
        elevenlabsConversationId: log.elevenlabsConversationId,
        hasElevenLabsId: !!log.elevenlabsConversationId,
        createdAt: log.created_at
      }))
    });
  } catch (error) {
    console.error('Debug call logs error:', error);
    res.status(500).json({ error: 'Failed to fetch call logs' });
  }
});

// Update agent configuration
router.put('/:id/update-agent', requireAuth, async (req, res) => {
  try {
    const { systemPersona, firstPrompt, selectedVoiceId, knowledgeBaseIds } = req.body;
    
    console.log(`🔧 [Update Agent] Starting update for campaign ${req.params.id}`);
    console.log(`📋 [Update Agent] Request body:`, {
      hasFirstPrompt: !!firstPrompt,
      hasSystemPersona: !!systemPersona,
      selectedVoiceId: selectedVoiceId,
      hasKnowledgeBaseIds: !!knowledgeBaseIds,
      knowledgeBaseCount: knowledgeBaseIds?.length || 0
    });

    const campaign = await Campaign.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!campaign) {
      console.log(`❌ [Update Agent] Campaign ${req.params.id} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    console.log(`✅ [Update Agent] Campaign found: ${campaign.name}`);
    console.log(`🎤 [Update Agent] Current voice ID: ${campaign.selectedVoiceId || 'None'}`);
    console.log(`🎤 [Update Agent] New voice ID: ${selectedVoiceId || 'None'}`);

    const updateData = {};
    if (firstPrompt) updateData.firstPrompt = firstPrompt;
    if (systemPersona) updateData.systemPersona = systemPersona;
    if (selectedVoiceId) updateData.selectedVoiceId = selectedVoiceId;

    await campaign.update(updateData);
    console.log(`💾 [Update Agent] Campaign database updated successfully`);
    
    if (selectedVoiceId) {
      console.log(`🎤 [Update Agent] Voice ID updated from '${campaign.selectedVoiceId}' to '${selectedVoiceId}'`);
    }

    // Propagate to ElevenLabs agent if configured
    try {
      const agentId = process.env.ELEVENLABS_AGENT_ID || elevenlabsService.agentId;
      console.log(`🤖 [Update Agent] ElevenLabs Agent ID: ${agentId || 'None configured'}`);
      
      if (agentId) {
        // Update knowledge base on agent if IDs provided
        if (Array.isArray(knowledgeBaseIds)) {
          console.log(`📚 [Update Agent] Updating knowledge base with ${knowledgeBaseIds.length} documents`);
          const kbResult = await elevenlabsService.updateAgentKnowledgeBase(agentId, knowledgeBaseIds);
          console.log(`📚 [Update Agent] Knowledge base update result:`, kbResult?.success ? 'Success' : `Failed: ${kbResult?.error}`);
        }
        
        // Update agent voice if provided
        if (selectedVoiceId) {
          console.log(`🎤 [Update Agent] Updating ElevenLabs agent voice to: ${selectedVoiceId}`);
          const voiceResp = await elevenlabsService.updateAgentVoice(agentId, selectedVoiceId);
          
          if (voiceResp?.success) {
            console.log(`✅ [Update Agent] ElevenLabs agent voice updated successfully`);
          } else {
            console.error(`❌ [Update Agent] Failed to update ElevenLabs agent voice:`, voiceResp?.error);
            console.error(`❌ [Update Agent] Voice update failed with parameters:`, { agentId, selectedVoiceId });
          }
        } else {
          console.log(`⚪ [Update Agent] No voice ID provided, skipping voice update`);
        }
      } else {
        console.warn(`⚠️ [Update Agent] No ElevenLabs agent ID configured, skipping ElevenLabs updates`);
      }
    } catch (err) {
      console.error('❌ [Update Agent] Failed to update ElevenLabs agent config:', err?.message || err);
      console.error('❌ [Update Agent] ElevenLabs error details:', err?.response?.data || 'No additional details');
    }

    res.json({ message: 'Agent updated successfully', campaign });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete leads for campaign
router.delete('/:id/leads', requireAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await Lead.destroy({
      where: { campaignId: campaign.id }
    });

    // Reset campaign stats
    await campaign.update({
      totalLeads: 0,
      completedCalls: 0,
      successfulCalls: 0,
      failedCalls: 0
    });

    res.json({ message: 'Leads deleted successfully' });
  } catch (error) {
    console.error('Delete leads error:', error);
    res.status(500).json({ error: 'Failed to delete leads' });
  }
});

// Manually trigger transcription backfill for a campaign
router.post('/:id/backfill-transcriptions', requireAuth, async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id, 10);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaign = await Campaign.findOne({
      where: { 
        id: campaignId,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    console.log(`🎯 Manual transcription backfill requested for campaign ${campaignId}`);

    // Run both duration and transcription backfill
    await backfillMissingDurations(campaignId);
    await backfillMissingTranscriptions(campaignId);

    // Get updated statistics
    const callLogs = await CallLog.findAll({ 
      where: { campaignId },
      order: [['created_at', 'DESC']]
    });

    const callsWithTranscription = callLogs.filter(log => log.transcription && log.transcription !== '');
    const callsWithConversationId = callLogs.filter(log => log.elevenlabsConversationId);

    res.json({ 
      message: 'Transcription backfill completed',
      statistics: {
        totalCallLogs: callLogs.length,
        callsWithConversationId: callsWithConversationId.length,
        callsWithTranscription: callsWithTranscription.length,
        backfillSuccess: `${callsWithTranscription.length}/${callsWithConversationId.length}`
      }
    });

  } catch (error) {
    console.error('Transcription backfill error:', error);
    res.status(500).json({ error: 'Failed to backfill transcriptions' });
  }
});

// Reset a failed campaign back to draft status
router.post('/:id/reset', requireAuth, async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id, 10);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    const campaign = await Campaign.findOne({
      where: { 
        id: campaignId,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Reset campaign to draft status and clear batch data
    await campaign.update({
      status: 'draft',
      batchJobId: null
    });

    // Reset any leads back to pending
    await Lead.update(
      { status: 'pending' },
      { where: { campaignId, status: ['calling', 'failed'] } }
    );

    // Remove from running campaigns set if present
    runningCampaigns.delete(campaignId);

    console.log(`✅ Campaign ${campaignId} reset to draft status`);

    res.json({ 
      message: 'Campaign reset successfully',
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: 'draft'
      }
    });

  } catch (error) {
    console.error('Reset campaign error:', error);
    res.status(500).json({ error: 'Failed to reset campaign' });
  }
});

// Alternative endpoint to match the expected API from the code snippet
router.post('/start-campaign', requireAuth, async (req, res) => {
  try {
    const { campaignId } = req.body;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    console.log(`🚀 [Start Campaign] Starting campaign ${campaignId} by user ${req.user.id}`);

    const campaign = await Campaign.findOne({
      where: { 
        id: campaignId,
        userId: req.user.id 
      }
    });

    if (!campaign) {
      console.log(`❌ [Start Campaign] Campaign ${campaignId} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Check if campaign is already running
    if (runningCampaigns.has(campaignId)) {
      console.log(`⚠️ [Start Campaign] Campaign ${campaignId} is already running`);
      return res.status(400).json({ error: 'Campaign is already running' });
    }

    // Check if campaign has leads
    const leads = await Lead.findAll({ where: { campaignId } });
    if (leads.length === 0) {
      console.log(`❌ [Start Campaign] No leads found for campaign ${campaignId}`);
      return res.status(400).json({ error: 'No leads found for this campaign. Please upload leads first.' });
    }

    const pendingLeads = leads.filter(lead => lead.status === 'pending');
    if (pendingLeads.length === 0) {
      console.log(`❌ [Start Campaign] No pending leads found for campaign ${campaignId}`);
      return res.status(400).json({ error: 'No pending leads found. All leads have already been processed.' });
    }

    console.log(`📋 [Start Campaign] Found ${pendingLeads.length} pending leads out of ${leads.length} total leads`);

    // Clean up CSV file when campaign transitions from draft to active
    if (campaign.status === 'draft') {
      cleanupCampaignCSV(campaign);
    }

    // Update campaign status and total leads count, clear CSV file info since it's now active
    await campaign.update({ 
      status: 'active', 
      totalLeads: leads.length,
      csvFileName: null,
      csvFilePath: null,
      csvUploadedAt: null
    });

    // Update campaign statistics
    await updateCampaignStatistics(campaignId);

    console.log(`✅ [Start Campaign] Campaign ${campaignId} status updated to active`);

    // Start processing calls asynchronously
    processcamp(campaignId);

    res.json({ 
      message: 'Campaign started successfully',
      campaignId: campaignId,
      totalLeads: leads.length,
      pendingLeads: pendingLeads.length,
      status: 'active'
    });

  } catch (error) {
    console.error('Start campaign error:', error);
    res.status(500).json({ error: 'Failed to start campaign' });
  }
});

export default router;
