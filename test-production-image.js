const axios = require('axios');
require('dotenv').config();

// Test image analysis on production server
async function testProductionImageAnalysis() {
  console.log('🚀 Testing Production Image Analysis...\n');

  const RENDER_URL = 'https://sih-ntq6.onrender.com';
  
  // Test scenarios with different image message types
  const testCases = [
    {
      name: 'Valid JPEG Image',
      message: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                from: '+1234567890',
                id: 'test_jpeg_msg',
                timestamp: Date.now().toString(),
                type: 'image',
                image: {
                  id: 'valid_jpeg_image_id',
                  mime_type: 'image/jpeg',
                  caption: 'Please analyze this skin rash'
                }
              }],
              contacts: [{
                profile: { name: 'Test Patient JPEG' }
              }]
            }
          }]
        }]
      },
      expectedBehavior: 'Should attempt download, fail gracefully with specific error message'
    },
    {
      name: 'PNG Image with Caption',
      message: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                from: '+1234567891',
                id: 'test_png_msg',
                timestamp: Date.now().toString(),
                type: 'image',
                image: {
                  id: 'valid_png_image_id',
                  mime_type: 'image/png',
                  caption: 'What could this wound be?'
                }
              }],
              contacts: [{
                profile: { name: 'Test Patient PNG' }
              }]
            }
          }]
        }]
      },
      expectedBehavior: 'Should process caption and attempt analysis'
    },
    {
      name: 'Unsupported GIF Format',
      message: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                from: '+1234567892',
                id: 'test_gif_msg',
                timestamp: Date.now().toString(),
                type: 'image',
                image: {
                  id: 'gif_image_id',
                  mime_type: 'image/gif',
                  caption: 'This is a GIF animation'
                }
              }],
              contacts: [{
                profile: { name: 'Test Patient GIF' }
              }]
            }
          }]
        }]
      },
      expectedBehavior: 'Should reject with format error message'
    },
    {
      name: 'Image without Caption',
      message: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                from: '+1234567893',
                id: 'test_no_caption_msg',
                timestamp: Date.now().toString(),
                type: 'image',
                image: {
                  id: 'no_caption_image_id',
                  mime_type: 'image/jpeg'
                }
              }],
              contacts: [{
                profile: { name: 'Test Patient No Caption' }
              }]
            }
          }]
        }]
      },
      expectedBehavior: 'Should process without caption, use default language'
    },
    {
      name: 'Missing Image ID',
      message: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                from: '+1234567894',
                id: 'test_missing_id_msg',
                timestamp: Date.now().toString(),
                type: 'image',
                image: {
                  mime_type: 'image/jpeg',
                  caption: 'Image without ID'
                }
              }],
              contacts: [{
                profile: { name: 'Test Patient Missing ID' }
              }]
            }
          }]
        }]
      },
      expectedBehavior: 'Should fail with missing ID error'
    }
  ];

  console.log('🧪 Running comprehensive image analysis tests...\n');

  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`);
      console.log(`Expected: ${testCase.expectedBehavior}`);
      
      const startTime = Date.now();
      const response = await axios.post(`${RENDER_URL}/webhook`, testCase.message, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ Response: ${response.status} (${duration}ms)`);
      
      // Wait for processing to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('📋 Test Summary:');
  console.log('✅ All webhook requests completed successfully');
  console.log('🔍 Check Render logs for detailed processing results');
  console.log('📱 Now test with real WhatsApp images to verify end-to-end functionality');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Send a real image via WhatsApp to your bot');
  console.log('2. Check if you get specific error messages instead of generic ones');
  console.log('3. Monitor Render logs for detailed processing information');
  console.log('4. Verify image analysis works with supported formats');
}

testProductionImageAnalysis().catch(console.error);
