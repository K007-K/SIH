const { detectLanguage, getGeminiResponse } = require('./utils/aiUtils');

// Test the corrected Telugu transliteration
async function testTeluguFix() {
  console.log('🔧 Testing Corrected Telugu Transliteration for \"I have fever\"...\n');

  const testCase = {
    description: "Verify 'naaku jwaram vachindi' is used for fever queries",
    input: "naaku jwaram vachindi, em cheyyali?",
    expectedLang: "te_trans",
    shouldContain: "naaku jwaram vachindi",
    shouldNotContain: "naaku kaichal vachindi"
  };

  let passed = false;

  try {
    console.log(`🧪 Testing: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    
    const detectedLang = detectLanguage(testCase.input);
    console.log(`Detected Language: ${detectedLang} (Expected: ${testCase.expectedLang})`);
    
    console.log('Getting AI response...');
    const aiResponse = await getGeminiResponse(testCase.input, null, detectedLang);
    
    console.log(`AI Response: ${aiResponse.substring(0, 300)}...`);
    
    const containsExpected = aiResponse.toLowerCase().includes(testCase.shouldContain.toLowerCase());
    const avoidsIncorrect = !aiResponse.toLowerCase().includes(testCase.shouldNotContain.toLowerCase());
    const languageCorrect = detectedLang === testCase.expectedLang;
    
    if (containsExpected && avoidsIncorrect && languageCorrect) {
      console.log('✅ PASS - Bot used the correct Telugu transliteration.');
      passed = true;
    } else {
      console.log('❌ FAIL - Bot used incorrect terminology.');
      if (!containsExpected) console.log(`  - Missing expected phrase: "${testCase.shouldContain}"`);
      if (!avoidsIncorrect) console.log(`  - Contains incorrect phrase: "${testCase.shouldNotContain}"`);
    }
    
  } catch (error) {
    console.log(`❌ FAIL - Error: ${error.message}`);
  }

  console.log(`\n📊 Test Result: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  if(passed) {
    console.log('🎉 The Telugu transliteration has been successfully corrected!');
  }
}

// Run the test
if (require.main === module) {
  testTeluguFix().catch(console.error);
}
