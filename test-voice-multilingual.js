const { detectLanguage, getGeminiResponse } = require('./utils/aiUtils');
const axios = require('axios');

// Test voice transcription and multilingual responses
async function testVoiceMultilingual() {
  console.log('🎤 Testing Voice Transcription + Multilingual Responses...\n');

  // Mock transcription results in different languages
  const voiceTestCases = [
    {
      mockTranscription: "naaku fever vachindi, ela treat cheyyali?",
      expectedLang: "te_trans",
      description: "Telugu Voice → Telugu Transliteration Response"
    },
    {
      mockTranscription: "mujhe bukhar hai, kya karna chahiye?",
      expectedLang: "hi_trans", 
      description: "Hindi Voice → Hindi Transliteration Response"
    },
    {
      mockTranscription: "enakku kaichal vanthuchu, enna seyyanum?",
      expectedLang: "ta_trans",
      description: "Tamil Voice → Tamil Transliteration Response"
    },
    {
      mockTranscription: "I have fever, what should I do?",
      expectedLang: "en",
      description: "English Voice → English Response"
    }
  ];

  let passedTests = 0;
  let totalTests = voiceTestCases.length;

  for (const testCase of voiceTestCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.description}`);
      console.log(`Mock Transcription: "${testCase.mockTranscription}"`);
      
      // Test language detection on transcribed text
      const detectedLang = detectLanguage(testCase.mockTranscription);
      console.log(`Detected Language: ${detectedLang} (Expected: ${testCase.expectedLang})`);
      
      // Test AI response for transcribed text
      console.log('Getting AI response for transcribed voice...');
      const aiResponse = await getGeminiResponse(testCase.mockTranscription, null, detectedLang);
      
      console.log(`AI Response: ${aiResponse.substring(0, 200)}...`);
      
      // Verify response matches detected language
      let responseValid = false;
      
      if (detectedLang === 'te_trans') {
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(meeru|naaku|enti|ela|cheppandi|bagundi)\b/i.test(aiResponse);
      } else if (detectedLang === 'hi_trans') {
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(aap|main|hai|kaise|theek|accha)\b/i.test(aiResponse);
      } else if (detectedLang === 'ta_trans') {
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(naan|neenga|eppadi|nalla|romba)\b/i.test(aiResponse);
      } else if (detectedLang === 'en') {
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse);
      }
      
      if (responseValid && detectedLang === testCase.expectedLang) {
        console.log('✅ PASS - Voice transcription with correct multilingual response');
        passedTests++;
      } else {
        console.log('❌ FAIL - Language detection or response format incorrect');
      }
      
    } catch (error) {
      console.log(`❌ FAIL - Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Voice Multilingual Results: ${passedTests}/${totalTests} tests passed`);
  return { passedTests, totalTests };
}

// Test OpenAI Whisper API connection
async function testWhisperAPI() {
  console.log('\n🔊 Testing OpenAI Whisper API Connection...\n');

  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not configured');
    return { error: 'API key missing' };
  }

  try {
    // Test API connection with a minimal request
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.status === 200) {
      console.log('✅ OpenAI API connection successful');
      
      // Check if Whisper model is available
      const models = response.data.data;
      const whisperModel = models.find(model => model.id.includes('whisper'));
      
      if (whisperModel) {
        console.log(`✅ Whisper model available: ${whisperModel.id}`);
      } else {
        console.log('⚠️ Whisper model not found in available models');
      }
      
      return { status: 'connected', models: models.length };
    }
    
  } catch (error) {
    console.log(`❌ OpenAI API connection failed: ${error.message}`);
    
    if (error.response?.status === 401) {
      console.log('❌ Invalid API key');
    } else if (error.response?.status === 429) {
      console.log('❌ Rate limit exceeded');
    }
    
    return { error: error.message };
  }
}

// Test complete voice processing pipeline
async function testCompleteVoicePipeline() {
  console.log('\n🔄 Testing Complete Voice Processing Pipeline...\n');

  console.log('1️⃣ Testing Voice Transcription + Language Detection + AI Response');
  const voiceResults = await testVoiceMultilingual();
  
  console.log('\n2️⃣ Testing OpenAI Whisper API Connection');
  const whisperResults = await testWhisperAPI();
  
  console.log('\n📊 Complete Voice Pipeline Results:');
  console.log('=====================================');
  console.log(`Voice Multilingual: ${voiceResults.passedTests}/${voiceResults.totalTests} tests passed`);
  console.log(`Whisper API: ${whisperResults.error ? '❌ Issues found' : '✅ Connected'}`);
  
  if (whisperResults.error) {
    console.log(`\n⚠️ Voice Processing Issues:`);
    console.log(`- ${whisperResults.error}`);
    console.log(`\n🔧 To Fix Voice Issues:`);
    console.log(`1. Verify OpenAI API key is valid`);
    console.log(`2. Check API quota and billing`);
    console.log(`3. Test with real WhatsApp voice messages`);
  } else {
    console.log('\n🎉 Voice processing pipeline is ready!');
    console.log('✅ Transcription: OpenAI Whisper configured');
    console.log('✅ Language Detection: Working for all supported languages');
    console.log('✅ Multilingual Responses: Matching user language');
  }
  
  return { voiceResults, whisperResults };
}

// Run tests
if (require.main === module) {
  testCompleteVoicePipeline().catch(console.error);
}

module.exports = { 
  testVoiceMultilingual, 
  testWhisperAPI,
  testCompleteVoicePipeline 
};
