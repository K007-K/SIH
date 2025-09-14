// Disease Symptoms Database and Checker
// Comprehensive symptom analysis for rural healthcare

const diseaseDatabase = {
  // Common Diseases with Symptoms
  fever: {
    name: {
      en: "Fever",
      hi: "बुखार",
      te: "జ్వరం"
    },
    symptoms: [
      "high temperature", "body ache", "headache", "chills", "sweating", 
      "weakness", "loss of appetite", "nausea"
    ],
    severity: "medium",
    urgency: "monitor",
    advice: {
      en: `**Fever Management:**
🌡️ **Immediate Care:**
• Rest and drink plenty of fluids
• Take paracetamol as per dosage
• Use cold compress on forehead
• Wear light clothing

⚠️ **See doctor if:**
• Temperature above 103°F (39.4°C)
• Fever lasts more than 3 days
• Severe headache or neck stiffness
• Difficulty breathing
• Persistent vomiting

🏠 **Home Remedies:**
• Tulsi tea with honey
• Ginger and turmeric water
• Light, easily digestible food
• Adequate rest in ventilated room`,
      hi: `**बुखार का प्रबंधन:**
🌡️ **तत्काल देखभाल:**
• आराम करें और खूब तरल पदार्थ पिएं
• खुराक के अनुसार पैरासिटामोल लें
• माथे पर ठंडी पट्टी रखें
• हल्के कपड़े पहनें

⚠️ **डॉक्टर से मिलें यदि:**
• तापमान 103°F (39.4°C) से ऊपर
• बुखार 3 दिन से अधिक रहे
• गंभीर सिरदर्द या गर्दन में अकड़न
• सांस लेने में कठिनाई
• लगातार उल्टी

🏠 **घरेलू उपचार:**
• शहद के साथ तुलसी की चाय
• अदरक और हल्दी का पानी
• हल्का, आसानी से पचने वाला भोजन
• हवादार कमरे में पर्याप्त आराम`
    },
    relatedDiseases: ["malaria", "dengue", "typhoid", "viral_infection"]
  },

  diarrhea: {
    name: {
      en: "Diarrhea",
      hi: "दस्त",
      te: "అతిసారం"
    },
    symptoms: [
      "loose stools", "frequent bowel movements", "stomach cramps", 
      "nausea", "vomiting", "dehydration", "weakness"
    ],
    severity: "high",
    urgency: "immediate",
    advice: {
      en: `**Diarrhea Treatment:**
💧 **Critical: Prevent Dehydration**
• ORS solution every 15-20 minutes
• Coconut water, rice water, buttermilk
• Continue breastfeeding for infants

🍚 **BRAT Diet:**
• Bananas, Rice, Applesauce, Toast
• Avoid dairy, spicy, fatty foods
• Small frequent meals

⚠️ **Emergency Signs:**
• Blood in stools
• High fever with diarrhea
• Signs of severe dehydration
• No urination for 8+ hours
• Extreme weakness

🏥 **Seek immediate medical help if:**
• Infant under 6 months
• Elderly person affected
• Symptoms worsen after 24 hours`,
      hi: `**दस्त का इलाज:**
💧 **महत्वपूर्ण: निर्जलीकरण रोकें**
• हर 15-20 मिनट में ORS घोल
• नारियल पानी, चावल का पानी, छाछ
• शिशुओं के लिए स्तनपान जारी रखें

🍚 **BRAT आहार:**
• केला, चावल, सेब की प्यूरी, टोस्ट
• डेयरी, मसालेदार, तैलीय भोजन से बचें
• थोड़ा-थोड़ा करके बार-बार खाएं

⚠️ **आपातकालीन संकेत:**
• मल में खून
• दस्त के साथ तेज बुखार
• गंभीर निर्जलीकरण के संकेत
• 8+ घंटे तक पेशाब न आना
• अत्यधिक कमजोरी

🏥 **तुरंत चिकित्सा सहायता लें यदि:**
• 6 महीने से कम का शिशु
• बुजुर्ग व्यक्ति प्रभावित
• 24 घंटे बाद लक्षण बिगड़ें`
    },
    relatedDiseases: ["cholera", "food_poisoning", "gastroenteritis"]
  },

  cough_cold: {
    name: {
      en: "Cough & Cold",
      hi: "खांसी और जुकाम",
      te: "దగ్గు మరియు జలుబు"
    },
    symptoms: [
      "runny nose", "sneezing", "cough", "sore throat", "mild fever",
      "congestion", "body ache", "fatigue"
    ],
    severity: "low",
    urgency: "monitor",
    advice: {
      en: `**Cough & Cold Care:**
🫖 **Home Remedies:**
• Warm salt water gargling
• Honey and ginger tea
• Steam inhalation with tulsi leaves
• Turmeric milk before bed

💧 **Hydration:**
• Warm water, herbal teas
• Avoid cold drinks and ice
• Lemon honey water

⚠️ **See doctor if:**
• Fever above 101°F for 3+ days
• Difficulty breathing
• Chest pain or wheezing
• Cough with blood
• Symptoms worsen after a week

🛡️ **Prevention:**
• Wash hands frequently
• Avoid close contact with sick people
• Cover mouth when coughing/sneezing
• Boost immunity with vitamin C foods`,
      hi: `**खांसी और जुकाम की देखभाल:**
🫖 **घरेलू उपचार:**
• गुनगुने नमक के पानी से गरारे
• शहद और अदरक की चाय
• तुलसी के पत्तों के साथ भाप लेना
• सोने से पहले हल्दी वाला दूध

💧 **हाइड्रेशन:**
• गर्म पानी, हर्बल चाय
• ठंडे पेय और बर्फ से बचें
• नींबू शहद का पानी

⚠️ **डॉक्टर से मिलें यदि:**
• 3+ दिन तक 101°F से ऊपर बुखार
• सांस लेने में कठिनाई
• सीने में दर्द या घरघराहट
• खून के साथ खांसी
• एक सप्ताह बाद लक्षण बिगड़ें

🛡️ **रोकथाम:**
• बार-बार हाथ धोएं
• बीमार लोगों से दूरी बनाए रखें
• खांसते/छींकते समय मुंह ढकें
• विटामिन सी युक्त खाद्य पदार्थों से रोग प्रतिरोधक क्षमता बढ़ाएं`
    },
    relatedDiseases: ["flu", "bronchitis", "pneumonia"]
  },

  malaria: {
    name: {
      en: "Malaria",
      hi: "मलेरिया",
      te: "మలేరియా"
    },
    symptoms: [
      "high fever with chills", "sweating", "headache", "nausea", "vomiting",
      "muscle pain", "fatigue", "cyclical fever pattern"
    ],
    severity: "high",
    urgency: "immediate",
    advice: {
      en: `**Malaria - Medical Emergency:**
🚨 **Immediate Action Required:**
• Get blood test (RDT/microscopy) immediately
• Start treatment only after confirmation
• Do not delay medical consultation

💊 **Treatment:**
• Only take prescribed antimalarial drugs
• Complete full course even if feeling better
• Paracetamol for fever (not aspirin)

🛡️ **Prevention (Critical for Rural Areas):**
• Use mosquito nets while sleeping
• Apply mosquito repellent
• Eliminate stagnant water around home
• Wear full-sleeve clothes in evening

⚠️ **Danger Signs:**
• Severe headache with neck stiffness
• Difficulty breathing
• Persistent vomiting
• Confusion or unconsciousness
• Dark/bloody urine

🏥 **Seek immediate hospital care for danger signs**`,
      hi: `**मलेरिया - चिकित्सा आपातकाल:**
🚨 **तत्काल कार्रवाई आवश्यक:**
• तुरंत रक्त जांच (RDT/माइक्रोस्कोपी) कराएं
• पुष्टि के बाद ही इलाज शुरू करें
• चिकित्सा सलाह में देरी न करें

💊 **उपचार:**
• केवल निर्धारित मलेरिया रोधी दवाएं लें
• बेहतर महसूस करने पर भी पूरा कोर्स लें
• बुखार के लिए पैरासिटामोल (एस्पिरिन नहीं)

🛡️ **रोकथाम (ग्रामीण क्षेत्रों के लिए महत्वपूर्ण):**
• सोते समय मच्छरदानी का उपयोग करें
• मच्छर भगाने वाली क्रीम लगाएं
• घर के आसपास रुके हुए पानी को हटाएं
• शाम को पूरी बाजू के कपड़े पहनें

⚠️ **खतरे के संकेत:**
• गर्दन में अकड़न के साथ गंभीर सिरदर्द
• सांस लेने में कठिनाई
• लगातार उल्टी
• भ्रम या बेहोशी
• गहरे/खूनी रंग का पेशाब

🏥 **खतरे के संकेतों के लिए तुरंत अस्पताल जाएं**`
    },
    relatedDiseases: ["dengue", "chikungunya", "typhoid"]
  },

  dengue: {
    name: {
      en: "Dengue Fever",
      hi: "डेंगू बुखार",
      te: "డెంగ్యూ జ్వరం"
    },
    symptoms: [
      "sudden high fever", "severe headache", "eye pain", "muscle pain",
      "joint pain", "skin rash", "nausea", "vomiting"
    ],
    severity: "high",
    urgency: "immediate",
    advice: {
      en: `**Dengue - Serious Viral Disease:**
🚨 **Immediate Medical Attention Required**
• Get blood test (NS1, IgM/IgG) immediately
• Monitor platelet count daily
• No self-medication

💧 **Critical Care:**
• Increase fluid intake significantly
• ORS, coconut water, fresh juices
• Paracetamol ONLY for fever
• NEVER give aspirin or ibuprofen

⚠️ **Danger Signs (Emergency):**
• Severe abdominal pain
• Persistent vomiting
• Bleeding (nose, gums, skin)
• Difficulty breathing
• Sudden drop in temperature with sweating
• Restlessness or drowsiness

🛡️ **Prevention:**
• Eliminate standing water (pots, tires, containers)
• Use mosquito nets and repellents
• Keep surroundings clean
• Community-wide mosquito control

🏥 **Hospitalization may be needed for severe cases**`,
      hi: `**डेंगू - गंभीर वायरल बीमारी:**
🚨 **तत्काल चिकित्सा सहायता आवश्यक**
• तुरंत रक्त जांच (NS1, IgM/IgG) कराएं
• रोजाना प्लेटलेट काउंट की निगरानी करें
• स्व-चिकित्सा न करें

💧 **महत्वपूर्ण देखभाल:**
• तरल पदार्थ का सेवन काफी बढ़ाएं
• ORS, नारियल पानी, ताजे जूस
• बुखार के लिए केवल पैरासिटामोल
• कभी भी एस्पिरिन या आइबुप्रोफेन न दें

⚠️ **खतरे के संकेत (आपातकाल):**
• पेट में तेज दर्द
• लगातार उल्टी
• रक्तस्राव (नाक, मसूड़े, त्वचा)
• सांस लेने में कठिनाई
• पसीने के साथ तापमान में अचानक गिरावट
• बेचैनी या सुस्ती

🛡️ **रोकथाम:**
• रुके हुए पानी को हटाएं (बर्तन, टायर, कंटेनर)
• मच्छरदानी और रिपेलेंट का उपयोग करें
• आसपास की सफाई रखें
• समुदायिक स्तर पर मच्छर नियंत्रण

🏥 **गंभीर मामलों में अस्पताल में भर्ती की आवश्यकता हो सकती है**`
    },
    relatedDiseases: ["malaria", "chikungunya", "zika"]
  }
};

// Symptom analysis function
const analyzeSymptoms = (symptoms, language = 'en') => {
  const inputSymptoms = symptoms.toLowerCase().split(/[,\s]+/).filter(s => s.length > 2);
  const matches = [];
  
  for (const [diseaseKey, disease] of Object.entries(diseaseDatabase)) {
    let matchCount = 0;
    let matchedSymptoms = [];
    
    for (const symptom of disease.symptoms) {
      for (const inputSymptom of inputSymptoms) {
        if (symptom.includes(inputSymptom) || inputSymptom.includes(symptom)) {
          matchCount++;
          matchedSymptoms.push(symptom);
          break;
        }
      }
    }
    
    if (matchCount > 0) {
      matches.push({
        disease: diseaseKey,
        name: disease.name[language] || disease.name.en,
        matchCount,
        matchedSymptoms,
        severity: disease.severity,
        urgency: disease.urgency,
        advice: disease.advice[language] || disease.advice.en,
        confidence: Math.round((matchCount / disease.symptoms.length) * 100)
      });
    }
  }
  
  return matches.sort((a, b) => b.matchCount - a.matchCount);
};

// Get disease information
const getDiseaseInfo = (diseaseKey, language = 'en') => {
  const disease = diseaseDatabase[diseaseKey];
  if (!disease) return null;
  
  return {
    name: disease.name[language] || disease.name.en,
    symptoms: disease.symptoms,
    severity: disease.severity,
    urgency: disease.urgency,
    advice: disease.advice[language] || disease.advice.en,
    relatedDiseases: disease.relatedDiseases
  };
};

// Generate symptom checker response
const generateSymptomAnalysis = (symptoms, language = 'en') => {
  const analysis = analyzeSymptoms(symptoms, language);
  
  if (analysis.length === 0) {
    const noMatchTexts = {
      en: `I couldn't identify specific diseases from the symptoms you described. 

🏥 **General Advice:**
• Monitor your symptoms closely
• Stay hydrated and rest
• Consult a healthcare provider if symptoms persist
• Seek immediate help if symptoms worsen

Please describe your symptoms in more detail or consult a doctor for proper diagnosis.`,
      hi: `आपके द्वारा बताए गए लक्षणों से मैं विशिष्ट बीमारियों की पहचान नहीं कर सका।

🏥 **सामान्य सलाह:**
• अपने लक्षणों पर बारीकी से नजर रखें
• हाइड्रेटेड रहें और आराम करें
• यदि लक्षण बने रहें तो स्वास्थ्य सेवा प्रदाता से सलाह लें
• यदि लक्षण बिगड़ें तो तुरंत सहायता लें

कृपया अपने लक्षणों का अधिक विस्तार से वर्णन करें या उचित निदान के लिए डॉक्टर से सलाह लें।`
    };
    
    return noMatchTexts[language] || noMatchTexts.en;
  }
  
  const topMatch = analysis[0];
  const urgencyTexts = {
    en: {
      immediate: "🚨 **URGENT - Seek immediate medical attention**",
      monitor: "⚠️ **Monitor closely - See doctor if symptoms worsen**",
      routine: "📋 **Routine care - Schedule doctor visit**"
    },
    hi: {
      immediate: "🚨 **तत्काल - तुरंत चिकित्सा सहायता लें**",
      monitor: "⚠️ **बारीकी से निगरानी करें - यदि लक्षण बिगड़ें तो डॉक्टर से मिलें**",
      routine: "📋 **नियमित देखभाल - डॉक्टर से मिलने का समय निर्धारित करें**"
    }
  };
  
  const urgencyText = urgencyTexts[language] || urgencyTexts.en;
  
  let response = `**Possible Condition: ${topMatch.name}**\n`;
  response += `**Confidence: ${topMatch.confidence}%**\n\n`;
  response += `${urgencyText[topMatch.urgency]}\n\n`;
  response += `${topMatch.advice}\n\n`;
  
  if (analysis.length > 1) {
    const otherTexts = {
      en: "**Other possible conditions to consider:**",
      hi: "**विचार करने योग्य अन्य संभावित स्थितियां:**"
    };
    
    response += `${otherTexts[language] || otherTexts.en}\n`;
    for (let i = 1; i < Math.min(3, analysis.length); i++) {
      response += `• ${analysis[i].name} (${analysis[i].confidence}%)\n`;
    }
  }
  
  const disclaimerTexts = {
    en: "\n⚠️ **Disclaimer:** This is not a medical diagnosis. Always consult a qualified healthcare provider for proper diagnosis and treatment.",
    hi: "\n⚠️ **अस्वीकरण:** यह चिकित्सा निदान नहीं है। उचित निदान और उपचार के लिए हमेशा एक योग्य स्वास्थ्य सेवा प्रदाता से सलाह लें।"
  };
  
  response += disclaimerTexts[language] || disclaimerTexts.en;
  
  return response;
};

// Emergency symptom detection
const detectEmergencySymptoms = (symptoms) => {
  const emergencyKeywords = [
    'chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding',
    'high fever', 'severe headache', 'vomiting blood', 'severe abdominal pain',
    'stroke symptoms', 'heart attack', 'seizure', 'severe dehydration'
  ];
  
  const lowerSymptoms = symptoms.toLowerCase();
  return emergencyKeywords.some(keyword => lowerSymptoms.includes(keyword));
};

module.exports = {
  analyzeSymptoms,
  getDiseaseInfo,
  generateSymptomAnalysis,
  detectEmergencySymptoms,
  diseaseDatabase
};
