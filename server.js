const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const { 
  detectLanguage, 
  getGeminiResponse, 
  transcribeAudio, 
  generateLanguageButtons, 
  generateRegionalLanguageButtons,
  generateScriptTypeButtons,
  generateHindiScriptButtons,
  getSystemPrompt 
} = require('./utils/aiUtils');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const moment = require('moment');

// Import Disease Symptoms Education feature
const diseaseRoutes = require('./features/disease-symptoms/routes/diseaseRoutes');
const WhatsAppDiseaseIntegration = require('./features/disease-symptoms/integration/whatsappIntegration');

// Import Vaccination Tracker feature
const vaccinationRoutes = require('./features/vaccination-tracker/routes/vaccinationRoutes');
const VaccinationWhatsAppIntegration = require('./features/vaccination-tracker/integration/whatsappIntegration');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Store user sessions, language preferences, and conversation state
const userSessions = new Map();
const userLanguages = new Map();
const userConversationState = new Map();

// Language selection and conversation state management
const isNewUser = (phoneNumber) => {
  return !userConversationState.has(phoneNumber);
};

const setUserLanguage = (phoneNumber, language) => {
  userLanguages.set(phoneNumber, language);
  userConversationState.set(phoneNumber, { hasSelectedLanguage: true });
};

const getUserLanguage = (phoneNumber) => {
  return userLanguages.get(phoneNumber) || 'en';
};

// Download WhatsApp media files
const downloadWhatsAppMedia = async (mediaId) => {
  try {
    const token = process.env.WHATSAPP_ACCESS_TOKEN; // Fixed: Use correct env variable
    
    console.log(`Downloading media: ${mediaId}`);
    
    // Get media URL
    const mediaResponse = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'WhatsApp-Bot/1.0'
      },
      timeout: 10000
    });
    
    console.log('Media URL response:', mediaResponse.data);
    const mediaUrl = mediaResponse.data.url;
    
    if (!mediaUrl) {
      throw new Error('No media URL received from WhatsApp API');
    }
    
    // Download media content
    const contentResponse = await axios.get(mediaUrl, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'WhatsApp-Bot/1.0'
      },
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 16 * 1024 * 1024 // 16MB limit
    });
    
    console.log(`Media downloaded: ${contentResponse.data.byteLength} bytes, type: ${contentResponse.headers['content-type']}`);
    
    return {
      data: Buffer.from(contentResponse.data).toString('base64'),
      mimeType: contentResponse.headers['content-type'] || 'application/octet-stream'
    };
  } catch (error) {
    console.error('Media download error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw new Error(`Failed to download media: ${error.message}`);
  }
};

// Middleware
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Disease Symptoms Education routes
app.use('/api/diseases', diseaseRoutes);

// Mount Vaccination Tracker routes
app.use('/api/vaccination', vaccinationRoutes);

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// WhatsApp API configuration
const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Utility functions
const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
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
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
};

// Send interactive message with buttons
const sendWhatsAppInteractiveMessage = async (to, interactiveMessage) => {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
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
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp interactive message:', error.response?.data || error.message);
    throw error;
  }
};

// Patient management functions
const getOrCreatePatient = async (phoneNumber, name = null) => {
  try {
    // Check if patient exists
    const { data: existingPatient, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (existingPatient) {
      return existingPatient;
    }

    // Create new patient
    const { data: newPatient, error: createError } = await supabase
      .from('patients')
      .insert({
        phone_number: phoneNumber,
        name: name || 'Unknown',
        is_active: true
      })
      .select()
      .single();

    if (createError) throw createError;
    return newPatient;
  } catch (error) {
    console.error('Error managing patient:', error);
    // Return a default patient object if database is not available
    return {
      id: phoneNumber,
      phone_number: phoneNumber,
      name: name || 'Unknown',
      is_active: true
    };
  }
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Healthcare WhatsApp Bot is running with Gemini 2.0 Flash!',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: ['Language Selection', 'Gemini 2.0 Flash', 'Opus Audio Support', 'Image Analysis']
  });
});

// WhatsApp webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('Webhook verification failed');
    res.status(403).json({ error: 'Verification failed' });
  }
});

// WhatsApp webhook for incoming messages
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(async (entry) => {
        const changes = entry.changes;
        changes?.forEach(async (change) => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            messages?.forEach(async (message) => {
              await handleIncomingMessage(message, change.value.contacts?.[0]);
            });

            // Handle button replies
            const interactiveMessages = change.value.messages?.filter(msg => msg.type === 'interactive');
            interactiveMessages?.forEach(async (message) => {
              await handleInteractiveMessage(message, change.value.contacts?.[0]);
            });
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

// Handle interactive messages (button replies)
const handleInteractiveMessage = async (message, contact) => {
  try {
    const phoneNumber = message.from;
    const interactiveType = message.interactive?.type;
    
    if (interactiveType === 'button_reply') {
      const buttonId = message.interactive.button_reply.id;
      
      // Handle regional languages button
      if (buttonId === 'regional_langs') {
        const regionalButtons = generateRegionalLanguageButtons();
        await sendWhatsAppInteractiveMessage(phoneNumber, regionalButtons);
        return;
      }
      
      // Handle back to languages button
      if (buttonId === 'back_to_languages') {
        const languageButtons = generateLanguageButtons();
        await sendWhatsAppInteractiveMessage(phoneNumber, languageButtons);
        return;
      }
      
      // Handle script selection for regional languages
      if (buttonId === 'lang_te' || buttonId === 'lang_ta' || buttonId === 'lang_or') {
        const language = buttonId.replace('lang_', '');
        const scriptButtons = generateScriptTypeButtons(language);
        await sendWhatsAppInteractiveMessage(phoneNumber, scriptButtons);
        return;
      }
      
      // Handle Hindi script selection
      if (buttonId === 'lang_hi') {
        const hindiScriptButtons = generateHindiScriptButtons();
        await sendWhatsAppInteractiveMessage(phoneNumber, hindiScriptButtons);
        return;
      }
      
      // Handle final language selection
      if (buttonId.startsWith('lang_')) {
        const selectedLanguage = buttonId.replace('lang_', '');
        setUserLanguage(phoneNumber, selectedLanguage);
        
        let confirmationMessage = '';
        switch (selectedLanguage) {
          case 'en':
            confirmationMessage = '🇬🇧 English selected! How can I help you with your health today?';
            break;
          case 'hi':
            confirmationMessage = '🇮🇳 हिंदी चुनी गई! आज मैं आपकी स्वास्थ्य संबंधी कैसे मदद कर सकता हूं?';
            break;
          case 'hi_trans':
            confirmationMessage = '🇮🇳 Hindi (Roman) chunli gayi! Aaj main aapki health mein kaise madad kar sakta hun?';
            break;
          case 'te':
            confirmationMessage = '🇮🇳 తెలుగు ఎంచుకున్నారు! ఈరోజు మీ ఆరోగ్యం గురించి నేను ఎలా సహాయం చేయగలను?';
            break;
          case 'te_trans':
            confirmationMessage = '🇮🇳 Telugu (Roman) select chesaru! Ee roju mee health lo nenu ela help cheyagalanu?';
            break;
          case 'ta':
            confirmationMessage = '🇮🇳 தமிழ் தேர்ந்தெடுக்கப்பட்டது! இன்று உங்கள் ஆரோக்கியத்தில் நான் எப்படி உதவ முடியும்?';
            break;
          case 'ta_trans':
            confirmationMessage = '🇮🇳 Tamil (Roman) select panneenga! Innaiku unga health la naan eppadi help panna mudiyum?';
            break;
          case 'or':
            confirmationMessage = '🇮🇳 ଓଡ଼ିଆ ବାଛିଲେ! ଆଜି ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟରେ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?';
            break;
          case 'or_trans':
            confirmationMessage = '🇮🇳 Odia (Roman) select kala! Aaji apananka health re mu kemiti sahayya kariparibo?';
            break;
          default:
            confirmationMessage = 'Language selected! How can I help you today?';
        }
        
        await sendWhatsAppMessage(phoneNumber, confirmationMessage);
        return;
      }
    }
  } catch (error) {
    console.error('Error handling interactive message:', error);
  }
};

// Handle incoming WhatsApp messages
const handleIncomingMessage = async (message, contact) => {
  try {
    const phoneNumber = message.from;
    const contactName = contact?.profile?.name || 'Unknown';
    
    // Check for language change shortcut
    const messageText = message.text?.body?.toLowerCase() || '';
    if (messageText === 'ch-lang' || messageText === 'change language') {
      const languageButtons = generateLanguageButtons();
      await sendWhatsAppInteractiveMessage(phoneNumber, languageButtons);
      return;
    }
    
    // Check if user is new and needs language selection
    if (isNewUser(phoneNumber) && message.type === 'text') {
      const languageButtons = generateLanguageButtons();
      await sendWhatsAppInteractiveMessage(phoneNumber, languageButtons);
      return;
    }
    
    // Get user's preferred language
    const userLanguage = getUserLanguage(phoneNumber);
    
    // Check if message is disease/symptom related and route to Disease Education feature
    const isDiseaseQuery = messageText.includes('symptom') || messageText.includes('disease') || 
                          messageText.includes('fever') || messageText.includes('pain') || 
                          messageText.includes('लक्षण') || messageText.includes('रोग') || 
                          messageText.includes('లక్షణం') || messageText.includes('వ్యాధి') ||
                          messageText.includes('அறிகுறி') || messageText.includes('நோய்');
    
    // Check if message is vaccination-related and route to Vaccination Tracker feature
    const isVaccinationQuery = VaccinationWhatsAppIntegration.isVaccinationMessage(messageText);
    
    if (isDiseaseQuery) {
      console.log('Disease-related query detected, routing to Disease Education feature');
      
      // Detect language using AI
      const detectedLanguage = await detectLanguage(messageText);
      
      // Handle with Disease Education feature
      const diseaseResponse = await WhatsAppDiseaseIntegration.handleDiseaseQuery(message, contact, detectedLanguage);
      
      if (diseaseResponse.type === 'emergency') {
        await sendWhatsAppMessage(phoneNumber, diseaseResponse.template.message);
        return;
      }
      
      if (diseaseResponse.template && diseaseResponse.template.message) {
        await sendWhatsAppMessage(phoneNumber, diseaseResponse.template.message);
        return;
      }
    } else if (isVaccinationQuery) {
      console.log('Vaccination-related query detected, routing to Vaccination Tracker feature');
      
      // Detect language using AI
      const detectedLanguage = await detectLanguage(messageText);
      
      // Handle with Vaccination Tracker feature
      const vaccinationResponse = await VaccinationWhatsAppIntegration.handleVaccinationMessage(message, contact, detectedLanguage);
      
      if (vaccinationResponse.response) {
        await sendWhatsAppMessage(phoneNumber, vaccinationResponse.response);
        return;
      }
    }
    
    // Get or create patient
    const patient = await getOrCreatePatient(phoneNumber, contactName);
    
    let aiResponse = '';
    let messageContent = '';

    if (message.type === 'text') {
      messageContent = message.text.body;
      
      // Detect language using AI and get response using Gemini 2.0 Flash
      const detectedLanguage = await detectLanguage(messageContent);
      const finalLanguage = detectedLanguage || userLanguage;
      
      aiResponse = await getGeminiResponse(messageContent, null, finalLanguage);
      
    } else if (message.type === 'audio') {
      // Handle audio messages with Opus format support
      console.log('Audio message received:', JSON.stringify(message, null, 2));
      
      try {
        const audioId = message.audio?.id;
        const audioMimeType = message.audio?.mime_type || 'audio/ogg; codecs=opus';
        
        if (!audioId) {
          throw new Error('No audio ID found in message');
        }
        
        console.log(`Processing audio: ID=${audioId}, MimeType=${audioMimeType}`);
        
        // Download audio from WhatsApp
        const audioData = await downloadWhatsAppMedia(audioId);
        
        // Validate audio data
        if (!audioData.data) {
          throw new Error('No audio data received');
        }
        
        console.log(`Audio downloaded: ${Math.round(audioData.data.length * 0.75)} bytes, type: ${audioData.mimeType}`);
        
        // Convert base64 to buffer for Whisper API
        const audioBuffer = Buffer.from(audioData.data, 'base64');
        
        // Transcribe audio using OpenAI Whisper (supports Opus)
        const transcription = await transcribeAudio(audioBuffer, audioData.mimeType);
        console.log(`Audio transcribed: "${transcription}"`);
        
        if (!transcription || transcription.trim().length === 0) {
          aiResponse = 'I received your voice message but could not understand the speech. Please try speaking more clearly or send your question as text.';
          messageContent = '[Audio received - transcription failed]';
        } else {
          // Process transcribed text
          messageContent = transcription;
          
          // Detect language and get AI response
          const detectedLanguage = await detectLanguage(transcription);
          const finalLanguage = detectedLanguage || userLanguage;
          
          const audioPrompt = `Voice message transcription: "${transcription}"
Please provide healthcare guidance based on this voice message.`;
          
          aiResponse = await getGeminiResponse(audioPrompt, null, finalLanguage);
          console.log(`Audio processed successfully, transcription: "${transcription}"`);
        }
        
      } catch (error) {
        console.error('Audio processing error:', {
          message: error.message,
          stack: error.stack,
          audioId: message.audio?.id,
          mimeType: message.audio?.mime_type
        });
        
        // Provide specific error messages
        if (error.message.includes('OPENAI_API_KEY')) {
          aiResponse = 'Voice message processing is temporarily unavailable. Please send your question as text.';
        } else if (error.message.includes('Failed to download')) {
          aiResponse = 'I had trouble accessing your voice message. Please try sending it again.';
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
        
        // Download image from WhatsApp
        const imageData = await downloadWhatsAppMedia(imageId);
        
        // Validate image data
        if (!imageData.data || !imageData.mimeType) {
          throw new Error('Invalid image data received');
        }
        
        // Check if it's a valid image MIME type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validImageTypes.includes(imageData.mimeType.toLowerCase())) {
          throw new Error(`Unsupported image format: ${imageData.mimeType}`);
        }
        
        console.log(`Image validated: ${imageData.mimeType}, size: ${Math.round(imageData.data.length * 0.75)} bytes`);
        
        // Analyze image using Gemini Vision
        const detectedLanguage = await detectLanguage(imageCaption);
        const finalLanguage = detectedLanguage || userLanguage;
        
        const analysisPrompt = `Analyze this medical image briefly and provide simple healthcare guidance.
Image caption: ${imageCaption}
Provide a SHORT response (2-3 sentences max) with:
1. What you see
2. Simple recommendation
3. When to see a doctor (if needed)`;
        
        aiResponse = await getGeminiResponse(
          analysisPrompt,
          imageData,
          finalLanguage
        );
        
        messageContent = `[Image: ${imageCaption}]`;
        console.log(`Image analyzed successfully, response length: ${aiResponse.length}`);
        
      } catch (error) {
        console.error('Image processing error:', {
          message: error.message,
          stack: error.stack,
          imageId: message.image?.id
        });
        
        // Provide specific error messages
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
    
    // Send error message to user
    try {
      await sendWhatsAppMessage(message.from, 'Sorry, I encountered an error. Please try again.');
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Healthcare WhatsApp Bot server running on port ${PORT}`);
  console.log(`🤖 Using Gemini 2.0 Flash for AI responses`);
  console.log(`🎤 Audio transcription with OpenAI Whisper (Opus support)`);
  console.log(`🌐 Multi-language support: Telugu, Tamil, Hindi, English, Odia`);
  console.log(`📱 Language selection with buttons and ch-lang shortcut`);
});

module.exports = app;
