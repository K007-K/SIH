// Test script for specific recipient number +918977733389
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const RECIPIENT_NUMBER = '+918977733389';

// Test with the actual recipient number that should be allowed
async function testSpecificRecipient() {
  console.log('🔍 Testing with Specific Recipient: +918977733389');
  console.log('===============================================\n');

  const webhookData = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '918977733389',
            phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '796180340242168'
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
            type: 'text',
            text: {
              body: 'Hello, I need medical help'
            }
          }]
        },
        field: 'messages'
      }]
    }]
  };

  try {
    console.log(`📤 Sending test message from: ${RECIPIENT_NUMBER}`);
    console.log('📝 Message: "Hello, I need medical help"');
    
    const response = await axios.post(`${SERVER_URL}/webhook`, webhookData, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Webhook processed successfully');
    console.log('📊 Response status:', response.status);
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🔍 Check server logs for AI response...');
    
  } catch (error) {
    console.error('❌ Error testing specific recipient:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Test direct WhatsApp API call with the specific number
async function testDirectWhatsAppAPI() {
  console.log('\n📱 Testing Direct WhatsApp API Call');
  console.log('==================================\n');

  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error('❌ Missing WhatsApp credentials in .env file');
    return;
  }

  try {
    console.log(`📤 Sending test message to: ${RECIPIENT_NUMBER}`);
    
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: RECIPIENT_NUMBER,
        type: 'text',
        text: { 
          body: 'Test message from healthcare bot - AI is working!' 
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Direct WhatsApp API call successful!');
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Direct WhatsApp API call failed:');
    console.error('Error:', error.response?.data?.error || error.message);
    
    if (error.response?.data?.error?.message?.includes('Recipient phone number not in allowed list')) {
      console.log('\n⚠️ The number +918977733389 is NOT properly added to allowed list');
      console.log('🔧 Please verify in Meta Business Manager:');
      console.log('   1. Go to WhatsApp > Phone Numbers');
      console.log('   2. Click your phone number > Manage');
      console.log('   3. Check "Recipient Phone Numbers" section');
      console.log('   4. Ensure +918977733389 is listed and verified');
    }
  }
}

// Run tests
async function runTests() {
  require('dotenv').config();
  
  await testDirectWhatsAppAPI();
  await testSpecificRecipient();
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSpecificRecipient, testDirectWhatsAppAPI };
