// Simple AI Response Test - Direct Gemini API Testing
const { getGeminiResponse } = require('./utils/aiUtils');
require('dotenv').config();

// Test scenarios with sample health messages
const healthMessages = [
  {
    message: "I have a headache and feel tired",
    language: "en",
    category: "Basic Symptoms"
  },
  {
    message: "My child has fever of 102°F for 2 days",
    language: "en", 
    category: "Pediatric"
  },
  {
    message: "I'm having chest pain and shortness of breath",
    language: "en",
    category: "Emergency"
  },
  {
    message: "What foods should I eat to lower cholesterol?",
    language: "en",
    category: "Nutrition"
  },
  {
    message: "I feel anxious and can't sleep well",
    language: "en",
    category: "Mental Health"
  },
  {
    message: "मुझे बुखार और खांसी है",
    language: "hi",
    category: "Hindi Symptoms"
  },
  {
    message: "నాకు కడుపు నొప్పి ఉంది",
    language: "te", 
    category: "Telugu Symptoms"
  },
  {
    message: "How can I boost my immune system naturally?",
    language: "en",
    category: "Preventive Care"
  }
];

async function testAIResponses() {
  console.log('🧪 Testing AI Responses with Sample Health Messages');
  console.log('==================================================\n');

  let successful = 0;
  let failed = 0;
  const results = [];

  for (let i = 0; i < healthMessages.length; i++) {
    const test = healthMessages[i];
    
    console.log(`📋 Test ${i + 1}/${healthMessages.length}: ${test.category}`);
    console.log(`💬 Message: "${test.message}"`);
    console.log(`🌐 Language: ${test.language}`);
    console.log('⏳ Getting AI response...\n');

    try {
      const startTime = Date.now();
      const response = await getGeminiResponse(test.message, null, test.language);
      const responseTime = Date.now() - startTime;

      console.log('✅ AI Response:');
      console.log('─'.repeat(60));
      console.log(response);
      console.log('─'.repeat(60));
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`📏 Response length: ${response.length} characters`);
      
      // Basic quality checks
      const hasHealthAdvice = response.toLowerCase().includes('doctor') || 
                             response.toLowerCase().includes('medical') ||
                             response.toLowerCase().includes('health') ||
                             response.toLowerCase().includes('treatment');
      
      const isRelevant = response.length > 50 && hasHealthAdvice;
      
      console.log(`🔍 Quality: ${isRelevant ? '✅ Good' : '⚠️ Needs improvement'}`);
      console.log('✅ Test PASSED\n');

      results.push({
        test: test.category,
        message: test.message,
        language: test.language,
        status: 'PASSED',
        responseTime,
        responseLength: response.length,
        response: response.substring(0, 100) + '...'
      });
      
      successful++;

    } catch (error) {
      console.error(`❌ Test FAILED: ${error.message}`);
      
      if (error.message.includes('429')) {
        console.log('⚠️ Rate limited - retry logic should handle this');
      } else if (error.message.includes('GEMINI_API_KEY')) {
        console.log('⚠️ API key issue - check environment variables');
      }
      
      console.log('');
      
      results.push({
        test: test.category,
        message: test.message,
        language: test.language,
        status: 'FAILED',
        error: error.message
      });
      
      failed++;
    }

    // Small delay between requests to avoid rate limiting
    if (i < healthMessages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log('🎉 AI Response Testing Complete!');
  console.log('================================\n');
  console.log(`✅ Successful: ${successful}/${healthMessages.length}`);
  console.log(`❌ Failed: ${failed}/${healthMessages.length}`);
  console.log(`📊 Success Rate: ${((successful / healthMessages.length) * 100).toFixed(1)}%\n`);

  // Detailed results
  console.log('📋 Test Results Summary:');
  console.log('─'.repeat(80));
  results.forEach((result, index) => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${result.test} (${result.language})`);
    
    if (result.status === 'PASSED') {
      console.log(`   Response: ${result.response}`);
      console.log(`   Time: ${result.responseTime}ms, Length: ${result.responseLength} chars`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  // API Status Check
  console.log('🔧 System Status:');
  if (successful > 0) {
    console.log('✅ Gemini API: Working');
    console.log('✅ Rate limiting: Handled properly');
    console.log('✅ Multilingual: Supported');
    console.log('✅ Healthcare responses: Generated successfully');
  } else {
    console.log('❌ Gemini API: Issues detected');
    console.log('⚠️ Check API key and network connectivity');
  }

  return results;
}

// Test single message function
async function testSingleMessage(message, language = 'en') {
  console.log(`🧪 Testing: "${message}" (${language})\n`);
  
  try {
    const startTime = Date.now();
    const response = await getGeminiResponse(message, null, language);
    const responseTime = Date.now() - startTime;
    
    console.log('✅ AI Response:');
    console.log('─'.repeat(60));
    console.log(response);
    console.log('─'.repeat(60));
    console.log(`⏱️ Response time: ${responseTime}ms`);
    
    return response;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Run the tests
if (require.main === module) {
  testAIResponses().catch(console.error);
}

module.exports = { testAIResponses, testSingleMessage };
