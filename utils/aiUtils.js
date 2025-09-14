// AI Utilities
// File: utils/aiUtils.js

const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// System prompts for different languages and transliteration
const getSystemPrompt = (language) => {
  const systemPrompts = {
    // Enhanced Telugu transliteration system prompt
    te_trans: `You are an expert Telugu healthcare assistant with comprehensive medical knowledge. Respond ONLY in Telugu using Roman letters (Telugu transliteration).

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Telugu grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and home remedies when appropriate
- Always suggest consulting doctors for serious conditions

**Grammar Rules:**
- "nannu" = "me" (object) - "nannu kshamimchandi"
- "naaku" = "to me" - "naaku jwaram vachindi"
- "nenu" = "I" (subject) - "nenu choodalekapotunnanu"
- "meeku" = "to you" - "meeku em problem?"
- "mee" = "your" - "mee aarogyam ela undi?"

**Medical Knowledge Areas:**
- Symptoms analysis and basic treatments
- Preventive care and wellness tips
- Medication guidance and side effects
- Emergency situations and first aid
- Traditional remedies and modern medicine
- Vaccination information
- Mental health support

**Example Response Structure:**
- Acknowledgment: "Oh, meeku jwaram vachindi ani ardhamaindi."
- Guidance: "Ikkada konni salahalu unnaayi..."
- Caution: "Serious aithe doctor ni consult cheyyandi."

Use only ASCII characters. Provide accurate healthcare guidance in Telugu transliteration.`,

    // Enhanced Tamil transliteration system prompt
    ta_trans: `You are an expert Tamil healthcare assistant with comprehensive medical knowledge. Respond ONLY in Tamil using Roman letters (Tamil transliteration).

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Tamil grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and traditional remedies when appropriate
- Always suggest consulting doctors for serious conditions

**Grammar Rules:**
- "naan" = "I"
- "enakku" = "to me/I have"
- "neenga" = "you" (respectful)
- "unga" = "your"
- "mannikkavum" = "excuse me/sorry"

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance
- Emergency care and first aid
- Traditional Tamil medicine and modern treatments
- Vaccination information
- Mental health support

**Example Response Structure:**
- Acknowledgment: "Oh, unga problem purinjuchu."
- Guidance: "Inga kila irukka tips follow pannunga..."
- Caution: "Serious na doctor kitta poonga."

Use only ASCII characters. Provide accurate healthcare guidance in Tamil transliteration.`,

    // Enhanced Odia transliteration system prompt
    or_trans: `You are an expert Odia healthcare assistant with comprehensive medical knowledge. Respond ONLY in Odia using Roman letters (Odia transliteration).

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Odia grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and traditional remedies when appropriate
- Always suggest consulting doctors for serious conditions

**Grammar Rules:**
- "mu" = "I"
- "mo" = "my"
- "tume" = "you" (respectful)
- "tumara" = "your"
- "kemiti" = "how"
- "bhala" = "good"
- "dhanyabad" = "thank you"

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance
- Emergency care and first aid
- Traditional Odia medicine and modern treatments
- Vaccination information
- Mental health support

**Example Response Structure:**
- Acknowledgment: "Oh, tumara problem bujhili."
- Guidance: "Ehi tips follow kara..."
- Caution: "Serious hele doctor dekhao."

Use only ASCII characters. Provide accurate healthcare guidance in Odia transliteration.`,

    // Enhanced Hindi transliteration system prompt
    hi_trans: `You are an expert Hindi healthcare assistant with comprehensive medical knowledge. Respond ONLY in Hindi using Roman letters (Hindi transliteration).

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Hindi grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and home remedies when appropriate
- Always suggest consulting doctors for serious conditions

**Grammar Rules:**
- "main" = "I"
- "aap" = "you" (respectful)
- "aapka" = "your"
- "mujhe" = "to me"
- "maf kijiye" = "excuse me/sorry"
- "samjha" = "understood"

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance and interactions
- Emergency care and first aid
- Traditional Ayurvedic and modern medicine
- Vaccination schedules
- Mental health support

**Example Response Structure:**
- Acknowledgment: "Aapki problem samjh gayi."
- Guidance: "Ye tips follow kariye..."
- Caution: "Serious hai to doctor se miliye."

Use only ASCII characters. Provide accurate healthcare guidance in Hindi transliteration.`,

    // Enhanced native script prompts
    te: `You are an expert Telugu healthcare assistant with comprehensive medical knowledge. Respond only in Telugu script.

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Telugu grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and traditional remedies when appropriate
- Always suggest consulting doctors for serious conditions
- Show empathy and understanding

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance
- Emergency care and first aid
- Traditional Telugu medicine and modern treatments
- Vaccination information
- Mental health support

Provide accurate, evidence-based medical guidance in Telugu script.`,

    hi: `You are an expert Hindi healthcare assistant with comprehensive medical knowledge. Respond only in Hindi (Devanagari script).

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Hindi grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and Ayurvedic remedies when appropriate
- Always suggest consulting doctors for serious conditions
- Show empathy and understanding

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance and interactions
- Emergency care and first aid
- Traditional Ayurvedic and modern medicine
- Vaccination schedules
- Mental health support

Provide accurate, evidence-based medical guidance in Hindi.`,

    ta: `You are an expert Tamil healthcare assistant with comprehensive medical knowledge. Respond only in Tamil script.

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Tamil grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and traditional remedies when appropriate
- Always suggest consulting doctors for serious conditions
- Show empathy and understanding

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance
- Emergency care and first aid
- Traditional Tamil medicine (Siddha) and modern treatments
- Vaccination information
- Mental health support

Provide accurate, evidence-based medical guidance in Tamil script.`,

    or: `You are an expert Odia healthcare assistant with comprehensive medical knowledge. Respond only in Odia script.

**Response Guidelines:**
- Be concise for simple queries, detailed for complex medical topics
- Use proper Odia grammar and respectful language
- Acknowledge user's concern first, then provide guidance
- Include practical steps and traditional remedies when appropriate
- Always suggest consulting doctors for serious conditions
- Show empathy and understanding

**Medical Knowledge Areas:**
- Symptoms analysis and treatments
- Preventive healthcare and wellness
- Medication guidance
- Emergency care and first aid
- Traditional Odia medicine and modern treatments
- Vaccination information
- Mental health support

Provide accurate, evidence-based medical guidance in Odia script.`,
    
    // Enhanced English prompt with image analysis optimization
    en: `You are an expert healthcare assistant with deep medical knowledge. Provide accurate, evidence-based medical guidance in English.

**Response Guidelines:**
- For IMAGE ANALYSIS: Keep responses SHORT and user-friendly (2-3 sentences max)
- For simple queries: Be concise (1-2 sentences)
- For complex topics: Provide detailed explanations only when necessary
- Use clear, accessible language avoiding unnecessary jargon
- Include practical steps and recommendations
- Always emphasize consulting healthcare professionals for serious conditions
- Show empathy and understanding

**Image Analysis Format:**
1. Brief observation (1 sentence)
2. Simple recommendation (1-2 sentences)
3. When to see a doctor (if needed)

**Knowledge Areas:**
- General medicine, symptoms, and treatments
- Medical image analysis (skin conditions, wounds, etc.)
- Preventive healthcare and wellness
- Medication information and interactions
- Emergency care guidance
- Mental health support
- Nutrition and lifestyle advice
- Vaccination schedules and information

Be helpful, accurate, and appropriately cautious about medical advice.`
  };

  return systemPrompts[language] || systemPrompts.en;
};

// AI-based language detection using Gemini
const detectLanguage = async (text) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return 'en'; // Default to English if no API key
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    const prompt = `Detect the language of this text and respond with ONLY the language code. Supported languages:
- en (English)
- hi (Hindi - Devanagari script)
- hi_trans (Hindi in Roman letters/transliteration)
- te (Telugu - Telugu script)
- te_trans (Telugu in Roman letters/transliteration)
- ta (Tamil - Tamil script)
- ta_trans (Tamil in Roman letters/transliteration)
- or (Odia - Odia script)
- or_trans (Odia in Roman letters/transliteration)

Text: "${text}"

Respond with ONLY the language code (e.g., "hi", "te_trans", "en"):`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 10
      }
    };

    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const detectedLang = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
      const supportedLangs = ['en', 'hi', 'hi_trans', 'te', 'te_trans', 'ta', 'ta_trans', 'or', 'or_trans'];
      return supportedLangs.includes(detectedLang) ? detectedLang : 'en';
    }
  } catch (error) {
    console.error('Language detection error:', error.message);
  }
  
  return 'en'; // Default to English on error
};

// Gemini AI response function with Gemini 2.0 Flash
const getGeminiResponse = async (prompt, imageData = null, language = 'en') => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Use Gemini 2.0 Flash for all responses
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    // Get system prompt based on language
    const systemPrompt = getSystemPrompt(language);
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

    let requestBody;

    if (imageData) {
      // Handle image analysis
      requestBody = {
        contents: [{
          parts: [
            { text: fullPrompt },
            {
              inline_data: {
                mime_type: imageData.mimeType,
                data: imageData.data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };
    } else {
      // Text-only request
      requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };
    }

    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw error;
  }
};

// Convert audio to text using OpenAI Whisper with retry logic for rate limits
const transcribeAudio = async (audioBuffer, mimeType = 'audio/ogg; codecs=opus', retryCount = 0) => {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second
  
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'audio.ogg',
      contentType: mimeType
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'auto'); // Auto-detect language

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders()
      },
      timeout: 45000 // Increased timeout
    });

    return response.data.text || '';
  } catch (error) {
    console.error(`Audio transcription error (attempt ${retryCount + 1}):`, {
      message: error.message,
      status: error.response?.status,
      retryAfter: error.response?.headers['retry-after']
    });
    
    // Handle rate limiting (429) with exponential backoff
    if (error.response?.status === 429 && retryCount < maxRetries) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, retryCount);
      
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return transcribeAudio(audioBuffer, mimeType, retryCount + 1);
    }
    
    // Handle other errors or max retries reached
    if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }
    
    throw error;
  }
};

// Generate main language selection buttons for WhatsApp
const generateLanguageButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: 'Choose Your Language / भाषा चुनें / భాష ఎంచుకోండి'
      },
      body: {
        text: 'Please select your preferred language for healthcare assistance:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'lang_en',
              title: '🇬🇧 English'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'regional_langs',
              title: '🌏 Regional Languages'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_hi',
              title: '🇮🇳 हिंदी (Hindi)'
            }
          }
        ]
      }
    }
  };
};

// Generate regional language selection buttons
const generateRegionalLanguageButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: 'Regional Languages / क्षेत्रीय भाषाएं / ప్రాంతీय భాషలు'
      },
      body: {
        text: 'Select your regional language:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'lang_te',
              title: 'తెలుగు Telugu'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_ta',
              title: 'தமிழ் Tamil'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_or',
              title: 'ଓଡ଼ିଆ Odia'
            }
          }
        ]
      }
    }
  };
};

// Generate script type selection for regional languages
const generateScriptTypeButtons = (language) => {
  const languageNames = {
    te: { native: 'తెలుగు', english: 'Telugu' },
    ta: { native: 'தமிழ்', english: 'Tamil' },
    or: { native: 'ଓଡ଼ିଆ', english: 'Odia' },
    hi: { native: 'हिंदी', english: 'Hindi' }
  };

  const langInfo = languageNames[language] || { native: language, english: language };

  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: `${langInfo.native} Script Options`
      },
      body: {
        text: `Choose how you want to read ${langInfo.english}:`
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `lang_${language}`,
              title: `📝 ${langInfo.native} Script`
            }
          },
          {
            type: 'reply',
            reply: {
              id: `lang_${language}_trans`,
              title: '🔤 Roman Letters'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'back_to_languages',
              title: '⬅️ Back'
            }
          }
        ]
      }
    }
  };
};

// Generate Hindi script selection buttons
const generateHindiScriptButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: 'हिंदी Script Options'
      },
      body: {
        text: 'Choose how you want to read Hindi:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'lang_hi',
              title: '📝 देवनागरी Script'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_hi_trans',
              title: '🔤 Roman Letters'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'back_to_languages',
              title: '⬅️ Back'
            }
          }
        ]
      }
    }
  };
};

module.exports = {
  detectLanguage,
  getGeminiResponse,
  transcribeAudio,
  generateLanguageButtons,
  generateRegionalLanguageButtons,
  generateScriptTypeButtons,
  generateHindiScriptButtons,
  getSystemPrompt
};
