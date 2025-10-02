import axios from 'axios';
import crypto from 'crypto';

class CalendlyService {
  constructor() {
    this.clientId = process.env.CALENDLY_CLIENT_ID;
    this.clientSecret = process.env.CALENDLY_CLIENT_SECRET;
    this.webhookSigningKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
    this.baseURL = 'https://api.calendly.com';
    this.redirectUri = process.env.CALENDLY_REDIRECT_URI || 'http://localhost:3000/auth/calendly/callback';
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl() {
    const authUrl = new URL('https://auth.calendly.com/oauth/authorize');
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('scope', 'scheduling:read scheduling:write');
    
    return authUrl.toString();
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(authorizationCode) {
    try {
      const response = await axios.post('https://auth.calendly.com/oauth/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching current user:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Get user's event types
   */
  async getEventTypes(accessToken, userUri) {
    try {
      const response = await axios.get(`${this.baseURL}/event_types`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          user: userUri,
          count: 20,
          sort: 'name:asc'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching event types:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Get scheduled events
   */
  async getScheduledEvents(accessToken, userUri, options = {}) {
    try {
      const params = {
        user: userUri,
        count: options.count || 20,
        sort: options.sort || 'start_time:asc'
      };

      if (options.minStartTime) {
        params.min_start_time = options.minStartTime;
      }
      if (options.maxStartTime) {
        params.max_start_time = options.maxStartTime;
      }

      const response = await axios.get(`${this.baseURL}/scheduled_events`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching scheduled events:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Create webhook subscription
   */
  async createWebhookSubscription(accessToken, webhookUrl, events) {
    try {
      const response = await axios.post(`${this.baseURL}/webhook_subscriptions`, {
        url: webhookUrl,
        events: events || [
          'invitee.created',
          'invitee.canceled'
        ],
        organization: null, // Will use user's default organization
        scope: 'user'
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating webhook subscription:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSigningKey) {
      console.error('Webhook signing key not configured');
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSigningKey)
        .update(payload, 'utf8')
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'base64'),
        Buffer.from(expectedSignature, 'base64')
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Generate scheduling link for embedding
   */
  generateSchedulingLink(eventTypeSlug, userSlug, options = {}) {
    const baseUrl = 'https://calendly.com';
    let schedulingUrl = `${baseUrl}/${userSlug}/${eventTypeSlug}`;

    if (options.embedType === 'popup') {
      schedulingUrl += '?embed_domain=' + encodeURIComponent(options.embedDomain || 'localhost:3000');
      schedulingUrl += '&embed_type=Popup';
    }

    // Add prefill parameters if provided
    if (options.prefill) {
      const searchParams = new URLSearchParams();
      Object.keys(options.prefill).forEach(key => {
        searchParams.append(key, options.prefill[key]);
      });
      schedulingUrl += (schedulingUrl.includes('?') ? '&' : '?') + searchParams.toString();
    }

    return schedulingUrl;
  }

  /**
   * Get available time slots (for custom calendar display)
   */
  async getAvailableTimes(accessToken, eventTypeUri, startDate, endDate) {
    try {
      const response = await axios.get(`${this.baseURL}/event_type_available_times`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          event_type: eventTypeUri,
          start_time: startDate,
          end_time: endDate
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching available times:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }
}

export default new CalendlyService();
