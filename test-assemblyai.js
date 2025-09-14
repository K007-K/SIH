const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Test AssemblyAI transcription functionality
async function testAssemblyAI() {
  console.log('🎤 Testing AssemblyAI transcription...');
  
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    console.error('❌ ASSEMBLYAI_API_KEY not found in environment');
    return;
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 8) + '...');
  
  try {
    // Create a simple test audio buffer (simulate WhatsApp audio)
    const testAudioBuffer = Buffer.from('test audio data for simulation');
    
    console.log('\n📤 Step 1: Uploading test audio...');
    
    // Upload audio
    const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', testAudioBuffer, {
      headers: {
        'authorization': apiKey,
        'content-type': 'application/octet-stream'
      },
      timeout: 30000
    });
    
    console.log('✅ Upload successful:', uploadResponse.data.upload_url);
    
    // Request transcription
    console.log('\n🔄 Step 2: Requesting transcription...');
    const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
      audio_url: uploadResponse.data.upload_url,
      language_detection: true,
      speech_model: 'best'
    }, {
      headers: {
        'authorization': apiKey,
        'content-type': 'application/json'
      },
      timeout: 10000
    });
    
    const transcriptId = transcriptResponse.data.id;
    console.log('✅ Transcription requested, ID:', transcriptId);
    
    // Poll for completion
    console.log('\n⏳ Step 3: Polling for completion...');
    let transcript;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'authorization': apiKey
        },
        timeout: 10000
      });
      
      transcript = statusResponse.data;
      attempts++;
      
      console.log(`📊 Status check ${attempts}: ${transcript.status}`);
      
      if (transcript.status === 'error') {
        console.error('❌ Transcription error:', transcript.error);
        return;
      }
      
    } while (transcript.status !== 'completed' && attempts < maxAttempts);
    
    if (transcript.status === 'completed') {
      console.log('✅ Transcription completed!');
      console.log('📝 Result:', transcript.text || 'No text detected');
    } else {
      console.log('⏰ Transcription timeout after', attempts, 'attempts');
    }
    
  } catch (error) {
    console.error('❌ AssemblyAI test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Test the fallback system
async function testFallbackSystem() {
  console.log('\n🔄 Testing fallback system...');
  
  try {
    const { transcribeAudio } = require('./utils/aiUtils');
    
    // Create test audio buffer
    const testBuffer = Buffer.from('test audio for fallback');
    
    console.log('🎯 Testing transcribeAudio function...');
    const result = await transcribeAudio(testBuffer, 'audio/ogg');
    
    console.log('✅ Fallback system working!');
    console.log('📝 Result:', result);
    
  } catch (error) {
    console.error('❌ Fallback test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting AssemblyAI Integration Tests\n');
  
  await testAssemblyAI();
  await testFallbackSystem();
  
  console.log('\n✨ Tests completed!');
}

runTests().catch(console.error);
