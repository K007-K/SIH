const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Import language detection from aiUtils
const { detectLanguage } = require('./utils/aiUtils');

// Test cases
const testCases = [
  "मुझे सिरदर्द है", // Hindi Devanagari
  "main hain", // Hinglish
  "naan fever vandhudhu", // Tamil Romanized
  "nuvvu ela unnaru", // Telugu Romanized
  "ami bhalo achi", // Bengali Romanized
  "mi thik ahe", // Marathi Romanized
  "naanu chennagiddene", // Kannada Romanized
  "hu majama chhu", // Gujarati Romanized
  "naan nalla irukken", // Malayalam Romanized
  "mu bhala achi", // Odia Romanized
  "mai theek haan", // Punjabi Romanized
  "moi bhal aasu", // Assamese Romanized
  "main theek hun", // Urdu Romanized
  "am bhalo achi", // Santali Romanized
  "I have a headache", // English
  "Hello world", // English fallback
];

console.log('🌐 Testing Multilingual Language Detection...\n');

testCases.forEach((text, index) => {
  const detectedLang = detectLanguage(text);
  console.log(`${index + 1}. "${text}" → ${detectedLang}`);
});

console.log('\n✅ Multilingual language detection test completed!');
