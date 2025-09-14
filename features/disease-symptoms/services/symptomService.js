// Disease Symptoms Service Layer
// File: features/disease-symptoms/services/symptomService.js

const { supabase } = require('../../../config/database');
const { getGeminiResponse } = require('../../../utils/aiUtils');

class SymptomService {
  
  // Check for emergency keywords in user input
  static async checkEmergencyKeywords(text, language = 'en') {
    try {
      const { data: keywords, error } = await supabase
        .from('emergency_keywords')
        .select('*');

      if (error) throw error;

      const lowerText = text.toLowerCase();
      
      for (const keyword of keywords) {
        const keywordField = language === 'hi' ? 'keyword_hi' : 
                            language === 'te' ? 'keyword_te' :
                            language === 'ta' ? 'keyword_ta' :
                            language === 'bn' ? 'keyword_bn' :
                            language === 'mr' ? 'keyword_mr' : 'keyword';
        
        const keywordToCheck = keyword[keywordField] || keyword.keyword;
        
        if (keywordToCheck && lowerText.includes(keywordToCheck.toLowerCase())) {
          const responseField = language === 'hi' ? 'auto_response_hi' :
                               language === 'te' ? 'auto_response_te' :
                               language === 'ta' ? 'auto_response_ta' :
                               language === 'bn' ? 'auto_response_bn' :
                               language === 'mr' ? 'auto_response_mr' : 'auto_response';
          
          return {
            isEmergency: true,
            severity: keyword.severity_level,
            response: keyword[responseField] || keyword.auto_response,
            keyword: keywordToCheck
          };
        }
      }
      
      return { isEmergency: false };
    } catch (error) {
      console.error('Emergency keyword check error:', error);
      return { isEmergency: false };
    }
  }

  // Find symptoms matching user input
  static async findMatchingSymptoms(symptoms, language = 'en') {
    try {
      if (!Array.isArray(symptoms) || symptoms.length === 0) {
        return [];
      }

      // Build OR query for symptom matching
      const orConditions = symptoms.map(symptom => {
        const field = language === 'hi' ? 'name_hi' : 
                     language === 'te' ? 'name_te' :
                     language === 'ta' ? 'name_ta' :
                     language === 'bn' ? 'name_bn' :
                     language === 'mr' ? 'name_mr' : 'name';
        return `${field}.ilike.%${symptom.trim()}%`;
      }).join(',');

      const { data: matchedSymptoms, error } = await supabase
        .from('symptoms')
        .select('*')
        .or(orConditions);

      if (error) throw error;

      return matchedSymptoms || [];
    } catch (error) {
      console.error('Find matching symptoms error:', error);
      return [];
    }
  }

  // Get diseases associated with symptoms
  static async getDiseasesForSymptoms(symptomIds, language = 'en') {
    try {
      if (!Array.isArray(symptomIds) || symptomIds.length === 0) {
        return [];
      }

      const { data: diseaseMatches, error } = await supabase
        .from('disease_symptoms')
        .select(`
          disease_id, frequency, severity,
          diseases(
            id, name, name_hi, name_te, name_ta, name_bn, name_mr,
            severity_level, description, description_hi, description_te, description_ta, description_bn, description_mr,
            when_to_seek_help, when_to_seek_help_hi, when_to_seek_help_te, when_to_seek_help_ta, when_to_seek_help_bn, when_to_seek_help_mr,
            emergency_signs, emergency_signs_hi, emergency_signs_te, emergency_signs_ta, emergency_signs_bn, emergency_signs_mr
          )
        `)
        .in('symptom_id', symptomIds);

      if (error) throw error;

      return diseaseMatches || [];
    } catch (error) {
      console.error('Get diseases for symptoms error:', error);
      return [];
    }
  }

  // Calculate confidence scores for disease matches
  static calculateDiseaseConfidence(diseaseMatches, totalSymptoms) {
    const diseaseScores = {};
    
    diseaseMatches.forEach(match => {
      const diseaseId = match.disease_id;
      
      if (!diseaseScores[diseaseId]) {
        diseaseScores[diseaseId] = {
          disease: match.diseases,
          score: 0,
          symptom_count: 0,
          matched_symptoms: []
        };
      }
      
      // Calculate weight based on frequency and severity
      let weight = 0.2; // base weight
      
      // Frequency weight
      if (match.frequency === 'common') weight += 0.4;
      else if (match.frequency === 'occasional') weight += 0.2;
      else if (match.frequency === 'rare') weight += 0.1;
      
      // Severity weight
      if (match.severity === 'severe') weight += 0.3;
      else if (match.severity === 'moderate') weight += 0.2;
      else if (match.severity === 'mild') weight += 0.1;
      
      diseaseScores[diseaseId].score += weight;
      diseaseScores[diseaseId].symptom_count += 1;
    });

    // Normalize scores and sort
    const rankedDiseases = Object.values(diseaseScores)
      .map(item => ({
        ...item,
        confidence_score: Math.min(item.score / totalSymptoms, 1.0)
      }))
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, 5); // Top 5 matches

    return rankedDiseases;
  }

  // Generate AI-powered health awareness content
  static async generateHealthAwareness(symptoms, language = 'en', matchedDiseases = []) {
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
      
      let prompt = `You are a healthcare awareness assistant for rural and semi-urban users. 
      
Based on these symptoms: ${symptoms.join(', ')}, provide brief health awareness information in ${targetLanguage}.

IMPORTANT GUIDELINES:
- This is for AWARENESS ONLY, never provide diagnosis or prescriptions
- Keep response under 100 words
- Use simple, easy-to-understand language
- Include when to seek medical help
- Mention emergency signs if relevant
- Start with "This is for awareness only, not medical diagnosis"
- If symptoms suggest serious condition, emphasize seeking immediate medical help
- Include call to action: "Call 108 for emergency or visit nearest PHC"

Focus on: prevention tips, when to seek help, and general health awareness.`;

      if (matchedDiseases.length > 0) {
        const diseaseNames = matchedDiseases.map(d => d.disease.name).join(', ');
        prompt += `\n\nPossible related conditions for awareness: ${diseaseNames}`;
      }

      const aiResponse = await getGeminiResponse(prompt);
      return aiResponse;
    } catch (error) {
      console.error('Generate health awareness error:', error);
      
      // Fallback response based on language
      const fallbackResponses = {
        'hi': 'यह केवल जानकारी के लिए है। गंभीर लक्षणों के लिए तुरंत डॉक्टर से मिलें। आपातकाल के लिए 108 पर कॉल करें।',
        'te': 'ఇది కేవలం అవగాహన కోసం. తీవ్రమైన లక్షణాలకు వెంటనే వైద్యుడిని సంప్రదించండి. అత్యవసర పరిస్థితుల్లో 108కి కాల్ చేయండి.',
        'ta': 'இது விழிப்புணர்வுக்காக மட்டுமே. கடுமையான அறிகுறிகளுக்கு உடனடியாக மருத்துவரை அணுகவும். அவசரநிலைக்கு 108 ஐ அழைக்கவும்.',
        'bn': 'এটি শুধুমাত্র সচেতনতার জন্য। গুরুতর লক্ষণের জন্য অবিলম্বে ডাক্তারের সাথে যোগাযোগ করুন। জরুরি অবস্থায় ১০৮ এ কল করুন।',
        'mr': 'हे फक्त जागरूकतेसाठी आहे. गंभीर लक्षणांसाठी लगेच डॉक्टरांना भेटा. आणीबाणीसाठी 108 वर कॉल करा।',
        'en': 'This is for awareness only, not medical diagnosis. For serious symptoms, consult a doctor immediately. Call 108 for emergency.'
      };
      
      return fallbackResponses[language] || fallbackResponses['en'];
    }
  }

  // Log symptom query for analytics
  static async logSymptomQuery(queryData) {
    try {
      const { error } = await supabase
        .from('symptom_queries')
        .insert({
          patient_id: queryData.patient_id,
          query_text: queryData.query_text,
          language: queryData.language || 'en',
          matched_symptoms: queryData.matched_symptoms || [],
          suggested_diseases: queryData.suggested_diseases || [],
          confidence_score: queryData.confidence_score || 0,
          emergency_triggered: queryData.emergency_triggered || false
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Log symptom query error:', error);
      return false;
    }
  }

  // Get disease details with localization
  static async getDiseaseDetails(diseaseId, language = 'en') {
    try {
      const { data: disease, error } = await supabase
        .from('diseases')
        .select(`
          *,
          disease_symptoms(
            frequency, severity,
            symptoms(id, name, name_hi, name_te, name_ta, name_bn, name_mr, body_part, severity_indicator)
          ),
          awareness_campaigns(
            id, title, title_hi, title_te, title_ta, title_bn, title_mr,
            content, content_hi, content_te, content_ta, content_bn, content_mr,
            campaign_type, media_type, media_url
          )
        `)
        .eq('id', diseaseId)
        .single();

      if (error) throw error;
      if (!disease) return null;

      // Format response with localization
      return {
        id: disease.id,
        name: disease[`name_${language}`] || disease.name,
        description: disease[`description_${language}`] || disease.description,
        severity_level: disease.severity_level,
        is_contagious: disease.is_contagious,
        prevention_tips: disease[`prevention_tips_${language}`] || disease.prevention_tips,
        when_to_seek_help: disease[`when_to_seek_help_${language}`] || disease.when_to_seek_help,
        emergency_signs: disease[`emergency_signs_${language}`] || disease.emergency_signs,
        symptoms: disease.disease_symptoms.map(ds => ({
          id: ds.symptoms.id,
          name: ds.symptoms[`name_${language}`] || ds.symptoms.name,
          body_part: ds.symptoms.body_part,
          frequency: ds.frequency,
          severity: ds.severity,
          severity_indicator: ds.symptoms.severity_indicator
        })),
        campaigns: disease.awareness_campaigns.map(campaign => ({
          id: campaign.id,
          title: campaign[`title_${language}`] || campaign.title,
          content: campaign[`content_${language}`] || campaign.content,
          campaign_type: campaign.campaign_type,
          media_type: campaign.media_type,
          media_url: campaign.media_url
        }))
      };
    } catch (error) {
      console.error('Get disease details error:', error);
      return null;
    }
  }

  // Get active awareness campaigns
  static async getActiveCampaigns(filters = {}) {
    try {
      const { language = 'en', disease_id, campaign_type } = filters;

      let query = supabase
        .from('awareness_campaigns')
        .select('*')
        .eq('is_active', true);

      // Filter by date range
      const today = new Date().toISOString().split('T')[0];
      query = query.lte('start_date', today);
      query = query.gte('end_date', today);

      if (disease_id) {
        query = query.eq('disease_id', disease_id);
      }

      if (campaign_type) {
        query = query.eq('campaign_type', campaign_type);
      }

      const { data: campaigns, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign[`title_${language}`] || campaign.title,
        content: campaign[`content_${language}`] || campaign.content,
        campaign_type: campaign.campaign_type,
        target_audience: campaign.target_audience,
        media_type: campaign.media_type,
        media_url: campaign.media_url,
        start_date: campaign.start_date,
        end_date: campaign.end_date
      }));
    } catch (error) {
      console.error('Get active campaigns error:', error);
      return [];
    }
  }
}

module.exports = SymptomService;
