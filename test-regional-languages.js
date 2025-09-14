// Test regional language selection flow
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const TEST_PHONE = '919876543210';

// Simulate button clicks for regional language flow
async function simulateButtonClick(buttonId, title = '') {
  const testPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: TEST_PHONE,
            id: 'test_interactive_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            type: 'interactive',
            interactive: {
              type: 'button_reply',
              button_reply: {
                id: buttonId,
                title: title || buttonId
              }
            }
          }],
          contacts: [{
            profile: { name: 'Test User' }
          }]
        }
      }]
    }]
  };

  try {
    const response = await axios.post(`${SERVER_URL}/webhook`, testPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    return {
      success: true,
      statusCode: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status
    };
  }
}

// Test regional language selection flow
async function testRegionalLanguageFlow() {
  console.log('🧪 Testing Regional Language Selection Flow');
  console.log('==========================================\n');

  const tests = [
    {
      step: 1,
      name: 'Click Regional Languages Button',
      buttonId: 'regional_langs',
      title: '🌏 Regional Languages',
      expected: 'Should show Telugu, Tamil, Odia options'
    },
    {
      step: 2,
      name: 'Select Telugu',
      buttonId: 'lang_te',
      title: 'తెలుగు Telugu',
      expected: 'Should show script type options (Native/Roman)'
    },
    {
      step: 3,
      name: 'Select Telugu Native Script',
      buttonId: 'script_te_native',
      title: '📝 తెలుగు',
      expected: 'Should set language to "te" and show Telugu welcome'
    },
    {
      step: 4,
      name: 'Select Tamil',
      buttonId: 'lang_ta',
      title: 'தமிழ் Tamil',
      expected: 'Should show script type options'
    },
    {
      step: 5,
      name: 'Select Tamil Roman Script',
      buttonId: 'script_ta_roman',
      title: '🔤 Roman Letters',
      expected: 'Should set language to "ta_roman" and show Tamil welcome'
    },
    {
      step: 6,
      name: 'Select Odia',
      buttonId: 'lang_or',
      title: 'ଓଡ଼ିଆ Odia',
      expected: 'Should show script type options'
    },
    {
      step: 7,
      name: 'Select Odia Native Script',
      buttonId: 'script_or_native',
      title: '📝 ଓଡ଼ିଆ',
      expected: 'Should set language to "or" and show Odia welcome'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`📋 Step ${test.step}: ${test.name}`);
    console.log(`🔘 Button ID: ${test.buttonId}`);
    console.log(`📝 Title: ${test.title}`);
    console.log(`🎯 Expected: ${test.expected}`);
    console.log('⏳ Simulating button click...\n');

    try {
      const result = await simulateButtonClick(test.buttonId, test.title);
      
      if (result.success) {
        console.log('✅ Button click processed successfully');
        console.log(`📊 Status Code: ${result.statusCode}`);
        console.log('✅ Test PASSED\n');
        passed++;
      } else {
        console.log(`❌ Test FAILED: ${result.error}`);
        console.log(`📊 Status Code: ${result.statusCode || 'N/A'}`);
        failed++;
        console.log('');
      }
      
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}`);
      failed++;
      console.log('');
    }

    // Delay between tests
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Summary
  console.log('🎉 Regional Language Flow Testing Complete!');
  console.log('==========================================\n');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  console.log(`📊 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`);

  // Manual verification steps
  console.log('📋 Manual Verification Required:');
  console.log('1. Check WhatsApp for proper button menus after each step');
  console.log('2. Verify welcome messages appear in correct languages/scripts');
  console.log('3. Test AI responses work in selected regional languages');
  console.log('4. Confirm language persistence across conversation\n');

  console.log('🌐 Regional Languages Supported:');
  console.log('- తెలుగు (Telugu) - Native & Roman scripts');
  console.log('- தமிழ் (Tamil) - Native & Roman scripts');
  console.log('- ଓଡ଼ିଆ (Odia) - Native & Roman scripts');
  console.log('- हिंदी (Hindi) - Native & Roman scripts');

  return { passed, failed, total: tests.length };
}

// Test individual regional language AI responses
async function testRegionalAIResponses() {
  console.log('\n🤖 Testing Regional Language AI Responses');
  console.log('=========================================\n');

  const { getGeminiResponse } = require('./utils/aiUtils');

  const regionalTests = [
    {
      language: 'te',
      message: 'నాకు తలనొప్పి ఉంది',
      expected: 'Telugu native script response'
    },
    {
      language: 'te_roman',
      message: 'Naaku tala noppi undi',
      expected: 'Telugu roman script response'
    },
    {
      language: 'ta',
      message: 'எனக்கு காய்ச்சல் இருக்கிறது',
      expected: 'Tamil native script response'
    },
    {
      language: 'ta_roman',
      message: 'Enakku kaichhal irukkirathu',
      expected: 'Tamil roman script response'
    },
    {
      language: 'or',
      message: 'ମୋର ଜ୍ୱର ହୋଇଛି',
      expected: 'Odia native script response'
    },
    {
      language: 'or_roman',
      message: 'Mora jwara hoichi',
      expected: 'Odia roman script response'
    }
  ];

  let aiPassed = 0;
  let aiFailed = 0;

  for (const test of regionalTests) {
    console.log(`🌐 Testing ${test.language}: "${test.message}"`);
    console.log(`🎯 Expected: ${test.expected}`);
    
    try {
      const startTime = Date.now();
      const response = await getGeminiResponse(test.message, null, test.language);
      const responseTime = Date.now() - startTime;
      
      console.log('✅ AI Response:');
      console.log('─'.repeat(50));
      console.log(response);
      console.log('─'.repeat(50));
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log('✅ AI Test PASSED\n');
      
      aiPassed++;
      
    } catch (error) {
      console.log(`❌ AI Test FAILED: ${error.message}\n`);
      aiFailed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`🤖 AI Response Results: ${aiPassed}/${regionalTests.length} passed`);
  
  return { aiPassed, aiFailed, aiTotal: regionalTests.length };
}

// Run all tests
async function runAllRegionalTests() {
  try {
    const flowResults = await testRegionalLanguageFlow();
    const aiResults = await testRegionalAIResponses();
    
    console.log('\n🎯 OVERALL RESULTS:');
    console.log('==================');
    console.log(`Button Flow: ${flowResults.passed}/${flowResults.total} passed`);
    console.log(`AI Responses: ${aiResults.aiPassed}/${aiResults.aiTotal} passed`);
    
    const totalPassed = flowResults.passed + aiResults.aiPassed;
    const totalTests = flowResults.total + aiResults.aiTotal;
    console.log(`Overall Success: ${totalPassed}/${totalTests} (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests
if (require.main === module) {
  runAllRegionalTests().catch(console.error);
}

module.exports = { testRegionalLanguageFlow, testRegionalAIResponses };
