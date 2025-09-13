const axios = require('axios');
require('dotenv').config();

// Replace with your actual Render URL
const RENDER_URL = 'https://sih-ntq6.onrender.com';

async function testDeployedWebhook() {
  console.log('🧪 Testing Deployed WhatsApp Webhook...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${RENDER_URL}/`);
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test 2: Webhook verification
    console.log('\n2️⃣ Testing webhook verification...');
    const verifyResponse = await axios.get(`${RENDER_URL}/webhook`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
        'hub.challenge': 'test123'
      }
    });
    
    if (verifyResponse.data === 'test123') {
      console.log('✅ Webhook verification working');
    } else {
      console.log('❌ Webhook verification failed');
      return false;
    }

    // Test 3: Send test message
    console.log('\n3️⃣ Testing message processing...');
    const testMessage = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          field: 'messages',
          value: {
            messages: [{
              from: '+1234567890',
              type: 'text',
              text: {
                body: 'Test message from deployed server'
              }
            }],
            contacts: [{
              profile: {
                name: 'Test User'
              }
            }]
          }
        }]
      }]
    };

    const messageResponse = await axios.post(`${RENDER_URL}/webhook`, testMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (messageResponse.status === 200) {
      console.log('✅ Message processing endpoint working');
    } else {
      console.log('❌ Message processing failed');
      return false;
    }

    console.log('\n🎉 Deployed webhook is working correctly!');
    console.log('\n📋 Next steps:');
    console.log('1. Update Meta Developer Console webhook URL to:', `${RENDER_URL}/webhook`);
    console.log('2. Ensure webhook fields include "messages"');
    console.log('3. Test with real WhatsApp message');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Instructions for user
console.log('📝 INSTRUCTIONS:');
console.log('1. Replace RENDER_URL with your actual Render app URL');
console.log('2. Run: node test-deployed-webhook.js');
console.log('3. Update Meta Developer Console with the webhook URL\n');

testDeployedWebhook().catch(console.error);
