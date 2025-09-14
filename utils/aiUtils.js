// AI Utilities
// File: utils/aiUtils.js

const axios = require('axios');
require('dotenv').config();

// Enhanced language detection function with transliteration support
const detectLanguage = (text) => {
  const lowerText = text.toLowerCase();
  
  // Check for script-based languages first
  const scriptPatterns = {
    hi: /[\u0900-\u097F]/, // Devanagari (Hindi)
    te: /[\u0C00-\u0C7F]/, // Telugu
    ta: /[\u0B80-\u0BFF]/, // Tamil
    or: /[\u0B00-\u0B7F]/  // Odia
  };

  // Check for native scripts first
  for (const [lang, pattern] of Object.entries(scriptPatterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }

  // Check for transliterated patterns
  const transliterationPatterns = {
    // Telugu transliteration (removed ambiguous English words like 'fever', 'treat')
    te_trans: /\b(nuvvu|meeru|naaku|enti|ela|unnavu|unnaru|cheppandi|telugu|vachindi|cheyyali|bagundi|manchidi)\b/i,
    
    // Hindi transliteration
    hi_trans: /\b(main|hain|hai|nahi|kyun|kaise|kya|aap|tum|mujhe|tumhe|hindi|accha|theek|namaste|bukhar|karna|chahiye)\b/i,
    
    // Tamil transliteration
    ta_trans: /\b(naan|neenga|eppadi|irukeenga|tamil|nalla|romba|enna|eppo|kaichal|vanthuchu|seyyanum)\b/i,
    
    // Odia transliteration (corrected 'kaichal' to 'jara')
    or_trans: /\b(mu|tume|kemiti|achanti|odia|bhala|bahut|jara|helechi|kariba)\b/i
  };

  // Check transliteration patterns
  for (const [langCode, pattern] of Object.entries(transliterationPatterns)) {
    if (pattern.test(lowerText)) {
      const lang = langCode.replace('_trans', '');
      return lang + '_trans'; // Mark as transliterated
    }
  }
  
  
  return 'en'; // Default to English
};

// System prompts for different languages and transliteration
const getSystemPrompt = (language) => {
  const systemPrompts = {
    // Telugu transliteration system prompt
    te_trans: `You are a conversational Telugu healthcare assistant. Your goal is to be helpful and accurate. Respond ONLY in Telugu using Roman letters (Telugu transliteration).

**Response Flow:**
1.  **Acknowledge**: Start by acknowledging the user's problem. If they say "naaku jwaram vachindi", you should start with something like "Oh, meeku jwaram vachindi ani ardhamaindi." or simply repeat the key phrase "naaku jwaram vachindi".
2.  **Provide Guidance**: Give clear, step-by-step medical advice.
3.  **Disclaimer**: Always include a disclaimer to consult a doctor.

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
    en: `You are a multilingual healthcare assistant. Provide medical guidance in English. Always include safety disclaimers and recommend consulting healthcare professionals for serious symptoms.`
  };

  return systemPrompts[language] || systemPrompts.en;
};

// Gemini AI response function with multilingual support
const getGeminiResponse = async (prompt, imageData = null, userLanguage = 'en') => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    // Get system prompt based on detected language
    const systemPrompt = getSystemPrompt(userLanguage);
    const fullPrompt = `${systemPrompt}\n\nUser message: ${prompt}`;
    
    let requestBody;
    
    if (imageData) {
      // Handle image + text request
      requestBody = {
        contents: [{
          parts: [
            { text: fullPrompt },
            {
              inline_data: {
                mime_type: imageData.mimeType || 'image/jpeg',
                data: imageData.data
              }
            }
          ]
        }],
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
    } else {
      // Handle text-only request
      requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
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
    }

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Gemini response structure:', response.data);
      throw new Error('Invalid response from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      throw new Error('Invalid request to Gemini API');
    } else if (error.response?.status === 403) {
      throw new Error('Gemini API access forbidden - check API key');
    } else if (error.response?.status === 429) {
      throw new Error('Gemini API rate limit exceeded');
    } else {
      throw new Error('Failed to get response from Gemini AI');
    }
  }
};

module.exports = {
  detectLanguage,
  getGeminiResponse,
  getSystemPrompt
};
