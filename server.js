const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const { getGeminiResponse, detectLanguage, transcribeAudio, generateLanguageButtons, generateRegionalLanguageButtons, generateScriptTypeButtons, generateHindiScriptButtons } = require('./utils/aiUtils');

// Import new feature modules
const { generateMainMenuButtons, generateSecondaryMenuButtons, generateSymptomCheckerButtons, generateVaccinationButtons, generateHealthAlertsButtons, generatePreventiveCareButtons, generateFeedbackButtons, generateBackButton } = require('./features/main-menu/mainMenuButtons');
const { generateSymptomCategoryButtons, generateMoreSymptomCategories, generateEmergencyCheckButtons, processSymptomDescription } = require('./features/disease-symptoms/symptomChecker');
const { generateVaccinationTrackerButtons, generateAgeGroupButtons, generateMoreAgeGroups, getVaccinationScheduleForAge, getVaccineDetails } = require('./features/vaccination-tracker/vaccinationScheduler');
const { generateOutbreakAlertsButtons, generateOutbreakLevelButtons, generateSeasonalHealthButtons, getOutbreakInfo, getSeasonalHealthInfo, getCurrentSeasonAlerts } = require('./features/health-alerts/outbreakAlerts');
const { generateFeedbackButtons: generateDetailedFeedback, processFeedback, generateSatisfactionSurvey } = require('./features/accuracy-measurement/feedbackSystem');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const moment = require('moment');

// Import Disease Symptoms Education feature (if routes exist)
// const diseaseRoutes = require('./features/disease-symptoms/routes/diseaseRoutes');
// const WhatsAppDiseaseIntegration = require('./features/disease-symptoms/integration/whatsappIntegration');

// Import Vaccination Tracker feature (if routes exist)
// const vaccinationRoutes = require('./features/vaccination-tracker/routes/vaccinationRoutes');

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

const updateUserLanguage = async (phoneNumber, language) => {
  userLanguages.set(phoneNumber, language);
  userConversationState.set(phoneNumber, { hasSelectedLanguage: true });
  console.log(`Updated language for ${phoneNumber} to ${language}`);
};

const getUserLanguage = (phoneNumber) => {
  return userLanguages.get(phoneNumber) || 'en';
};

// Mock VaccinationWhatsAppIntegration for compatibility
const VaccinationWhatsAppIntegration = {
  isVaccinationMessage: (message) => {
    const vaccinationKeywords = ['vaccine', 'vaccination', 'immunization', 'shot', 'टीका', 'వ్యాక్సిన్', 'தடுப்பூசி'];
    return vaccinationKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }
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

// Mount Disease Symptoms Education routes (commented out until routes are created)
// app.use('/api/diseases', diseaseRoutes);

// Mount Vaccination Tracker routes (commented out until routes are created)
// app.use('/api/vaccination', vaccinationRoutes);

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// WhatsApp API configuration - Updated to latest version with better error handling
const WHATSAPP_API_VERSION = 'v20.0';
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Enhanced WhatsApp messaging with retry logic and better error handling
const sendWhatsAppMessage = async (to, message, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      console.log('✅ WhatsApp message sent successfully');
      return response.data;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.response?.data?.error || error.message);
      
      // Handle specific error codes
      if (error.response?.data?.error?.code === 10) {
        console.log('🔧 OAuth/Permission error detected - check access token and permissions');
        // Log for manual review instead of throwing immediately
        if (attempt === retries) {
          console.log('📋 Message logged for manual review:', { to, message, timestamp: new Date().toISOString() });
          return { error: 'Permission denied - message logged for review' };
        }
      }
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Send interactive message with buttons
const sendWhatsAppInteractiveMessage = async (to, interactiveMessage, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: to,
          ...interactiveMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      console.log('✅ WhatsApp interactive message sent successfully');
      return response.data;
    } catch (error) {
      console.error(`❌ Interactive message attempt ${attempt} failed:`, error.response?.data?.error || error.message);
      
      // Handle permission errors gracefully
      if (error.response?.data?.error?.code === 10) {
        console.log('🔧 Falling back to simple text message due to permission issues');
        // Extract text from interactive message and send as simple text
        const fallbackText = interactiveMessage.interactive?.body?.text || 
                           interactiveMessage.interactive?.header?.text || 
                           'Healthcare menu options available. Please type "menu" to see options.';
        return await sendWhatsAppMessage(to, fallbackText);
      }
      
      if (attempt === retries) {
        // Final fallback to simple message
        console.log('📋 Falling back to simple text message');
        return await sendWhatsAppMessage(to, 'Healthcare assistant ready. Type "help" for options.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
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

// Health endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      whatsapp: 'operational',
      gemini: 'operational',
      whisper: 'operational',
      database: 'operational'
    },
    features: ['AI Symptom Analysis', 'Emergency Detection', 'Multi-language Support', 'Audio Processing', 'Image Analysis']
  });
});

// Status endpoint for detailed system information
app.get('/status', (req, res) => {
  res.json({
    server: {
      status: 'running',
      port: PORT,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '2.0.0'
    },
    features: {
      symptom_analysis: true,
      emergency_detection: true,
      vaccination_tracker: true,
      health_alerts: true,
      preventive_care: true,
      feedback_system: true,
      multilingual: true,
      audio_processing: true,
      image_analysis: true
    },
    languages: ['English', 'Hindi', 'Telugu', 'Tamil', 'Odia'],
    integrations: {
      whatsapp_business_api: true,
      gemini_ai: true,
      openai_whisper: true,
      supabase: true
    },
    timestamp: new Date().toISOString()
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

// Handle interactive messages (button responses)
const handleInteractiveMessage = async (message, contact) => {
  try {
    const buttonId = message.interactive?.button_reply?.id || message.interactive?.list_reply?.id;
    const userPhone = message.from;
    
    console.log(`Interactive message from ${contact.profile?.name || 'Unknown'} (${userPhone}): ${buttonId}`);
    
    let responseMessage = '';
    let interactiveResponse = null;
    
    // Main menu navigation
    if (buttonId === 'main_menu' || buttonId === 'menu') {
      const userLanguage = getUserLanguage(userPhone);
      interactiveResponse = generateMainMenuButtons(userLanguage);
      
    } else if (buttonId === 'more_services') {
      interactiveResponse = generateSecondaryMenuButtons();
      
    // Symptom Checker Flow
    } else if (buttonId === 'symptom_checker') {
      const userLanguage = getUserLanguage(userPhone);
      interactiveResponse = generateSymptomCheckerButtons(userLanguage);
      
    } else if (buttonId === 'symptom_describe') {
      responseMessage = '📝 Please describe your symptoms in detail. For example: "I have fever, headache, and cough for 2 days"';
      
    } else if (buttonId === 'symptom_categories') {
      interactiveResponse = generateSymptomCategoryButtons();
      
    } else if (buttonId === 'emergency_check') {
      interactiveResponse = generateEmergencyCheckButtons();
      
    } else if (buttonId.startsWith('category_')) {
      const category = buttonId.replace('category_', '');
      responseMessage = `You selected ${category} symptoms. Please describe your specific symptoms in this category.`;
      
    // Vaccination Tracker Flow
    } else if (buttonId === 'vaccination_tracker') {
      interactiveResponse = generateVaccinationTrackerButtons();
      
    } else if (buttonId === 'vacc_age_schedule') {
      interactiveResponse = generateAgeGroupButtons();
      
    } else if (buttonId.startsWith('age_')) {
      const ageGroup = buttonId.replace('age_', '');
      responseMessage = getVaccinationScheduleForAge(ageGroup);
      interactiveResponse = generateBackButton('vaccination_tracker');
      
    } else if (buttonId.startsWith('vaccine_info_')) {
      const vaccineName = buttonId.replace('vaccine_info_', '').replace(/_/g, ' ');
      responseMessage = getVaccineDetails(vaccineName);
      
    // Health Alerts Flow
    } else if (buttonId === 'health_alerts') {
      interactiveResponse = generateHealthAlertsButtons();
      
    } else if (buttonId === 'current_outbreaks') {
      interactiveResponse = generateOutbreakLevelButtons();
      
    } else if (buttonId === 'seasonal_health') {
      interactiveResponse = generateSeasonalHealthButtons();
      
    } else if (buttonId.endsWith('_outbreaks')) {
      const level = buttonId.replace('_outbreaks', '');
      responseMessage = getOutbreakInfo(level);
      interactiveResponse = generateBackButton('health_alerts');
      
    } else if (buttonId.endsWith('_health')) {
      const season = buttonId.replace('_health', '');
      responseMessage = getSeasonalHealthInfo(season);
      interactiveResponse = generateBackButton('seasonal_health');
      
    // Preventive Care Flow
    } else if (buttonId === 'preventive_care') {
      interactiveResponse = generatePreventiveCareButtons();
      
    } else if (buttonId === 'nutrition_tips') {
      responseMessage = '🥗 **Nutrition Tips for Better Health:**\n\n• Eat 5 servings of fruits and vegetables daily\n• Choose whole grains over refined grains\n• Include lean proteins (fish, chicken, legumes)\n• Limit processed and sugary foods\n• Stay hydrated with 8-10 glasses of water\n• Eat regular, balanced meals\n• Include calcium-rich foods for bone health';
      interactiveResponse = generateBackButton('preventive_care');
      
    } else if (buttonId === 'exercise_guide') {
      responseMessage = '🏃 **Exercise Guidelines for Health:**\n\n• Aim for 150 minutes of moderate exercise weekly\n• Include strength training 2-3 times per week\n• Start slowly and gradually increase intensity\n• Choose activities you enjoy (walking, swimming, cycling)\n• Include flexibility and balance exercises\n• Take rest days for recovery\n• Consult doctor before starting new exercise program';
      interactiveResponse = generateBackButton('preventive_care');
      
    } else if (buttonId === 'hygiene_tips') {
      responseMessage = '🧼 **Essential Hygiene Practices:**\n\n• Wash hands frequently with soap for 20 seconds\n• Cover coughs and sneezes with elbow\n• Brush teeth twice daily and floss\n• Shower regularly and keep body clean\n• Maintain clean living environment\n• Wash fruits and vegetables before eating\n• Use clean water for drinking and cooking\n• Keep fingernails short and clean';
      interactiveResponse = generateBackButton('preventive_care');
      
    // Feedback Flow
    } else if (buttonId === 'feedback') {
      interactiveResponse = generateFeedbackButtons();
      
    } else if (buttonId.startsWith('feedback_')) {
      const rating = buttonId.includes('excellent') ? 5 : buttonId.includes('good') ? 4 : 3;
      const feedbackResult = await processFeedback('general', rating, userPhone, message.id);
      responseMessage = feedbackResult.message;
      interactiveResponse = generateBackButton('main_menu');
      
    // Language selection (existing code)
    } else if (buttonId === 'lang_en') {
      await updateUserLanguage(userPhone, 'en');
      responseMessage = 'Great! I\'ll assist you in English. How can I help you with your health concerns today?';
      const userLanguage = getUserLanguage(userPhone);
      interactiveResponse = generateMainMenuButtons(userLanguage);
      
    } else if (buttonId === 'regional_langs') {
      interactiveResponse = generateRegionalLanguageButtons();
      
    } else if (buttonId === 'lang_hi') {
      interactiveResponse = generateScriptTypeButtons('hi');
      
    } else if (buttonId.startsWith('lang_')) {
      const language = buttonId.replace('lang_', '');
      if (['te', 'ta', 'or'].includes(language)) {
        interactiveResponse = generateScriptTypeButtons(language);
      }
      
    } else if (buttonId.startsWith('script_')) {
      const parts = buttonId.split('_');
      const language = parts[1];
      const script = parts[2];
      
      const finalLanguage = script === 'native' ? language : `${language}_roman`;
      await updateUserLanguage(userPhone, finalLanguage);
      
      const languageNames = {
        te: script === 'native' ? 'తెలుగు' : 'Telugu (Roman)',
        ta: script === 'native' ? 'தமிழ்' : 'Tamil (Roman)',
        hi: script === 'native' ? 'हिंदी' : 'Hindi (Roman)',
        or: script === 'native' ? 'ଓଡ଼ିଆ' : 'Odia (Roman)'
      };
      
      responseMessage = `Perfect! I'll assist you in ${languageNames[language]}. How can I help you with your health concerns today?`;
      const userLanguage = getUserLanguage(userPhone);
      interactiveResponse = generateMainMenuButtons(userLanguage);
      
    } else if (buttonId === 'back_to_languages') {
      interactiveResponse = generateLanguageButtons();
      
    } else {
      responseMessage = 'I didn\'t understand that selection. Please try again or type your question.';
      const userLanguage = getUserLanguage(userPhone);
      interactiveResponse = generateMainMenuButtons(userLanguage);
    }
    
    // Send response
    if (interactiveResponse) {
      await sendWhatsAppInteractiveMessage(userPhone, interactiveResponse);
    } else if (responseMessage) {
      await sendWhatsAppMessage(userPhone, responseMessage);
    }
    
  } catch (error) {
    console.error('Error handling interactive message:', error);
    await sendWhatsAppMessage(
      message.from,
      'Sorry, I encountered an error processing your selection. Please try again.'
    );
  }
};

// Handle incoming WhatsApp messages
const handleIncomingMessage = async (message, contact) => {
  try {
    const phoneNumber = message.from;
    const contactName = contact?.profile?.name || 'Unknown';
    
    // Check for language change shortcut
    const messageText = message.text?.body?.toLowerCase() || '';
    if (messageText === 'ch-lang' || messageText.toLowerCase().includes('change language')) {
      const languageButtons = generateLanguageButtons();
      await sendWhatsAppInteractiveMessage(phoneNumber, languageButtons);
      return;
    }
    
    // Check for menu command
    if (messageText.toLowerCase().includes('menu') || messageText.toLowerCase().includes('help') || messageText === '/' || messageText === 'start') {
      const userLanguage = getUserLanguage(phoneNumber);
      const menuButtons = generateMainMenuButtons(userLanguage);
      await sendWhatsAppInteractiveMessage(phoneNumber, menuButtons);
      return;
    }
    
    // Check if user is describing symptoms
    if (messageText.toLowerCase().includes('symptom') || messageText.toLowerCase().includes('pain') || messageText.toLowerCase().includes('fever') || messageText.toLowerCase().includes('headache')) {
      const userLanguage = await getUserLanguage(phoneNumber);
      const symptomAnalysis = await processSymptomDescription(messageText, userLanguage);
      
      if (symptomAnalysis.type === 'emergency') {
        await sendWhatsAppMessage(phoneNumber, symptomAnalysis.message);
        await sendWhatsAppInteractiveMessage(phoneNumber, symptomAnalysis.buttons);
        return;
      } else if (symptomAnalysis.type === 'analysis') {
        await sendWhatsAppMessage(phoneNumber, symptomAnalysis.message);
        await sendWhatsAppInteractiveMessage(phoneNumber, symptomAnalysis.buttons);
        return;
      }
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
        
        // Transcribe audio using OpenAI Whisper with queue and retry logic
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
        
        // Provide specific error messages based on error type
        if (error.message.includes('OPENAI_API_KEY')) {
          aiResponse = 'Audio transcription is temporarily unavailable. Please send your message as text.';
        } else if (error.message.includes('temporarily unavailable')) {
          aiResponse = error.message; // Use the specific rate limit message
        } else if (error.message.includes('rate limit')) {
          aiResponse = 'Audio processing is temporarily busy due to high demand. Please try again in a moment or send your message as text.';
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
