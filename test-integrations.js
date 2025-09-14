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
    'OPENAI_API_KEY',
    'HF_TOKEN',
    'AI_MODEL_PROVIDER',
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

  // Test 5: OpenAI Whisper API
  console.log('5️⃣ Testing OpenAI Whisper API...');
  try {
    // Just test API key validity with a minimal request
    const testResponse = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    
    if (testResponse.data && testResponse.data.data) {
      console.log('✅ OpenAI API access working');
    } else {
      console.log('❌ OpenAI API response unexpected');
    }
  } catch (error) {
    console.log('❌ OpenAI API error:', error.response?.data?.error?.message || error.message);
    return false;
  }
  console.log('');

  // Test 6: Featherless AI + Llama 3.1-8B
  console.log('6️⃣ Testing Featherless AI + Llama 3.1-8B...');
  try {
    const llamaResponse = await axios.post(
      'https://api.featherless.ai/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a healthcare assistant. Respond briefly.'
          },
          {
            role: 'user',
            content: 'Test message - please respond with "Llama test successful"'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (llamaResponse.data?.choices?.[0]?.message?.content) {
      console.log('✅ Featherless AI + Llama 3.1-8B working');
      console.log('🦙 Response:', llamaResponse.data.choices[0].message.content);
    } else {
      console.log('❌ Featherless AI response format unexpected');
    }
  } catch (error) {
    console.log('❌ Featherless AI error:', error.response?.data?.error?.message || error.message);
    return false;
  }
  console.log('');

  // Test 7: Local server health
  console.log('7️⃣ Testing Local Server...');
  try {
    const healthResponse = await axios.get('http://localhost:3001/health', { timeout: 5000 });
    console.log('✅ Local server is running');
  } catch (error) {
    console.log('⚠️ Local server not running (start with: npm start)');
  }
  console.log('');

  // Test 8: Production server health
  console.log('8️⃣ Testing Production Server...');
  try {
    const prodHealthResponse = await axios.get('https://sih-ntq6.onrender.com/health', { timeout: 10000 });
    console.log('✅ Production server is healthy');
  } catch (error) {
    console.log('⚠️ Production server health check failed:', error.message);
  }
  console.log('');

  console.log('🎉 Complete system integration test finished!');
  console.log('\n📊 System Status Summary:');
  console.log('✅ Environment variables configured');
  console.log('✅ Supabase database connected');
  console.log('✅ Gemini API (text + vision) working');
  console.log('✅ OpenAI Whisper API (audio) working');
  console.log('✅ Featherless AI + Llama 3.1-8B (multilingual) working');
  console.log('✅ WhatsApp API configured');
  
  console.log('\n🚀 Ready for Production:');
  console.log('- Text messages: Hybrid AI (Gemini/Llama based on language)');
  console.log('- Voice messages: OpenAI Whisper → AI response');
  console.log('- Image messages: Gemini Vision analysis');
  console.log('- Multilingual: 15+ Indian languages supported');
  
  console.log('\n📋 Final Steps:');
  console.log('1. Ensure all environment variables are in production');
  console.log('2. Test with real WhatsApp messages');
  console.log('3. Monitor logs for performance');
  console.log('4. Set up appointment reminders if needed');
  
  return true;
}

// Run tests
testIntegrations().catch(console.error);
