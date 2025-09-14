const { detectLanguage, getGeminiResponse } = require('./utils/aiUtils');

// Test multilingual Gemini responses with transliteration
async function testMultilingualGemini() {
  console.log('🌐 Testing Multilingual Gemini 2.0 Flash with Transliteration...\n');

  const testCases = [
    // Telugu transliteration
    {
      message: "naaku fever vachindi, ela treat cheyyali?",
      expectedLang: "te_trans",
      description: "Telugu Transliteration - Fever Query"
    },
    
    // Hindi transliteration  
    {
      message: "mujhe bukhar hai, kya karna chahiye?",
      expectedLang: "hi_trans", 
      description: "Hindi Transliteration - Fever Query"
    },
    
    // Tamil transliteration
    {
      message: "enakku kaichal vanthuchu, enna seyyanum?",
      expectedLang: "ta_trans",
      description: "Tamil Transliteration - Fever Query"
    },
    
    // Odia transliteration
    {
      message: "mo kaichal helechi, ki kariba?",
      expectedLang: "or_trans",
      description: "Odia Transliteration - Fever Query"
    },
    
    // English
    {
      message: "I have fever, what should I do?",
      expectedLang: "en",
      description: "English - Fever Query"
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.description}`);
      console.log(`Input: "${testCase.message}"`);
      
      // Test language detection
      const detectedLang = detectLanguage(testCase.message);
      console.log(`Detected Language: ${detectedLang} (Expected: ${testCase.expectedLang})`);
      
      // Test AI response
      console.log('Getting AI response...');
      const aiResponse = await getGeminiResponse(testCase.message, null, detectedLang);
      
      console.log(`AI Response: ${aiResponse.substring(0, 150)}...`);
      
      // Validate response based on language
      let responseValid = false;
      
      if (detectedLang === 'te_trans') {
        // Check if response is in Telugu transliteration (ASCII only)
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(nuvvu|meeru|naaku|enti|ela|unnavu|unnaru|cheppandi)\b/i.test(aiResponse);
      } else if (detectedLang === 'hi_trans') {
        // Check if response is in Hindi transliteration (ASCII only)
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(aap|main|hai|hain|kaise|kya|theek|accha)\b/i.test(aiResponse);
      } else if (detectedLang === 'ta_trans') {
        // Check if response is in Tamil transliteration (ASCII only)
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(naan|neenga|eppadi|irukeenga|nalla|romba|enna)\b/i.test(aiResponse);
      } else if (detectedLang === 'or_trans') {
        // Check if response is in Odia transliteration (ASCII only)
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse) && 
                       /\b(mu|tume|kemiti|achanti|bhala|bahut|jara)\b/i.test(aiResponse);
      } else if (detectedLang === 'en') {
        // Check if response is in English
        responseValid = /^[a-zA-Z0-9\s.,!?'"():;-]+$/.test(aiResponse);
      }
      
      if (responseValid) {
        console.log('✅ PASS - Response format matches expected language');
        passedTests++;
      } else {
        console.log('❌ FAIL - Response format does not match expected language');
      }
      
    } catch (error) {
      console.log(`❌ FAIL - Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All multilingual tests passed! Gemini 2.0 Flash with transliteration is working perfectly!');
  } else {
    console.log('⚠️ Some tests failed. Check the configuration and system prompts.');
  }
  
  return passedTests === totalTests;
}

// Run the test
if (require.main === module) {
  testMultilingualGemini().catch(console.error);
}

module.exports = { testMultilingualGemini };
