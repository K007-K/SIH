// Disease Symptoms Education Routes
// File: features/disease-symptoms/routes/diseaseRoutes.js

const express = require('express');
const router = express.Router();
const { supabase } = require('../../../config/database');
const { detectLanguage, getGeminiResponse } = require('../../../utils/aiUtils');

// Emergency keywords check
const checkEmergencyKeywords = async (text, language = 'en') => {
  try {
    const { data: keywords, error } = await supabase
      .from('emergency_keywords')
      .select('*')
      .eq('severity_level', 'emergency');

    if (error) throw error;

    const lowerText = text.toLowerCase();
    for (const keyword of keywords) {
      const keywordField = language === 'hi' ? 'keyword_hi' : 
                          language === 'te' ? 'keyword_te' :
                          language === 'ta' ? 'keyword_ta' :
                          language === 'bn' ? 'keyword_bn' :
                          language === 'mr' ? 'keyword_mr' : 'keyword';
      
      if (lowerText.includes(keyword[keywordField]?.toLowerCase() || keyword.keyword.toLowerCase())) {
        const responseField = language === 'hi' ? 'auto_response_hi' :
                             language === 'te' ? 'auto_response_te' :
                             language === 'ta' ? 'auto_response_ta' :
                             language === 'bn' ? 'auto_response_bn' :
                             language === 'mr' ? 'auto_response_mr' : 'auto_response';
        
        return {
          isEmergency: true,
          response: keyword[responseField] || keyword.auto_response
        };
      }
    }
    return { isEmergency: false };
  } catch (error) {
    console.error('Emergency check error:', error);
    return { isEmergency: false };
  }
};

// GET /api/diseases - Get all diseases with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, severity, language = 'en', search } = req.query;
    
    let query = supabase
      .from('diseases')
      .select(`
        id, name, name_hi, name_te, name_ta, name_bn, name_mr,
        description, description_hi, description_te, description_ta, description_bn, description_mr,
        severity_level, is_contagious,
        prevention_tips, prevention_tips_hi, prevention_tips_te, prevention_tips_ta, prevention_tips_bn, prevention_tips_mr,
        when_to_seek_help, when_to_seek_help_hi, when_to_seek_help_te, when_to_seek_help_ta, when_to_seek_help_bn, when_to_seek_help_mr,
        disease_category_mapping(disease_categories(name, name_hi, name_te, name_ta, name_bn, name_mr))
      `);

    if (category) {
      query = query.eq('disease_category_mapping.category_id', category);
    }
    
    if (severity) {
      query = query.eq('severity_level', severity);
    }

    if (search) {
      const searchField = language === 'hi' ? 'name_hi' :
                         language === 'te' ? 'name_te' :
                         language === 'ta' ? 'name_ta' :
                         language === 'bn' ? 'name_bn' :
                         language === 'mr' ? 'name_mr' : 'name';
      query = query.ilike(searchField, `%${search}%`);
    }

    const { data: diseases, error } = await query.limit(50);

    if (error) throw error;

    // Format response based on language
    const formattedDiseases = diseases.map(disease => ({
      id: disease.id,
      name: disease[`name_${language}`] || disease.name,
      description: disease[`description_${language}`] || disease.description,
      severity_level: disease.severity_level,
      is_contagious: disease.is_contagious,
      prevention_tips: disease[`prevention_tips_${language}`] || disease.prevention_tips,
      when_to_seek_help: disease[`when_to_seek_help_${language}`] || disease.when_to_seek_help
    }));

    res.json({
      success: true,
      data: formattedDiseases,
      count: formattedDiseases.length
    });

  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch diseases',
      message: error.message
    });
  }
});

// GET /api/diseases/:id - Get specific disease details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    const { data: disease, error } = await supabase
      .from('diseases')
      .select(`
        *,
        disease_symptoms(
          frequency, severity,
          symptoms(id, name, name_hi, name_te, name_ta, name_bn, name_mr, body_part, severity_indicator)
        ),
        awareness_campaigns(id, title, title_hi, title_te, title_ta, title_bn, title_mr, content, content_hi, content_te, content_ta, content_bn, content_mr, campaign_type, media_type, media_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!disease) {
      return res.status(404).json({
        success: false,
        error: 'Disease not found'
      });
    }

    // Format response
    const response = {
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

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Get disease details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch disease details',
      message: error.message
    });
  }
});

// POST /api/diseases/symptom-checker - Non-diagnostic symptom analysis
router.post('/symptom-checker', async (req, res) => {
  try {
    const { symptoms, patient_id, language = 'en' } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide symptoms array'
      });
    }

    // Check for emergency keywords first
    const symptomText = symptoms.join(' ');
    const emergencyCheck = await checkEmergencyKeywords(symptomText, language);
    
    if (emergencyCheck.isEmergency) {
      return res.json({
        success: true,
        emergency: true,
        message: emergencyCheck.response,
        data: {
          confidence_score: 1.0,
          matched_symptoms: [],
          suggested_diseases: [],
          recommendations: [emergencyCheck.response]
        }
      });
    }

    // Find matching symptoms in database
    const { data: matchedSymptoms, error: symptomsError } = await supabase
      .from('symptoms')
      .select('id, name, name_hi, name_te, name_ta, name_bn, name_mr, severity_indicator')
      .or(symptoms.map(symptom => {
        const field = language === 'hi' ? 'name_hi' : 
                     language === 'te' ? 'name_te' :
                     language === 'ta' ? 'name_ta' :
                     language === 'bn' ? 'name_bn' :
                     language === 'mr' ? 'name_mr' : 'name';
        return `${field}.ilike.%${symptom}%`;
      }).join(','));

    if (symptomsError) throw symptomsError;

    const matchedSymptomIds = matchedSymptoms.map(s => s.id);

    // Find diseases associated with these symptoms
    const { data: diseaseMatches, error: diseasesError } = await supabase
      .from('disease_symptoms')
      .select(`
        disease_id, frequency, severity,
        diseases(id, name, name_hi, name_te, name_ta, name_bn, name_mr, severity_level, when_to_seek_help, when_to_seek_help_hi, when_to_seek_help_te, when_to_seek_help_ta, when_to_seek_help_bn, when_to_seek_help_mr)
      `)
      .in('symptom_id', matchedSymptomIds);

    if (diseasesError) throw diseasesError;

    // Calculate confidence scores
    const diseaseScores = {};
    diseaseMatches.forEach(match => {
      const diseaseId = match.disease_id;
      if (!diseaseScores[diseaseId]) {
        diseaseScores[diseaseId] = {
          disease: match.diseases,
          score: 0,
          symptom_count: 0
        };
      }
      
      // Weight by frequency and severity
      let weight = 0.3; // base weight
      if (match.frequency === 'common') weight += 0.4;
      else if (match.frequency === 'occasional') weight += 0.2;
      
      if (match.severity === 'severe') weight += 0.3;
      else if (match.severity === 'moderate') weight += 0.2;
      
      diseaseScores[diseaseId].score += weight;
      diseaseScores[diseaseId].symptom_count += 1;
    });

    // Sort by confidence score
    const rankedDiseases = Object.values(diseaseScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 matches

    // Generate AI-powered recommendations
    const aiPrompt = `Based on these symptoms: ${symptoms.join(', ')}, provide brief health awareness information (not diagnosis) in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : language === 'ta' ? 'Tamil' : language === 'bn' ? 'Bengali' : 'Marathi'}. Include when to seek medical help. Keep under 100 words. Start with "This is for awareness only, not medical diagnosis."`;

    const aiResponse = await getGeminiResponse(aiPrompt);

    // Log the query for analytics
    if (patient_id) {
      await supabase
        .from('symptom_queries')
        .insert({
          patient_id,
          query_text: symptomText,
          language,
          matched_symptoms: matchedSymptomIds,
          suggested_diseases: rankedDiseases.map(d => d.disease.id),
          confidence_score: rankedDiseases[0]?.score || 0,
          emergency_triggered: false
        });
    }

    const response = {
      success: true,
      emergency: false,
      data: {
        matched_symptoms: matchedSymptoms.map(s => ({
          id: s.id,
          name: s[`name_${language}`] || s.name,
          severity: s.severity_indicator
        })),
        suggested_diseases: rankedDiseases.map(item => ({
          id: item.disease.id,
          name: item.disease[`name_${language}`] || item.disease.name,
          confidence_score: Math.min(item.score, 1.0),
          severity_level: item.disease.severity_level,
          when_to_seek_help: item.disease[`when_to_seek_help_${language}`] || item.disease.when_to_seek_help
        })),
        ai_recommendations: aiResponse,
        disclaimer: language === 'hi' ? 'यह केवल जानकारी के लिए है, चिकित्सा निदान नहीं है।' :
                   language === 'te' ? 'ఇది కేవలం అవగాహన కోసం, వైద్య నిర్ధారణ కాదు।' :
                   language === 'ta' ? 'இது விழிப்புணர்வுக்காக மட்டுமே, மருத்துவ நோயறிதல் அல்ல।' :
                   language === 'bn' ? 'এটি শুধুমাত্র সচেতনতার জন্য, চিকিৎসা নির্ণয় নয়।' :
                   language === 'mr' ? 'हे फक्त जागरूकतेसाठी आहे, वैद्यकीय निदान नाही।' :
                   'This is for awareness only, not medical diagnosis.'
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Symptom checker error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze symptoms',
      message: error.message
    });
  }
});

// GET /api/diseases/categories - Get disease categories
router.get('/categories/list', async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const { data: categories, error } = await supabase
      .from('disease_categories')
      .select('*')
      .order('name');

    if (error) throw error;

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category[`name_${language}`] || category.name,
      description: category.description,
      icon: category.icon
    }));

    res.json({
      success: true,
      data: formattedCategories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/diseases/campaigns - Get awareness campaigns
router.get('/campaigns/active', async (req, res) => {
  try {
    const { language = 'en', disease_id, campaign_type } = req.query;

    let query = supabase
      .from('awareness_campaigns')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString().split('T')[0]);

    if (disease_id) {
      query = query.eq('disease_id', disease_id);
    }

    if (campaign_type) {
      query = query.eq('campaign_type', campaign_type);
    }

    const { data: campaigns, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const formattedCampaigns = campaigns.map(campaign => ({
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

    res.json({
      success: true,
      data: formattedCampaigns
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
      message: error.message
    });
  }
});

// POST /api/diseases/feedback - User feedback on symptom checker
router.post('/feedback', async (req, res) => {
  try {
    const { query_id, feedback, patient_id } = req.body;

    if (!query_id || !feedback) {
      return res.status(400).json({
        success: false,
        error: 'Query ID and feedback are required'
      });
    }

    const { error } = await supabase
      .from('symptom_queries')
      .update({ user_feedback: feedback })
      .eq('id', query_id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Feedback recorded successfully'
    });

  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record feedback',
      message: error.message
    });
  }
});

module.exports = router;
