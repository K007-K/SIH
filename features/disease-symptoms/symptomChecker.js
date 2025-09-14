// Symptom checker functionality with WhatsApp interactive buttons

const { diseaseDatabase, symptomCategories, searchDiseasesBySymptoms, checkEmergencySymptoms } = require('./diseaseDatabase');

// Generate symptom category selection buttons
const generateSymptomCategoryButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '📋 Select Symptom Category'
      },
      body: {
        text: 'Choose the category that best describes your symptoms:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'category_respiratory',
              title: '🫁 Respiratory'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'category_gastrointestinal',
              title: '🍽️ Stomach Issues'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'category_neurological',
              title: '🧠 Head/Nervous'
            }
          }
        ]
      }
    }
  };
};

// Generate more symptom categories
const generateMoreSymptomCategories = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '📋 More Symptom Categories'
      },
      body: {
        text: 'Additional symptom categories:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'category_dermatological',
              title: '🩹 Skin Issues'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'category_cardiovascular',
              title: '❤️ Heart Issues'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'category_general',
              title: '🌡️ General Symptoms'
            }
          }
        ]
      }
    }
  };
};

// Generate emergency check buttons
const generateEmergencyCheckButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🚨 Emergency Symptom Check'
      },
      body: {
        text: 'Do you have any of these EMERGENCY symptoms?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'emergency_breathing',
              title: '😰 Breathing'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'emergency_chest',
              title: '💔 Chest Pain'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'emergency_other',
              title: '🆘 Other'
            }
          }
        ]
      }
    }
  };
};

// Process symptom description and provide analysis
const processSymptomDescription = async (symptoms, userLanguage = 'en') => {
  try {
    // Extract symptoms from user input
    const symptomList = extractSymptomsFromText(symptoms);
    
    // Check for emergency symptoms first
    const emergencySymptoms = checkEmergencySymptoms(symptomList);
    
    if (emergencySymptoms.length > 0) {
      return {
        type: 'emergency',
        message: `🚨 EMERGENCY: You mentioned symptoms that may require immediate medical attention: ${emergencySymptoms.join(', ')}.\n\n⚠️ Please seek immediate medical care or call emergency services.\n\n📞 Emergency Numbers:\n• India: 102 (Ambulance)\n• Emergency: 108\n• Police: 100`,
        buttons: generateEmergencyActionButtons()
      };
    }
    
    // Search for matching diseases
    const matches = searchDiseasesBySymptoms(symptomList);
    
    if (matches.length === 0) {
      return {
        type: 'no_match',
        message: 'I couldn\'t find specific matches for your symptoms. Please consult a healthcare provider for proper evaluation.',
        buttons: generateNoMatchButtons()
      };
    }
    
    // Return top matches with recommendations
    const topMatch = matches[0];
    const disease = topMatch.disease;
    
    let response = `🔍 **Symptom Analysis Results**\n\n`;
    response += `**Most likely condition:** ${disease.name}\n`;
    response += `**Matching symptoms:** ${topMatch.matchingSymptoms.join(', ')}\n\n`;
    response += `**Recommendations:**\n`;
    disease.recommendations.forEach((rec, index) => {
      response += `${index + 1}. ${rec}\n`;
    });
    
    response += `\n**⚠️ Seek immediate medical attention if you experience:**\n`;
    disease.emergency_signs.forEach(sign => {
      response += `• ${sign}\n`;
    });
    
    response += `\n**Prevention tips:**\n`;
    disease.prevention.forEach(tip => {
      response += `• ${tip}\n`;
    });
    
    response += `\n*This is for educational purposes only. Always consult a healthcare professional for proper diagnosis and treatment.*`;
    
    return {
      type: 'analysis',
      message: response,
      buttons: generateSymptomResultButtons(),
      disease: disease
    };
    
  } catch (error) {
    console.error('Error processing symptoms:', error);
    return {
      type: 'error',
      message: 'Sorry, I encountered an error analyzing your symptoms. Please try again or consult a healthcare provider.',
      buttons: generateSymptomCheckerButtons()
    };
  }
};

// Extract symptoms from user text input
const extractSymptomsFromText = (text) => {
  const commonSymptoms = [
    'fever', 'headache', 'cough', 'sore throat', 'runny nose', 'congestion',
    'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain',
    'chest pain', 'shortness of breath', 'dizziness', 'fatigue', 'weakness',
    'rash', 'itching', 'swelling', 'pain', 'ache', 'burning', 'stiffness'
  ];
  
  const textLower = text.toLowerCase();
  const foundSymptoms = [];
  
  commonSymptoms.forEach(symptom => {
    if (textLower.includes(symptom)) {
      foundSymptoms.push(symptom);
    }
  });
  
  // Also split text and look for individual words
  const words = textLower.split(/\s+/);
  words.forEach(word => {
    if (word.length > 3 && !foundSymptoms.includes(word)) {
      // Check if word is a potential symptom
      commonSymptoms.forEach(symptom => {
        if (symptom.includes(word) || word.includes(symptom)) {
          if (!foundSymptoms.includes(symptom)) {
            foundSymptoms.push(symptom);
          }
        }
      });
    }
  });
  
  return foundSymptoms;
};

// Generate emergency action buttons
const generateEmergencyActionButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🚨 Emergency Actions'
      },
      body: {
        text: 'What would you like to do?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'call_ambulance',
              title: '🚑 Call Ambulance'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'find_hospital',
              title: '🏥 Find Hospital'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'first_aid',
              title: '🩹 First Aid Tips'
            }
          }
        ]
      }
    }
  };
};

// Generate buttons when no symptom match found
const generateNoMatchButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: 'How would you like to proceed?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'symptom_categories',
              title: '📋 Browse Categories'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'describe_again',
              title: '📝 Describe Again'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'consult_doctor',
              title: '👨‍⚕️ Find Doctor'
            }
          }
        ]
      }
    }
  };
};

// Generate buttons after symptom analysis results
const generateSymptomResultButtons = () => {
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
              id: 'more_info',
              title: 'ℹ️ More Information'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'find_doctor',
              title: '👨‍⚕️ Find Doctor'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'new_symptoms',
              title: '🔍 Check New Symptoms'
            }
          }
        ]
      }
    }
  };
};

module.exports = {
  generateSymptomCategoryButtons,
  generateMoreSymptomCategories,
  generateEmergencyCheckButtons,
  processSymptomDescription,
  extractSymptomsFromText,
  generateEmergencyActionButtons,
  generateNoMatchButtons,
  generateSymptomResultButtons
};
