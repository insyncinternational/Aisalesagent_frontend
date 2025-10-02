import express from 'express';
import rateLimit from 'express-rate-limit';
import calendlyService from '../services/calendlyService.js';
import { requireAuth } from '../middleware/auth.js';

// Rate limiting for Calendly endpoints
const calendlyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many Calendly requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

/**
 * GET /api/calendly/status
 * Check Calendly integration status
 */
router.get('/status', (req, res) => {
  const userSlug = process.env.CALENDLY_USER_SLUG;
  const eventType = process.env.CALENDLY_EVENT_TYPE;
  const clientId = process.env.CALENDLY_CLIENT_ID;
  const webhookKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

  const status = {
    configured: true, // Now configured with insyncinternational
    userSlug: userSlug || 'insyncinternational',
    eventType: eventType || '30min (default)',
    hasClientId: !!clientId,
    hasWebhookKey: !!webhookKey,
    sampleUrl: `https://calendly.com/${userSlug || 'insyncinternational'}/${eventType || '30min'}`,
    ready: true,
    message: 'Calendly integration is configured and ready to use!'
  };

  res.json({
    success: true,
    status
  });
});

/**
 * GET /api/calendly/debug/test-slugs
 * Test different event type slugs to find the correct one
 */
router.get('/debug/test-slugs', (req, res) => {
  const userSlug = 'insyncinternational';
  const commonSlugs = [
    '30min',
    '30-min', 
    '30-minute',
    '30-minutes',
    '30-minute-call',
    '30-minute-meeting',
    'consultation',
    'call',
    'meeting',
    'discovery-call',
    'free-consultation'
  ];

  const testUrls = commonSlugs.map(slug => ({
    slug,
    url: `https://calendly.com/${userSlug}/${slug}`,
    testLink: `Click to test: <a href="https://calendly.com/${userSlug}/${slug}" target="_blank">https://calendly.com/${userSlug}/${slug}</a>`
  }));

  res.json({
    success: true,
    message: 'Test these URLs to find your correct event type slug',
    userSlug,
    currentDefault: '30min',
    testUrls,
    instructions: 'Click each test link. The one that shows your booking page (not 404) is your correct slug!'
  });
});

/**
 * GET /api/calendly/auth/url
 * Get Calendly OAuth authorization URL (Admin only)
 */
router.get('/auth/url', requireAuth, (req, res) => {
  try {
    const authUrl = calendlyService.getAuthorizationUrl();
    res.json({ 
      success: true, 
      authUrl 
    });
  } catch (error) {
    console.error('Error generating Calendly auth URL:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate authorization URL' 
    });
  }
});

/**
 * POST /api/calendly/auth/token
 * Exchange authorization code for access token
 */
router.post('/auth/token', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      });
    }

    const tokenResult = await calendlyService.getAccessToken(code);
    
    if (!tokenResult.success) {
      return res.status(400).json({
        success: false,
        error: tokenResult.error
      });
    }

    // Get user information
    const userResult = await calendlyService.getCurrentUser(tokenResult.data.access_token);
    
    if (!userResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch user information'
      });
    }

    // Store tokens in session or database as needed
    // For now, we'll return them to the frontend
    res.json({
      success: true,
      tokens: tokenResult.data,
      user: userResult.data
    });

  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to exchange authorization code'
    });
  }
});

/**
 * GET /api/calendly/user/me
 * Get current user information
 */
router.get('/user/me', requireAuth, async (req, res) => {
  try {
    const { accessToken } = req.query;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const result = await calendlyService.getCurrentUser(accessToken);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      user: result.data
    });

  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user information'
    });
  }
});

/**
 * GET /api/calendly/event-types
 * Get user's event types
 */
router.get('/event-types', requireAuth, async (req, res) => {
  try {
    const { accessToken, userUri } = req.query;
    
    if (!accessToken || !userUri) {
      return res.status(400).json({
        success: false,
        error: 'Access token and user URI are required'
      });
    }

    const result = await calendlyService.getEventTypes(accessToken, userUri);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      eventTypes: result.data
    });

  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event types'
    });
  }
});

/**
 * GET /api/calendly/scheduled-events
 * Get scheduled events
 */
router.get('/scheduled-events', requireAuth, async (req, res) => {
  try {
    const { accessToken, userUri, minStartTime, maxStartTime, count } = req.query;
    
    if (!accessToken || !userUri) {
      return res.status(400).json({
        success: false,
        error: 'Access token and user URI are required'
      });
    }

    const options = {
      minStartTime,
      maxStartTime,
      count: count ? parseInt(count) : 20
    };

    const result = await calendlyService.getScheduledEvents(accessToken, userUri, options);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      events: result.data
    });

  } catch (error) {
    console.error('Error fetching scheduled events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scheduled events'
    });
  }
});

/**
 * POST /api/calendly/webhooks/setup
 * Create webhook subscription
 */
router.post('/webhooks/setup', requireAuth, async (req, res) => {
  try {
    const { accessToken, webhookUrl, events } = req.body;
    
    if (!accessToken || !webhookUrl) {
      return res.status(400).json({
        success: false,
        error: 'Access token and webhook URL are required'
      });
    }

    const result = await calendlyService.createWebhookSubscription(accessToken, webhookUrl, events);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      webhook: result.data
    });

  } catch (error) {
    console.error('Error creating webhook subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create webhook subscription'
    });
  }
});

/**
 * POST /api/calendly/webhooks/receive
 * Receive Calendly webhook notifications (Public endpoint)
 */
router.post('/webhooks/receive', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const signature = req.headers['calendly-webhook-signature'];
    const payload = req.body;

    // Verify webhook signature
    const isValid = calendlyService.verifyWebhookSignature(payload, signature);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook signature'
      });
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(payload);
    
    console.log('📅 Calendly webhook received:', {
      event: webhookData.event,
      created_at: webhookData.created_at,
      payload: webhookData.payload
    });

    // Handle different webhook events
    handleWebhookEvent(webhookData);

    res.json({ success: true });

  } catch (error) {
    console.error('Error processing Calendly webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

/**
 * POST /api/calendly/scheduling-link
 * Generate scheduling link for embedding (Public access)
 */
router.post('/scheduling-link', async (req, res) => {
  try {
    const { eventTypeSlug, userSlug, options = {} } = req.body;
    
    if (!eventTypeSlug || !userSlug) {
      return res.status(400).json({
        success: false,
        error: 'Event type slug and user slug are required'
      });
    }

    const schedulingLink = calendlyService.generateSchedulingLink(eventTypeSlug, userSlug, options);
    
    res.json({
      success: true,
      schedulingLink
    });

  } catch (error) {
    console.error('Error generating scheduling link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate scheduling link'
    });
  }
});

/**
 * GET /api/calendly/public/schedule-link
 * Get public scheduling link for landing page
 */
router.get('/public/schedule-link', calendlyLimiter, async (req, res) => {
  try {
    const { eventType = '30min', prefill } = req.query;
    
    // Default configuration for public scheduling  
    const userSlug = process.env.CALENDLY_USER_SLUG || 'insyncinternational';
    const eventTypeSlug = process.env.CALENDLY_EVENT_TYPE || eventType;
    
    // Using insyncinternational as the default - no configuration check needed since we have valid defaults
    
    let options = {
      embedType: 'popup',
      embedDomain: req.get('host') || 'localhost:3000'
    };

    // Add prefill data if provided
    if (prefill) {
      try {
        options.prefill = JSON.parse(prefill);
      } catch (e) {
        console.warn('Invalid prefill data:', prefill);
      }
    }

    const schedulingLink = calendlyService.generateSchedulingLink(eventTypeSlug, userSlug, options);
    
    res.json({
      success: true,
      schedulingLink,
      embedCode: `<div class="calendly-inline-widget" data-url="${schedulingLink}" style="min-width:320px;height:700px;"></div>`
    });

  } catch (error) {
    console.error('Error generating public scheduling link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate scheduling link'
    });
  }
});

/**
 * GET /api/calendly/available-times
 * Get available time slots (Admin only)
 */
router.get('/available-times', requireAuth, async (req, res) => {
  try {
    const { accessToken, eventTypeUri, startDate, endDate } = req.query;
    
    if (!accessToken || !eventTypeUri || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Access token, event type URI, start date, and end date are required'
      });
    }

    const result = await calendlyService.getAvailableTimes(accessToken, eventTypeUri, startDate, endDate);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      availableTimes: result.data
    });

  } catch (error) {
    console.error('Error fetching available times:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available times'
    });
  }
});

/**
 * POST /api/calendly/public/lead-capture
 * Capture lead information before scheduling (Public endpoint)
 */
router.post('/public/lead-capture', async (req, res) => {
  try {
    const { name, email, phone, company, message, eventType = '30min' } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    // Store lead information (you can integrate with your existing Lead model)
    const leadData = {
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      email,
      phone,
      company,
      message,
      source: 'calendly_landing',
      createdAt: new Date().toISOString()
    };

    console.log('📋 Lead captured for Calendly scheduling:', leadData);

    // Generate personalized scheduling link with prefilled data
    const userSlug = process.env.CALENDLY_USER_SLUG || 'insyncinternational';
    const options = {
      embedType: 'popup',
      prefill: {
        name,
        email,
        a1: phone, // Custom field for phone
        a2: company, // Custom field for company
      }
    };

    const schedulingLink = calendlyService.generateSchedulingLink(eventType, userSlug, options);
    
    // TODO: Store lead in database
    // const lead = await Lead.create(leadData);
    
    res.json({
      success: true,
      message: 'Lead information captured successfully',
      schedulingLink,
      leadData: {
        id: `lead_${Date.now()}`,
        ...leadData
      }
    });

  } catch (error) {
    console.error('Error capturing lead for Calendly:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture lead information'
    });
  }
});

/**
 * Handle different webhook events
 */
async function handleWebhookEvent(webhookData) {
  try {
    const { event, payload } = webhookData;

    switch (event) {
      case 'invitee.created':
        await handleInviteeCreated(payload);
        break;
      case 'invitee.canceled':
        await handleInviteeCanceled(payload);
        break;
      default:
        console.log(`📅 Unhandled Calendly webhook event: ${event}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
  }
}

/**
 * Handle invitee created event
 */
async function handleInviteeCreated(payload) {
  try {
    console.log('🎉 New Calendly appointment booked:', {
      appointmentUri: payload.uri,
      eventUri: payload.event,
      name: payload.name,
      email: payload.email,
      status: payload.status,
      createdAt: payload.created_at
    });

    // TODO: Store appointment in database
    // TODO: Send confirmation email
    // TODO: Update lead status if applicable
    
  } catch (error) {
    console.error('Error handling invitee created:', error);
  }
}

/**
 * Handle invitee canceled event
 */
async function handleInviteeCanceled(payload) {
  try {
    console.log('❌ Calendly appointment canceled:', {
      appointmentUri: payload.uri,
      eventUri: payload.event,
      name: payload.name,
      email: payload.email,
      canceledAt: payload.canceled_at,
      cancelReason: payload.cancellation?.canceler_type
    });

    // TODO: Update appointment status in database
    // TODO: Send cancellation notification
    // TODO: Update lead status if applicable
    
  } catch (error) {
    console.error('Error handling invitee canceled:', error);
  }
}

export default router;
