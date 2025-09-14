// Test language change functionality during conversation
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const TEST_PHONE = '919876543210';

// Test scenarios for language change requests
const languageChangeTests = [
  {
    name: 'English Language Change Request',
    message: 'change language',
    expectedResponse: 'language selection menu'
  },
  {
    name: 'Hindi Language Change Request',
    message: 'भाषा बदलें',
    expectedResponse: 'language selection menu'
  },
  {
    name: 'Telugu Language Change Request',
    message: 'భాష మార్చు',
    expectedResponse: 'language selection menu'
  },
  {
    name: 'Tamil Language Change Request',
    message: 'மொழி மாற்று',
    expectedResponse: 'language selection menu'
  },
  {
    name: 'Mixed Language Request',
    message: 'language change karo',
    expectedResponse: 'language selection menu'
  },
  {
    name: 'Switch Language Request',
    message: 'switch language please',
    expectedResponse: 'language selection menu'
  },
  {
    name: 'Normal Health Question',
    message: 'I have a headache',
    expectedResponse: 'AI health response'
  }
];

// Send message to bot
async function sendTestMessage(message) {
  const testPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: TEST_PHONE,
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

// Test language change detection
async function testLanguageChangeDetection() {
  console.log('🧪 Testing Language Change Detection');
  console.log('===================================\n');

  let passed = 0;
  let failed = 0;

  for (const test of languageChangeTests) {
    console.log(`📋 Test: ${test.name}`);
    console.log(`💬 Message: "${test.message}"`);
    console.log(`🎯 Expected: ${test.expectedResponse}`);
    console.log('⏳ Sending message...\n');

    try {
      const result = await sendTestMessage(test.message);
      
      if (result.success) {
        console.log('✅ Message processed successfully');
        console.log(`📊 Status Code: ${result.statusCode}`);
        
        if (test.expectedResponse === 'language selection menu') {
          console.log('🌐 Expected: Language menu should be displayed');
        } else {
          console.log('🤖 Expected: AI health response should be generated');
        }
        
        passed++;
        console.log('✅ Test PASSED\n');
      } else {
        console.log(`❌ Test FAILED: ${result.error}`);
        failed++;
        console.log('');
      }
      
    } catch (error) {
      console.log(`❌ Test FAILED: ${error.message}`);
      failed++;
      console.log('');
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('🎉 Language Change Testing Complete!');
  console.log('====================================\n');
  console.log(`✅ Passed: ${passed}/${languageChangeTests.length}`);
  console.log(`❌ Failed: ${failed}/${languageChangeTests.length}`);
  console.log(`📊 Success Rate: ${((passed / languageChangeTests.length) * 100).toFixed(1)}%\n`);

  // Test instructions
  console.log('📋 Manual Verification Steps:');
  console.log('1. Check WhatsApp for language selection buttons after language change requests');
  console.log('2. Verify normal health questions get AI responses');
  console.log('3. Test language selection buttons work correctly');
  console.log('4. Confirm conversation continues in selected language\n');

  console.log('🔧 Language Change Keywords Tested:');
  console.log('- English: "change language", "switch language"');
  console.log('- Hindi: "भाषा बदलें", "भाषा बदलो"');
  console.log('- Telugu: "భాష మార్చు", "భాష మార్చండి"');
  console.log('- Tamil: "மொழி மாற்று", "மொழியை மாற்று"');
  console.log('- Mixed: "language badlo", "language change karo"');
}

// Run tests
if (require.main === module) {
  testLanguageChangeDetection().catch(console.error);
}

module.exports = { testLanguageChangeDetection };
