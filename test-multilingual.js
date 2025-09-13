const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Enhanced language detection function with 15+ Indian languages
const detectLanguage = (text) => {
  // Unicode ranges for Indian scripts + Romanized patterns
  const scripts = {
    // Hindi (Devanagari) + Hinglish
    hi: [/[\u0900-\u097F]/, /\b(main|hain|hai|nahi|kyun|kaise|kya|bhai|didi|mama|papa|ghar|desh|bhasha|hindi)\b/i],
    
    // Telugu
    te: [/[\u0C00-\u0C7F]/, /\b(nuvvu|memu|vallu|aame|okka|rendu|muddu|amma|nanna|telugu|andhra)\b/i],
    
    // Tamil
    ta: [/[\u0B80-\u0BFF]/, /\b(naan|neenga|avanga|ungal|tamil|chennai|madurai|coimbatore)\b/i],
    
    // Bengali
    bn: [/[\u0980-\u09FF]/, /\b(ami|tumi|se|bangla|kolkata|dhaka|chanda|bhalo)\b/i],
    
    // Marathi
    mr: [/\b(mi|tu|to|mala|tula|mumbai|maharashtra|marathi|pune|nagpur)\b/i],
    
    // Kannada
    kn: [/[\u0C80-\u0CFF]/, /\b(naanu|neenu|avaru|namma|kannada|bangalore|mysore|hubli)\b/i],
    
    // Gujarati
    gu: [/[\u0A80-\u0AFF]/, /\b(hu|tu|te|mara|tara|gujarati|ahmedabad|surat|vadodara)\b/i],
    
    // Malayalam
    ml: [/[\u0D00-\u0D7F]/, /\b(naan|nee|avar|njangal|malayalam|kerala|kochi|thiruvananthapuram)\b/i],
    
    // Odia
    or: [/[\u0B00-\u0B7F]/, /\b(mu|tume|se|odia|orissa|bhubaneswar|cuttack)\b/i],
    
    // Punjabi (Gurmukhi)
    pa: [/[\u0A00-\u0A7F]/, /\b(mai|tu|oh|sada|tuhada|punjabi|chandigarh|amritsar|ludhiana)\b/i],
    
    // Assamese
    as: [/[\u0980-\u09FF]/, /\b(moi|tumi|te|amar|tomar|assamese|guwahati|dibrugarh)\b/i],
    
    // Urdu (Arabic script)
    ur: [/[\u0600-\u06FF]/, /\b(main|aap|woh|hamara|tumhara|urdu|lahore|karachi|islamabad)\b/i],
    
    // Santali (Ol Chiki)
    sat: [/[\u1C50-\u1C7F]/, /\b(am|bona|uni|santali|jorhat|tata|jamshedpur)\b/i]
  };
  
  // Check for script patterns first
  for (const [lang, patterns] of Object.entries(scripts)) {
    if (patterns[0] && patterns[0].test(text)) {
      return lang;
    }
  }
  
  // Check for Romanized patterns
  for (const [lang, patterns] of Object.entries(scripts)) {
    if (patterns[1] && patterns[1].test(text)) {
      return lang;
    }
  }
  
  // Default to English
  return 'en';
};

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
