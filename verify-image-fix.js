const axios = require('axios');
require('dotenv').config();

// Test the fixed image processing
async function verifyImageFix() {
  console.log('🔧 Verifying Image Processing Fixes...\n');

  // Test with the local server
  const LOCAL_URL = 'http://localhost:3001';
  
  // Test 1: Valid image message structure (will fail at download due to fake ID)
  const validImageMessage = {
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
              id: 'valid_fake_image_id',
              mime_type: 'image/jpeg',
              caption: 'Please analyze this skin condition'
            }
          }],
          contacts: [{
            profile: {
              name: 'Test Patient'
            }
          }]
        }
      }]
    }]
  };

  // Test 2: Unsupported format
  const unsupportedFormatMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          messages: [{
            from: '+1234567890',
            id: 'test_message_id_2',
            timestamp: '1234567890',
            type: 'image',
            image: {
              id: 'unsupported_image_id',
              mime_type: 'image/gif',
              caption: 'This is a GIF file'
            }
          }],
          contacts: [{
            profile: {
              name: 'Test Patient 2'
            }
          }]
        }
      }]
    }]
  };

  // Test 3: Missing image ID
  const missingIdMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          messages: [{
            from: '+1234567890',
            id: 'test_message_id_3',
            timestamp: '1234567890',
            type: 'image',
            image: {
              mime_type: 'image/jpeg',
              caption: 'Image without ID'
            }
          }],
          contacts: [{
            profile: {
              name: 'Test Patient 3'
            }
          }]
        }
      }]
    }]
  };

  const tests = [
    { name: 'Valid Image Message (expect download error)', message: validImageMessage },
    { name: 'Unsupported Format (expect format error)', message: unsupportedFormatMessage },
    { name: 'Missing Image ID (expect ID error)', message: missingIdMessage }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axios.post(`${LOCAL_URL}/webhook`, test.message, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      console.log(`✅ Response: ${response.status}`);
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
  }

  console.log('\n📋 Check server logs for detailed error messages and responses');
  console.log('Expected behaviors:');
  console.log('1. Valid image should show download error with specific message');
  console.log('2. Unsupported format should show format error message');
  console.log('3. Missing ID should show ID error message');
}

verifyImageFix().catch(console.error);
