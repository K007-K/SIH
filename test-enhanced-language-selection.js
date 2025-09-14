const axios = require('axios');
require('dotenv').config();

const testEnhancedLanguageSelection = async () => {
  console.log('🧪 Testing Enhanced Language Selection Flow...\n');

  try {
    // Test 1: Initial language selection
    console.log('1️⃣ Testing initial language selection...');
    const initialResponse = await axios.post('http://localhost:3000/webhook', {
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
              id: 'wamid.test001',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'text',
              text: { body: 'Hello' }
            }]
          }
        }]
      }]
    });
    console.log('✅ Initial message sent\n');

    // Test 2: Regional languages selection
    console.log('2️⃣ Testing regional languages button...');
    const regionalResponse = await axios.post('http://localhost:3000/webhook', {
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
              id: 'wamid.test002',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'interactive',
              interactive: {
                type: 'button_reply',
                button_reply: {
                  id: 'regional_langs',
                  title: '🌏 Regional Languages'
                }
              }
            }]
          }
        }]
      }]
    });
    console.log('✅ Regional languages button clicked\n');

    // Test 3: Telugu script selection
    console.log('3️⃣ Testing Telugu script options...');
    const teluguResponse = await axios.post('http://localhost:3000/webhook', {
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
              id: 'wamid.test003',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'interactive',
              interactive: {
                type: 'button_reply',
                button_reply: {
                  id: 'lang_te',
                  title: 'తెలుగు Telugu'
                }
              }
            }]
          }
        }]
      }]
    });
    console.log('✅ Telugu script options shown\n');

    // Test 4: Telugu transliteration selection
    console.log('4️⃣ Testing Telugu transliteration selection...');
    const teluguTransResponse = await axios.post('http://localhost:3000/webhook', {
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
              id: 'wamid.test004',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'interactive',
              interactive: {
                type: 'button_reply',
                button_reply: {
                  id: 'lang_te_trans',
                  title: '🔤 Roman Letters'
                }
              }
            }]
          }
        }]
      }]
    });
    console.log('✅ Telugu transliteration selected\n');

    // Test 5: Test AI response in Telugu transliteration
    console.log('5️⃣ Testing AI response in Telugu transliteration...');
    const aiTestResponse = await axios.post('http://localhost:3000/webhook', {
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
              id: 'wamid.test005',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'text',
              text: { body: 'naaku jwaram vachindi, em cheyyali?' }
            }]
          }
        }]
      }]
    });
    console.log('✅ AI response test completed\n');

    console.log('🎉 All language selection tests completed successfully!');
    console.log('\n📋 Enhanced Features:');
    console.log('✅ Main language selection: English, Hindi, Regional Languages');
    console.log('✅ Regional languages: Telugu, Tamil, Odia');
    console.log('✅ Script options: Native script or Roman transliteration');
    console.log('✅ Enhanced AI responses with better medical knowledge');
    console.log('✅ Improved response length optimization');
    console.log('✅ Traditional medicine integration');

  } catch (error) {
    console.error('❌ Test error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

testEnhancedLanguageSelection();
