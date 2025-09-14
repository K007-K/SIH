// WhatsApp Templates for Disease Symptoms Education
// File: features/disease-symptoms/whatsapp/templates.js

class DiseaseSymptomTemplates {
  
  // Emergency response template
  static getEmergencyTemplate(language = 'en') {
    const templates = {
      'en': {
        message: '🚨 *EMERGENCY ALERT* 🚨\n\nCall *108* immediately or visit nearest hospital!\n\nThis appears to be a medical emergency. Do not delay seeking immediate medical attention.',
        quick_replies: ['Call 108', 'Find Hospital', 'More Info']
      },
      'hi': {
        message: '🚨 *आपातकालीन चेतावनी* 🚨\n\nतुरंत *108* पर कॉल करें या निकटतम अस्पताल जाएं!\n\nयह एक चिकित्सा आपातकाल लगता है। तत्काल चिकित्सा सहायता लेने में देरी न करें।',
        quick_replies: ['108 कॉल करें', 'अस्पताल खोजें', 'और जानकारी']
      },
      'te': {
        message: '🚨 *అత్యవసర హెచ్చరిక* 🚨\n\nవెంటనే *108*కి కాల్ చేయండి లేదా సమీప ఆసుపత్రికి వెళ్లండి!\n\nఇది వైద్య అత్యవసర పరిస్థితిగా కనిపిస్తోంది. వెంటనే వైద్య సహాయం తీసుకోవడంలో ఆలస్యం చేయవద్దు.',
        quick_replies: ['108కి కాల్ చేయండి', 'ఆసుపత్రి కనుగొనండి', 'మరింత సమాచారం']
      },
      'ta': {
        message: '🚨 *அவசர எச்சரிக்கை* 🚨\n\nஉடனடியாக *108* ஐ அழைக்கவும் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லுங்கள்!\n\nஇது ஒரு மருத்துவ அவசரநிலையாகத் தோன்றுகிறது. உடனடி மருத்துவ உதவியைப் பெறுவதில் தாமதம் செய்யாதீர்கள்.',
        quick_replies: ['108 ஐ அழைக்கவும்', 'மருத்துவமனையைக் கண்டறியவும்', 'மேலும் தகவல்']
      },
      'bn': {
        message: '🚨 *জরুরি সতর্কতা* 🚨\n\nঅবিলম্বে *১০৮* এ কল করুন বা নিকটতম হাসপাতালে যান!\n\nএটি একটি চিকিৎসা জরুরি অবস্থা বলে মনে হচ্ছে। অবিলম্বে চিকিৎসা সহায়তা নিতে দেরি করবেন না।',
        quick_replies: ['১০৮ এ কল করুন', 'হাসপাতাল খুঁজুন', 'আরও তথ্য']
      },
      'mr': {
        message: '🚨 *आणीबाणीचा इशारा* 🚨\n\nलगेच *108* वर कॉल करा किंवा जवळच्या रुग्णालयात जा!\n\nही एक वैद्यकीय आणीबाणी असल्याचे दिसते. तात्काळ वैद्यकीय मदत घेण्यास उशीर करू नका.',
        quick_replies: ['108 वर कॉल करा', 'रुग्णालय शोधा', 'अधिक माहिती']
      }
    };
    
    return templates[language] || templates['en'];
  }

  // Symptom checker result template
  static getSymptomResultTemplate(result, language = 'en') {
    const disclaimers = {
      'en': '⚠️ *For awareness only - Not medical diagnosis*',
      'hi': '⚠️ *केवल जानकारी के लिए - चिकित्सा निदान नहीं*',
      'te': '⚠️ *కేवలం అవగాహన కోసం - వైద్య నిర్ధారణ కాదు*',
      'ta': '⚠️ *விழிப்புணர்வுக்காக மட்டுமே - மருத்துவ நோயறிதல் அல்ல*',
      'bn': '⚠️ *শুধুমাত্র সচেতনতার জন্য - চিকিৎসা নির্ণয় নয়*',
      'mr': '⚠️ *फक्त जागरूकतेसाठी - वैद्यकीय निदान नाही*'
    };

    let message = `${disclaimers[language] || disclaimers['en']}\n\n`;
    
    if (result.suggested_diseases && result.suggested_diseases.length > 0) {
      const headers = {
        'en': '🔍 *Possible Related Conditions:*',
        'hi': '🔍 *संभावित संबंधित स्थितियां:*',
        'te': '🔍 *సంభావ్య సంబంధిత పరిస్థితులు:*',
        'ta': '🔍 *சாத்தியமான தொடர்புடைய நிலைமைகள்:*',
        'bn': '🔍 *সম্ভাব্য সংশ্লিষ্ট অবস্থা:*',
        'mr': '🔍 *संभाव्य संबंधित परिस्थिती:*'
      };
      
      message += `${headers[language] || headers['en']}\n`;
      
      result.suggested_diseases.slice(0, 3).forEach((disease, index) => {
        message += `${index + 1}. ${disease.name}\n`;
        if (disease.when_to_seek_help) {
          message += `   💡 ${disease.when_to_seek_help}\n`;
        }
      });
    }

    if (result.ai_recommendations) {
      message += `\n📋 *Health Awareness:*\n${result.ai_recommendations}\n`;
    }

    const footers = {
      'en': '\n🏥 *When to seek help:* Persistent or worsening symptoms\n📞 *Emergency:* Call 108',
      'hi': '\n🏥 *कब मदद लें:* लगातार या बिगड़ते लक्षण\n📞 *आपातकाल:* 108 पर कॉल करें',
      'te': '\n🏥 *ఎప్పుడు సహాయం తీసుకోవాలి:* నిరంతర లేదా మరింత తీవ్రమయ్యే లక్షణాలు\n📞 *అత్యవసరం:* 108కి కాల్ చేయండి',
      'ta': '\n🏥 *எப்போது உதவி பெறுவது:* தொடர்ச்சியான அல்லது மோசமாகும் அறிகுறிகள்\n📞 *அவசரம்:* 108 ஐ அழைக்கவும்',
      'bn': '\n🏥 *কখন সাহায্য নিতে হবে:* ক্রমাগত বা খারাপ হওয়া লক্ষণ\n📞 *জরুরি:* ১০৮ এ কল করুন',
      'mr': '\n🏥 *कधी मदत घ्यावी:* सतत किंवा वाढणारी लक्षणे\n📞 *आणीবाणी:* 108 वर कॉल करा'
    };

    message += footers[language] || footers['en'];

    return {
      message,
      quick_replies: ['More Info', 'Prevention Tips', 'Find Doctor', 'Emergency Help']
    };
  }

  // Disease information template
  static getDiseaseInfoTemplate(disease, language = 'en') {
    let message = `🦠 *${disease.name}*\n\n`;
    
    if (disease.description) {
      message += `📝 ${disease.description}\n\n`;
    }

    if (disease.prevention_tips) {
      const headers = {
        'en': '🛡️ *Prevention Tips:*',
        'hi': '🛡️ *रोकथाम के उपाय:*',
        'te': '🛡️ *నివారణ చిట్కాలు:*',
        'ta': '🛡️ *தடுப்பு குறிப்புகள்:*',
        'bn': '🛡️ *প্রতিরোধের টিপস:*',
        'mr': '🛡️ *प्रतिबंध टिप्स:*'
      };
      
      message += `${headers[language] || headers['en']}\n${disease.prevention_tips}\n\n`;
    }

    if (disease.when_to_seek_help) {
      const headers = {
        'en': '🏥 *When to seek medical help:*',
        'hi': '🏥 *कब चिकित्सा सहायता लें:*',
        'te': '🏥 *ఎప్పుడు వైద్య సహాయం తీసుకోవాలి:*',
        'ta': '🏥 *எப்போது மருத்துவ உதவி பெறுவது:*',
        'bn': '🏥 *কখন চিকিৎসা সাহায্য নিতে হবে:*',
        'mr': '🏥 *कधी वैद्यकीय मदत घ्यावी:*'
      };
      
      message += `${headers[language] || headers['en']}\n${disease.when_to_seek_help}\n\n`;
    }

    if (disease.emergency_signs) {
      message += `🚨 *Emergency Signs:*\n${disease.emergency_signs}\n\n`;
    }

    const footers = {
      'en': '📞 Emergency: Call 108 | 🏥 Find nearest PHC',
      'hi': '📞 आपातकाल: 108 कॉल करें | 🏥 निकटतम PHC खोजें',
      'te': '📞 అత్యవసరం: 108కి కాల్ చేయండి | 🏥 సమీప PHC కనుగొనండి',
      'ta': '📞 அவசரம்: 108 ஐ அழைக்கவும் | 🏥 அருகிலுள்ள PHC ஐக் கண்டறியவும்',
      'bn': '📞 জরুরি: ১০৮ এ কল করুন | 🏥 নিকটতম PHC খুঁজুন',
      'mr': '📞 आणीबाणी: 108 वर कॉल करा | 🏥 जवळचे PHC शोधा'
    };

    message += footers[language] || footers['en'];

    return {
      message,
      quick_replies: ['Symptoms', 'Prevention', 'Treatment Centers', 'Share Info']
    };
  }

  // Awareness campaign template
  static getCampaignTemplate(campaign, language = 'en') {
    let message = `📢 *${campaign.title}*\n\n`;
    message += `${campaign.content}\n\n`;
    
    if (campaign.media_url && campaign.media_type === 'image') {
      return {
        type: 'image',
        image: {
          link: campaign.media_url,
          caption: message
        },
        quick_replies: ['More Info', 'Share', 'Related Diseases']
      };
    }

    return {
      type: 'text',
      message,
      quick_replies: ['More Info', 'Share', 'Related Diseases']
    };
  }

  // Symptom input helper template
  static getSymptomInputHelper(language = 'en') {
    const templates = {
      'en': {
        message: '🔍 *Symptom Checker*\n\n⚠️ *For awareness only - Not medical diagnosis*\n\nPlease describe your symptoms:\n\nExample:\n• "Fever and headache"\n• "Stomach pain and nausea"\n• "Cough and body pain"\n\n*Remember:* For serious symptoms, consult a doctor immediately!',
        quick_replies: ['Common Symptoms', 'Emergency Help', 'Disease Info']
      },
      'hi': {
        message: '🔍 *लक्षण जांचकर्ता*\n\n⚠️ *केवल जानकारी के लिए - चिकित्सा निदान नहीं*\n\nकृपया अपने लक्षणों का वर्णन करें:\n\nउदाहरण:\n• "बुखार और सिरदर्द"\n• "पेट दर्द और जी मिचलाना"\n• "खांसी और शरीर में दर्द"\n\n*याद रखें:* गंभीर लक्षणों के लिए तुरंत डॉक्टर से सलाह लें!',
        quick_replies: ['सामान्य लक्षण', 'आपातकालीन सहायता', 'रोग की जानकारी']
      },
      'te': {
        message: '🔍 *లక్షణ తనిఖీ*\n\n⚠️ *కేవలం అవగాహన కోసం - వైద్య నిర్ధారణ కాదు*\n\nదయచేసి మీ లక్షణాలను వివరించండి:\n\nఉదాహరణ:\n• "జ్వరం మరియు తలనొప్పి"\n• "కడుపు నొప్పి మరియు వాంతులు"\n• "దగ్గు మరియు శరీర నొప్పులు"\n\n*గుర్తుంచుకోండి:* తీవ్రమైన లక్షణాలకు వెంటనే వైద్యుడిని సంప్రదించండి!',
        quick_replies: ['సాధారణ లక్షణాలు', 'అత్యవసర సహాయం', 'వ్యాధి సమాచారం']
      }
    };
    
    return templates[language] || templates['en'];
  }

  // Prevention tips template
  static getPreventionTipsTemplate(disease, language = 'en') {
    const headers = {
      'en': '🛡️ *Prevention Tips*',
      'hi': '🛡️ *रोकथाम के उपाय*',
      'te': '🛡️ *నివారణ చిట్కాలు*',
      'ta': '🛡️ *தடுப்பு குறிப்புகள்*',
      'bn': '🛡️ *প্রতিরোধের টিপস*',
      'mr': '🛡️ *प्रतिबंध टिप्स*'
    };

    let message = `${headers[language] || headers['en']}\n\n`;
    
    if (disease && disease.prevention_tips) {
      message += `*${disease.name}:*\n${disease.prevention_tips}\n\n`;
    }

    const generalTips = {
      'en': '🌟 *General Health Tips:*\n• Wash hands frequently\n• Drink clean water\n• Eat fresh, cooked food\n• Get adequate sleep\n• Exercise regularly\n• Avoid crowded places when sick',
      'hi': '🌟 *सामान्य स्वास्थ्य सुझाव:*\n• बार-बार हाथ धोएं\n• साफ पानी पिएं\n• ताजा, पका हुआ खाना खाएं\n• पर्याप्त नींद लें\n• नियमित व्यायाम करें\n• बीमार होने पर भीड़भाड़ वाली जगहों से बचें',
      'te': '🌟 *సాధారణ ఆరోగ్య చిట్కాలు:*\n• తరచుగా చేతులు కడుక్కోండి\n• శుభ్రమైన నీరు త్రాగండి\n• తాజా, వండిన ఆహారం తినండి\n• తగినంత నిద్రపోండి\n• క్రమం తప్పకుండా వ్యాయామం చేయండి\n• అనారోగ్యంతో ఉన్నప్పుడు రద్దీ ఉన్న ప్రాంతాలను తప్పించండి'
    };

    message += generalTips[language] || generalTips['en'];

    return {
      message,
      quick_replies: ['Disease Info', 'Symptom Check', 'Find Doctor', 'Emergency']
    };
  }

  // Quick reply options based on context
  static getContextualQuickReplies(context, language = 'en') {
    const replies = {
      'main_menu': {
        'en': ['Symptom Check', 'Disease Info', 'Prevention Tips', 'Emergency Help'],
        'hi': ['लक्षण जांच', 'रोग की जानकारी', 'रोकथाम के उपाय', 'आपातकालीन सहायता'],
        'te': ['లక్షణ తనిఖీ', 'వ్యాధి సమాచారం', 'నివారణ చిట్కాలు', 'అత్యవసర సహాయం']
      },
      'emergency': {
        'en': ['Call 108', 'Find Hospital', 'Emergency Signs', 'Back to Menu'],
        'hi': ['108 कॉल करें', 'अस्पताल खोजें', 'आपातकालीन संकेत', 'मेनू पर वापस'],
        'te': ['108కి కాల్ చేయండి', 'ఆసుపత్రి కనుగొనండి', 'అత్యవసర సంకేతాలు', 'మెనూకు తిరిగి']
      },
      'disease_info': {
        'en': ['Symptoms', 'Prevention', 'Treatment', 'Share Info'],
        'hi': ['लक्षण', 'रोकथाम', 'उपचार', 'जानकारी साझा करें'],
        'te': ['లక్షణాలు', 'నివారణ', 'చికిత్స', 'సమాచారం పంచుకోండి']
      }
    };

    return replies[context]?.[language] || replies[context]?.['en'] || [];
  }
}

module.exports = DiseaseSymptomTemplates;
