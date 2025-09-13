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

    const response = await axios.post(
      `${url}?key=${process.env.GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting Gemini response:', error.response?.data || error.message);
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
      
    } else if (message.type === 'image') {
      // Handle image messages
      const imageId = message.image.id;
      const imageUrl = `https://graph.facebook.com/v23.0/${imageId}`;
      
      // Download image
      const imageResponse = await axios.get(imageUrl, {
        headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
        responseType: 'arraybuffer'
      });
      
      const imageBuffer = Buffer.from(imageResponse.data);
      const base64Image = imageBuffer.toString('base64');
      
      // Detect language for image analysis
      const detectedLanguage = detectLanguage(messageContent || '');
      const visionPrompt = createImageAnalysisPrompt(detectedLanguage);
      
      aiResponse = await getGeminiResponse(visionPrompt, {
        mimeType: 'image/jpeg',
        data: base64Image
      });
      
      messageContent = '[Image received]';
    }

    // Save message to database
    await saveMessage(patient.id, chatSession.id, messageContent, message.type, true, aiResponse);

    // Send AI response
    await sendWhatsAppMessage(phoneNumber, aiResponse);

    // Update session
    await updateChatSession(chatSession.id, messageContent, aiResponse);

  } catch (error) {
    console.error('Error handling message:', error);
    
    // Send error message to user
    try {
      await sendWhatsAppMessage(message.from, 'I apologize, but I encountered an error processing your message. Please try again or contact support if the issue persists.');
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
