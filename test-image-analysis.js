const axios = require('axios');
require('dotenv').config();

// Test image analysis functionality
async function testImageAnalysis() {
  console.log('🖼️ Testing Image Analysis Functionality...\n');

  // Test 1: Check Gemini API key
  console.log('1️⃣ Testing Gemini API access...');
  try {
    const testPrompt = 'Hello, can you respond with "API working"?';
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: testPrompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (response.data.candidates && response.data.candidates.length > 0) {
      console.log('✅ Gemini API access working');
      console.log('Response:', response.data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ No response from Gemini API');
      return false;
    }
  } catch (error) {
    console.log('❌ Gemini API test failed:', error.response?.data || error.message);
    return false;
  }

  // Test 2: Test Vision API with sample image
  console.log('\n2️⃣ Testing Gemini Vision API...');
  try {
    // Create a simple test image (1x1 pixel red image in base64)
    const testImageBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
    
    const visionResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: 'Describe what you see in this image.' },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: testImageBase64
              }
            }
          ]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (visionResponse.data.candidates && visionResponse.data.candidates.length > 0) {
      console.log('✅ Gemini Vision API working');
      console.log('Vision response:', visionResponse.data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ No response from Gemini Vision API');
      return false;
    }
  } catch (error) {
    console.log('❌ Gemini Vision API test failed:', error.response?.data || error.message);
    return false;
  }

  // Test 3: Test WhatsApp image URL access
  console.log('\n3️⃣ Testing WhatsApp API access...');
  try {
    const testUrl = `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;
    const whatsappResponse = await axios.get(testUrl, {
      headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` }
    });
    
    console.log('✅ WhatsApp API access working');
    console.log('Phone number info:', whatsappResponse.data.display_phone_number);
  } catch (error) {
    console.log('❌ WhatsApp API test failed:', error.response?.status, error.response?.data || error.message);
    return false;
  }

  console.log('\n🎉 All image analysis components are working!');
  console.log('\n📋 If images still not working, check:');
  console.log('1. Image format (JPEG, PNG, WebP only)');
  console.log('2. Image size (should be < 5MB)');
  console.log('3. WhatsApp webhook is receiving image messages');
  console.log('4. Check server logs for detailed error messages');
  
  return true;
}

// Test environment variables
function checkEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  const requiredVars = [
    'GEMINI_API_KEY',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY'
  ];

  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Present (${process.env[varName].substring(0, 10)}...)`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });

  return allPresent;
}

// Run tests
async function runTests() {
  console.log('🧪 Healthcare Bot Image Analysis Test Suite\n');
  
  if (!checkEnvironmentVariables()) {
    console.log('\n❌ Missing required environment variables. Please check your .env file.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testImageAnalysis();
}

runTests().catch(console.error);
