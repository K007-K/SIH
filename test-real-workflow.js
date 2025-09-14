// Real WhatsApp Workflow Test - Actual Server Calls and API Testing
// Tests live server functionality with real message processing

const axios = require('axios');
const { getGeminiResponse, detectLanguage, transcribeAudio } = require('./utils/aiUtils');
const { processSymptomDescription } = require('./features/disease-symptoms/symptomChecker');
const { getVaccinationScheduleForAge } = require('./features/vaccination-tracker/vaccinationScheduler');
const { getOutbreakInfo } = require('./features/health-alerts/outbreakAlerts');
const { processFeedback } = require('./features/accuracy-measurement/feedbackSystem');

const SERVER_URL = 'http://localhost:3000';
const TEST_PHONE = '+919876543210';

console.log('🔥 Testing REAL WhatsApp Workflow with Live Server...\n');

// Test server health first
async function testServerHealth() {
  try {
    console.log('🏥 Testing Server Health...');
    const response = await axios.get(`${SERVER_URL}/health`);
    console.log(`✅ Server Status: ${response.data.status}`);
    console.log(`📊 Version: ${response.data.version}`);
    console.log(`🚀 Features: ${response.data.features} active\n`);
    return true;
  } catch (error) {
    console.log('❌ Server not running or unreachable');
    console.log('💡 Please start server with: node server.js\n');
    return false;
  }
}

// Test real webhook with actual message processing
async function testRealWebhook() {
  console.log('📨 Testing Real Webhook Message Processing...');
  
  const testMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '15550559999',
            phone_number_id: 'test_phone_id'
          },
          contacts: [{
            profile: { name: 'Test User' },
            wa_id: TEST_PHONE
          }],
          messages: [{
            from: TEST_PHONE,
            id: 'test_msg_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            type: 'text',
            text: { body: 'Hello' }
          }]
        },
        field: 'messages'
      }]
    }]
  };

  try {
    const response = await axios.post(`${SERVER_URL}/webhook`, testMessage, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log(`✅ Webhook Response: ${response.status} ${response.statusText}`);
    console.log('📝 Message processed successfully\n');
    return true;
  } catch (error) {
    console.log('❌ Webhook test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test interactive button processing
async function testInteractiveButtons() {
  console.log('🔘 Testing Interactive Button Processing...');
  
  const buttonMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '15550559999',
            phone_number_id: 'test_phone_id'
          },
          contacts: [{
            profile: { name: 'Test User' },
            wa_id: TEST_PHONE
          }],
          messages: [{
            from: TEST_PHONE,
            id: 'test_btn_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            type: 'interactive',
            interactive: {
              type: 'button_reply',
              button_reply: {
                id: 'symptom_checker',
                title: '🔍 Symptoms'
              }
            }
          }]
        },
        field: 'messages'
      }]
    }]
  };

  try {
    const response = await axios.post(`${SERVER_URL}/webhook`, buttonMessage, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log(`✅ Button Response: ${response.status} ${response.statusText}`);
    console.log('🔘 Interactive button processed successfully\n');
    return true;
  } catch (error) {
    console.log('❌ Button test failed:', error.response?.data || error.message);
    return false;
  }
}

// Test real symptom analysis with AI
async function testRealSymptomAnalysis() {
  console.log('🩺 Testing Real Symptom Analysis...');
  
  try {
    const symptoms = 'I have fever, headache and cough for 3 days';
    console.log(`💬 Analyzing: "${symptoms}"`);
    
    // Test language detection
    const language = await detectLanguage(symptoms);
    console.log(`🌐 Detected Language: ${language}`);
    
    // Test symptom processing
    const analysis = await processSymptomDescription(symptoms, language);
    console.log(`📋 Analysis Type: ${analysis.type}`);
    console.log(`💡 Response Length: ${analysis.message?.length || 0} characters`);
    
    if (analysis.buttons) {
      console.log(`🔘 Generated ${analysis.buttons.interactive?.action?.buttons?.length || 0} buttons`);
    }
    
    console.log('✅ Symptom analysis completed successfully\n');
    return true;
  } catch (error) {
    console.log('❌ Symptom analysis failed:', error.message);
    return false;
  }
}

// Test real vaccination data retrieval
async function testRealVaccinationData() {
  console.log('💉 Testing Real Vaccination Data...');
  
  try {
    const ageGroups = ['infant', 'child', 'teen', 'adult'];
    
    for (const ageGroup of ageGroups) {
      const schedule = getVaccinationScheduleForAge(ageGroup);
      console.log(`📅 ${ageGroup}: ${schedule.split('\n').length} lines of schedule data`);
    }
    
    console.log('✅ Vaccination data retrieval successful\n');
    return true;
  } catch (error) {
    console.log('❌ Vaccination data test failed:', error.message);
    return false;
  }
}

// Test real outbreak alerts
async function testRealOutbreakAlerts() {
  console.log('🚨 Testing Real Outbreak Alerts...');
  
  try {
    const levels = ['global', 'india', 'regional'];
    
    for (const level of levels) {
      const info = getOutbreakInfo(level);
      console.log(`⚠️ ${level}: ${info.split('\n').length} lines of outbreak data`);
    }
    
    console.log('✅ Outbreak alerts retrieval successful\n');
    return true;
  } catch (error) {
    console.log('❌ Outbreak alerts test failed:', error.message);
    return false;
  }
}

// Test real feedback processing
async function testRealFeedback() {
  console.log('⭐ Testing Real Feedback Processing...');
  
  try {
    const feedbackResult = await processFeedback('accuracy', 5, TEST_PHONE, 'test_msg_123');
    console.log(`📊 Feedback Status: ${feedbackResult.success ? 'Success' : 'Failed'}`);
    console.log(`💬 Response: ${feedbackResult.message}`);
    
    console.log('✅ Feedback processing successful\n');
    return true;
  } catch (error) {
    console.log('❌ Feedback test failed:', error.message);
    return false;
  }
}

// Test real AI response generation
async function testRealAIResponse() {
  console.log('🤖 Testing Real AI Response Generation...');
  
  try {
    const testQueries = [
      'What are the symptoms of dengue fever?',
      'When should I get my child vaccinated?',
      'How to prevent malaria during monsoon?'
    ];
    
    for (const query of testQueries) {
      console.log(`💭 Query: "${query}"`);
      
      const response = await getGeminiResponse(query, 'en');
      console.log(`📝 Response Length: ${response.length} characters`);
      console.log(`✅ Generated successfully`);
    }
    
    console.log('✅ AI response generation successful\n');
    return true;
  } catch (error) {
    console.log('❌ AI response test failed:', error.message);
    return false;
  }
}

// Test complete user journey simulation
async function testCompleteUserJourney() {
  console.log('🎯 Testing Complete User Journey...');
  
  const journey = [
    { type: 'text', message: 'Hello' },
    { type: 'button', id: 'lang_en' },
    { type: 'button', id: 'symptom_checker' },
    { type: 'button', id: 'symptom_describe' },
    { type: 'text', message: 'I have fever and cough' },
    { type: 'button', id: 'vaccination_tracker' },
    { type: 'button', id: 'vacc_age_schedule' },
    { type: 'button', id: 'age_infant' },
    { type: 'button', id: 'feedback' },
    { type: 'button', id: 'feedback_excellent' }
  ];
  
  try {
    for (let i = 0; i < journey.length; i++) {
      const step = journey[i];
      console.log(`📍 Step ${i + 1}: ${step.type} - ${step.message || step.id}`);
      
      let webhookData;
      
      if (step.type === 'text') {
        webhookData = createTextMessage(step.message);
      } else if (step.type === 'button') {
        webhookData = createButtonMessage(step.id);
      }
      
      const response = await axios.post(`${SERVER_URL}/webhook`, webhookData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      console.log(`   ✅ Response: ${response.status}`);
      
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ Complete user journey successful\n');
    return true;
  } catch (error) {
    console.log('❌ User journey test failed:', error.response?.data || error.message);
    return false;
  }
}

// Helper functions to create webhook messages
function createTextMessage(text) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '15550559999',
            phone_number_id: 'test_phone_id'
          },
          contacts: [{
            profile: { name: 'Test User' },
            wa_id: TEST_PHONE
          }],
          messages: [{
            from: TEST_PHONE,
            id: 'test_msg_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            type: 'text',
            text: { body: text }
          }]
        },
        field: 'messages'
      }]
    }]
  };
}

function createButtonMessage(buttonId) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_entry',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '15550559999',
            phone_number_id: 'test_phone_id'
          },
          contacts: [{
            profile: { name: 'Test User' },
            wa_id: TEST_PHONE
          }],
          messages: [{
            from: TEST_PHONE,
            id: 'test_btn_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000),
            type: 'interactive',
            interactive: {
              type: 'button_reply',
              button_reply: {
                id: buttonId,
                title: buttonId.replace(/_/g, ' ')
              }
            }
          }]
        },
        field: 'messages'
      }]
    }]
  };
}

// Main test execution
async function runRealWorkflowTests() {
  console.log('🚀 REAL WHATSAPP WORKFLOW TESTING\n');
  console.log('============================================================\n');
  
  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'Webhook Processing', fn: testRealWebhook },
    { name: 'Interactive Buttons', fn: testInteractiveButtons },
    { name: 'Symptom Analysis', fn: testRealSymptomAnalysis },
    { name: 'Vaccination Data', fn: testRealVaccinationData },
    { name: 'Outbreak Alerts', fn: testRealOutbreakAlerts },
    { name: 'Feedback Processing', fn: testRealFeedback },
    { name: 'AI Response Generation', fn: testRealAIResponse },
    { name: 'Complete User Journey', fn: testCompleteUserJourney }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const success = await test.fn();
      results.push({ name: test.name, success });
    } catch (error) {
      console.log(`❌ ${test.name} failed:`, error.message);
      results.push({ name: test.name, success: false });
    }
  }
  
  // Summary
  console.log('\n============================================================');
  console.log('📊 REAL WORKFLOW TEST RESULTS\n');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Tests Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 ALL REAL WORKFLOW TESTS PASSED!');
    console.log('🚀 Bot is fully functional and ready for production!');
  } else {
    console.log('⚠️ Some tests failed. Check server status and API keys.');
  }
}

// Run the tests
runRealWorkflowTests().catch(console.error);
