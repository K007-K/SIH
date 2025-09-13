const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const cron = require('node-cron');
const moment = require('moment');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Enhanced language detection function with 15+ Indian languages
const detectLanguage = (text) => {
  // Unicode ranges for Indian scripts + Romanized patterns
  const scripts = {
    // Hindi (Devanagari) + Hinglish
    hi: [/[\u0900-\u097F]/, /\b(main|hain|hai|nahi|kyun|kaise|kya|bhai|didi|mama|papa|ghar|desh|bhasha|hindi)\b/i],
    
    // Telugu
    te: [/[\u0C00-\u0C7F]/, /\b(nuvvu|memu|vallu|aame|okka|rendu|muddu|amma|nanna|telugu|andhra)\b/i],
    
    // Tamil
    ta: [/[\u0B80-\u0BFF]/, /\b(naan|neenga|avanga|ungal|tamil|chennai|madurai|coimbatore)\b/i],
    
    // Bengali
    bn: [/[\u0980-\u09FF]/, /\b(ami|tumi|se|bangla|kolkata|dhaka|chanda|bhalo)\b/i],
    
    // Marathi
    mr: [/\b(mi|tu|to|mala|tula|mumbai|maharashtra|marathi|pune|nagpur)\b/i],
    
    // Kannada
    kn: [/[\u0C80-\u0CFF]/, /\b(naanu|neenu|avaru|namma|kannada|bangalore|mysore|hubli)\b/i],
    
    // Gujarati
    gu: [/[\u0A80-\u0AFF]/, /\b(hu|tu|te|mara|tara|gujarati|ahmedabad|surat|vadodara)\b/i],
    
    // Malayalam
    ml: [/[\u0D00-\u0D7F]/, /\b(naan|nee|avar|njangal|malayalam|kerala|kochi|thiruvananthapuram)\b/i],
    
    // Odia
    or: [/[\u0B00-\u0B7F]/, /\b(mu|tume|se|odia|orissa|bhubaneswar|cuttack)\b/i],
    
    // Punjabi (Gurmukhi)
    pa: [/[\u0A00-\u0A7F]/, /\b(mai|tu|oh|sada|tuhada|punjabi|chandigarh|amritsar|ludhiana)\b/i],
    
    // Assamese
    as: [/[\u0980-\u09FF]/, /\b(moi|tumi|te|amar|tomar|assamese|guwahati|dibrugarh)\b/i],
    
    // Urdu (Arabic script)
    ur: [/[\u0600-\u06FF]/, /\b(main|aap|woh|hamara|tumhara|urdu|lahore|karachi|islamabad)\b/i],
    
    // Santali (Ol Chiki)
    sat: [/[\u1C50-\u1C7F]/, /\b(am|bona|uni|santali|jorhat|tata|jamshedpur)\b/i]
  };
  
  // Check for script patterns first
  for (const [lang, patterns] of Object.entries(scripts)) {
    if (patterns[0] && patterns[0].test(text)) {
      return lang;
    }
  }
  
  // Check for Romanized patterns
  for (const [lang, patterns] of Object.entries(scripts)) {
    if (patterns[1] && patterns[1].test(text)) {
      return lang;
    }
  }
  
  // Default to English
  return 'en';
};

// Create optimized healthcare prompt
const createHealthcarePrompt = (userMessage, patient, language) => {
  const languageInstructions = {
    'hi': 'Respond in Hindi (हिंदी). Use simple, clear Hindi that rural populations can understand.',
    'te': 'Respond in Telugu (తెలుగు). Use simple, clear Telugu that rural populations can understand.',
    'ta': 'Respond in Tamil (தமிழ்). Use simple, clear Tamil that rural populations can understand.',
    'bn': 'Respond in Bengali (বাংলা). Use simple, clear Bengali that rural populations can understand.',
    'mr': 'Respond in Marathi (मराठी). Use simple, clear Marathi that rural populations can understand.',
    'kn': 'Respond in Kannada (ಕನ್ನಡ). Use simple, clear Kannada that rural populations can understand.',
    'gu': 'Respond in Gujarati (ગુજરાતી). Use simple, clear Gujarati that rural populations can understand.',
    'ml': 'Respond in Malayalam (മലയാളം). Use simple, clear Malayalam that rural populations can understand.',
    'or': 'Respond in Odia (ଓଡ଼ିଆ). Use simple, clear Odia that rural populations can understand.',
    'pa': 'Respond in Punjabi (ਪੰਜਾਬੀ). Use simple, clear Punjabi that rural populations can understand.',
    'as': 'Respond in Assamese (অসমীয়া). Use simple, clear Assamese that rural populations can understand.',
    'ur': 'Respond in Urdu (اردو). Use simple, clear Urdu that rural populations can understand.',
    'sat': 'Respond in Santali (ᱥᱟᱱᱛᱟᱲᱤ). Use simple, clear Santali that rural populations can understand.',
    'en': 'Respond in English. Use simple, clear English that rural populations can understand.'
  };

  return `You are a multilingual public health assistant designed to support rural and semi-urban populations.

${languageInstructions[language] || languageInstructions['en']}

Your role is to provide **clear, simple, and friendly answers** about:
- Preventive healthcare practices
- Common disease symptoms and when to seek help
- Vaccination schedules and reminders
- Health alerts and outbreak advisories
- Nearby healthcare facilities and official helplines

### Response Guidelines
- Always respond in **short, simple sentences**. Avoid medical jargon unless necessary; if used, explain it in plain language.
- Structure replies with **bullets or numbered steps** when giving instructions.
- Be **empathetic, polite, and respectful**, like a community health worker talking to a neighbor.
- **Stay strictly on-topic**: only answer questions related to healthcare, disease awareness, prevention, vaccination, or outbreaks.
- If the user asks about unrelated topics (politics, sports, entertainment, personal advice, etc.), reply with:
  "I can only help with health-related questions about diseases, prevention, vaccination, and safety. Please ask me about those."
- Always include a **safety disclaimer** for critical or emergency cases, e.g.:
  "If you have severe symptoms, please call your local health center or emergency number immediately."
- Keep answers **under 80–100 words** unless the user explicitly asks for more details.

### Tone
- Friendly, encouraging, non-judgmental.
- Example style: "Hello! I can help you understand symptoms and vaccines. What would you like to know today?"

### User Message
"${userMessage}"

### User Context
- Name: ${patient.name}
- Phone: ${patient.phone_number}
- Age: ${patient.age || 'Not specified'}
- Allergies: ${patient.allergies?.join(', ') || 'None specified'}
- Chronic conditions: ${patient.chronic_conditions?.join(', ') || 'None specified'}

Please provide a helpful, accurate response in the appropriate language.`;
};

// Create image analysis prompt
const createImageAnalysisPrompt = (language) => {
  const languageInstructions = {
    'hi': 'Respond in Hindi (हिंदी). Use simple, clear Hindi that rural populations can understand.',
    'te': 'Respond in Telugu (తెలుగు). Use simple, clear Telugu that rural populations can understand.',
    'ta': 'Respond in Tamil (தமிழ்). Use simple, clear Tamil that rural populations can understand.',
    'bn': 'Respond in Bengali (বাংলা). Use simple, clear Bengali that rural populations can understand.',
    'mr': 'Respond in Marathi (मराठी). Use simple, clear Marathi that rural populations can understand.',
    'kn': 'Respond in Kannada (ಕನ್ನಡ). Use simple, clear Kannada that rural populations can understand.',
    'gu': 'Respond in Gujarati (ગુજરાતી). Use simple, clear Gujarati that rural populations can understand.',
    'ml': 'Respond in Malayalam (മലയാളം). Use simple, clear Malayalam that rural populations can understand.',
    'or': 'Respond in Odia (ଓଡ଼ିଆ). Use simple, clear Odia that rural populations can understand.',
    'pa': 'Respond in Punjabi (ਪੰਜਾਬੀ). Use simple, clear Punjabi that rural populations can understand.',
    'as': 'Respond in Assamese (অসমীয়া). Use simple, clear Assamese that rural populations can understand.',
    'ur': 'Respond in Urdu (اردو). Use simple, clear Urdu that rural populations can understand.',
    'sat': 'Respond in Santali (ᱥᱟᱱᱛᱟᱲᱤ). Use simple, clear Santali that rural populations can understand.',
    'en': 'Respond in English. Use simple, clear English that rural populations can understand.'
  };

  return `You are a multilingual public health assistant analyzing a medical image.

${languageInstructions[language] || languageInstructions['en']}

### Image Analysis Guidelines
- Look for visible symptoms, skin conditions, wounds, or health concerns
- Provide simple, clear observations in the appropriate language
- Use bullet points for easy reading
- Be empathetic and reassuring
- If serious condition detected, advise immediate medical attention
- Keep response under 80-100 words
- Include safety disclaimer: "If symptoms are severe, please contact your local health center immediately"

Analyze this medical image and provide helpful insights.`;
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// WhatsApp API configuration (use latest supported version)
const WHATSAPP_API_URL = `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// OpenAI API configuration for speech-to-text
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

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

const getGeminiResponse = async (prompt, imageData = null) => {
  try {
    const url = imageData ? GEMINI_VISION_API_URL : GEMINI_API_URL;
    
    console.log(`Making Gemini API request: ${imageData ? 'Vision' : 'Text'} mode`);
    
    const requestBody = {
      contents: [{
        parts: imageData 
          ? [
              { text: prompt },
              {
                inline_data: {
                  mime_type: imageData.mimeType,
                  data: imageData.data
                }
              }
            ]
          : [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    if (imageData) {
      console.log(`Image data: MimeType=${imageData.mimeType}, Size=${imageData.data.length} characters`);
    }

    const response = await axios.post(
      `${url}?key=${process.env.GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for image processing
      }
    );

    if (!response.data.candidates || response.data.candidates.length === 0) {
      console.error('No candidates in Gemini response:', response.data);
      throw new Error('No response generated by Gemini API');
    }

    if (response.data.candidates[0].finishReason === 'SAFETY') {
      console.error('Gemini response blocked by safety filters:', response.data.candidates[0]);
      return 'I cannot analyze this image due to safety guidelines. Please ensure the image contains appropriate medical content.';
    }

    const responseText = response.data.candidates[0].content.parts[0].text;
    console.log(`Gemini response received: ${responseText.substring(0, 100)}...`);
    
    return responseText;
  } catch (error) {
    console.error('Error getting Gemini response:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response?.status === 400) {
      throw new Error('Invalid request to Gemini API. Please check image format and size.');
    } else if (error.response?.status === 403) {
      throw new Error('Gemini API access denied. Please check your API key.');
    } else if (error.response?.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please try again later.');
    } else {
      throw new Error('Failed to get response from Gemini API. Please try again.');
    }
  }
};

// Audio transcription function using OpenAI Whisper API
const transcribeAudio = async (base64Audio, mimeType) => {
  try {
    console.log(`Starting audio transcription with OpenAI Whisper, mimeType: ${mimeType}`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured');
      return 'Audio message received. Speech-to-text service is currently being configured. Please send your message as text for now.';
    }
    
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    
    // Determine file extension based on MIME type
    let fileExtension = 'ogg';
    switch (mimeType.toLowerCase()) {
      case 'audio/mpeg':
      case 'audio/mp3':
        fileExtension = 'mp3';
        break;
      case 'audio/mp4':
        fileExtension = 'm4a';
        break;
      case 'audio/wav':
        fileExtension = 'wav';
        break;
      case 'audio/amr':
        fileExtension = 'amr';
        break;
      default:
        fileExtension = 'ogg';
    }
    
    // Create FormData for OpenAI API
    const FormData = require('form-data');
    const form = new FormData();
    
    form.append('file', audioBuffer, {
      filename: `audio.${fileExtension}`,
      contentType: mimeType
    });
    form.append('model', 'whisper-1');
    form.append('language', 'en'); // Primary language, Whisper can auto-detect
    form.append('response_format', 'text');
    
    console.log(`Making OpenAI Whisper API request with file extension: ${fileExtension}`);
    
    const response = await axios.post(OPENAI_API_URL, form, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      },
      timeout: 60000 // 60 second timeout for transcription
    });

    const transcription = response.data.trim();
    
    if (!transcription || transcription.length === 0) {
      console.log('No transcription results returned from OpenAI');
      return '';
    }

    console.log(`OpenAI transcription successful: "${transcription}"`);
    return transcription;

  } catch (error) {
    console.error('Error transcribing audio with OpenAI:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response?.status === 400) {
      throw new Error('Invalid audio format for transcription. Please try a different audio format.');
    } else if (error.response?.status === 401) {
      throw new Error('OpenAI API access denied. Please check your API key.');
    } else if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else {
      throw new Error('Failed to transcribe audio. Please try again.');
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
    throw error;
  }
};

const saveMessage = async (patientId, chatSessionId, content, messageType, isFromPatient, aiResponse = null) => {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        patient_id: patientId,
        chat_session_id: chatSessionId,
        message_type: messageType,
        content: content,
        is_from_patient: isFromPatient,
        ai_response: aiResponse
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Healthcare WhatsApp Bot is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
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

            // Delivery/status updates (ack, delivered, read, failed)
            const statuses = change.value.statuses;
            statuses?.forEach((status) => {
              console.log('WhatsApp status update:', {
                id: status.id,
                status: status.status,
                timestamp: status.timestamp,
                recipient_id: status.recipient_id,
                conversation: status.conversation,
                pricing: status.pricing
              });
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

// Handle incoming WhatsApp messages
const handleIncomingMessage = async (message, contact) => {
  try {
    const phoneNumber = message.from;
    const contactName = contact?.profile?.name || 'Unknown';
    
    // Get or create patient
    const patient = await getOrCreatePatient(phoneNumber, contactName);
    
    // Get or create chat session
    let chatSession = await getActiveChatSession(patient.id);
    if (!chatSession) {
      chatSession = await createChatSession(patient.id);
    }

    let aiResponse = '';
    let messageContent = '';

    if (message.type === 'text') {
      messageContent = message.text.body;
      
      // Detect language and create optimized healthcare prompt
      const detectedLanguage = detectLanguage(messageContent);
      const medicalPrompt = createHealthcarePrompt(messageContent, patient, detectedLanguage);

      aiResponse = await getGeminiResponse(medicalPrompt);
      
    } else if (message.type === 'audio') {
      // Handle audio messages
      console.log('Raw audio message received:', JSON.stringify(message, null, 2));
      
      try {
        const audioId = message.audio?.id;
        const audioMimeType = message.audio?.mime_type || 'audio/ogg';
        
        if (!audioId) {
          throw new Error('No audio ID found in message');
        }
        
        console.log(`Processing audio: ID=${audioId}, MimeType=${audioMimeType}`);
        
        // Validate supported audio formats
        const supportedAudioFormats = ['audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/amr', 'audio/wav'];
        if (!supportedAudioFormats.includes(audioMimeType.toLowerCase())) {
          aiResponse = 'Sorry, I can only process OGG, MP3, MP4, AMR, and WAV audio formats. Please send your voice message in one of these formats.';
          messageContent = `[Unsupported audio format: ${audioMimeType}]`;
        } else {
          // First get the audio URL from WhatsApp API
          const audioInfoUrl = `https://graph.facebook.com/v23.0/${audioId}`;
          console.log(`Getting audio info from: ${audioInfoUrl}`);
          
          const audioInfoResponse = await axios.get(audioInfoUrl, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
            timeout: 15000
          });
          
          const audioUrl = audioInfoResponse.data.url;
          console.log(`Downloading audio from: ${audioUrl}`);
          
          // Download audio file
          const audioResponse = await axios.get(audioUrl, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
            responseType: 'arraybuffer',
            timeout: 30000
          });
          
          console.log(`Audio downloaded successfully. Size: ${audioResponse.data.byteLength} bytes`);
          
          const audioBuffer = Buffer.from(audioResponse.data);
          const base64Audio = audioBuffer.toString('base64');
          
          console.log(`Audio converted to base64. Length: ${base64Audio.length} characters`);
          
          // Transcribe audio using Google Speech-to-Text API
          const transcription = await transcribeAudio(base64Audio, audioMimeType);
          console.log(`Audio transcribed: "${transcription}"`);
          
          if (!transcription || transcription.trim().length === 0 || transcription.includes('Speech-to-text service is currently being configured')) {
            // Handle the case where transcription service is not yet available or failed
            aiResponse = transcription || 'I received your voice message but could not transcribe it. Please send your health question as a text message, and I\'ll be happy to help you.';
            messageContent = '[Audio received - transcription failed or pending]';
          } else {
            // Process transcribed text as a regular text message
            const detectedLanguage = detectLanguage(transcription);
            const medicalPrompt = createHealthcarePrompt(transcription, patient, detectedLanguage);
            
            aiResponse = await getGeminiResponse(medicalPrompt);
            messageContent = `[Audio transcribed: "${transcription}"]`;
            console.log('Audio processing completed successfully');
          }
        }
        
      } catch (audioError) {
        console.error('Detailed audio processing error:', {
          error: audioError.message,
          stack: audioError.stack,
          response: audioError.response?.data,
          status: audioError.response?.status,
          url: audioError.config?.url
        });
        
        // Provide specific error messages based on the error type
        if (audioError.response?.status === 400) {
          aiResponse = 'Unable to access the audio message. This might be due to WhatsApp API permissions or the audio has expired. Please try sending the voice message again.';
        } else if (audioError.response?.status === 403) {
          aiResponse = 'Access denied when trying to download the audio. Please check if the audio is still available and try again.';
        } else if (audioError.response?.status === 404) {
          aiResponse = 'The audio message could not be found. It may have expired. Please try sending the voice message again.';
        } else if (audioError.message.includes('timeout')) {
          aiResponse = 'The audio download timed out. Please try sending a shorter voice message or try again later.';
        } else if (audioError.message.includes('transcription')) {
          aiResponse = 'There was an issue transcribing your voice message. Please try speaking more clearly or send a text message instead.';
        } else {
          aiResponse = 'I encountered an error while processing your voice message. Please try sending it again or use text instead.';
        }
        
        messageContent = `[Audio processing failed: ${audioError.message}]`;
      }
      
    } else if (message.type === 'image') {
      // Handle image messages
      console.log('Raw image message received:', JSON.stringify(message, null, 2));
      
      try {
        const imageId = message.image?.id;
        const imageCaption = message.image?.caption || '';
        const imageMimeType = message.image?.mime_type || 'image/jpeg';
        
        if (!imageId) {
          throw new Error('No image ID found in message');
        }
        
        console.log(`Processing image: ID=${imageId}, MimeType=${imageMimeType}, Caption="${imageCaption}"`);
        
        // Validate supported image formats
        const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!supportedFormats.includes(imageMimeType.toLowerCase())) {
          aiResponse = 'Sorry, I can only analyze JPEG, PNG, and WebP images. Please send your image in one of these formats.';
          messageContent = `[Unsupported image format: ${imageMimeType}]`;
        } else {
          // First get the image URL from WhatsApp API
          const imageInfoUrl = `https://graph.facebook.com/v23.0/${imageId}`;
          console.log(`Getting image info from: ${imageInfoUrl}`);
          
          const imageInfoResponse = await axios.get(imageInfoUrl, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
            timeout: 15000
          });
          
          const imageUrl = imageInfoResponse.data.url;
          console.log(`Downloading image from: ${imageUrl}`);
          
          // Download image with better error handling
          const imageResponse = await axios.get(imageUrl, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
            responseType: 'arraybuffer',
            timeout: 30000 // 30 second timeout
          });
          
          console.log(`Image downloaded successfully. Size: ${imageResponse.data.byteLength} bytes`);
          
          const imageBuffer = Buffer.from(imageResponse.data);
          const base64Image = imageBuffer.toString('base64');
          
          console.log(`Image converted to base64. Length: ${base64Image.length} characters`);
          
          // Detect language from caption or default to English
          const detectedLanguage = detectLanguage(imageCaption || 'analyze this medical image');
          const visionPrompt = createImageAnalysisPrompt(detectedLanguage);
          
          // Add caption context to prompt if available
          const enhancedPrompt = imageCaption 
            ? `${visionPrompt}\n\nUser's caption/question: "${imageCaption}"`
            : visionPrompt;
          
          console.log(`Sending to Gemini Vision API with language: ${detectedLanguage}`);
          
          aiResponse = await getGeminiResponse(enhancedPrompt, {
            mimeType: imageMimeType,
            data: base64Image
          });
          
          messageContent = imageCaption ? `[Image received with caption: ${imageCaption}]` : '[Image received]';
          console.log('Image analysis completed successfully');
        }
        
      } catch (imageError) {
        console.error('Detailed image processing error:', {
          error: imageError.message,
          stack: imageError.stack,
          response: imageError.response?.data,
          status: imageError.response?.status,
          url: imageError.config?.url
        });
        
        // Provide specific error messages based on the error type
        if (imageError.response?.status === 400) {
          aiResponse = 'Unable to access the image. This might be due to WhatsApp API permissions or the image has expired. Please try sending the image again.';
        } else if (imageError.response?.status === 403) {
          aiResponse = 'Access denied when trying to download the image. Please check if the image is still available and try again.';
        } else if (imageError.response?.status === 404) {
          aiResponse = 'The image could not be found. It may have expired. Please try sending the image again.';
        } else if (imageError.message.includes('timeout')) {
          aiResponse = 'The image download timed out. Please try sending a smaller image or try again later.';
        } else if (imageError.message.includes('Gemini API')) {
          aiResponse = 'There was an issue with the image analysis service. Please try again in a few moments.';
        } else {
          aiResponse = 'I encountered an error while processing your image. Please ensure the image is clear and try sending it again.';
        }
        
        messageContent = `[Image processing failed: ${imageError.message}]`;
      }
    }

    // Save message to database
    await saveMessage(patient.id, chatSession.id, messageContent, message.type, true, aiResponse);

    // Send AI response
    await sendWhatsAppMessage(phoneNumber, aiResponse);

    // Update session
    await updateChatSession(chatSession.id, messageContent, aiResponse);

  } catch (error) {
    console.error('Error handling message:', {
      messageType: message.type,
      messageFrom: message.from,
      error: error.message,
      stack: error.stack,
      fullError: error
    });
    
    // Send more specific error message to user
    let errorMessage = 'I apologize, but I encountered an error processing your message.';
    
    if (message.type === 'image') {
      errorMessage = 'I encountered an error while processing your image. Please ensure the image is in JPEG, PNG, or WebP format and try again.';
    }
    
    try {
      await sendWhatsAppMessage(message.from, errorMessage + ' Please try again or contact support if the issue persists.');
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }
  }
};

// Helper functions for chat sessions
const getActiveChatSession = async (patientId) => {
  const { data } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('patient_id', patientId)
    .is('session_end', null)
    .order('session_start', { ascending: false })
    .limit(1)
    .single();
  
  return data;
};

const createChatSession = async (patientId) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      patient_id: patientId,
      session_start: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

const updateChatSession = async (sessionId, userMessage, _aiResponse) => {
  // Read current values, then update safely (supabase-js v2 has no raw)
  const { data: session, error: fetchError } = await supabase
    .from('chat_sessions')
    .select('message_count, topics_discussed')
    .eq('id', sessionId)
    .single();

  if (fetchError) throw fetchError;

  const nextCount = (session?.message_count || 0) + 1;
  const existingTopics = Array.isArray(session?.topics_discussed)
    ? [...session.topics_discussed]
    : [];
  const topic = extractTopics(userMessage);
  existingTopics.push(topic);

  const { error: updateError } = await supabase
    .from('chat_sessions')
    .update({ message_count: nextCount, topics_discussed: existingTopics })
    .eq('id', sessionId);

  if (updateError) throw updateError;
};

const extractTopics = (message) => {
  // Simple topic extraction - can be enhanced with NLP
  const medicalKeywords = ['pain', 'fever', 'headache', 'cough', 'vaccine', 'appointment', 'medicine', 'allergy', 'blood pressure', 'diabetes'];
  const foundTopics = medicalKeywords.filter(keyword => 
    message.toLowerCase().includes(keyword)
  );
  return foundTopics.length > 0 ? foundTopics[0] : 'general';
};

// Appointment reminder cron job (runs daily at 9 AM)
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Running appointment reminder job...');
    
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(phone_number, name)
      `)
      .eq('appointment_date', tomorrow)
      .eq('reminder_sent', false)
      .eq('status', 'scheduled');

    if (error) throw error;

    for (const appointment of appointments) {
      const reminderMessage = `Hello ${appointment.patients.name}! 

This is a reminder that you have an appointment scheduled for tomorrow:
📅 Date: ${moment(appointment.appointment_date).format('MMMM Do, YYYY')}
🕐 Time: ${appointment.appointment_time}
👨‍⚕️ Doctor: ${appointment.doctor_name || 'TBD'}
🏥 Location: ${appointment.hospital_name || 'TBD'}
📋 Purpose: ${appointment.purpose || 'General checkup'}

Please arrive 15 minutes early. If you need to reschedule, please contact us.

Best regards,
Healthcare Bot Team`;

      await sendWhatsAppMessage(appointment.patients.phone_number, reminderMessage);
      
      // Mark reminder as sent
      await supabase
        .from('appointments')
        .update({ reminder_sent: true })
        .eq('id', appointment.id);
    }

    console.log(`Sent ${appointments.length} appointment reminders`);
  } catch (error) {
    console.error('Error in appointment reminder job:', error);
  }
});

// Vaccination reminder cron job (runs weekly on Mondays at 10 AM)
cron.schedule('0 10 * * 1', async () => {
  try {
    console.log('Running vaccination reminder job...');
    
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    for (const patient of patients) {
      // Check for upcoming vaccinations based on age
      const patientAgeMonths = patient.age ? patient.age * 12 : 0;
      
      const { data: upcomingVaccines, error: vaccineError } = await supabase
        .from('vaccination_schedule')
        .select('*')
        .gte('recommended_age_months', patientAgeMonths)
        .lte('recommended_age_months', patientAgeMonths + 3)
        .eq('is_mandatory', true);

      if (vaccineError) throw vaccineError;

      if (upcomingVaccines.length > 0) {
        const vaccineNames = upcomingVaccines.map(v => v.vaccine_name).join(', ');
        
        const reminderMessage = `Hello ${patient.name}!

📅 Vaccination Reminder:
You have upcoming vaccinations due:
${vaccineNames}

Please schedule an appointment with your healthcare provider to receive these important vaccinations.

Stay healthy! 💉
Healthcare Bot Team`;

        await sendWhatsAppMessage(patient.phone_number, reminderMessage);
      }
    }

    console.log('Vaccination reminders sent');
  } catch (error) {
    console.error('Error in vaccination reminder job:', error);
  }
});

// API Routes for patient management
app.get('/api/patients/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone_number', phone)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin/test endpoint: send a template message
app.post('/admin/send-template', async (req, res) => {
  try {
    const { to, template, language = 'en_US' } = req.body;
    if (!to || !template) {
      return res.status(400).json({ error: 'Missing required fields: to, template' });
    }

    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: { name: template, language: { code: language } }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error sending template:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Healthcare WhatsApp Bot server running on port ${PORT}`);
  console.log(`📱 Webhook URL: https://your-domain.com/webhook`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
});

module.exports = app;
