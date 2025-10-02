import axios from 'axios';
import twilio from 'twilio';
import dotenv from 'dotenv';

class TwilioService {
  constructor() {
    this.client = null;
    this.initialize();
  }

  initialize() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('⚠️  Twilio credentials not found. Calls will be mocked.');
      return;
    }

    try {
      this.client = twilio(accountSid, authToken);
      this.phoneNumber = phoneNumber;
      console.log('✅ Twilio service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio:', error.message);
    }
  }

  async makeCall(to, message, voiceUrl = null, campaignData = {}) {
    if (!this.client) {
      // Return mock response if Twilio not configured
      return {
        success: true,
        callId: `mock_call_${Date.now()}`,
        status: 'initiated',
        message: 'Mock call initiated (Twilio not configured)'
      };
    }

    try {
      // For testing, use TwiML directly instead of webhook URL
      const leadName = campaignData.leadName || 'there';
      const twiml = this.generateTwiML(message, 'alice', leadName, campaignData);
      
      const call = await this.client.calls.create({
        to: to,
        from: this.phoneNumber,
        twiml: twiml
      });

      return {
        success: true,
        callId: call.sid,
        status: call.status,
        message: 'Call initiated successfully'
      };
    } catch (error) {
      console.error('Twilio call error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to initiate call'
      };
    }
  }

  async sendSMS(to, message) {
    if (!this.client) {
      return {
        success: true,
        messageId: `mock_sms_${Date.now()}`,
        message: 'Mock SMS sent (Twilio not configured)'
      };
    }

    try {
      const sms = await this.client.messages.create({
        to: to,
        from: this.phoneNumber,
        body: message
      });

      return {
        success: true,
        messageId: sms.sid,
        message: 'SMS sent successfully'
      };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send SMS'
      };
    }
  }

  async getCallStatus(callId) {
    if (!this.client) {
      return {
        status: 'completed',
        duration: 120,
        message: 'Mock call status'
      };
    }

    try {
      const call = await this.client.calls(callId).fetch();
      return {
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
        direction: call.direction
      };
    } catch (error) {
      console.error('Twilio status error:', error);
      return {
        error: error.message
      };
    }
  }

  async getRecordingUrl(callSid) {
    try {
      const recording = await this.client.recordings.list({ callSid: callSid, limit: 1 });
      if (recording.length > 0) {
        const recordingSid = recording[0].sid;
        const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Recordings/${recordingSid}.mp3`;
        
        const response = await axios({
          method: 'get',
          url: url,
          responseType: 'stream',
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
        });
        
        return { success: true, stream: response.data };
      }
      return { success: false, error: 'No recording found for this call.' };
    } catch (error) {
      console.error('Error fetching recording stream from Twilio:', error);
      return { success: false, error: 'Failed to fetch recording stream.' };
    }
  }

  // Generate TwiML for voice response
  generateTwiML(message, voice = 'alice', leadName = 'there', campaignData = {}) {
    // Add natural pauses and conversational elements
    const naturalMessage = this.makeMessageNatural(message);
    
    // Use selected voice from campaign data if available
    const selectedVoice = campaignData.selectedVoice || voice;
    
    // More conversational and natural TwiML
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Say voice="${selectedVoice}" language="en-US" rate="0.85" pitch="1.1">${naturalMessage}</Say>
  <Pause length="2"/>
  <Say voice="${selectedVoice}" language="en-US" rate="0.9" pitch="1.0">Thank you so much for your time, ${leadName}. I really appreciate you taking the call.</Say>
  <Pause length="1"/>
  <Say voice="${selectedVoice}" language="en-US" rate="0.95" pitch="0.9">Have a wonderful day, and take care!</Say>
  <Pause length="1"/>
  <Say voice="${selectedVoice}" language="en-US" rate="0.9">Goodbye.</Say>
</Response>`;
  }

  makeMessageNatural(message) {
    // Add natural speech patterns
    return message
      .replace(/\./g, '. <break time="0.5s"/>')
      .replace(/\?/g, '? <break time="0.8s"/>')
      .replace(/!/g, '! <break time="0.5s"/>')
      .replace(/,/g, ', <break time="0.3s"/>')
      .replace(/:/g, ': <break time="0.4s"/>');
  }

  async placeDemoCall({ to, demoId, customerName, industry, useCase, script }) {
    if (!this.client) {
      // Return mock response if Twilio not configured
      return {
        success: true,
        callSid: `mock_demo_${Date.now()}`,
        status: 'initiated',
        message: 'Mock demo call initiated (Twilio not configured)',
        demoId
      };
    }

    try {
      console.log(`📞 Placing demo call to ${to} for ${customerName}`);

      // For demo calls, we'll use the script as TwiML with enhanced natural speech
      const demoTwiML = this.generateDemoTwiML(script, customerName, industry, useCase);
      
      const call = await this.client.calls.create({
        to: to,
        from: this.phoneNumber,
        twiml: demoTwiML,
        statusCallback: `${process.env.BASE_URL || 'http://localhost:8000'}/api/ai-demo/webhook`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed', 'failed'],
        timeout: 30, // Ring for 30 seconds
        record: false, // Don't record demo calls for privacy
        // Pass custom parameters for webhook
        machineDetection: 'Enable', // Handle voicemail appropriately
        machineDetectionTimeout: 5,
        machineDetectionSpeechThreshold: 2400,
        machineDetectionSilenceTimeout: 2000
      });

      console.log('✅ Demo call placed successfully:', call.sid);

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        message: 'Demo call initiated successfully',
        demoId,
        estimatedDuration: '60 seconds'
      };

    } catch (error) {
      console.error('❌ Demo call failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to place demo call',
        message: 'Demo call initiation failed',
        demoId
      };
    }
  }

  generateDemoTwiML(script, customerName, industry, useCase) {
    // Create enhanced TwiML for demo calls with better pacing and naturalness
    const enhancedScript = this.enhanceScriptForDemo(script, customerName);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="1"/>
  <Say voice="alice" language="en-US" rate="0.9" pitch="1.0">${enhancedScript}</Say>
  <Pause length="2"/>
  <Say voice="alice" language="en-US" rate="0.85" pitch="1.1">This was a demonstration of our AI agent capabilities for ${industry} businesses.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US" rate="0.9" pitch="1.0">If you'd like to see how this can transform your ${useCase} process, please visit our website or contact our team.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US" rate="0.9" pitch="0.95">Thank you for your time, ${customerName}. Have a great day!</Say>
</Response>`;
  }

  enhanceScriptForDemo(script, customerName) {
    // Enhance the script with natural pauses and customer name personalization
    return script
      .replace(/\{name\}/g, customerName)
      .replace(/\{customer\}/g, customerName)
      .replace(/\./g, '. <break time="0.6s"/>')
      .replace(/\?/g, '? <break time="0.9s"/>')
      .replace(/!/g, '! <break time="0.6s"/>')
      .replace(/,/g, ', <break time="0.4s"/>')
      .replace(/:/g, ': <break time="0.5s"/>')
      .replace(/\n/g, ' <break time="1s"/> ');
  }
}

export default new TwilioService();
