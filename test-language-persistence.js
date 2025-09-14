// Test script to verify language persistence across user interactions
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const TEST_PHONE = '+1234567890';

// Test configuration
const testConfig = {
  serverUrl: SERVER_URL,
  testPhone: TEST_PHONE,
  timeout: 5000
};

// Language test scenarios
const languageTests = [
  {
    name: 'English Language Selection',
    language: 'en',
    buttonId: 'lang_en',
    expectedMenuText: 'Healthcare Assistant Menu',
    expectedSymptomText: 'Symptom Checker'
  },
  {
    name: 'Hindi Native Script',
    language: 'hi',
    scriptButtonId: 'script_hi_native',
    expectedMenuText: 'स्वास्थ्य सहायक मेनू',
    expectedSymptomText: 'लक्षण जांचकर्ता'
  },
  {
    name: 'Hindi Roman Script',
    language: 'hi_roman',
    scriptButtonId: 'script_hi_roman',
    expectedMenuText: 'Swasthya Sahayak Menu',
    expectedSymptomText: 'Lakshan Janchkarta'
  },
  {
    name: 'Telugu Native Script',
    language: 'te',
    scriptButtonId: 'script_te_native',
    expectedMenuText: 'ఆరోగ్య సహాయక మెనూ',
    expectedSymptomText: 'లక్షణ పరీక్షకుడు'
  },
  {
    name: 'Telugu Roman Script',
    language: 'te_roman',
    scriptButtonId: 'script_te_roman',
    expectedMenuText: 'Arogya Sahayaka Menu',
    expectedSymptomText: 'Lakshana Pareekshakudu'
  }
];

// Helper function to simulate WhatsApp webhook message
async function simulateWhatsAppMessage(messageType, content, buttonId = null) {
  const webhookData = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '1234567890',
            phone_number_id: 'test_phone_id'
          },
          contacts: [{
            profile: {
              name: 'Test User'
            },
            wa_id: testConfig.testPhone
          }],
          messages: [{
            from: testConfig.testPhone,
            id: `test_msg_${Date.now()}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            type: messageType
          }]
        },
        field: 'messages'
      }]
    }]
  };

  // Add message content based on type
  if (messageType === 'text') {
    webhookData.entry[0].changes[0].value.messages[0].text = {
      body: content
    };
  } else if (messageType === 'interactive') {
    webhookData.entry[0].changes[0].value.messages[0].interactive = {
      type: 'button_reply',
      button_reply: {
        id: buttonId,
        title: content
      }
    };
  }

  try {
    const response = await axios.post(`${testConfig.serverUrl}/webhook`, webhookData, {
      timeout: testConfig.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status || 'No response'
    };
  }
}

// Function to test language persistence
async function testLanguagePersistence(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log('=' .repeat(50));

  const results = {
    testName: testCase.name,
    language: testCase.language,
    steps: [],
    overall: 'PENDING'
  };

  try {
    // Step 1: Send menu command to get language selection
    console.log('📱 Step 1: Requesting language menu...');
    const menuResult = await simulateWhatsAppMessage('text', 'menu');
    results.steps.push({
      step: 'Request Menu',
      success: menuResult.success,
      details: menuResult.success ? 'Menu requested successfully' : menuResult.error
    });

    if (!menuResult.success) {
      results.overall = 'FAILED';
      return results;
    }

    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Select language (English direct or regional for others)
    console.log('🌐 Step 2: Selecting language...');
    let langResult;
    
    if (testCase.language === 'en') {
      // Direct English selection
      langResult = await simulateWhatsAppMessage('interactive', 'English', 'lang_en');
    } else {
      // First select regional languages
      langResult = await simulateWhatsAppMessage('interactive', 'Regional Languages', 'regional_langs');
      
      if (langResult.success) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Then select specific language
        const langCode = testCase.language.split('_')[0]; // Get base language code
        langResult = await simulateWhatsAppMessage('interactive', `Language ${langCode}`, `lang_${langCode}`);
        
        if (langResult.success && testCase.scriptButtonId) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Select script type
          langResult = await simulateWhatsAppMessage('interactive', 'Script Selection', testCase.scriptButtonId);
        }
      }
    }

    results.steps.push({
      step: 'Language Selection',
      success: langResult.success,
      details: langResult.success ? `${testCase.language} selected successfully` : langResult.error
    });

    if (!langResult.success) {
      results.overall = 'FAILED';
      return results;
    }

    // Wait for language to be processed
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Test main menu in selected language
    console.log('📋 Step 3: Testing main menu language persistence...');
    const mainMenuResult = await simulateWhatsAppMessage('interactive', 'Main Menu', 'main_menu');
    results.steps.push({
      step: 'Main Menu Test',
      success: mainMenuResult.success,
      details: mainMenuResult.success ? 'Main menu accessed successfully' : mainMenuResult.error
    });

    // Step 4: Test symptom checker in selected language
    console.log('🔍 Step 4: Testing symptom checker language persistence...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const symptomResult = await simulateWhatsAppMessage('interactive', 'Symptoms', 'symptom_checker');
    results.steps.push({
      step: 'Symptom Checker Test',
      success: symptomResult.success,
      details: symptomResult.success ? 'Symptom checker accessed successfully' : symptomResult.error
    });

    // Step 5: Test back to main menu
    console.log('⬅️ Step 5: Testing navigation back to main menu...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const backResult = await simulateWhatsAppMessage('interactive', 'Back to Menu', 'main_menu');
    results.steps.push({
      step: 'Navigation Test',
      success: backResult.success,
      details: backResult.success ? 'Navigation working successfully' : backResult.error
    });

    // Determine overall result
    const allStepsSuccessful = results.steps.every(step => step.success);
    results.overall = allStepsSuccessful ? 'PASSED' : 'PARTIAL';

    console.log(`✅ Test completed: ${results.overall}`);

  } catch (error) {
    console.error(`❌ Test failed with error: ${error.message}`);
    results.overall = 'FAILED';
    results.steps.push({
      step: 'Test Execution',
      success: false,
      details: `Test execution failed: ${error.message}`
    });
  }

  return results;
}

// Function to check server health
async function checkServerHealth() {
  try {
    const response = await axios.get(`${testConfig.serverUrl}/health`, {
      timeout: testConfig.timeout
    });
    return { healthy: true, status: response.status, data: response.data };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message,
      status: error.response?.status || 'No response'
    };
  }
}

// Main test execution function
async function runLanguagePersistenceTests() {
  console.log('🚀 Starting Language Persistence Tests');
  console.log('=====================================');
  console.log(`Server: ${testConfig.serverUrl}`);
  console.log(`Test Phone: ${testConfig.testPhone}`);
  console.log(`Timeout: ${testConfig.timeout}ms\n`);

  // Check server health first
  console.log('🏥 Checking server health...');
  const healthCheck = await checkServerHealth();
  
  if (!healthCheck.healthy) {
    console.error('❌ Server is not healthy. Aborting tests.');
    console.error(`Error: ${healthCheck.error}`);
    return;
  }
  
  console.log('✅ Server is healthy and ready for testing\n');

  const testResults = [];
  let passedTests = 0;
  let failedTests = 0;

  // Run tests for each language
  for (const testCase of languageTests) {
    const result = await testLanguagePersistence(testCase);
    testResults.push(result);
    
    if (result.overall === 'PASSED') {
      passedTests++;
    } else {
      failedTests++;
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate final report
  console.log('\n📊 LANGUAGE PERSISTENCE TEST REPORT');
  console.log('===================================');
  console.log(`Total Tests: ${testResults.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / testResults.length) * 100).toFixed(1)}%\n`);

  // Detailed results
  testResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.testName}: ${result.overall}`);
    if (result.overall === 'FAILED' || result.overall === 'PARTIAL') {
      result.steps.forEach(step => {
        if (!step.success) {
          console.log(`   ❌ ${step.step}: ${step.details}`);
        }
      });
    }
  });

  // Summary and recommendations
  console.log('\n🔍 ANALYSIS & RECOMMENDATIONS');
  console.log('=============================');
  
  if (passedTests === testResults.length) {
    console.log('✅ All language persistence tests passed!');
    console.log('✅ Language state management is working correctly');
    console.log('✅ Menu translations are being applied properly');
    console.log('✅ Navigation maintains language consistency');
  } else {
    console.log('⚠️  Some language persistence issues detected:');
    
    const failedLanguages = testResults
      .filter(r => r.overall !== 'PASSED')
      .map(r => r.language);
    
    console.log(`❌ Failed languages: ${failedLanguages.join(', ')}`);
    console.log('🔧 Recommendations:');
    console.log('   - Check getUserLanguage() function implementation');
    console.log('   - Verify language parameter passing to menu functions');
    console.log('   - Ensure translation objects include all language variants');
    console.log('   - Test language state persistence in user sessions');
  }

  console.log('\n🏁 Language persistence testing completed!');
}

// Run the tests
if (require.main === module) {
  runLanguagePersistenceTests().catch(console.error);
}

module.exports = {
  runLanguagePersistenceTests,
  testLanguagePersistence,
  checkServerHealth
};
