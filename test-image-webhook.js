const axios = require('axios');
require('dotenv').config();

// Test image webhook with simulated WhatsApp image message
async function testImageWebhook() {
  console.log('🖼️ Testing Image Webhook Processing...\n');

  const RENDER_URL = 'https://sih-ntq6.onrender.com';
  
  // Simulate a WhatsApp image message structure
  const imageMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          messages: [{
            from: '+1234567890',
            id: 'test_message_id',
            timestamp: '1234567890',
            type: 'image',
            image: {
              id: 'test_image_id_123',
              mime_type: 'image/jpeg',
              caption: 'Please analyze this medical image'
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

  try {
    console.log('Sending test image message to webhook...');
    console.log('Message structure:', JSON.stringify(imageMessage, null, 2));
    
    const response = await axios.post(`${RENDER_URL}/webhook`, imageMessage, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Webhook response:', response.status, response.data);
    
    // Wait a bit for processing
    console.log('\nWaiting for processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error('❌ Webhook test failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
}

// Test local server if running
async function testLocalImageWebhook() {
  console.log('🔧 Testing Local Image Webhook...\n');
  
  const LOCAL_URL = 'http://localhost:3000';
  
  const imageMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          messages: [{
            from: '+1234567890',
            id: 'test_message_id',
            timestamp: '1234567890',
            type: 'image',
            image: {
              id: 'test_image_id_123',
              mime_type: 'image/jpeg',
              caption: 'Test medical image analysis'
            }
          }],
          contacts: [{
            profile: {
              name: 'Test User Local'
            }
          }]
        }
      }]
    }]
  };

  try {
    console.log('Testing local server...');
    const response = await axios.post(`${LOCAL_URL}/webhook`, imageMessage, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Local webhook response:', response.status, response.data);
    
  } catch (error) {
    console.log('❌ Local server not running or failed:', error.message);
  }
}

// Instructions
console.log('📝 Image Webhook Test Instructions:');
console.log('1. This will test image message processing');
console.log('2. Check server logs for detailed error information');
console.log('3. The test uses a fake image ID - expect download errors');
console.log('4. Look for specific error messages in the logs\n');

// Run tests
Promise.all([
  testImageWebhook(),
  testLocalImageWebhook()
]).then(() => {
  console.log('\n📋 Next steps:');
  console.log('1. Check your server logs for detailed error messages');
  console.log('2. Look for "Raw image message received" logs');
  console.log('3. Check if the error is in image download or Gemini API');
  console.log('4. Test with a real WhatsApp image message');
}).catch(console.error);
