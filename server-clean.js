// Healthcare WhatsApp Bot - Direct AI Chat (No Menus)
const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { getGeminiResponse, detectLanguage, transcribeAudio, generateLanguageButtons } = require('./utils/aiUtils');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Supabase configuration
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// WhatsApp API configuration
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// User session storage
const userSessions = new Map();

// Helper functions
const getUserLanguage = (phoneNumber) => {
  const session = userSessions.get(phoneNumber);
  return session?.language || 'en';
};

const updateUserLanguage = async (phoneNumber, language) => {
  const session = userSessions.get(phoneNumber) || {};
  session.language = language;
  userSessions.set(phoneNumber, session);
  
  try {
    await supabase
      .from('user_sessions')
      .upsert({
        phone_number: phoneNumber,
        language: language,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error updating user language:', error);
  }
};

const isNewUser = (phoneNumber) => {
  return !userSessions.has(phoneNumber);
};

const getOrCreatePatient = async (phoneNumber, name) => {
  try {
    let { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (!patient) {
      const { data: newPatient } = await supabase
        .from('patients')
        .insert({
          phone_number: phoneNumber,
          name: name,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      patient = newPatient;
    }

    return patient;
  } catch (error) {
    console.error('Error managing patient:', error);
    return null;
  }
};

// WhatsApp messaging functions
const sendWhatsAppMessage = async (to, message, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Message sent successfully to ${to} (attempt ${attempt})`);
      return response.data;
      
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.error(`❌ Attempt ${attempt} failed:`, error.response?.data?.error || error.message);
      
      if (errorMessage.includes('Recipient phone number not in allowed list')) {
        console.log('⚠️ WhatsApp API Development Mode Restriction:');
        console.log('📱 This phone number needs to be added to your WhatsApp Business account allowed list');
        throw new Error('Recipient phone number not in allowed list');
      }
      
      if (attempt === retries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

const sendWhatsAppInteractiveMessage = async (to, interactiveMessage, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          ...interactiveMessage
        },
        {
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ WhatsApp interactive message sent successfully');
      return response.data;
      
    } catch (error) {
      console.error(`❌ Interactive message attempt ${attempt} failed:`, error.response?.data?.error || error.message);
      
      if (attempt === retries) {
        const fallbackText = interactiveMessage.interactive?.body?.text || 
                           interactiveMessage.interactive?.header?.text || 
                           'Healthcare assistant ready. Send me any health questions!';
        return await sendWhatsAppMessage(to, fallbackText);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Download WhatsApp media
const downloadWhatsAppMedia = async (mediaId) => {
  try {
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v20.0/${mediaId}`,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );

    const mediaUrl = mediaResponse.data.url;
    const mediaDataResponse = await axios.get(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      responseType: 'arraybuffer'
    });

    return {
      data: Buffer.from(mediaDataResponse.data).toString('base64'),
      mimeType: mediaResponse.data.mime_type
    };
  } catch (error) {
    console.error('Error downloading media:', error);
    throw new Error('Failed to download media');
  }
};

// Webhook routes
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(entry => {
        entry.changes?.forEach(change => {
          if (change.field === 'messages') {
            const message = change.value.messages?.[0];
            const contact = change.value.contacts?.[0];

            if (message) {
              if (message.type === 'interactive') {
                handleInteractiveMessage(message, contact);
              } else {
                handleIncomingMessage(message, contact);
              }
            }
          }
        });
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle interactive messages (language selection only)
const handleInteractiveMessage = async (message, contact) => {
  try {
    const userPhone = message.from;
    const buttonId = message.interactive?.button_reply?.id;
    const contactName = contact?.profile?.name || 'User';
    
    console.log(`Interactive message from ${contactName} (${userPhone}): ${buttonId}`);
    
    // Handle language selection only
    if (buttonId && buttonId.startsWith('lang_')) {
      const selectedLanguage = buttonId.replace('lang_', '');
      await updateUserLanguage(userPhone, selectedLanguage);
      
      const welcomeMessages = {
        en: '🤖 Great! I\'ll assist you in English. Ask me any health questions!',
        hi: '🤖 बहुत बढ़िया! मैं हिंदी में आपकी सहायता करूंगा। कोई भी स्वास्थ्य प्रश्न पूछें!',
        te: '🤖 అద్భుతం! నేను తెలుగులో మీకు సహాయం చేస్తాను। ఏదైనా ఆరోగ్య ప్రశ్న అడగండి!',
        ta: '🤖 அருமை! நான் தமிழில் உங்களுக்கு உதவுவேன். எந்த சுகாதார கேள்வியும் கேளுங்கள்!',
        or: '🤖 ବହୁତ ଭଲ! ମୁଁ ଓଡ଼ିଆରେ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବି। କୌଣସି ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ!'
      };
      
      const responseMessage = welcomeMessages[selectedLanguage] || welcomeMessages.en;
      await sendWhatsAppMessage(userPhone, responseMessage);
      return;
    }
    
    // For any other interactive message, treat as regular text
    const messageText = message.interactive?.button_reply?.title || 'Hello';
    await handleIncomingMessage({
      from: userPhone,
      type: 'text',
      text: { body: messageText }
    }, contact);
    
  } catch (error) {
    console.error('Error handling interactive message:', error);
    await sendWhatsAppMessage(
      message.from,
      'I\'m here to help with your health questions. Just send me a message!'
    );
  }
};

// Handle incoming messages - Direct AI Chat
const handleIncomingMessage = async (message, contact) => {
  try {
    const phoneNumber = message.from;
    const contactName = contact?.profile?.name || 'User';
    const messageText = message.text?.body || '';
    
    console.log(`📨 Message from ${contactName} (${phoneNumber}): ${messageText}`);
    
    // Check if user is new - send welcome and language selection
    if (isNewUser(phoneNumber) && message.type === 'text') {
      await sendWhatsAppMessage(phoneNumber, '🤖 Welcome! I\'m your AI healthcare assistant. Please select your preferred language:');
      const languageButtons = generateLanguageButtons();
      await sendWhatsAppInteractiveMessage(phoneNumber, languageButtons);
      await updateUserLanguage(phoneNumber, 'en'); // Default to English
      return;
    }
    
    // Get user's preferred language
    const userLanguage = getUserLanguage(phoneNumber);
    
    // Get or create patient
    const patient = await getOrCreatePatient(phoneNumber, contactName);
    
    let aiResponse = '';
    let messageContent = '';

    if (message.type === 'text') {
      messageContent = message.text.body;
      
      // Direct AI response for all text messages
      aiResponse = await getGeminiResponse(messageContent, null, userLanguage);
      
    } else if (message.type === 'audio') {
      // Handle audio messages
      console.log('Audio message received:', JSON.stringify(message, null, 2));
      
      try {
        const audioId = message.audio?.id;
        const audioMimeType = message.audio?.mime_type || 'audio/ogg; codecs=opus';
        
        if (!audioId) {
          throw new Error('No audio ID found in message');
        }
        
        console.log(`Processing audio: ID=${audioId}, MimeType=${audioMimeType}`);
        
        const audioData = await downloadWhatsAppMedia(audioId);
        
        if (!audioData.data) {
          throw new Error('No audio data received');
        }
        
        console.log(`Audio downloaded: ${Math.round(audioData.data.length * 0.75)} bytes`);
        
        const audioBuffer = Buffer.from(audioData.data, 'base64');
        const transcription = await transcribeAudio(audioBuffer, audioData.mimeType);
        console.log(`Audio transcribed: "${transcription}"`);
        
        if (!transcription || transcription.trim().length === 0) {
          aiResponse = 'I received your voice message but could not understand the speech. Please try speaking more clearly or send your question as text.';
          messageContent = '[Audio received - transcription failed]';
        } else {
          messageContent = transcription;
          const audioPrompt = `Voice message transcription: "${transcription}"\nPlease provide healthcare guidance based on this voice message.`;
          aiResponse = await getGeminiResponse(audioPrompt, null, userLanguage);
          console.log(`Audio processed successfully`);
        }
        
      } catch (error) {
        console.error('Audio processing error:', error);
        
        if (error.message.includes('OPENAI_API_KEY')) {
          aiResponse = 'Audio transcription is temporarily unavailable. Please send your message as text.';
        } else if (error.message.includes('rate limit')) {
          aiResponse = 'Audio processing is temporarily busy. Please try again in a moment or send your message as text.';
        } else {
          aiResponse = 'Sorry, I had trouble processing your voice message. Please try sending it as text.';
        }
        
        messageContent = '[Audio processing failed]';
      }
      
    } else if (message.type === 'image') {
      // Handle image messages
      console.log('Image message received:', JSON.stringify(message, null, 2));
      
      try {
        const imageId = message.image?.id;
        const imageCaption = message.image?.caption || 'Medical image for analysis';
        
        if (!imageId) {
          throw new Error('No image ID found in message');
        }
        
        console.log(`Processing image: ID=${imageId}, Caption=${imageCaption}`);
        
        const imageData = await downloadWhatsAppMedia(imageId);
        
        if (!imageData.data || !imageData.mimeType) {
          throw new Error('Invalid image data received');
        }
        
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validImageTypes.includes(imageData.mimeType.toLowerCase())) {
          throw new Error(`Unsupported image format: ${imageData.mimeType}`);
        }
        
        console.log(`Image validated: ${imageData.mimeType}, size: ${Math.round(imageData.data.length * 0.75)} bytes`);
        
        const analysisPrompt = `Analyze this medical image briefly and provide simple healthcare guidance.
Image caption: ${imageCaption}
Provide a SHORT response (2-3 sentences max) with:
1. What you see
2. Simple recommendation
3. When to see a doctor (if needed)`;
        
        aiResponse = await getGeminiResponse(analysisPrompt, imageData, userLanguage);
        messageContent = `[Image: ${imageCaption}]`;
        console.log(`Image analyzed successfully`);
        
      } catch (error) {
        console.error('Image processing error:', error);
        
        if (error.message.includes('Unsupported image format')) {
          aiResponse = 'Please send your image in JPEG, PNG, or WebP format for analysis.';
        } else if (error.message.includes('Failed to download')) {
          aiResponse = 'I had trouble accessing your image. Please try sending it again.';
        } else {
          aiResponse = 'Sorry, I had trouble analyzing your image. Please try again or describe your symptoms in text.';
        }
        
        messageContent = '[Image processing failed]';
      }
    }

    // Send AI response
    if (aiResponse) {
      await sendWhatsAppMessage(phoneNumber, aiResponse);
    }

  } catch (error) {
    console.error('Error handling incoming message:', error);
    
    try {
      if (error.message && error.message.includes('Recipient phone number not in allowed list')) {
        console.log('⚠️ WhatsApp API restriction: Recipient not in allowed list');
        console.log('💡 In development mode, only verified phone numbers can receive messages');
        return;
      }
      
      await sendWhatsAppMessage(message.from, 'Sorry, I encountered an error. Please try again.');
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
      
      if (sendError.response?.data?.error?.message?.includes('Recipient phone number not in allowed list')) {
        console.log('⚠️ Cannot send error message - recipient not in WhatsApp allowed list');
      }
    }
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Healthcare WhatsApp Bot server running on port ${PORT}`);
  console.log(`🤖 Using Gemini 1.5 Flash for AI responses with rate limiting`);
  console.log(`🎤 Audio transcription with OpenAI Whisper`);
  console.log(`🌐 Multi-language support: Telugu, Tamil, Hindi, English, Odia`);
  console.log(`💬 Direct AI chat - no menu system`);
});

module.exports = app;
