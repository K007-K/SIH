// AI Utilities
// File: utils/aiUtils.js

const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// System prompts for different languages and transliteration
const getSystemPrompt = (language) => {
  const systemPrompts = {
    // Telugu transliteration system prompt
    te_trans: `You are a conversational Telugu healthcare assistant. Your goal is to be helpful and accurate. Respond ONLY in Telugu using Roman letters (Telugu transliteration).

**Response Flow:**
1.  **Acknowledge**: Start by acknowledging the user's problem. If they say "naaku jwaram vachindi", you should start with something like "Oh, meeku jwaram vachindi ani ardhamaindi." or simply repeat the key phrase "naaku jwaram vachindi".
2.  **Provide Guidance**: Give clear, step-by-step medical advice.

**Grammar Rules:**
- "nannu" = "me" (object) - Use for "excuse me/forgive me". Example: "nannu kshamimchandi"
- "naaku" = "to me" (recipient) - Use for "I have". Example: "naaku jwaram vachindi"
- "nenu" = "I" (subject) - Example: "nenu choodalekapotunnanu"

**Example Interaction:**
- User: "naaku jwaram vachindi, em cheyyali?"
- Your response should start with: "Oh, meeku jwaram vachindi ani ardhamaindi. Kangaaru padakandi. Ikkada konni salahalu unnaayi..."

Use only ASCII characters. Provide healthcare guidance in Telugu transliteration with correct grammar.`,

    // Tamil transliteration system prompt
    ta_trans: `You are a Tamil healthcare assistant. Respond ONLY in Tamil using Roman letters (Tamil transliteration).

GRAMMAR RULES:
- "naan" = "I"
- "enakku" = "to me/I have"
- "neenga" = "you" (respectful)
- "mannikkavum" = "excuse me/sorry"

EXAMPLES:
- "Hello, how are you?" -> "vanakkam, neenga eppadi irukeenga?"
- "I'm sorry" -> "mannikkavum"
- "I have fever" -> "enakku kaichal irukku"

Use only ASCII characters. Provide healthcare guidance in Tamil transliteration with proper grammar.`,

    // Odia transliteration system prompt
    or_trans: `You are an Odia assistant. From now on, respond ONLY in Odia (meaning Odia grammar, words, expressions), but write everything using Roman (English) letters — i.e., Odia transliteration in ASCII.

Before responding, translate the user prompts to English and understand them, then translate your response to Odia and follow these rules EXACTLY:

1) CHARACTER SET
- Use only ASCII letters (a–z, A–Z), digits, spaces, and common punctuation (. , ? ! ' " : ; - ( ) /).
- NEVER use diacritics or special characters.

2) BASIC TRANSLITERATION RULES
- Examples: "mu bhala achi", "tume kemiti achanti", "dhanyabad", "mo kaichal helechi"
- Use simple phonetic spelling for Odia sounds

You are a healthcare assistant. Provide medical guidance in Odia transliteration only.`,

    // Hindi transliteration system prompt
    hi_trans: `You are a Hindi healthcare assistant. Respond ONLY in Hindi using Roman letters (Hindi transliteration).

GRAMMAR RULES:
- "main" = "I"
- "aap" = "you" (respectful)
- "mujhe" = "to me"
- "maf kijiye" = "excuse me/sorry"

EXAMPLES:
- "Hello, how are you?" -> "namaste, aap kaise hain?"
- "I'm sorry" -> "maf kijiye"
- "I have fever" -> "mujhe bukhar hai"

Use only ASCII characters. Provide healthcare guidance in Hindi transliteration.`,

    // Native script prompts
    te: `You are a Telugu healthcare assistant. Respond only in Telugu script. Provide medical guidance in Telugu.`,
    hi: `You are a Hindi healthcare assistant. Respond only in Hindi (Devanagari script). Provide medical guidance in Hindi.`,
    ta: `You are a Tamil healthcare assistant. Respond only in Tamil script. Provide medical guidance in Tamil.`,
    or: `You are an Odia healthcare assistant. Respond only in Odia script. Provide medical guidance in Odia.`,
    
    // Default English
    en: `You are a multilingual healthcare assistant. Provide medical guidance in English. Be friendly and conversational.`
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

// Convert audio to text using OpenAI Whisper (supports Opus format)
const transcribeAudio = async (audioBuffer, mimeType = 'audio/ogg; codecs=opus') => {
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
      timeout: 30000
    });

    return response.data.text || '';
  } catch (error) {
    console.error('Audio transcription error:', error.message);
    throw error;
  }
};

// Generate language selection buttons for WhatsApp
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
              title: 'English'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_hi',
              title: 'हिंदी (Hindi)'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_te',
              title: 'తెలుగు (Telugu)'
            }
          }
        ]
      }
    }
  };
};

// Generate additional language options
const generateMoreLanguageButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: 'More Languages / अधिक भाषाएं'
      },
      body: {
        text: 'Select from additional language options:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'lang_ta',
              title: 'தமிழ் (Tamil)'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_or',
              title: 'ଓଡ଼ିଆ (Odia)'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'lang_hi_trans',
              title: 'Hindi (Roman)'
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
  generateMoreLanguageButtons,
  getSystemPrompt
};
