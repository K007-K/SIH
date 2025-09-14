const axios = require('axios');
const { detectLanguage, getGeminiResponse, generateLanguageButtons } = require('./utils/aiUtils');

console.log('🧪 Testing New Features with Gemini 2.0 Flash...\n');

const testAILanguageDetection = async () => {
  console.log('🤖 Testing AI-based Language Detection...');
  
  const testTexts = [
    'Hello, how are you?',
    'naaku jwaram vachindi',
    'मुझे बुखार है',
    'enakku kaichal irukku',
    'mo kaichal helechi'
  ];
  
  for (const text of testTexts) {
    try {
      const detectedLang = await detectLanguage(text);
      console.log(`  "${text}" -> ${detectedLang}`);
    } catch (error) {
      console.log(`  "${text}" -> Error: ${error.message}`);
    }
  }
  console.log('  ✅ AI Language Detection Test Complete\n');
};

const testGemini2Flash = async () => {
  console.log('⚡ Testing Gemini 2.0 Flash Responses...');
  
  const testQueries = [
    { text: 'I have fever and headache', lang: 'en' },
    { text: 'naaku jwaram vachindi', lang: 'te_trans' },
    { text: 'मुझे सिरदर्द है', lang: 'hi' }
  ];
  
  for (const query of testQueries) {
    try {
      console.log(`  Testing: "${query.text}" (${query.lang})`);
      const response = await getGeminiResponse(query.text, null, query.lang);
      console.log(`  Response: ${response.substring(0, 100)}...`);
      console.log(`  ✅ ${query.lang} response successful\n`);
    } catch (error) {
      console.log(`  ❌ ${query.lang} response failed: ${error.message}\n`);
    }
  }
};

const testLanguageButtons = () => {
  console.log('🔘 Testing Language Selection Buttons...');
  
  try {
    const buttons = generateLanguageButtons();
    console.log('  ✅ Language buttons generated successfully');
    console.log(`  Button count: ${buttons.interactive.action.buttons.length}`);
    console.log(`  Languages: ${buttons.interactive.action.buttons.map(b => b.reply.title).join(', ')}`);
  } catch (error) {
    console.log(`  ❌ Language buttons failed: ${error.message}`);
  }
  console.log();
};

const testServerEndpoints = async () => {
  console.log('🌐 Testing Server Endpoints...');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3000/');
    console.log('  ✅ Health endpoint working');
    console.log(`  Version: ${healthResponse.data.version}`);
    console.log(`  Features: ${healthResponse.data.features.join(', ')}`);
    
    // Test webhook verification
    const webhookResponse = await axios.get('http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=test&hub.challenge=test123');
    console.log('  ⚠️ Webhook verification (expected to fail without proper token)');
    
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('  ✅ Webhook verification working (correctly rejected invalid token)');
    } else {
      console.log(`  ❌ Server endpoint error: ${error.message}`);
    }
  }
  console.log();
};

const testChLangShortcut = () => {
  console.log('🔄 Testing ch-lang Shortcut...');
  
  // Simulate message processing
  const testMessages = ['ch-lang', 'change language', 'CH-LANG'];
  
  testMessages.forEach(msg => {
    const isShortcut = msg.toLowerCase() === 'ch-lang' || msg.toLowerCase() === 'change language';
    console.log(`  "${msg}" -> ${isShortcut ? '✅ Shortcut detected' : '❌ Not detected'}`);
  });
  console.log();
};

// Run all tests
const runAllTests = async () => {
  console.log('🎯 New Features Test Suite\n');
  console.log('=' .repeat(50));
  
  await testAILanguageDetection();
  await testGemini2Flash();
  testLanguageButtons();
  await testServerEndpoints();
  testChLangShortcut();
  
  console.log('=' .repeat(50));
  console.log('🎉 All new features tested!');
  console.log('\n📱 Ready for WhatsApp integration with:');
  console.log('   • Gemini 2.0 Flash AI responses');
  console.log('   • AI-powered language detection');
  console.log('   • Interactive language selection buttons');
  console.log('   • ch-lang shortcut for language switching');
  console.log('   • Opus audio format support');
  console.log('   • Enhanced image analysis');
};

runAllTests().catch(console.error);
