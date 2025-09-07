const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test script to verify all integrations
async function testIntegrations() {
  console.log('🧪 Testing Healthcare WhatsApp Bot Integrations...\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Testing Environment Variables...');
  const requiredEnvVars = [
    'GEMINI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_WEBHOOK_VERIFY_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:', missingVars.join(', '));
    return false;
  }
  console.log('✅ All environment variables are set\n');

  // Test 2: Supabase Connection
  console.log('2️⃣ Testing Supabase Connection...');
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from('patients')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful\n');
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
    return false;
  }

  // Test 3: Gemini API
  console.log('3️⃣ Testing Gemini API...');
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Hello, this is a test message. Please respond with 'Test successful'."
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0]) {
      console.log('✅ Gemini API connection successful');
      console.log('📝 Response:', response.data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ Gemini API response format unexpected');
      return false;
    }
  } catch (error) {
    console.log('❌ Gemini API error:', error.response?.data?.error?.message || error.message);
    return false;
  }
  console.log('');

  // Test 4: WhatsApp API (Basic check)
  console.log('4️⃣ Testing WhatsApp API Configuration...');
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );

    if (response.data.id) {
      console.log('✅ WhatsApp API configuration valid');
      console.log('📱 Phone Number ID:', response.data.id);
    } else {
      console.log('❌ WhatsApp API configuration invalid');
      return false;
    }
  } catch (error) {
    console.log('❌ WhatsApp API error:', error.response?.data?.error?.message || error.message);
    return false;
  }
  console.log('');

  console.log('🎉 All integrations tested successfully!');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy to Render');
  console.log('2. Set up WhatsApp webhook');
  console.log('3. Test with actual WhatsApp messages');
  console.log('4. Configure appointment reminders');
  
  return true;
}

// Run tests
testIntegrations().catch(console.error);
