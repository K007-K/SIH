// Main menu system with WhatsApp interactive buttons for healthcare features

// Generate main healthcare menu buttons
const generateMainMenuButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🏥 Healthcare Assistant Menu'
      },
      body: {
        text: 'Welcome to your comprehensive healthcare assistant! Choose a service:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'symptom_checker',
              title: '🔍 Symptom Checker'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vaccination_tracker',
              title: '💉 Vaccination Tracker'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'health_alerts',
              title: '🚨 Health Alerts'
            }
          }
        ]
      }
    }
  };
};

// Generate secondary menu for more features
const generateSecondaryMenuButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '📚 More Health Services'
      },
      body: {
        text: 'Additional healthcare services and education:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'preventive_care',
              title: '🛡️ Preventive Care'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'health_quiz',
              title: '🧠 Health Quiz'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'feedback',
              title: '⭐ Give Feedback'
            }
          }
        ]
      }
    }
  };
};

// Generate symptom checker flow buttons
const generateSymptomCheckerButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🔍 Symptom Checker'
      },
      body: {
        text: 'How would you like to check your symptoms?'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'symptom_describe',
              title: '📝 Describe Symptoms'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'symptom_categories',
              title: '📋 Browse by Category'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'emergency_check',
              title: '🚨 Emergency Check'
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
              title: '📅 My Schedule'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_due',
              title: '⏰ Due Vaccines'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_info',
              title: 'ℹ️ Vaccine Info'
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
              title: '⚠️ Outbreak Alerts'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'seasonal_health',
              title: '🌡️ Seasonal Health'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'local_health',
              title: '📍 Local Health News'
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
              title: '🥗 Nutrition Tips'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'exercise_guide',
              title: '🏃 Exercise Guide'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'hygiene_tips',
              title: '🧼 Hygiene Tips'
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
              title: '⭐ Rate Last Response'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'suggest_improvement',
              title: '💡 Suggest Improvement'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'report_issue',
              title: '🐛 Report Issue'
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
