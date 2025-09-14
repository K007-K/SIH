const axios = require('axios');
require('dotenv').config();

// Quick system status check
async function checkSystemStatus() {
  console.log('🔍 Quick System Status Check...\n');

  // Check environment variables
  const envVars = {
    'GEMINI_API_KEY': !!process.env.GEMINI_API_KEY,
    'OPENAI_API_KEY': !!process.env.OPENAI_API_KEY,
    'HF_TOKEN': !!process.env.HF_TOKEN,
    'AI_MODEL_PROVIDER': process.env.AI_MODEL_PROVIDER || 'not set',
    'SUPABASE_URL': !!process.env.SUPABASE_URL,
    'WHATSAPP_ACCESS_TOKEN': !!process.env.WHATSAPP_ACCESS_TOKEN
  };

  console.log('📋 Environment Variables Status:');
  Object.entries(envVars).forEach(([key, value]) => {
    const status = typeof value === 'boolean' ? (value ? '✅' : '❌') : `✅ (${value})`;
    console.log(`  ${status} ${key}`);
  });

  // Quick API tests
  console.log('\n🔗 API Connectivity:');
  
  // Test production server
  try {
    const response = await axios.get('https://sih-ntq6.onrender.com/health', { timeout: 10000 });
    console.log('  ✅ Production server: Online');
  } catch (error) {
    console.log('  ❌ Production server: Offline');
  }

  // Test Gemini if key exists
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: "Test" }] }]
        },
        { timeout: 10000 }
      );
      console.log('  ✅ Gemini API: Working');
    } catch (error) {
      console.log('  ❌ Gemini API: Error');
    }
  }

  // Test OpenAI if key exists
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        timeout: 10000
      });
      console.log('  ✅ OpenAI API: Working');
    } catch (error) {
      console.log('  ❌ OpenAI API: Error');
    }
  }

  // Test Featherless AI if token exists
  if (process.env.HF_TOKEN) {
    try {
      const response = await axios.post(
        'https://api.featherless.ai/v1/chat/completions',
        {
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10
        },
        {
          headers: { 'Authorization': `Bearer ${process.env.HF_TOKEN}` },
          timeout: 15000
        }
      );
      console.log('  ✅ Featherless AI: Working');
    } catch (error) {
      console.log('  ❌ Featherless AI: Error');
    }
  }

  console.log('\n🎯 System Capabilities:');
  console.log('  📝 Text messages: Ready');
  console.log('  🎤 Voice messages: ' + (process.env.OPENAI_API_KEY ? 'Ready' : 'Needs OPENAI_API_KEY'));
  console.log('  🖼️ Image analysis: Ready');
  console.log('  🌍 Multilingual: ' + (process.env.HF_TOKEN ? 'Ready' : 'Needs HF_TOKEN'));
  console.log('  🔄 Hybrid AI: ' + (process.env.AI_MODEL_PROVIDER ? 'Ready' : 'Needs AI_MODEL_PROVIDER'));

  console.log('\n📱 Ready for WhatsApp testing!');
}

checkSystemStatus().catch(console.error);
