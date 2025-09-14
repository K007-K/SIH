// Test script specifically for Chat with AI button
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const RECIPIENT_NUMBER = '+918977733389';

// Test Chat with AI button click
async function testChatAIButton() {
  console.log('🔍 Testing Chat with AI Button Click');
  console.log('===================================\n');

  const webhookData = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '918977733389',
            phone_number_id: '796180340242168'
          },
          contacts: [{
            profile: {
              name: 'Test User'
            },
            wa_id: RECIPIENT_NUMBER
          }],
          messages: [{
            from: RECIPIENT_NUMBER,
            id: `test_msg_${Date.now()}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            type: 'interactive',
            interactive: {
              type: 'button_reply',
              button_reply: {
                id: 'chat_with_ai',
                title: 'Chat with AI'
              }
            }
          }]
        },
        field: 'messages'
      }]
    }]
  };

  try {
    console.log('📤 Simulating Chat with AI button click...');
    
    const response = await axios.post(`${SERVER_URL}/webhook`, webhookData, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Button click processed');
    console.log('📊 Response status:', response.status);
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🔍 Check server logs for Chat with AI handler response...');
    
  } catch (error) {
    console.error('❌ Error testing Chat with AI button:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run test
if (require.main === module) {
  require('dotenv').config();
  testChatAIButton().catch(console.error);
}

module.exports = { testChatAIButton };
