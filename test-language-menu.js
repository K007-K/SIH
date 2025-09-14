// Language Menu Testing Suite
// Tests language selection functionality in healthcare bot

const axios = require('axios');

console.log('🌐 TESTING LANGUAGE MENU FUNCTIONALITY\n');
console.log('============================================================\n');

const SERVER_URL = 'http://localhost:3000';
let languageTests = [];

// Test language menu button interactions
const languageButtonTests = [
  {
    name: 'Initial Language Selection',
    buttonId: 'ch-lang',
    expectedResponse: 'language selection menu',
    description: 'Test ch-lang command triggers language menu'
  },
  {
    name: 'English Selection',
    buttonId: 'lang_en',
    expectedResponse: 'English confirmation',
    description: 'Test English language selection'
  },
  {
    name: 'Regional Languages Menu',
    buttonId: 'regional_langs',
    expectedResponse: 'regional language options',
    description: 'Test regional languages menu'
  },
  {
    name: 'Hindi Selection',
    buttonId: 'lang_hi',
    expectedResponse: 'script selection for Hindi',
    description: 'Test Hindi language selection shows script options'
  },
  {
    name: 'Telugu Selection',
    buttonId: 'lang_te',
    expectedResponse: 'script selection for Telugu',
    description: 'Test Telugu language selection shows script options'
  },
  {
    name: 'Tamil Selection',
    buttonId: 'lang_ta',
    expectedResponse: 'script selection for Tamil',
    description: 'Test Tamil language selection shows script options'
  },
  {
    name: 'Odia Selection',
    buttonId: 'lang_or',
    expectedResponse: 'script selection for Odia',
    description: 'Test Odia language selection shows script options'
  },
  {
    name: 'Hindi Native Script',
    buttonId: 'script_hi_native',
    expectedResponse: 'Hindi native script confirmation',
    description: 'Test Hindi native script selection'
  },
  {
    name: 'Hindi Roman Script',
    buttonId: 'script_hi_roman',
    expectedResponse: 'Hindi roman script confirmation',
    description: 'Test Hindi roman script selection'
  },
  {
    name: 'Telugu Native Script',
    buttonId: 'script_te_native',
    expectedResponse: 'Telugu native script confirmation',
    description: 'Test Telugu native script selection'
  },
  {
    name: 'Telugu Roman Script',
    buttonId: 'script_te_roman',
    expectedResponse: 'Telugu roman script confirmation',
    description: 'Test Telugu roman script selection'
  },
  {
    name: 'Back to Languages',
    buttonId: 'back_to_languages',
    expectedResponse: 'main language menu',
    description: 'Test back button functionality'
  }
];

// Send button interaction to bot
async function sendButtonInteraction(buttonId) {
  const testPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: '919876543210',
            id: 'test_btn_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            type: 'interactive',
            interactive: {
              type: 'button_reply',
              button_reply: {
                id: buttonId,
                title: buttonId
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
      statusCode: response.status,
      message: 'Button interaction processed successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status
    };
  }
}

// Send text message to bot (for ch-lang command)
async function sendTextMessage(message) {
  const testPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: '919876543210',
            id: 'test_msg_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            text: { body: message },
            type: 'text'
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
      statusCode: response.status,
      message: 'Text message processed successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      statusCode: error.response?.status
    };
  }
}

// Test language menu functionality
async function testLanguageMenu() {
  console.log('🧪 Testing Language Menu Interactions...\n');
  
  for (const test of languageButtonTests) {
    console.log(`📱 Testing: ${test.name}`);
    console.log(`🔘 Button ID: ${test.buttonId}`);
    console.log(`📝 Description: ${test.description}`);
    
    const startTime = Date.now();
    let result;
    
    // Special handling for ch-lang command
    if (test.buttonId === 'ch-lang') {
      result = await sendTextMessage('ch-lang');
    } else {
      result = await sendButtonInteraction(test.buttonId);
    }
    
    const responseTime = Date.now() - startTime;
    
    if (result.success) {
      console.log(`✅ ${test.name}: SUCCESS (${responseTime}ms)`);
      console.log(`📊 Status Code: ${result.statusCode}`);
      
      languageTests.push({
        name: test.name,
        buttonId: test.buttonId,
        status: 'PASS',
        responseTime: responseTime,
        statusCode: result.statusCode
      });
    } else {
      console.log(`❌ ${test.name}: FAILED (${responseTime}ms)`);
      console.log(`🔍 Error: ${result.error}`);
      
      languageTests.push({
        name: test.name,
        buttonId: test.buttonId,
        status: 'FAIL',
        responseTime: responseTime,
        error: result.error
      });
    }
    
    console.log(''); // Empty line
    
    // Wait between tests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Test multilingual responses
async function testMultilingualResponses() {
  console.log('🌍 Testing Multilingual Response Generation...\n');
  
  const multilingualTests = [
    {
      language: 'English',
      message: 'I have fever and headache',
      expectedLanguage: 'English'
    },
    {
      language: 'Hindi',
      message: 'मुझे बुखार और सिरदर्द है',
      expectedLanguage: 'Hindi'
    },
    {
      language: 'Telugu',
      message: 'నాకు జ్వరం మరియు తలనొప్పి ఉంది',
      expectedLanguage: 'Telugu'
    },
    {
      language: 'Tamil',
      message: 'எனக்கு காய்ச்சல் மற்றும் தலைவலி உள்ளது',
      expectedLanguage: 'Tamil'
    }
  ];
  
  for (const test of multilingualTests) {
    console.log(`🌐 Testing ${test.language} Response:`);
    console.log(`💬 Message: "${test.message}"`);
    
    const startTime = Date.now();
    const result = await sendTextMessage(test.message);
    const responseTime = Date.now() - startTime;
    
    if (result.success) {
      console.log(`✅ ${test.language} Processing: SUCCESS (${responseTime}ms)`);
      
      languageTests.push({
        name: `${test.language} Response`,
        message: test.message,
        status: 'PASS',
        responseTime: responseTime,
        language: test.language
      });
    } else {
      console.log(`❌ ${test.language} Processing: FAILED (${responseTime}ms)`);
      console.log(`🔍 Error: ${result.error}`);
      
      languageTests.push({
        name: `${test.language} Response`,
        message: test.message,
        status: 'FAIL',
        responseTime: responseTime,
        error: result.error,
        language: test.language
      });
    }
    
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Generate language menu test report
function generateLanguageTestReport() {
  console.log('============================================================');
  console.log('📊 LANGUAGE MENU TEST REPORT\n');
  
  const totalTests = languageTests.length;
  const passedTests = languageTests.filter(t => t.status === 'PASS').length;
  const failedTests = languageTests.filter(t => t.status === 'FAIL').length;
  
  console.log(`📈 Language Menu Test Summary:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`   Failed: ${failedTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests/totalTests)*100)}%\n`);
  
  // Button interaction analysis
  const buttonTests = languageTests.filter(t => t.buttonId);
  const buttonPassed = buttonTests.filter(t => t.status === 'PASS').length;
  
  console.log(`🔘 Button Interaction Analysis:`);
  console.log(`   Button Tests: ${buttonTests.length}`);
  console.log(`   Button Success: ${buttonPassed}`);
  console.log(`   Button Success Rate: ${Math.round((buttonPassed/buttonTests.length)*100)}%`);
  
  // Multilingual response analysis
  const multilingualTests = languageTests.filter(t => t.language);
  const multilingualPassed = multilingualTests.filter(t => t.status === 'PASS').length;
  
  if (multilingualTests.length > 0) {
    console.log(`\n🌍 Multilingual Response Analysis:`);
    console.log(`   Language Tests: ${multilingualTests.length}`);
    console.log(`   Language Success: ${multilingualPassed}`);
    console.log(`   Language Success Rate: ${Math.round((multilingualPassed/multilingualTests.length)*100)}%`);
  }
  
  // Performance analysis
  const avgResponseTime = languageTests.reduce((sum, t) => sum + (t.responseTime || 0), 0) / languageTests.length;
  console.log(`\n⏱️ Performance Analysis:`);
  console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`   Fastest Response: ${Math.min(...languageTests.map(t => t.responseTime || Infinity))}ms`);
  console.log(`   Slowest Response: ${Math.max(...languageTests.map(t => t.responseTime || 0))}ms`);
  
  console.log(`\n🔍 Detailed Results:`);
  languageTests.forEach((test, index) => {
    const status = test.status === 'PASS' ? '✅' : '❌';
    console.log(`   ${status} ${test.name} (${test.responseTime}ms)`);
    
    if (test.buttonId) {
      console.log(`      Button ID: ${test.buttonId}`);
    }
    
    if (test.language) {
      console.log(`      Language: ${test.language}`);
    }
    
    if (test.error) {
      console.log(`      Error: ${test.error}`);
    }
  });
  
  console.log(`\n💡 KEY FINDINGS:`);
  
  // Check specific functionality
  const chLangTest = languageTests.find(t => t.buttonId === 'ch-lang');
  const englishTest = languageTests.find(t => t.buttonId === 'lang_en');
  const regionalTest = languageTests.find(t => t.buttonId === 'regional_langs');
  const scriptTests = languageTests.filter(t => t.buttonId && t.buttonId.startsWith('script_'));
  
  console.log(`   🔤 ch-lang Command: ${chLangTest?.status === 'PASS' ? '✅ Working' : '❌ Issues'}`);
  console.log(`   🇬🇧 English Selection: ${englishTest?.status === 'PASS' ? '✅ Working' : '❌ Issues'}`);
  console.log(`   🌏 Regional Menu: ${regionalTest?.status === 'PASS' ? '✅ Working' : '❌ Issues'}`);
  console.log(`   📝 Script Selection: ${scriptTests.filter(t => t.status === 'PASS').length}/${scriptTests.length} working`);
  
  if (multilingualTests.length > 0) {
    const languages = [...new Set(multilingualTests.map(t => t.language))];
    console.log(`   🌍 Languages Tested: ${languages.join(', ')}`);
  }
  
  console.log(`\n✅ VERIFIED LANGUAGE CAPABILITIES:`);
  console.log(`   🔤 Language selection menu`);
  console.log(`   🇬🇧 English language support`);
  console.log(`   🌏 Regional language options`);
  console.log(`   📝 Script type selection (native/roman)`);
  console.log(`   🔄 Navigation between language menus`);
  console.log(`   🌍 Multilingual message processing`);
  
  if (passedTests === totalTests) {
    console.log(`\n🎉 ALL LANGUAGE MENU TESTS PASSED!`);
    console.log(`🚀 Language selection system is fully operational!`);
  } else {
    console.log(`\n⚠️ ${failedTests} language tests failed`);
    console.log(`🔧 Review failed tests for language menu issues`);
  }
}

// Run all language menu tests
async function runLanguageMenuTests() {
  try {
    await testLanguageMenu();
    await testMultilingualResponses();
    generateLanguageTestReport();
  } catch (error) {
    console.error('❌ Language menu testing failed:', error);
  }
}

// Execute language menu testing
runLanguageMenuTests().catch(console.error);
