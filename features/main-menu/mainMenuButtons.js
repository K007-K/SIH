// Main menu system with WhatsApp interactive buttons for healthcare features

// Generate main healthcare menu buttons
const generateMainMenuButtons = (userLanguage = 'en') => {
  const translations = {
    en: {
      header: '🏥 Healthcare Assistant Menu',
      body: 'Welcome to your comprehensive healthcare assistant! Choose a service:',
      symptoms: '🔍 Symptoms',
      chat: '💬 Chat with AI',
      more: '📋 More Services'
    },
    hi: {
      header: '🏥 स्वास्थ्य सहायक मेनू',
      body: 'आपके व्यापक स्वास्थ्य सहायक में आपका स्वागत है! एक सेवा चुनें:',
      symptoms: '🔍 लक्षण',
      chat: '💬 AI से बात करें',
      more: '📋 अधिक सेवाएं'
    },
    hi_roman: {
      header: '🏥 Swasthya Sahayak Menu',
      body: 'Aapke vyapak swasthya sahayak mein aapka swagat hai! Ek seva chuniye:',
      symptoms: '🔍 Lakshan',
      chat: '💬 AI se Baat Karen',
      more: '📋 Adhik Sevayen'
    },
    te: {
      header: '🏥 ఆరోగ్య సహాయక మెనూ',
      body: 'మీ సమగ్ర ఆరోగ్య సహాయకుడికి స్వాగతం! ఒక సేవను ఎంచుకోండి:',
      symptoms: '🔍 లక్షణాలు',
      chat: '💬 AI తో చాట్ చేయండి',
      more: '📋 మరిన్ని సేవలు'
    },
    te_roman: {
      header: '🏥 Arogya Sahayaka Menu',
      body: 'Mee samagra arogya sahayakudiki swagatam! Oka sevanu enchukondi:',
      symptoms: '🔍 Lakshanalu',
      chat: '💬 AI tho Chat Cheyandi',
      more: '📋 Marini Sevalu'
    },
    ta: {
      header: '🏥 சுகாதார உதவியாளர் மெனு',
      body: 'உங்கள் விரிவான சுகாதார உதவியாளருக்கு வரவேற்கிறோம்! ஒரு சேவையைத் தேர்ந்தெடுக்கவும்:',
      symptoms: '🔍 அறிகுறிகள்',
      chat: '💬 AI உடன் அரட்டை',
      more: '📋 மேலும் சேவைகள்'
    },
    ta_roman: {
      header: '🏥 Sugathara Uthaviyalar Menu',
      body: 'Unga virivana sugathara uthaviyalarukku varaverpkirom! Oru sevaiyai thernthedukavum:',
      symptoms: '🔍 Arikurikal',
      chat: '💬 AI udan Arattai',
      more: '📋 Melum Sevaikal'
    },
    or: {
      header: '🏥 ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ ମେନୁ',
      body: 'ଆପଣଙ୍କର ବ୍ୟାପକ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକଙ୍କୁ ସ୍ୱାଗତ! ଏକ ସେବା ବାଛନ୍ତୁ:',
      symptoms: '🔍 ଲକ୍ଷଣ',
      chat: '💬 AI ସହିତ କଥା ହୁଅନ୍ତୁ',
      more: '📋 ଅଧିକ ସେବା'
    },
    or_roman: {
      header: '🏥 Swasthya Sahayaka Menu',
      body: 'Apankara byapaka swasthya sahayakankku swagata! Eka seva bachhantu:',
      symptoms: '🔍 Lakshana',
      chat: '💬 AI sahita Katha Huantu',
      more: '📋 Adhika Seva'
    }
  };

  const lang = translations[userLanguage] || translations.en;

  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: lang.header
      },
      body: {
        text: lang.body
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'symptom_checker',
              title: lang.symptoms
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'chat_with_ai',
              title: lang.chat
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'more_services',
              title: lang.more
            }
          }
        ]
      }
    }
  };
};

// Generate secondary menu for more features
const generateSecondaryMenuButtons = (userLanguage = 'en') => {
  const translations = {
    en: {
      header: '📚 More Health Services',
      body: 'Additional healthcare services and education:',
      vaccines: '💉 Vaccines',
      alerts: '🚨 Alerts',
      prevention: '🛡️ Prevention'
    },
    hi: {
      header: '📚 अधिक स्वास्थ्य सेवाएं',
      body: 'अतिरिक्त स्वास्थ्य सेवाएं और शिक्षा:',
      vaccines: '💉 टीके',
      alerts: '🚨 अलर्ट',
      prevention: '🛡️ बचाव'
    },
    hi_roman: {
      header: '📚 Adhik Swasthya Sevayen',
      body: 'Atirikt swasthya sevayen aur shiksha:',
      vaccines: '💉 Teeke',
      alerts: '🚨 Alert',
      prevention: '🛡️ Bachav'
    },
    te: {
      header: '📚 మరిన్ని ఆరోగ్య సేవలు',
      body: 'అదనపు ఆరోగ్య సేవలు మరియు విద్య:',
      vaccines: '💉 వ్యాక్సిన్లు',
      alerts: '🚨 హెచ్చరికలు',
      prevention: '🛡️ నివారణ'
    },
    te_roman: {
      header: '📚 Marini Arogya Sevalu',
      body: 'Adanapu arogya sevalu mariyu vidya:',
      vaccines: '💉 Vaccines',
      alerts: '🚨 Alerts',
      prevention: '🛡️ Nivarana'
    },
    ta: {
      header: '📚 மேலும் சுகாதார சேவைகள்',
      body: 'கூடுதல் சுகாதார சேவைகள் மற்றும் கல்வி:',
      vaccines: '💉 தடுப்பூசிகள்',
      alerts: '🚨 எச்சரிக்கைகள்',
      prevention: '🛡️ தடுப்பு'
    },
    ta_roman: {
      header: '📚 Melum Sugathara Sevaikal',
      body: 'Kooduthal sugathara sevaikal mattrum kalvi:',
      vaccines: '💉 Thaduppusikal',
      alerts: '🚨 Echarikaikal',
      prevention: '🛡️ Thaduppu'
    },
    or: {
      header: '📚 ଅଧିକ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
      body: 'ଅତିରିକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ଏବଂ ଶିକ୍ଷା:',
      vaccines: '💉 ଟିକା',
      alerts: '🚨 ସତର୍କତା',
      prevention: '🛡️ ନିବାରଣ'
    },
    or_roman: {
      header: '📚 Adhika Swasthya Seva',
      body: 'Atirikta swasthya seva ebam shiksha:',
      vaccines: '💉 Tika',
      alerts: '🚨 Satarkata',
      prevention: '🛡️ Nibarana'
    }
  };

  const lang = translations[userLanguage] || translations.en;

  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: lang.header
      },
      body: {
        text: lang.body
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'vaccination_tracker',
              title: lang.vaccines
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'health_alerts',
              title: lang.alerts
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'preventive_care',
              title: lang.prevention
            }
          }
        ]
      }
    }
  };
};

// Generate symptom checker flow buttons
const generateSymptomCheckerButtons = (userLanguage = 'en') => {
  const translations = {
    en: {
      header: '🔍 Symptom Checker',
      body: 'How would you like to check your symptoms?',
      describe: '📝 Describe',
      categories: '📋 Categories',
      emergency: '🚨 Emergency'
    },
    hi: {
      header: '🔍 लक्षण जांचकर्ता',
      body: 'आप अपने लक्षणों की जांच कैसे करना चाहते हैं?',
      describe: '📝 वर्णन करें',
      categories: '📋 श्रेणियां',
      emergency: '🚨 आपातकाल'
    },
    hi_roman: {
      header: '🔍 Lakshan Janchkarta',
      body: 'Aap apne lakshanon ki janch kaise karna chahte hain?',
      describe: '📝 Varnan Karen',
      categories: '📋 Shreniyan',
      emergency: '🚨 Apatkal'
    },
    te: {
      header: '🔍 లక్షణ పరీక్షకుడు',
      body: 'మీరు మీ లక్షణాలను ఎలా తనిఖీ చేయాలని అనుకుంటున్నారు?',
      describe: '📝 వివరించండి',
      categories: '📋 వర్గాలు',
      emergency: '🚨 అత్యవసరం'
    },
    te_roman: {
      header: '🔍 Lakshana Pareekshakudu',
      body: 'Meeru mee lakshanaalanu ela thanikhi cheyaalani anukuntunnaaru?',
      describe: '📝 Vivarinchandi',
      categories: '📋 Vargaalu',
      emergency: '🚨 Atyavasaram'
    },
    ta: {
      header: '🔍 அறிகுறி சரிபார்ப்பாளர்',
      body: 'உங்கள் அறிகுறிகளை எப்படி சரிபார்க்க விரும்புகிறீர்கள்?',
      describe: '📝 விவரிக்கவும்',
      categories: '📋 வகைகள்',
      emergency: '🚨 அவசரநிலை'
    },
    ta_roman: {
      header: '🔍 Arikuri Sariparpalar',
      body: 'Unga arikurikaḷai eppadi sariparkka virumbugireergal?',
      describe: '📝 Vivarikavum',
      categories: '📋 Vakaikal',
      emergency: '🚨 Avasarniḷai'
    },
    or: {
      header: '🔍 ଲକ୍ଷଣ ପରୀକ୍ଷକ',
      body: 'ଆପଣ ଆପଣଙ୍କର ଲକ୍ଷଣଗୁଡ଼ିକୁ କିପରି ଯାଞ୍ଚ କରିବାକୁ ଚାହାଁନ୍ତି?',
      describe: '📝 ବର୍ଣ୍ଣନା କରନ୍ତୁ',
      categories: '📋 ବର୍ଗଗୁଡ଼ିକ',
      emergency: '🚨 ଜରୁରୀକାଳୀନ'
    },
    or_roman: {
      header: '🔍 Lakshana Pareekshaka',
      body: 'Aapana aapankara lakshanaguḍikaku kipari yancha karibaku chahaanti?',
      describe: '📝 Barnana Karantu',
      categories: '📋 Bargaguḍika',
      emergency: '🚨 Jarurikalina'
    }
  };

  const lang = translations[userLanguage] || translations.en;

  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: lang.header
      },
      body: {
        text: lang.body
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'symptom_describe',
              title: lang.describe
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'symptom_categories',
              title: lang.categories
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'emergency_check',
              title: lang.emergency
            }
          }
        ]
      }
    }
  };
};

// Generate vaccination tracker buttons
const generateVaccinationButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '💉 Vaccination Tracker'
      },
      body: {
        text: 'Manage your vaccination schedule:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'vacc_schedule',
              title: '📅 Schedule'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_due',
              title: '⏰ Due Soon'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_info',
              title: 'ℹ️ Info'
            }
          }
        ]
      }
    }
  };
};

// Generate health alerts buttons
const generateHealthAlertsButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🚨 Health Alerts'
      },
      body: {
        text: 'Stay updated with health information:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'outbreak_alerts',
              title: '⚠️ Outbreaks'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'seasonal_health',
              title: '🌡️ Seasonal'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'local_health',
              title: '📍 Local News'
            }
          }
        ]
      }
    }
  };
};

// Generate preventive care buttons
const generatePreventiveCareButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🛡️ Preventive Healthcare'
      },
      body: {
        text: 'Learn about preventive health measures:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'nutrition_tips',
              title: '🥗 Nutrition'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'exercise_guide',
              title: '🏃 Exercise'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'hygiene_tips',
              title: '🧼 Hygiene'
            }
          }
        ]
      }
    }
  };
};

// Generate feedback collection buttons
const generateFeedbackButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '⭐ Your Feedback Matters'
      },
      body: {
        text: 'Help us improve our healthcare service:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'rate_response',
              title: '⭐ Rate'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'suggest_improvement',
              title: '💡 Suggest'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'report_issue',
              title: '🐛 Report'
            }
          }
        ]
      }
    }
  };
};

// Generate back navigation button
const generateBackButton = (backTo = 'main_menu') => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: 'What would you like to do next?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: backTo,
              title: '⬅️ Back to Menu'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'more_help',
              title: '❓ More Help'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'end_session',
              title: '✅ Done'
            }
          }
        ]
      }
    }
  };
};

module.exports = {
  generateMainMenuButtons,
  generateSecondaryMenuButtons,
  generateSymptomCheckerButtons,
  generateVaccinationButtons,
  generateHealthAlertsButtons,
  generatePreventiveCareButtons,
  generateFeedbackButtons,
  generateBackButton
};
