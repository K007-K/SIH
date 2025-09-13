const axios = require('axios');

class TranslationService {
  constructor() {
    this.huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    
    // Fallback to simple pattern matching if HF is unavailable
    this.fallbackEnabled = true;
  }

  // Enhanced language detection with Hugging Face models
  async detectLanguage(text) {
    try {
      // Try Hugging Face language detection first
      if (this.huggingFaceApiKey) {
        const detectedLang = await this.detectLanguageHF(text);
        if (detectedLang) return detectedLang;
      }
    } catch (error) {
      console.log('HF language detection failed, using fallback:', error.message);
    }

    // Fallback to pattern matching
    return this.detectLanguagePattern(text);
  }

  // Hugging Face language detection
  async detectLanguageHF(text) {
    const response = await axios.post(
      `${this.baseUrl}/papluca/xlm-roberta-base-language-detection`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const predictions = response.data;
    if (predictions && predictions.length > 0) {
      const topPrediction = predictions[0];
      const langCode = topPrediction.label;
      
      // Map HF language codes to our internal codes
      const langMap = {
        'hi': 'hi', 'en': 'en', 'ta': 'ta', 'te': 'te', 'bn': 'bn',
        'mr': 'mr', 'kn': 'kn', 'gu': 'gu', 'ml': 'ml', 'or': 'or',
        'pa': 'pa', 'as': 'as', 'ur': 'ur'
      };
      
      return langMap[langCode] || 'en';
    }
    return null;
  }

  // Pattern-based language detection (fallback)
  detectLanguagePattern(text) {
    const scripts = {
      hi: [/[\u0900-\u097F]/, /\b(main|hain|hai|nahi|kyun|kaise|kya|bhai|didi|mama|papa|ghar|desh|bhasha|hindi)\b/i],
      te: [/[\u0C00-\u0C7F]/, /\b(nuvvu|memu|vallu|aame|okka|rendu|muddu|amma|nanna|telugu|andhra)\b/i],
      ta: [/[\u0B80-\u0BFF]/, /\b(naan|neenga|avanga|ungal|tamil|chennai|madurai|coimbatore)\b/i],
      bn: [/[\u0980-\u09FF]/, /\b(ami|tumi|se|bangla|kolkata|dhaka|chanda|bhalo)\b/i],
      mr: [/\b(mi|tu|to|mala|tula|mumbai|maharashtra|marathi|pune|nagpur)\b/i],
      kn: [/[\u0C80-\u0CFF]/, /\b(naanu|neenu|avaru|namma|kannada|bangalore|mysore|hubli)\b/i],
      gu: [/[\u0A80-\u0AFF]/, /\b(hu|tu|te|mara|tara|gujarati|ahmedabad|surat|vadodara)\b/i],
      ml: [/[\u0D00-\u0D7F]/, /\b(naan|nee|avar|njangal|malayalam|kerala|kochi|thiruvananthapuram)\b/i],
      or: [/[\u0B00-\u0B7F]/, /\b(mu|tume|se|odia|orissa|bhubaneswar|cuttack)\b/i],
      pa: [/[\u0A00-\u0A7F]/, /\b(mai|tu|oh|sada|tuhada|punjabi|chandigarh|amritsar|ludhiana)\b/i],
      as: [/[\u0980-\u09FF]/, /\b(moi|tumi|te|amar|tomar|assamese|guwahati|dibrugarh)\b/i],
      ur: [/[\u0600-\u06FF]/, /\b(main|aap|woh|hamara|tumhara|urdu|lahore|karachi|islamabad)\b/i],
      sat: [/[\u1C50-\u1C7F]/, /\b(am|bona|uni|santali|jorhat|tata|jamshedpur)\b/i]
    };
    
    for (const [lang, patterns] of Object.entries(scripts)) {
      if (patterns[0] && patterns[0].test(text)) return lang;
    }
    
    for (const [lang, patterns] of Object.entries(scripts)) {
      if (patterns[1] && patterns[1].test(text)) return lang;
    }
    
    return 'en';
  }

  // Translate text using Hugging Face models
  async translateText(text, targetLang) {
    try {
      if (this.huggingFaceApiKey) {
        return await this.translateWithHF(text, targetLang);
      }
    } catch (error) {
      console.log('HF translation failed, using fallback:', error.message);
    }

    // Fallback: return original text with language-specific instructions
    return text;
  }

  // Hugging Face translation
  async translateWithHF(text, targetLang) {
    // Use appropriate translation model based on target language
    const modelMap = {
      'hi': 'Helsinki-NLP/opus-mt-en-hi',
      'ta': 'Helsinki-NLP/opus-mt-en-ta', 
      'te': 'Helsinki-NLP/opus-mt-en-te',
      'bn': 'Helsinki-NLP/opus-mt-en-bn',
      'mr': 'Helsinki-NLP/opus-mt-en-mr',
      'kn': 'Helsinki-NLP/opus-mt-en-kn',
      'gu': 'Helsinki-NLP/opus-mt-en-gu',
      'ml': 'Helsinki-NLP/opus-mt-en-ml',
      'or': 'Helsinki-NLP/opus-mt-en-or',
      'pa': 'Helsinki-NLP/opus-mt-en-pa',
      'as': 'Helsinki-NLP/opus-mt-en-as',
      'ur': 'Helsinki-NLP/opus-mt-en-ur'
    };

    const model = modelMap[targetLang];
    if (!model) return text; // No translation needed for English or unsupported languages

    const response = await axios.post(
      `${this.baseUrl}/${model}`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${this.huggingFaceApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0].translation_text || text;
    }
    
    return text;
  }

  // Create healthcare prompt with translation support
  async createHealthcarePrompt(userMessage, patient, detectedLanguage) {
    const languageInstructions = {
      'hi': 'Respond in Hindi (हिंदी). Use simple, clear Hindi that rural populations can understand.',
      'te': 'Respond in Telugu (తెలుగు). Use simple, clear Telugu that rural populations can understand.',
      'ta': 'Respond in Tamil (தமிழ்). Use simple, clear Tamil that rural populations can understand.',
      'bn': 'Respond in Bengali (বাংলা). Use simple, clear Bengali that rural populations can understand.',
      'mr': 'Respond in Marathi (मराठी). Use simple, clear Marathi that rural populations can understand.',
      'kn': 'Respond in Kannada (ಕನ್ನಡ). Use simple, clear Kannada that rural populations can understand.',
      'gu': 'Respond in Gujarati (ગુજરાતી). Use simple, clear Gujarati that rural populations can understand.',
      'ml': 'Respond in Malayalam (മലയാളം). Use simple, clear Malayalam that rural populations can understand.',
      'or': 'Respond in Odia (ଓଡ଼ିଆ). Use simple, clear Odia that rural populations can understand.',
      'pa': 'Respond in Punjabi (ਪੰਜਾਬੀ). Use simple, clear Punjabi that rural populations can understand.',
      'as': 'Respond in Assamese (অসমীয়া). Use simple, clear Assamese that rural populations can understand.',
      'ur': 'Respond in Urdu (اردو). Use simple, clear Urdu that rural populations can understand.',
      'sat': 'Respond in Santali (ᱥᱟᱱᱛᱟᱲᱤ). Use simple, clear Santali that rural populations can understand.',
      'en': 'Respond in English. Use simple, clear English that rural populations can understand.'
    };

    const safetyDisclaimer = {
      'hi': 'यदि आपको गंभीर लक्षण हैं, तो तुरंत अपने स्थानीय स्वास्थ्य केंद्र या आपातकालीन नंबर पर कॉल करें।',
      'ta': 'உங்களுக்கு கடுமையான அறிகுறிகள் இருந்தால், உடனடியாக உங்கள் உள்ளூர் சுகாதார மையம் அல்லது அவசர எண்ணை அழைக்கவும்.',
      'te': 'మీకు తీవ్రమైన లక్షణాలు ఉంటే, వెంటనే మీ స్థానిక ఆరోగ్య కేంద్రం లేదా అత్యవసర నంబర్‌కు కాల్ చేయండి.',
      'bn': 'যদি আপনার গুরুতর লক্ষণ থাকে, তাহলে অবিলম্বে আপনার স্থানীয় স্বাস্থ্য কেন্দ্র বা জরুরি নম্বরে কল করুন।',
      'mr': 'तुम्हाला गंभीर लक्षणे असल्यास, त्वरित तुमच्या स्थानिक आरोग्य केंद्र किंवा आपत्कालीन नंबरवर कॉल करा.',
      'kn': 'ನಿಮಗೆ ತೀವ್ರ ಲಕ್ಷಣಗಳು ಇದ್ದರೆ, ತಕ್ಷಣ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಅಥವಾ ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ.',
      'gu': 'જો તમને ગંભીર લક્ષણો છે, તો તરત જ તમારા સ્થાનિક આરોગ્ય કેન્દ્ર અથવા આપત્તિકાળીન નંબર પર કૉલ કરો.',
      'ml': 'നിങ്ങൾക്ക് ഗുരുതരമായ ലക്ഷണങ്ങൾ ഉണ്ടെങ്കിൽ, ഉടനെ നിങ്ങളുടെ പ്രാദേശിക ആരോഗ്യ കേന്ദ്രം അല്ലെങ്കിൽ അടിയന്തിര നമ്പറിൽ വിളിക്കുക.',
      'or': 'ଯଦି ଆପଣଙ୍କର ଗୁରୁତର ଲକ୍ଷଣ ଅଛି, ତେବେ ତୁରନ୍ତ ଆପଣଙ୍କର ସ୍ଥାନୀୟ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର କିମ୍ବା ଜରୁରୀ ନମ୍ବରରେ କଲ୍ କରନ୍ତୁ।',
      'pa': 'ਜੇ ਤੁਹਾਨੂੰ ਗੰਭੀਰ ਲੱਛਣ ਹਨ, ਤਾਂ ਤੁਰੰਤ ਆਪਣੇ ਸਥਾਨਕ ਸਿਹਤ ਕੇਂਦਰ ਜਾਂ ਐਮਰਜੈਂਸੀ ਨੰਬਰ ਤੇ ਕਾਲ ਕਰੋ।',
      'as': 'যদি আপোনাৰ গুৰুতৰ লক্ষণ আছে, তেন্তে তৎক্ষণাত আপোনাৰ স্থানীয় স্বাস্থ্য কেন্দ্ৰ বা জৰুৰী নম্বৰত কল কৰক।',
      'ur': 'اگر آپ کو شدید علامات ہیں، تو فوری طور پر اپنے مقامی صحت مرکز یا ایمرجنسی نمبر پر کال کریں۔',
      'sat': 'ଯଦି ଆପଣଙ୍କର ଗୁରୁତର ଲକ୍ଷଣ ଅଛି, ତେବେ ତୁରନ୍ତ ଆପଣଙ୍କର ସ୍ଥାନୀୟ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର କିମ୍ବା ଜରୁରୀ ନମ୍ବରରେ କଲ୍ କରନ୍ତୁ।',
      'en': 'If you have severe symptoms, please call your local health center or emergency number immediately.'
    };

    const unrelatedTopicResponse = {
      'hi': 'मैं केवल बीमारियों, रोकथाम, टीकाकरण और सुरक्षा से संबंधित स्वास्थ्य प्रश्नों में मदद कर सकता हूँ। कृपया मुझे उनके बारे में पूछें।',
      'ta': 'நான் நோய்கள், தடுப்பு, தடுப்பூசி மற்றும் பாதுகாப்பு தொடர்பான சுகாதார கேள்விகளுக்கு மட்டுமே உதவ முடியும். தயவுசெய்து அவற்றைப் பற்றி என்னிடம் கேளுங்கள்.',
      'te': 'నేను వ్యాధులు, నివారణ, టీకాలు మరియు భద్రతకు సంబంధించిన ఆరోగ్య ప్రశ్నలకు మాత్రమే సహాయం చేయగలను. దయచేచేసి వాటి గురించి నన్ను అడగండి.',
      'bn': 'আমি শুধুমাত্র রোগ, প্রতিরোধ, টিকাকরণ এবং নিরাপত্তা সম্পর্কিত স্বাস্থ্য প্রশ্নগুলিতে সাহায্য করতে পারি। দয়া করে আমাকে সে সম্পর্কে জিজ্ঞাসা করুন।',
      'mr': 'मी फक्त रोग, प्रतिबंध, लसीकरण आणि सुरक्षा यांच्याशी संबंधित आरोग्य प्रश्नांमध्ये मदत करू शकतो. कृपया त्यांच्याबद्दल मला विचारा.',
      'kn': 'ನಾನು ಕೇವಲ ರೋಗಗಳು, ತಡೆಗಟ್ಟುವಿಕೆ, ಲಸಿಕೆ ಮತ್ತು ಸುರಕ್ಷತೆಗೆ ಸಂಬಂಧಿಸಿದ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ದಯವಿಟ್ಟು ಅವುಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.',
      'gu': 'હું ફક્ત રોગો, અટકાવ, રસીકરણ અને સલામતી સંબંધિત આરોગ્ય પ્રશ્નોમાં મદદ કરી શકું છું. કૃપા કરીને તેમના વિશે મને પૂછો.',
      'ml': 'ഞാൻ രോഗങ്ങൾ, തടയൽ, വാക്സിനേഷൻ, സുരക്ഷ എന്നിവയുമായി ബന്ധപ്പെട്ട ആരോഗ്യ ചോദ്യങ്ങളിൽ മാത്രമേ സഹായിക്കാൻ കഴിയൂ. ദയവായി അവയെക്കുറിച്ച് എന്നോട് ചോദിക്കുക.',
      'or': 'ମୁଁ କେବଳ ରୋଗ, ପ୍ରତିରୋଧ, ଟିକାକରଣ ଏବଂ ସୁରକ୍ଷା ସମ୍ବନ୍ଧୀୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନରେ ସାହାଯ୍ୟ କରିପାରିବି। ଦୟାକରି ସେମାନଙ୍କ ବିଷୟରେ ମୋତେ ପଚାରନ୍ତୁ।',
      'pa': 'ਮੈਂ ਸਿਰਫ਼ ਬੀਮਾਰੀਆਂ, ਰੋਕਥਾਮ, ਟੀਕਾਕਰਣ ਅਤੇ ਸੁਰੱਖਿਆ ਨਾਲ ਸਬੰਧਤ ਸਿਹਤ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਉਹਨਾਂ ਬਾਰੇ ਮੈਨੂੰ ਪੁੱਛੋ।',
      'as': 'মই কেৱল ৰোগ, প্ৰতিৰোধ, টিকাকৰণ আৰু নিৰাপত্তা সম্পৰ্কীয় স্বাস্থ্য প্ৰশ্নত সহায় কৰিব পাৰো। অনুগ্ৰহ কৰি সেইবোৰৰ বিষয়ে মোক সুধিব।',
      'ur': 'میں صرف بیماریوں، روک تھام، ٹیکہ کاری اور حفاظت سے متعلق صحت کے سوالات میں مدد کر سکتا ہوں۔ برائے کرم ان کے بارے میں مجھ سے پوچھیں۔',
      'sat': 'ମୁଁ କେବଳ ରୋଗ, ପ୍ରତିରୋଧ, ଟିକାକରଣ ଏବଂ ସୁରକ୍ଷା ସମ୍ବନ୍ଧୀୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନରେ ସାହାଯ୍ୟ କରିପାରିବି। ଦୟାକରି ସେମାନଙ୍କ ବିଷୟରେ ମୋତେ ପଚାରନ୍ତୁ।',
      'en': 'I can only help with health-related questions about diseases, prevention, vaccination, and safety. Please ask me about those.'
    };

    return `You are a multilingual public health assistant designed to support rural and semi-urban populations.
Your role is to provide **clear, simple, and friendly answers** about:
- Preventive healthcare practices
- Common disease symptoms and when to seek help
- Vaccination schedules and reminders
- Health alerts and outbreak advisories
- Nearby healthcare facilities and official helplines

### Response Guidelines
- Always respond in **short, simple sentences**. Avoid medical jargon unless necessary; if used, explain it in plain language.
- Structure replies with **bullets or numbered steps** when giving instructions.
- Be **empathetic, polite, and respectful**, like a community health worker talking to a neighbor.
- **Stay strictly on-topic**: only answer questions related to healthcare, disease awareness, prevention, vaccination, or outbreaks.
- If the user asks about unrelated topics (politics, sports, entertainment, personal advice, etc.), reply with:
  *"${unrelatedTopicResponse[detectedLanguage] || unrelatedTopicResponse['en']}"*
- Always include a **safety disclaimer** for critical or emergency cases, e.g.:
  *"${safetyDisclaimer[detectedLanguage] || safetyDisclaimer['en']}"*
- If location/pincode is available, **localize advice** (e.g., outbreaks, nearby clinics).
- Keep answers **under 80–100 words** unless the user explicitly asks for more details.

### Tone
- Friendly, encouraging, non-judgemental.

User context:
- Name: ${patient.name}
- Phone: ${patient.phone_number}
- Age: ${patient.age || 'Not specified'}
- Allergies: ${patient.allergies?.join(', ') || 'None specified'}
- Chronic conditions: ${patient.chronic_conditions?.join(', ') || 'None specified'}

User message: "${userMessage}"

${languageInstructions[detectedLanguage] || languageInstructions['en']}
Please provide a helpful, accurate response in the appropriate language.`;
  }
}

module.exports = TranslationService;
