const axios = require('axios');

// Test image message with local server
async function testLocalImageMessage() {
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
    console.log('Sending test image message to local server...');
    const response = await axios.post('http://localhost:3001/webhook', imageMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLocalImageMessage();
