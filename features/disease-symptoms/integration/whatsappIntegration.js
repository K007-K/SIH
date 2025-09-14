// WhatsApp Integration for Disease Symptoms Education
// File: features/disease-symptoms/integration/whatsappIntegration.js

const SymptomService = require('../services/symptomService');
const DiseaseSymptomTemplates = require('../whatsapp/templates');
const SafetyGuards = require('../utils/safetyGuards');
const { detectLanguage } = require('../../../utils/aiUtils');

class WhatsAppDiseaseIntegration {
  
  // Main handler for disease-related WhatsApp messages
  static async handleDiseaseQuery(message, contact, language = 'en') {
    try {
      const messageText = message.text?.body?.toLowerCase() || '';
      
      // Detect language if not provided
      if (!language || language === 'auto') {
        language = await detectLanguage(messageText);
      }
      
      // Check for emergency keywords first
      const emergencyCheck = await SafetyGuards.checkEmergencyKeywords(messageText, language);
      
      if (emergencyCheck.isEmergency) {
        // Log safety event
        await SafetyGuards.logSafetyEvent({
          type: 'emergency_keyword_triggered',
          severity: emergencyCheck.severity,
          input: messageText,
          keyword: emergencyCheck.keyword,
          response: emergencyCheck.response,
          patient_id: contact.id,
          language: language
        });
        
        return {
          type: 'emergency',
          template: DiseaseSymptomTemplates.getEmergencyTemplate(language),
          priority: 'critical'
        };
      }
      
      // Route based on message intent
      if (this.isSymptomQuery(messageText)) {
        return await this.handleSymptomChecker(messageText, contact, language);
      }
      
      if (this.isDiseaseInfoQuery(messageText)) {
        return await this.handleDiseaseInfo(messageText, contact, language);
      }
      
      if (this.isPreventionQuery(messageText)) {
        return await this.handlePreventionTips(messageText, contact, language);
      }
      
      // Default: Show symptom checker helper
      return {
        type: 'helper',
        template: DiseaseSymptomTemplates.getSymptomInputHelper(language)
      };
      
    } catch (error) {
      console.error('Disease query handling error:', error);
      return this.getErrorResponse(language);
    }
  }
  
  // Handle symptom checker queries
  static async handleSymptomChecker(messageText, contact, language) {
    try {
      // Extract symptoms from message
      const symptoms = this.extractSymptoms(messageText);
      
      // Validate input
      const validation = SafetyGuards.validateSymptomInput(symptoms);
      if (!validation.isValid) {
        return {
          type: 'error',
          message: validation.errors.join('. '),
          template: DiseaseSymptomTemplates.getSymptomInputHelper(language)
        };
      }
      
      // Check rate limiting
      const rateLimit = await SafetyGuards.checkRateLimit(contact.id);
      if (!rateLimit.allowed) {
        const rateLimitMessages = {
          'en': `You've reached the hourly limit for symptom checks. Please try again after ${rateLimit.resetTime.toLocaleTimeString()}.`,
          'hi': `आपने लक्षण जांच की घंटे की सीमा पूरी कर ली है। कृपया ${rateLimit.resetTime.toLocaleTimeString()} के बाद पुनः प्रयास करें।`,
          'te': `మీరు లక్షణ తనిఖీల గంట పరిమితిని చేరుకున్నారు. దయచేసి ${rateLimit.resetTime.toLocaleTimeString()} తర్వాత మళ్లీ ప్రయత్నించండి।`
        };
        
        return {
          type: 'rate_limit',
          message: rateLimitMessages[language] || rateLimitMessages['en']
        };
      }
      
      // Find matching symptoms
      const matchedSymptoms = await SymptomService.findMatchingSymptoms(symptoms, language);
      
      if (matchedSymptoms.length === 0) {
        return {
          type: 'no_match',
          message: this.getNoMatchMessage(language),
          template: DiseaseSymptomTemplates.getSymptomInputHelper(language)
        };
      }
      
      // Get diseases for symptoms
      const symptomIds = matchedSymptoms.map(s => s.id);
      const diseaseMatches = await SymptomService.getDiseasesForSymptoms(symptomIds, language);
      
      // Calculate confidence scores
      const rankedDiseases = SymptomService.calculateDiseaseConfidence(diseaseMatches, symptoms.length);
      
      // Generate AI recommendations
      const aiRecommendations = await SymptomService.generateHealthAwareness(symptoms, language, rankedDiseases);
      
      // Log the query
      await SymptomService.logSymptomQuery({
        patient_id: contact.id,
        query_text: messageText,
        language: language,
        matched_symptoms: symptomIds,
        suggested_diseases: rankedDiseases.map(d => d.disease.id),
        confidence_score: rankedDiseases[0]?.confidence_score || 0,
        emergency_triggered: false
      });
      
      // Format result
      const result = {
        matched_symptoms: matchedSymptoms.map(s => ({
          id: s.id,
          name: s[`name_${language}`] || s.name,
          severity: s.severity_indicator
        })),
        suggested_diseases: rankedDiseases.map(item => ({
          id: item.disease.id,
          name: item.disease[`name_${language}`] || item.disease.name,
          confidence_score: item.confidence_score,
          severity_level: item.disease.severity_level,
          when_to_seek_help: item.disease[`when_to_seek_help_${language}`] || item.disease.when_to_seek_help
        })),
        ai_recommendations: SafetyGuards.addSafetyDisclaimer(aiRecommendations, language)
      };
      
      return {
        type: 'symptom_result',
        template: DiseaseSymptomTemplates.getSymptomResultTemplate(result, language),
        data: result
      };
      
    } catch (error) {
      console.error('Symptom checker error:', error);
      return this.getErrorResponse(language);
    }
  }
  
  // Handle disease information queries
  static async handleDiseaseInfo(messageText, contact, language) {
    try {
      const diseaseName = this.extractDiseaseName(messageText);
      
      // Search for disease
      const { data: diseases, error } = await require('../../../config/database').supabase
        .from('diseases')
        .select('*')
        .or(`name.ilike.%${diseaseName}%,name_${language}.ilike.%${diseaseName}%`)
        .limit(1);
      
      if (error || !diseases || diseases.length === 0) {
        return {
          type: 'not_found',
          message: this.getDiseaseNotFoundMessage(language),
          template: DiseaseSymptomTemplates.getSymptomInputHelper(language)
        };
      }
      
      const disease = await SymptomService.getDiseaseDetails(diseases[0].id, language);
      
      return {
        type: 'disease_info',
        template: DiseaseSymptomTemplates.getDiseaseInfoTemplate(disease, language),
        data: disease
      };
      
    } catch (error) {
      console.error('Disease info error:', error);
      return this.getErrorResponse(language);
    }
  }
  
  // Handle prevention tips queries
  static async handlePreventionTips(messageText, contact, language) {
    try {
      const diseaseName = this.extractDiseaseName(messageText);
      let disease = null;
      
      if (diseaseName) {
        const { data: diseases } = await require('../../../config/database').supabase
          .from('diseases')
          .select('*')
          .or(`name.ilike.%${diseaseName}%,name_${language}.ilike.%${diseaseName}%`)
          .limit(1);
        
        disease = diseases?.[0] ? await SymptomService.getDiseaseDetails(diseases[0].id, language) : null;
      }
      
      return {
        type: 'prevention_tips',
        template: DiseaseSymptomTemplates.getPreventionTipsTemplate(disease, language)
      };
      
    } catch (error) {
      console.error('Prevention tips error:', error);
      return this.getErrorResponse(language);
    }
  }
  
  // Helper methods for message classification
  static isSymptomQuery(messageText) {
    const symptomKeywords = [
      'symptom', 'feel', 'pain', 'ache', 'fever', 'headache', 'cough', 'nausea',
      'लक्षण', 'दर्द', 'बुखार', 'सिरदर्द', 'खांसी',
      'లక్షణం', 'నొప్పి', 'జ్వరం', 'తలనొప్పి', 'దగ్గు',
      'அறிகுறி', 'வலி', 'காய்ச்சல்', 'தலைவலி', 'இருமல்'
    ];
    
    return symptomKeywords.some(keyword => messageText.includes(keyword.toLowerCase()));
  }
  
  static isDiseaseInfoQuery(messageText) {
    const infoKeywords = [
      'what is', 'tell me about', 'information', 'disease', 'condition',
      'क्या है', 'के बारे में बताएं', 'जानकारी', 'रोग', 'बीमारी',
      'ఏమిటి', 'గురించి చెప్పండి', 'సమాచారం', 'వ్యాధి', 'రోగం',
      'என்ன', 'பற்றி சொல்லுங்கள்', 'தகவல்', 'நோய்', 'வியாதி'
    ];
    
    return infoKeywords.some(keyword => messageText.includes(keyword.toLowerCase()));
  }
  
  static isPreventionQuery(messageText) {
    const preventionKeywords = [
      'prevent', 'prevention', 'avoid', 'tips', 'precaution',
      'रोकथाम', 'बचाव', 'सुझाव', 'सावधानी',
      'నివారణ', 'రక్షణ', 'చిట్కాలు', 'జాగ్రత్త',
      'தடுப்பு', 'பாதுகாப்பு', 'குறிப்புகள்', 'எச்சரிக்கை'
    ];
    
    return preventionKeywords.some(keyword => messageText.includes(keyword.toLowerCase()));
  }
  
  // Extract symptoms from message text
  static extractSymptoms(messageText) {
    // Simple extraction - split by common separators
    const separators = [',', 'and', 'also', 'with', '&', '+', 'और', 'भी', 'మరియు', 'కూడా', 'மற்றும்', 'கூட'];
    let symptoms = [messageText];
    
    for (const sep of separators) {
      symptoms = symptoms.flatMap(symptom => 
        symptom.split(new RegExp(`\\s+${sep}\\s+`, 'i'))
      );
    }
    
    return symptoms
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 100)
      .slice(0, 10); // Max 10 symptoms
  }
  
  // Extract disease name from message
  static extractDiseaseName(messageText) {
    // Remove common question words and extract the main term
    const stopWords = ['what', 'is', 'about', 'tell', 'me', 'information', 'क्या', 'है', 'के', 'बारे', 'में', 'ఏమిటి', 'గురించి', 'என்ன', 'பற்றி'];
    
    const words = messageText.split(/\s+/)
      .filter(word => !stopWords.includes(word.toLowerCase()))
      .filter(word => word.length > 2);
    
    return words.join(' ').trim();
  }
  
  // Error and fallback responses
  static getErrorResponse(language) {
    const errorMessages = {
      'en': 'I apologize, but I encountered an error processing your request. Please try again or contact support.',
      'hi': 'मुझे खुशी है, लेकिन आपके अनुरोध को संसाधित करने में त्रुटि हुई। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
      'te': 'క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో లోపం ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మద్దతును సంప్రదించండి।'
    };
    
    return {
      type: 'error',
      message: errorMessages[language] || errorMessages['en'],
      template: DiseaseSymptomTemplates.getSymptomInputHelper(language)
    };
  }
  
  static getNoMatchMessage(language) {
    const messages = {
      'en': 'I couldn\'t find matching symptoms in our database. Please describe your symptoms more clearly or consult a healthcare professional.',
      'hi': 'मुझे हमारे डेटाबेस में मेल खाते लक्षण नहीं मिले। कृपया अपने लक्षणों को अधिक स्पष्ट रूप से बताएं या किसी स्वास्थ्य पेशेवर से सलाह लें।',
      'te': 'మా డేటాబేస్‌లో సరిపోలే లక్షణాలు నాకు కనుగొనలేకపోయాను. దయచేసి మీ లక్షణాలను మరింత స్పష్టంగా వివరించండి లేదా ఆరోగ్య నిపుణుడిని సంప్రదించండి.'
    };
    
    return messages[language] || messages['en'];
  }
  
  static getDiseaseNotFoundMessage(language) {
    const messages = {
      'en': 'I couldn\'t find information about that condition in our database. Please check the spelling or try a different term.',
      'hi': 'मुझे हमारे डेटाबेस में उस स्थिति के बारे में जानकारी नहीं मिली। कृपया वर्तनी जांचें या कोई अन्य शब्द आज़माएं।',
      'te': 'మా డేటాబేస్‌లో ఆ పరిస్థితి గురించి సమాచారం నాకు కనుగొనలేకపోయింది. దయచేసి స్పెల్లింగ్ తనిఖీ చేయండి లేదా వేరే పదాన్ని ప్రయత్నించండి.'
    };
    
    return messages[language] || messages['en'];
  }
}

module.exports = WhatsAppDiseaseIntegration;
