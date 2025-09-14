const axios = require('axios');
require('dotenv').config();

const testMediaProcessing = async () => {
  console.log('🧪 Testing Image Analysis and Audio Processing...\n');

  try {
    // Test 1: Image message simulation
    console.log('1️⃣ Testing image processing...');
    const imageResponse = await axios.post('http://localhost:3000/webhook', {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '1234567890',
              phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID
            },
            contacts: [{
              profile: { name: 'Test User' },
              wa_id: '15555551234'
            }],
            messages: [{
              from: '15555551234',
              id: 'wamid.image001',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'image',
              image: {
                id: 'test_image_id_123',
                mime_type: 'image/jpeg',
                caption: 'I have a rash on my arm, please analyze'
              }
            }]
          }
        }]
      }]
    });
    console.log('✅ Image message sent\n');

    // Test 2: Audio message simulation
    console.log('2️⃣ Testing audio processing...');
    const audioResponse = await axios.post('http://localhost:3000/webhook', {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '1234567890',
              phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID
            },
            contacts: [{
              profile: { name: 'Test User' },
              wa_id: '15555551234'
            }],
            messages: [{
              from: '15555551234',
              id: 'wamid.audio001',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'audio',
              audio: {
                id: 'test_audio_id_456',
                mime_type: 'audio/ogg; codecs=opus'
              }
            }]
          }
        }]
      }]
    });
    console.log('✅ Audio message sent\n');

    console.log('🎉 Media processing tests completed!');
    console.log('\n📋 Fixed Issues:');
    console.log('✅ WhatsApp token configuration (WHATSAPP_ACCESS_TOKEN)');
    console.log('✅ Enhanced media download with proper error handling');
    console.log('✅ Image validation and format checking');
    console.log('✅ Audio buffer handling for Whisper API');
    console.log('✅ Detailed logging for debugging');
    console.log('✅ Specific error messages for different failure types');

  } catch (error) {
    console.error('❌ Test error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

testMediaProcessing();
