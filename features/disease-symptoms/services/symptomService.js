// AI-Powered Symptom Analysis Service
// File: features/disease-symptoms/services/symptomService.js

const { getGeminiResponse, detectLanguage } = require('../../../utils/aiUtils');

class SymptomService {
  
  // Check for emergency keywords using AI analysis
  static async checkEmergencyKeywords(text, language = 'en') {
    try {
      const emergencyKeywords = {
        en: [
          'severe chest pain', 'chest pain', 'heart attack', 'can\'t breathe', 'difficulty breathing',
          'shortness of breath', 'unconscious', 'heavy bleeding', 'severe bleeding', 'choking',
          'severe allergic reaction', 'anaphylaxis', 'stroke', 'seizure', 'severe burns',
          'poisoning', 'overdose', 'severe head injury', 'broken bones', 'severe abdominal pain'
        ],
        hi: [
          'गंभीर सीने में दर्द', 'सांस लेने में कठिनाई', 'बेहोशी', 'भारी खून बह रहा है',
          'दिल का दौरा', 'गंभीर एलर्जी', 'लकवा', 'दौरा', 'गंभीर जलन'
        ],
        te: [
          'తీవ్రమైన ఛాతీ నొప్పి', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'అపస్మారక స్థితి',
          'అధిక రక్తస్రావం', 'గుండెపోటు', 'తీవ్రమైన అలెర్జీ'
        ],
        ta: [
          'கடுமையான மார்பு வலி', 'மூச்சுத் திணறல்', 'மயக்கம்', 'அதிக இரத்தப்போக்கு',
          'மாரடைப்பு', 'கடுமையான ஒவ்வாமை'
        ]
      };

      const lowerText = text.toLowerCase();
      const keywords = emergencyKeywords[language] || emergencyKeywords.en;
      
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          const emergencyResponses = {
            en: '🚨 EMERGENCY: You mentioned symptoms that may require immediate medical attention. Please seek immediate medical help or call emergency services (108 in India, 911 in US).',
            hi: '🚨 आपातकाल: आपने ऐसे लक्षण बताए हैं जिनमें तत्काल चिकित्सा सहायता की आवश्यकता हो सकती है। कृपया तुरंत चिकित्सा सहायता लें या आपातकालीन सेवाओं को कॉल करें (108)।',
            te: '🚨 అత్యవసరం: మీరు తక్షణ వైద्య సహాయం అవసరమైన లక్షణాలను పేర్కొన్నారు। దయచేసి వెంటనే వైద్య సహాయం పొందండి లేదా అత్యవసర సేవలకు కాల్ చేయండి (108)।',
            ta: '🚨 அவசரநிலை: நீங்கள் உடனடி மருத்துவ கவனிப்பு தேவைப்படும் அறிகுறிகளைக் குறிப்பிட்டுள்ளீர்கள். உடனடியாக மருத்துவ உதவி பெறவும் அல்லது அவசர சேவைகளை அழைக்கவும் (108)।'
          };
          
          return {
            isEmergency: true,
            severity: 'critical',
            response: emergencyResponses[language] || emergencyResponses.en,
            keyword: keyword
          };
        }
      }
      
      return { isEmergency: false };
    } catch (error) {
      console.error('Emergency keyword check error:', error);
      return { isEmergency: false };
    }
  }

  // AI-powered symptom analysis and disease prediction
  static async analyzeSymptoms(symptomText, language = 'en') {
    try {
      const languageMap = {
        'en': 'English',
        'hi': 'Hindi', 
        'te': 'Telugu',
        'ta': 'Tamil',
        'bn': 'Bengali',
        'mr': 'Marathi'
      };

      const targetLanguage = languageMap[language] || 'English';
      
      const prompt = `You are a medical AI assistant for symptom analysis. Analyze these symptoms and provide a structured response in ${targetLanguage}.

Symptoms: "${symptomText}"

Provide your analysis in this EXACT JSON format:
{
  "emergency_level": "low/medium/high/critical",
  "most_likely_conditions": [
    {
      "name": "condition name",
      "confidence": 0.85,
      "description": "brief description"
    }
  ],
  "recommendations": [
    "specific recommendation 1",
    "specific recommendation 2"
  ],
  "when_to_seek_help": "guidance on when to see a doctor",
  "red_flags": ["warning sign 1", "warning sign 2"],
  "disclaimer": "This is for informational purposes only, not medical diagnosis"
}

IMPORTANT:
- Keep response under 300 words total
- Use simple, clear language
- Include 2-3 most likely conditions max
- Always include disclaimer
- If symptoms suggest emergency, set emergency_level to "high" or "critical"`;

      const response = await getGeminiResponse(prompt, language);
      
      // Try to parse JSON response
      try {
        const analysisResult = JSON.parse(response);
        return analysisResult;
      } catch (parseError) {
        // Fallback if AI doesn't return proper JSON
        return this.generateFallbackAnalysis(symptomText, language);
      }
    } catch (error) {
      console.error('AI symptom analysis error:', error);
      return this.generateFallbackAnalysis(symptomText, language);
    }
  }

  // Generate fallback analysis when AI fails
  static generateFallbackAnalysis(symptomText, language = 'en') {
    const fallbackResponses = {
      en: {
        emergency_level: "medium",
        most_likely_conditions: [
          {
            name: "Common viral infection",
            confidence: 0.6,
            description: "Symptoms may indicate a common viral illness"
          }
        ],
        recommendations: [
          "Rest and stay hydrated",
          "Monitor symptoms for changes",
          "Take over-the-counter medications as needed"
        ],
        when_to_seek_help: "Consult a doctor if symptoms worsen or persist for more than 3-5 days",
        red_flags: ["High fever over 103°F", "Difficulty breathing", "Severe pain"],
        disclaimer: "This is for informational purposes only, not medical diagnosis. Consult a healthcare provider for proper evaluation."
      },
      hi: {
        emergency_level: "medium",
        most_likely_conditions: [
          {
            name: "सामान्य वायरल संक्रमण",
            confidence: 0.6,
            description: "लक्षण सामान्य वायरल बीमारी का संकेत हो सकते हैं"
          }
        ],
        recommendations: [
          "आराम करें और पानी पिएं",
          "लक्षणों पर नजर रखें",
          "आवश्यकतानुसार दवा लें"
        ],
        when_to_seek_help: "यदि लक्षण बिगड़ते हैं या 3-5 दिन से अधिक रहते हैं तो डॉक्टर से मिलें",
        red_flags: ["103°F से अधिक बुखार", "सांस लेने में कठिनाई", "गंभीर दर्द"],
        disclaimer: "यह केवल जानकारी के लिए है, चिकित्सा निदान नहीं। उचित मूल्यांकन के लिए स्वास्थ्य सेवा प्रदाता से सलाह लें।"
      }
    };
    
    return fallbackResponses[language] || fallbackResponses.en;
  }

  // Get detailed medical information using AI
  static async getDetailedMedicalInfo(condition, language = 'en') {
    try {
      const languageMap = {
        'en': 'English',
        'hi': 'Hindi',
        'te': 'Telugu', 
        'ta': 'Tamil',
        'bn': 'Bengali',
        'mr': 'Marathi'
      };

      const targetLanguage = languageMap[language] || 'English';
      
      const prompt = `Provide detailed medical information about "${condition}" in ${targetLanguage}. Include:

1. **Description**: What is this condition?
2. **Common Symptoms**: List 5-7 typical symptoms
3. **Causes**: What typically causes this condition?
4. **Treatment**: General treatment approaches (mention to consult doctor)
5. **Prevention**: How to prevent this condition
6. **When to seek help**: Red flags that require immediate medical attention

Keep the response informative but accessible to general public. Always emphasize consulting healthcare professionals for proper diagnosis and treatment.

Format in clear sections with emojis for better readability.`;

      const response = await getGeminiResponse(prompt, language);
      return response;
    } catch (error) {
      console.error('Get detailed medical info error:', error);
      
      const fallbackInfo = {
        en: `ℹ️ **About ${condition}**\n\nFor detailed information about this condition, please consult with a healthcare professional. They can provide accurate diagnosis, treatment options, and personalized medical advice.\n\n🏥 **When to seek help:**\n• If symptoms persist or worsen\n• If you experience severe pain\n• If you have concerns about your health\n\n📞 **Emergency:** Call 108 (India) or your local emergency number for urgent medical situations.`,
        hi: `ℹ️ **${condition} के बारे में**\n\nइस स्थिति के बारे में विस्तृत जानकारी के लिए, कृपया किसी स्वास्थ्य पेशेवर से सलाह लें। वे सटीक निदान, उपचार विकल्प और व्यक्तिगत चिकित्सा सलाह प्रदान कर सकते हैं।`
      };
      
      return fallbackInfo[language] || fallbackInfo.en;
    }
  }

  // Main symptom processing function - AI-only approach
  static async processSymptoms(symptomText, language = 'en') {
    try {
      // Step 1: Check for emergency keywords
      const emergencyCheck = await this.checkEmergencyKeywords(symptomText, language);
      
      if (emergencyCheck.isEmergency) {
        return {
          type: 'emergency',
          message: emergencyCheck.response,
          severity: emergencyCheck.severity,
          keyword: emergencyCheck.keyword
        };
      }
      
      // Step 2: AI-powered symptom analysis
      const analysis = await this.analyzeSymptoms(symptomText, language);
      
      // Step 3: Format response based on analysis
      return this.formatAnalysisResponse(analysis, language);
      
    } catch (error) {
      console.error('Process symptoms error:', error);
      return this.generateErrorResponse(language);
    }
  }
  
  // Format AI analysis into user-friendly response
  static formatAnalysisResponse(analysis, language = 'en') {
    try {
      let message = '';
      
      // Emergency check from AI analysis
      if (analysis.emergency_level === 'high' || analysis.emergency_level === 'critical') {
        const emergencyMessages = {
          en: '🚨 URGENT: Your symptoms may require immediate medical attention. Please seek emergency care or call 108 immediately.',
          hi: '🚨 तत्काल: आपके लक्षणों में तुरंत चिकित्सा सहायता की आवश्यकता हो सकती है। कृपया आपातकालीन देखभाल लें या 108 पर तुरंत कॉल करें।',
          te: '🚨 అత్యవసరం: మీ లక్షణాలకు తక్షణ వైద్య సహాయం అవసరం కావచ్చు. దయచేసి అత్యవసర సంరక్షణ పొందండి లేదా వెంటనే 108కి కాల్ చేయండి।',
          ta: '🚨 அவசரம்: உங்கள் அறிகுறிகளுக்கு உடனடி மருத்துவ கவனிப்பு தேவைப்படலாம். அவசர சிகிச்சை பெறவும் அல்லது உடனடியாக 108 ஐ அழைக்கவும்.'
        };
        
        return {
          type: 'emergency',
          message: emergencyMessages[language] || emergencyMessages.en,
          severity: 'critical'
        };
      }
      
      // Regular analysis response
      message += `🔍 **Symptom Analysis Results**\n\n`;
      
      // Most likely conditions
      if (analysis.most_likely_conditions && analysis.most_likely_conditions.length > 0) {
        message += `**Most likely condition:** ${analysis.most_likely_conditions[0].name}\n`;
        if (analysis.most_likely_conditions[0].description) {
          message += `**Description:** ${analysis.most_likely_conditions[0].description}\n\n`;
        }
      }
      
      // Recommendations
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        message += `**Recommendations:**\n`;
        analysis.recommendations.forEach((rec, index) => {
          message += `${index + 1}. ${rec}\n`;
        });
        message += '\n';
      }
      
      // When to seek help
      if (analysis.when_to_seek_help) {
        message += `⚠️ **When to seek help:** ${analysis.when_to_seek_help}\n\n`;
      }
      
      // Red flags
      if (analysis.red_flags && analysis.red_flags.length > 0) {
        message += `🚩 **Warning signs:**\n`;
        analysis.red_flags.forEach(flag => {
          message += `• ${flag}\n`;
        });
        message += '\n';
      }
      
      // Disclaimer
      message += `📋 **Important:** ${analysis.disclaimer || 'This is for informational purposes only. Consult a healthcare provider for proper diagnosis.'}`;
      
      return {
        type: 'analysis',
        message: message,
        confidence: analysis.most_likely_conditions?.[0]?.confidence || 0.6,
        emergency_level: analysis.emergency_level || 'low'
      };
      
    } catch (error) {
      console.error('Format analysis response error:', error);
      return this.generateErrorResponse(language);
    }
  }
  
  // Generate error response when AI fails
  static generateErrorResponse(language = 'en') {
    const errorResponses = {
      en: 'I apologize, but I encountered an error analyzing your symptoms. Please consult a healthcare provider for proper evaluation. For emergencies, call 108.',
      hi: 'मुझे खुशी है कि आपने अपने लक्षणों का विश्लेषण करने में त्रुटि का सामना किया। कृपया उचित मूल्यांकन के लिए स्वास्थ्य सेवा प्रदाता से सलाह लें। आपातकाल के लिए 108 पर कॉल करें।',
      te: 'మీ లక్షణాలను విశ్లేషించడంలో నేను లోపాన్ని ఎదుర్కొన్నాను. దయచేసి సరైన మూల్యాంకనం కోసం ఆరోగ్య సేవా ప్రదాతను సంప్రదించండి. అత్యవసర పరిస్థితుల్లో 108కి కాల్ చేయండి।',
      ta: 'உங்கள் அறிகுறிகளை பகுப்பாய்வு செய்வதில் பிழை ஏற்பட்டது. சரியான மதிப்பீட்டிற்கு சுகாதார வழங்குநரை அணுகவும். அவசரநிலைகளுக்கு 108 ஐ அழைக்கவும்.'
    };
    
    return {
      type: 'error',
      message: errorResponses[language] || errorResponses.en
    };
  }

  // Log symptom query for analytics (simplified without database)
  static async logSymptomQuery(queryData) {
    try {
      // Log to console for now (can be extended to file logging or external service)
      const logEntry = {
        timestamp: new Date().toISOString(),
        patient_id: queryData.patient_id,
        query_text: queryData.query_text,
        language: queryData.language || 'en',
        analysis_type: queryData.analysis_type || 'unknown',
        confidence_score: queryData.confidence_score || 0,
        emergency_triggered: queryData.emergency_triggered || false
      };
      
      console.log('Symptom Query Log:', JSON.stringify(logEntry, null, 2));
      return true;
    } catch (error) {
      console.error('Log symptom query error:', error);
      return false;
    }
  }

  // Get disease details using AI (no database dependency)
  static async getDiseaseDetails(conditionName, language = 'en') {
    try {
      return await this.getDetailedMedicalInfo(conditionName, language);
    } catch (error) {
      console.error('Get disease details error:', error);
      return null;
    }
  }

  // Get health awareness content using AI
  static async getHealthAwareness(topic, language = 'en') {
    try {
      const languageMap = {
        'en': 'English',
        'hi': 'Hindi',
        'te': 'Telugu',
        'ta': 'Tamil',
        'bn': 'Bengali',
        'mr': 'Marathi'
      };

      const targetLanguage = languageMap[language] || 'English';
      
      const prompt = `Generate health awareness content about "${topic}" in ${targetLanguage}. Include:

1. **Key Facts**: 3-4 important facts about this health topic
2. **Prevention Tips**: Practical prevention advice
3. **Warning Signs**: When to seek medical help
4. **Action Steps**: What people should do

Keep it concise, practical, and suitable for general public. Use simple language and include relevant emojis.

Format as a brief awareness message under 200 words.`;

      const response = await getGeminiResponse(prompt, language);
      return response;
    } catch (error) {
      console.error('Get health awareness error:', error);
      
      const fallbackAwareness = {
        en: `🏥 **Health Awareness**\n\nStay informed about your health. Regular check-ups, healthy lifestyle, and early detection are key to preventing serious health issues.\n\n📞 For medical emergencies, call 108.`,
        hi: `🏥 **स्वास्थ्य जागरूकता**\n\nअपने स्वास्थ्य के बारे में जानकारी रखें। नियमित जांच, स्वस्थ जीवनशैली और शुरुआती पहचान गंभीर स्वास्थ्य समस्याओं को रोकने की कुंजी है।\n\n📞 चिकित्सा आपातकाल के लिए 108 पर कॉल करें।`
      };
      
      return fallbackAwareness[language] || fallbackAwareness.en;
    }
  }
}

module.exports = SymptomService;
