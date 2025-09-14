// Debug script to test AI response functionality
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const TEST_PHONE = '+1234567890';

// Test AI response with a simple message
async function testAIResponse() {
  console.log('🔍 Testing AI Response System');
  console.log('============================\n');

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
            wa_id: TEST_PHONE
          }],
          messages: [{
            from: TEST_PHONE,
            id: `test_msg_${Date.now()}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            type: 'text',
            text: {
              body: 'What can you do?'
            }
          }]
        },
        field: 'messages'
      }]
    }]
  };

  try {
    console.log('📤 Sending test message: "What can you do?"');
    
    const response = await axios.post(`${SERVER_URL}/webhook`, webhookData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Message sent successfully');
    console.log('📊 Response status:', response.status);
    
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🔍 Check server logs for AI response processing...');
    
  } catch (error) {
    console.error('❌ Error testing AI response:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Test direct Gemini API call
async function testGeminiDirect() {
  console.log('\n🤖 Testing Direct Gemini API Call');
  console.log('=================================\n');

  const { getGeminiResponse } = require('./utils/aiUtils');
  
  try {
    console.log('📤 Calling Gemini API directly...');
    const response = await getGeminiResponse('What can you do?', null, 'en');
    console.log('✅ Gemini API Response:');
    console.log(response);
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testGeminiDirect();
  await testAIResponse();
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAIResponse, testGeminiDirect };
