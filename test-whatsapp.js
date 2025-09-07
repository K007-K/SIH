const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test WhatsApp message processing
async function testWhatsAppMessage() {
  console.log('🧪 Testing WhatsApp Message Processing...\n');

  try {
    // Test 1: Send a test message to webhook
    console.log('1️⃣ Sending test message to webhook...');
    
    const testMessage = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          field: 'messages',
          value: {
            messages: [{
              from: '+1234567890',
              type: 'text',
              text: {
                body: 'I have a fever and headache, what should I do?'
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

    const response = await axios.post('http://localhost:3000/webhook', testMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('✅ Webhook processed message successfully');
    } else {
      console.log('❌ Webhook failed:', response.status);
      return false;
    }

    // Test 2: Check if patient was created/updated
    console.log('\n2️⃣ Checking patient data...');
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('phone_number', '+1234567890')
      .single();

    if (patientError) {
      console.log('❌ Error fetching patient:', patientError.message);
      return false;
    }

    console.log('✅ Patient found:', patient.name);

    // Test 3: Check if chat session was created
    console.log('\n3️⃣ Checking chat session...');
    
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('patient_id', patient.id)
      .order('session_start', { ascending: false })
      .limit(1)
      .single();

    if (sessionError) {
      console.log('❌ Error fetching chat session:', sessionError.message);
      return false;
    }

    console.log('✅ Chat session created:', chatSession.id);

    // Test 4: Check if message was saved
    console.log('\n4️⃣ Checking saved messages...');
    
    const { data: messages, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_session_id', chatSession.id)
      .order('created_at', { ascending: false });

    if (messageError) {
      console.log('❌ Error fetching messages:', messageError.message);
      return false;
    }

    if (messages.length > 0) {
      console.log('✅ Messages saved:', messages.length);
      console.log('📝 Latest message:', messages[0].content);
      if (messages[0].ai_response) {
        console.log('🤖 AI Response:', messages[0].ai_response.substring(0, 100) + '...');
      }
    } else {
      console.log('❌ No messages found');
      return false;
    }

    // Test 5: Test Gemini API directly
    console.log('\n5️⃣ Testing Gemini API directly...');
    
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "You are a healthcare assistant. A patient says: 'I have a fever and headache, what should I do?' Provide helpful medical advice."
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (geminiResponse.data.candidates && geminiResponse.data.candidates[0]) {
      console.log('✅ Gemini API working');
      console.log('🤖 Sample response:', geminiResponse.data.candidates[0].content.parts[0].text.substring(0, 100) + '...');
    } else {
      console.log('❌ Gemini API failed');
      return false;
    }

    console.log('\n🎉 All tests passed! The bot is working correctly.');
    console.log('\n📋 What was tested:');
    console.log('✅ Webhook message processing');
    console.log('✅ Patient creation/retrieval');
    console.log('✅ Chat session management');
    console.log('✅ Message storage');
    console.log('✅ Gemini AI integration');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testWhatsAppMessage().catch(console.error);
