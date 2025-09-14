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
              title: '🔍 Symptoms'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vaccination_tracker',
              title: '💉 Vaccines'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'health_alerts',
              title: '🚨 Alerts'
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
              title: '🛡️ Prevention'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'health_quiz',
              title: '🧠 Quiz'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'feedback',
              title: '⭐ Feedback'
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
              title: '📝 Describe'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'symptom_categories',
              title: '📋 Categories'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'emergency_check',
              title: '🚨 Emergency'
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
