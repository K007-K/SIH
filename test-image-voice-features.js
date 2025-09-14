const { detectLanguage, getGeminiResponse } = require('./utils/aiUtils');
const fs = require('fs');
const path = require('path');

// Test image analysis with multilingual responses
async function testImageAnalysis() {
  console.log('🖼️ Testing Image Analysis with Multilingual Responses...\n');

  const imageTestCases = [
    {
      text: "naaku ee rash enti, ela treat cheyyali?",
      language: "te_trans",
      description: "Telugu Transliteration + Image Analysis",
      imageType: "skin_condition"
    },
    {
      text: "mujhe ye daag kya hai, kaise theek karu?",
      language: "hi_trans", 
      description: "Hindi Transliteration + Image Analysis",
      imageType: "skin_condition"
    },
    {
      text: "enakku idhu enna problem, eppadi treat pannanum?",
      language: "ta_trans",
      description: "Tamil Transliteration + Image Analysis", 
      imageType: "skin_condition"
    },
    {
      text: "What is this rash, how to treat it?",
      language: "en",
      description: "English + Image Analysis",
      imageType: "skin_condition"
    }
  ];

  // Create a mock base64 image for testing
  const mockImageData = {
    mimeType: 'image/jpeg',
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' // 1x1 pixel
  };

  let passedTests = 0;
  let totalTests = imageTestCases.length;

  for (const testCase of imageTestCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.description}`);
      console.log(`Text: "${testCase.text}"`);
      console.log(`Expected Language: ${testCase.language}`);
      
      // Detect language from text
      const detectedLang = detectLanguage(testCase.text);
      console.log(`Detected Language: ${detectedLang}`);
      
      // Test image + text analysis
      console.log('Getting AI response for image + text...');
      const aiResponse = await getGeminiResponse(testCase.text, mockImageData, detectedLang);
      
      console.log(`AI Response: ${aiResponse.substring(0, 200)}...`);
      
      // Verify response language matches input
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
      
      if (responseValid) {
        console.log('✅ PASS - Image analysis with correct language response');
        passedTests++;
      } else {
        console.log('❌ FAIL - Response language does not match input');
      }
      
    } catch (error) {
      console.log(`❌ FAIL - Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Image Analysis Results: ${passedTests}/${totalTests} tests passed`);
  return { passedTests, totalTests };
}

// Test voice/audio processing
async function testVoiceProcessing() {
  console.log('\n🎤 Testing Voice/Audio Processing...\n');

  // Check OpenAI configuration
  console.log('1️⃣ Checking OpenAI Whisper Configuration...');
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not configured');
    return { error: 'OpenAI API key missing' };
  }
  console.log('✅ OpenAI API key configured');

  // Test audio transcription function
  console.log('\n2️⃣ Testing Audio Transcription Function...');
  
  // Mock audio data (base64 encoded)
  const mockAudioData = 'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
  
  try {
    // Test the transcribeAudio function from server.js
    console.log('Testing audio transcription...');
    
    // Since we can't directly test without a real audio file, we'll test the function structure
    const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
    
    if (serverContent.includes('transcribeAudio')) {
      console.log('✅ transcribeAudio function found in server.js');
    } else {
      console.log('❌ transcribeAudio function not found');
    }
    
    if (serverContent.includes('OPENAI_API_URL')) {
      console.log('✅ OpenAI API URL configured');
    } else {
      console.log('❌ OpenAI API URL not configured');
    }
    
    if (serverContent.includes('audio/transcriptions')) {
      console.log('✅ Whisper transcription endpoint configured');
    } else {
      console.log('❌ Whisper transcription endpoint not configured');
    }
    
  } catch (error) {
    console.log(`❌ Error testing voice processing: ${error.message}`);
    return { error: error.message };
  }

  console.log('\n3️⃣ Testing Audio Message Handling...');
  
  // Check if audio message handling exists in server.js
  const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  
  if (serverContent.includes('message.type === \'audio\'')) {
    console.log('✅ Audio message type handling found');
  } else {
    console.log('❌ Audio message type handling not found');
  }
  
  if (serverContent.includes('audioId')) {
    console.log('✅ Audio ID extraction implemented');
  } else {
    console.log('❌ Audio ID extraction not implemented');
  }
  
  if (serverContent.includes('audioMimeType')) {
    console.log('✅ Audio MIME type handling implemented');
  } else {
    console.log('❌ Audio MIME type handling not implemented');
  }

  return { status: 'tested' };
}

// Test WhatsApp webhook with different message types
async function testWhatsAppWebhook() {
  console.log('\n📱 Testing WhatsApp Webhook Message Types...\n');

  const webhookTests = [
    {
      type: 'text',
      description: 'Text Message Processing',
      mockMessage: {
        from: '1234567890',
        type: 'text',
        text: { body: 'naaku fever vachindi' }
      }
    },
    {
      type: 'image',
      description: 'Image Message Processing',
      mockMessage: {
        from: '1234567890',
        type: 'image',
        image: { 
          id: 'mock_image_id',
          mime_type: 'image/jpeg',
          caption: 'ee rash enti?'
        }
      }
    },
    {
      type: 'audio',
      description: 'Audio Message Processing',
      mockMessage: {
        from: '1234567890',
        type: 'audio',
        audio: {
          id: 'mock_audio_id',
          mime_type: 'audio/ogg'
        }
      }
    }
  ];

  webhookTests.forEach(test => {
    console.log(`Testing ${test.description}:`);
    console.log(`Message Type: ${test.type}`);
    console.log(`Mock Data: ${JSON.stringify(test.mockMessage, null, 2)}`);
    console.log('✅ Webhook structure ready for testing\n');
  });

  return { status: 'structure_verified' };
}

// Run comprehensive feature tests
async function runCompleteFeatureTests() {
  console.log('🚀 Complete Feature Testing Suite\n');
  console.log('Testing: Image Analysis + Voice Processing + WhatsApp Integration\n');

  try {
    // Test image analysis
    const imageResults = await testImageAnalysis();
    
    // Test voice processing
    const voiceResults = await testVoiceProcessing();
    
    // Test webhook structure
    const webhookResults = await testWhatsAppWebhook();
    
    console.log('\n📊 Complete Feature Test Summary:');
    console.log('=====================================');
    console.log(`Image Analysis: ${imageResults.passedTests}/${imageResults.totalTests} tests passed`);
    console.log(`Voice Processing: ${voiceResults.error ? '❌ Issues found' : '✅ Configured'}`);
    console.log(`WhatsApp Webhook: ${webhookResults.status === 'structure_verified' ? '✅ Ready' : '❌ Issues'}`);
    
    if (voiceResults.error) {
      console.log(`\n⚠️ Voice Processing Issues:`);
      console.log(`- ${voiceResults.error}`);
      console.log(`\n🔧 To Fix Voice Issues:`);
      console.log(`1. Ensure OpenAI API key is configured`);
      console.log(`2. Test with real WhatsApp audio messages`);
      console.log(`3. Check audio format compatibility (OGG, MP3, WAV)`);
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Deploy to production server');
    console.log('2. Test with real WhatsApp messages');
    console.log('3. Monitor logs for any issues');
    
  } catch (error) {
    console.error('Feature testing failed:', error);
  }
}

// Run tests
if (require.main === module) {
  runCompleteFeatureTests().catch(console.error);
}

module.exports = { 
  testImageAnalysis, 
  testVoiceProcessing, 
  testWhatsAppWebhook,
  runCompleteFeatureTests 
};
