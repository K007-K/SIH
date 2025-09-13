const TranslationService = require('./translation-service');
require('dotenv').config();

async function testHuggingFaceTranslation() {
  console.log('🤗 Testing Hugging Face Translation Service...\n');
  
  const translationService = new TranslationService();
  
  // Test cases for different languages
  const testCases = [
    {
      text: "I have a headache and fever",
      expectedLang: "en",
      description: "English text"
    },
    {
      text: "मुझे सिरदर्द है",
      expectedLang: "hi", 
      description: "Hindi Devanagari"
    },
    {
      text: "naan fever vandhudhu",
      expectedLang: "ta",
      description: "Tamil Romanized"
    },
    {
      text: "nuvvu ela unnaru",
      expectedLang: "te",
      description: "Telugu Romanized"
    },
    {
      text: "ami bhalo achi",
      expectedLang: "bn",
      description: "Bengali Romanized"
    }
  ];

  console.log('🔍 Testing Language Detection:');
  console.log('================================\n');

  for (const testCase of testCases) {
    try {
      const detectedLang = await translationService.detectLanguage(testCase.text);
      const status = detectedLang === testCase.expectedLang ? '✅' : '❌';
      
      console.log(`${status} "${testCase.text}"`);
      console.log(`   Expected: ${testCase.expectedLang}, Detected: ${detectedLang}`);
      console.log(`   Description: ${testCase.description}\n`);
    } catch (error) {
      console.log(`❌ Error detecting language for "${testCase.text}": ${error.message}\n`);
    }
  }

  // Test translation if API key is available
  if (process.env.HUGGINGFACE_API_KEY) {
    console.log('🌐 Testing Translation:');
    console.log('========================\n');

    const translationTests = [
      {
        text: "I have a headache",
        targetLang: "hi",
        description: "English to Hindi"
      },
      {
        text: "I need medical help",
        targetLang: "ta",
        description: "English to Tamil"
      },
      {
        text: "What are the symptoms of fever?",
        targetLang: "te",
        description: "English to Telugu"
      }
    ];

    for (const test of translationTests) {
      try {
        const translated = await translationService.translateText(test.text, test.targetLang);
        console.log(`🔄 "${test.text}" → "${translated}"`);
        console.log(`   ${test.description}\n`);
      } catch (error) {
        console.log(`❌ Translation failed for "${test.text}": ${error.message}\n`);
      }
    }
  } else {
    console.log('⚠️  HUGGINGFACE_API_KEY not set - skipping translation tests');
    console.log('   To test translation, add your Hugging Face API key to .env file\n');
  }

  // Test healthcare prompt generation
  console.log('🏥 Testing Healthcare Prompt Generation:');
  console.log('=========================================\n');

  const mockPatient = {
    name: "Test User",
    phone_number: "+1234567890",
    age: 25,
    allergies: ["None"],
    chronic_conditions: ["None"]
  };

  try {
    const prompt = await translationService.createHealthcarePrompt(
      "I have a fever and cough",
      mockPatient,
      "en"
    );
    
    console.log('✅ Healthcare prompt generated successfully');
    console.log(`   Length: ${prompt.length} characters`);
    console.log(`   Contains safety disclaimer: ${prompt.includes('severe symptoms') ? 'Yes' : 'No'}`);
    console.log(`   Contains language instruction: ${prompt.includes('Respond in English') ? 'Yes' : 'No'}\n`);
  } catch (error) {
    console.log(`❌ Healthcare prompt generation failed: ${error.message}\n`);
  }

  console.log('🎉 Hugging Face Translation Service test completed!');
}

// Run the test
testHuggingFaceTranslation().catch(console.error);
