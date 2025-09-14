// Safety Guardrails for Disease Symptoms Education
// File: features/disease-symptoms/utils/safetyGuards.js

const { supabase } = require('../../../config/database');

class SafetyGuards {
  
  // Critical emergency keywords that trigger immediate response
  static CRITICAL_KEYWORDS = {
    'en': [
      'chest pain', 'heart attack', 'can\'t breathe', 'difficulty breathing',
      'severe bleeding', 'unconscious', 'stroke', 'seizure', 'suicide',
      'overdose', 'poisoning', 'severe burn', 'broken bone', 'head injury'
    ],
    'hi': [
      'सीने में दर्द', 'दिल का दौरा', 'सांस नहीं आ रही', 'सांस लेने में कठिनाई',
      'गंभीर रक्तस्राव', 'बेहोश', 'लकवा', 'दौरा', 'आत्महत्या',
      'ओवरडोज', 'जहर', 'गंभीर जलन', 'हड्डी टूटी', 'सिर की चोट'
    ],
    'te': [
      'ఛాతీ నొప్పి', 'గుండెపోటు', 'ఊపిరి రాలేదు', 'శ్వాస తీసుకోవడంలో ఇబ్బంది',
      'తీవ్రమైన రక్తస్రావం', 'అపస్మారక', 'పక్షవాతం', 'మూర్ఛ', 'ఆత్మహత్య',
      'అధిక మోతాదు', 'విషం', 'తీవ్రమైన కాలిన గాయం', 'ఎముక విరిగింది', 'తల గాయం'
    ],
    'ta': [
      'மார்பு வலி', 'மாரடைப்பு', 'மூச்சு வரவில்லை', 'மூச்சு விடுவதில் சிரமம்',
      'கடுமையான இரத்தப்போக்கு', 'மயக்கம்', 'பக்கவாதம்', 'வலிப்பு', 'தற்கொலை',
      'அளவுக்கு அதிகமான மருந்து', 'விஷம்', 'கடுமையான தீக்காயம்', 'எலும்பு முறிவு', 'தலையில் காயம்'
    ],
    'bn': [
      'বুকে ব্যথা', 'হার্ট অ্যাটাক', 'শ্বাস নিতে পারছি না', 'শ্বাস নিতে কষ্ট',
      'তীব্র রক্তক্ষরণ', 'অজ্ঞান', 'স্ট্রোক', 'খিঁচুনি', 'আত্মহত্যা',
      'অতিরিক্ত ডোজ', 'বিষ', 'তীব্র পোড়া', 'হাড় ভাঙা', 'মাথায় আঘাত'
    ],
    'mr': [
      'छातीत दुखणे', 'हृदयविकाराचा झटका', 'श्वास घेता येत नाही', 'श्वास घेण्यात अडचण',
      'तीव्र रक्तस्राव', 'बेशुद्ध', 'पक्षाघात', 'अपस्मार', 'आत्महत्या',
      'जास्त डोस', 'विष', 'तीव्र भाजणे', 'हाड मोडले', 'डोक्याला दुखापत'
    ]
  };

  // High-risk symptoms that need immediate medical attention
  static HIGH_RISK_SYMPTOMS = {
    'en': [
      'severe abdominal pain', 'blood in stool', 'blood in urine', 'severe headache',
      'high fever above 103', 'persistent vomiting', 'severe dehydration',
      'difficulty swallowing', 'severe diarrhea', 'loss of consciousness'
    ],
    'hi': [
      'गंभीर पेट दर्द', 'मल में खून', 'पेशाब में खून', 'गंभीर सिरदर्द',
      '103 से ऊपर तेज बुखार', 'लगातार उल्टी', 'गंभीर निर्जलीकरण',
      'निगलने में कठिनाई', 'गंभीर दस्त', 'होश खोना'
    ],
    'te': [
      'తీవ్రమైన కడుపు నొప్పి', 'మలంలో రక్తం', 'మూత్రంలో రక్తం', 'తీవ్రమైన తలనొప్పి',
      '103 కంటే ఎక్కువ జ్వరం', 'నిరంతర వాంతులు', 'తీవ్రమైన నిర్జలీకరణ',
      'మింగడంలో ఇబ్బంది', 'తీవ్రమైన అతిసారం', 'స్పృహ కోల్పోవడం'
    ]
  };

  // Check if input contains emergency keywords
  static async checkEmergencyKeywords(text, language = 'en') {
    try {
      const lowerText = text.toLowerCase();
      const criticalKeywords = this.CRITICAL_KEYWORDS[language] || this.CRITICAL_KEYWORDS['en'];
      const highRiskKeywords = this.HIGH_RISK_SYMPTOMS[language] || this.HIGH_RISK_SYMPTOMS['en'];

      // Check critical keywords first
      for (const keyword of criticalKeywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return {
            isEmergency: true,
            severity: 'critical',
            keyword: keyword,
            response: this.getCriticalEmergencyResponse(language),
            action: 'immediate_emergency'
          };
        }
      }

      // Check high-risk symptoms
      for (const keyword of highRiskKeywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return {
            isEmergency: true,
            severity: 'high',
            keyword: keyword,
            response: this.getHighRiskResponse(language),
            action: 'urgent_medical_attention'
          };
        }
      }

      // Check database emergency keywords
      const { data: dbKeywords, error } = await supabase
        .from('emergency_keywords')
        .select('*');

      if (!error && dbKeywords) {
        for (const dbKeyword of dbKeywords) {
          const keywordField = language === 'hi' ? 'keyword_hi' : 
                              language === 'te' ? 'keyword_te' :
                              language === 'ta' ? 'keyword_ta' :
                              language === 'bn' ? 'keyword_bn' :
                              language === 'mr' ? 'keyword_mr' : 'keyword';
          
          const keywordToCheck = dbKeyword[keywordField] || dbKeyword.keyword;
          
          if (keywordToCheck && lowerText.includes(keywordToCheck.toLowerCase())) {
            const responseField = language === 'hi' ? 'auto_response_hi' :
                                 language === 'te' ? 'auto_response_te' :
                                 language === 'ta' ? 'auto_response_ta' :
                                 language === 'bn' ? 'auto_response_bn' :
                                 language === 'mr' ? 'auto_response_mr' : 'auto_response';
            
            return {
              isEmergency: true,
              severity: dbKeyword.severity_level,
              keyword: keywordToCheck,
              response: dbKeyword[responseField] || dbKeyword.auto_response,
              action: 'emergency_protocol'
            };
          }
        }
      }

      return { isEmergency: false };
    } catch (error) {
      console.error('Emergency keyword check error:', error);
      return { isEmergency: false };
    }
  }

  // Get critical emergency response
  static getCriticalEmergencyResponse(language = 'en') {
    const responses = {
      'en': '🚨 CRITICAL EMERGENCY 🚨\n\nCall 108 IMMEDIATELY or go to nearest emergency room NOW!\n\nDo not wait. This requires immediate medical attention.\n\n📞 Emergency: 108\n🏥 Go to nearest hospital immediately',
      'hi': '🚨 गंभीर आपातकाल 🚨\n\nतुरंत 108 पर कॉल करें या अभी निकटतम आपातकालीन कक्ष में जाएं!\n\nप्रतीक्षा न करें। इसके लिए तत्काल चिकित्सा सहायता की आवश्यकता है।\n\n📞 आपातकाल: 108\n🏥 तुरंत निकटतम अस्पताल जाएं',
      'te': '🚨 క్రిటికల్ ఎమర్జెన్సీ 🚨\n\nవెంటనే 108కి కాల్ చేయండి లేదా ఇప్పుడే సమీప ఎమర్జెన్సీ రూమ్‌కు వెళ్లండి!\n\nవేచి ఉండవద్దు. దీనికి వెంటనే వైద్య సహాయం అవసరం.\n\n📞 అత్యవసరం: 108\n🏥 వెంటనే సమీప ఆసుపత్రికి వెళ్లండి',
      'ta': '🚨 முக்கியமான அவசரநிலை 🚨\n\nஉடனடியாக 108 ஐ அழைக்கவும் அல்லது இப்போதே அருகிலுள்ள அவசர அறைக்குச் செல்லுங்கள்!\n\nகாத்திருக்காதீர்கள். இதற்கு உடனடி மருத்துவ கவனிப்பு தேவை.\n\n📞 அவசரம்: 108\n🏥 உடனடியாக அருகிலுள்ள மருத்துவமனைக்குச் செல்லுங்கள்',
      'bn': '🚨 গুরুতর জরুরি অবস্থা 🚨\n\nঅবিলম্বে ১০৮ এ কল করুন বা এখনই নিকটতম জরুরি কক্ষে যান!\n\nঅপেক্ষা করবেন না। এর জন্য অবিলম্বে চিকিৎসা সেবা প্রয়োজন।\n\n📞 জরুরি: ১০৮\n🏥 অবিলম্বে নিকটতম হাসপাতালে যান',
      'mr': '🚨 गंभीर आणीबाणी 🚨\n\nलगेच 108 वर कॉल करा किंवा आता जवळच्या आणीबाणी कक्षात जा!\n\nवाट पाहू नका. यासाठी तातडीने वैद्यकीय मदत आवश्यक आहे.\n\n📞 आणीबाणी: 108\n🏥 लगेच जवळच्या रुग्णालयात जा'
    };
    
    return responses[language] || responses['en'];
  }

  // Get high-risk response
  static getHighRiskResponse(language = 'en') {
    const responses = {
      'en': '⚠️ HIGH PRIORITY MEDICAL ATTENTION NEEDED ⚠️\n\nThis symptom requires urgent medical evaluation.\n\nPlease:\n• Contact your doctor immediately\n• Go to nearest healthcare center\n• Call 108 if symptoms worsen\n\n📞 Emergency: 108\n🏥 Visit nearest PHC/hospital',
      'hi': '⚠️ उच्च प्राथमिकता चिकित्सा सहायता की आवश्यकता ⚠️\n\nइस लक्षण के लिए तत्काल चिकित्सा मूल्यांकन की आवश्यकता है।\n\nकृपया:\n• तुरंत अपने डॉक्टर से संपर्क करें\n• निकटतम स्वास्थ्य केंद्र जाएं\n• लक्षण बिगड़ने पर 108 पर कॉल करें\n\n📞 आपातकाल: 108\n🏥 निकटतम PHC/अस्पताल जाएं',
      'te': '⚠️ అధిక ప్రాధాన్యత వైద్య సహాయం అవసరం ⚠️\n\nఈ లక్షణానికి అత్యవసర వైద్య మూల్యాంకనం అవసరం.\n\nదయచేసి:\n• వెంటనే మీ వైద్యుడిని సంప్రదించండి\n• సమీప ఆరోగ్య కేంద్రానికి వెళ్లండి\n• లక్షణాలు తీవ్రమైతే 108కి కాల్ చేయండి\n\n📞 అత్యవసరం: 108\n🏥 సమీప PHC/ఆసుపత్రిని సందర్శించండి'
    };
    
    return responses[language] || responses['en'];
  }

  // Validate symptom checker input
  static validateSymptomInput(symptoms) {
    const errors = [];
    
    if (!symptoms || !Array.isArray(symptoms)) {
      errors.push('Symptoms must be provided as an array');
      return { isValid: false, errors };
    }
    
    if (symptoms.length === 0) {
      errors.push('At least one symptom must be provided');
      return { isValid: false, errors };
    }
    
    if (symptoms.length > 10) {
      errors.push('Maximum 10 symptoms allowed per query');
      return { isValid: false, errors };
    }
    
    // Check for inappropriate content
    const inappropriateKeywords = ['drug', 'illegal', 'suicide method', 'self harm'];
    for (const symptom of symptoms) {
      if (typeof symptom !== 'string') {
        errors.push('All symptoms must be text strings');
        continue;
      }
      
      if (symptom.length > 200) {
        errors.push('Each symptom description must be under 200 characters');
      }
      
      const lowerSymptom = symptom.toLowerCase();
      for (const keyword of inappropriateKeywords) {
        if (lowerSymptom.includes(keyword)) {
          errors.push('Query contains inappropriate content. Please contact a healthcare professional directly.');
        }
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Add safety disclaimer to all responses
  static addSafetyDisclaimer(response, language = 'en') {
    const disclaimers = {
      'en': '\n\n⚠️ IMPORTANT: This is for awareness only, not medical diagnosis. Always consult healthcare professionals for medical advice.',
      'hi': '\n\n⚠️ महत्वपूर्ण: यह केवल जानकारी के लिए है, चिकित्सा निदान नहीं। चिकित्सा सलाह के लिए हमेशा स्वास्थ्य पेशेवरों से सलाह लें।',
      'te': '\n\n⚠️ ముఖ్యమైనది: ఇది కేవలం అవగాహన కోసం, వైద్య నిర్ధారణ కాదు. వైద్య సలహా కోసం ఎల్లప్పుడూ ఆరోగ్య నిపుణులను సంప్రదించండి।',
      'ta': '\n\n⚠️ முக்கியம்: இது விழிப்புணர்வுக்காக மட்டுமே, மருத்துவ நோயறிதல் அல்ல. மருத்துவ ஆலோசனைக்கு எப்போதும் சுகாதார நிபுணர்களை அணுகவும்.',
      'bn': '\n\n⚠️ গুরুত্বপূর্ণ: এটি শুধুমাত্র সচেতনতার জন্য, চিকিৎসা নির্ণয় নয়। চিকিৎসা পরামর্শের জন্য সর্বদা স্বাস্থ্যসেবা পেশাদারদের সাথে পরামর্শ করুন।',
      'mr': '\n\n⚠️ महत्त्वाचे: हे फक्त जागरूकतेसाठी आहे, वैद्यकीय निदान नाही. वैद्यकीय सल्ल्यासाठी नेहमी आरोग्य व्यावसायिकांचा सल्ला घ्या.'
    };
    
    return response + (disclaimers[language] || disclaimers['en']);
  }

  // Log safety events for monitoring
  static async logSafetyEvent(eventData) {
    try {
      const { error } = await supabase
        .from('safety_events')
        .insert({
          event_type: eventData.type,
          severity: eventData.severity,
          user_input: eventData.input,
          triggered_keyword: eventData.keyword,
          response_given: eventData.response,
          patient_id: eventData.patient_id,
          language: eventData.language,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log safety event:', error);
      }
    } catch (error) {
      console.error('Safety event logging error:', error);
    }
  }

  // Rate limiting for symptom checker
  static async checkRateLimit(patientId, timeWindow = 3600000) { // 1 hour
    try {
      const cutoffTime = new Date(Date.now() - timeWindow);
      
      const { data: recentQueries, error } = await supabase
        .from('symptom_queries')
        .select('id')
        .eq('patient_id', patientId)
        .gte('created_at', cutoffTime.toISOString());

      if (error) throw error;

      const queryCount = recentQueries?.length || 0;
      const maxQueries = 20; // Max 20 queries per hour

      return {
        allowed: queryCount < maxQueries,
        remaining: Math.max(0, maxQueries - queryCount),
        resetTime: new Date(Date.now() + timeWindow)
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true, remaining: 20 }; // Allow on error
    }
  }
}

module.exports = SafetyGuards;
