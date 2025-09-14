// Real-time outbreak alerts and health monitoring system

// Mock outbreak data (in production, this would connect to WHO/CDC APIs)
const currentOutbreaks = {
  global: [
    {
      id: 'covid19_variant',
      disease: 'COVID-19 New Variant',
      location: 'Global',
      severity: 'moderate',
      description: 'New COVID-19 variant detected with increased transmissibility',
      recommendations: ['Continue mask wearing', 'Get vaccinated/boosted', 'Maintain social distancing'],
      lastUpdated: '2024-01-15',
      source: 'WHO'
    }
  ],
  india: [
    {
      id: 'dengue_outbreak',
      disease: 'Dengue Fever',
      location: 'Delhi, Mumbai, Bangalore',
      severity: 'high',
      description: 'Increased dengue cases reported in major cities',
      recommendations: ['Eliminate stagnant water', 'Use mosquito repellent', 'Seek medical care for fever'],
      lastUpdated: '2024-01-14',
      source: 'Ministry of Health'
    },
    {
      id: 'seasonal_flu',
      disease: 'Seasonal Influenza',
      location: 'Northern States',
      severity: 'moderate',
      description: 'Seasonal flu cases rising in northern regions',
      recommendations: ['Get flu vaccination', 'Practice good hygiene', 'Stay home if sick'],
      lastUpdated: '2024-01-13',
      source: 'ICMR'
    }
  ],
  regional: [
    {
      id: 'chikungunya_kerala',
      disease: 'Chikungunya',
      location: 'Kerala',
      severity: 'moderate',
      description: 'Chikungunya cases reported in coastal areas',
      recommendations: ['Vector control measures', 'Use protective clothing', 'Report symptoms early'],
      lastUpdated: '2024-01-12',
      source: 'Kerala Health Department'
    }
  ]
};

// Seasonal health alerts
const seasonalAlerts = {
  winter: {
    diseases: ['Influenza', 'Pneumonia', 'Common Cold', 'Asthma exacerbation'],
    recommendations: [
      'Get flu vaccination',
      'Dress warmly',
      'Maintain indoor air quality',
      'Stay hydrated',
      'Eat vitamin C rich foods'
    ],
    precautions: [
      'Avoid crowded places if possible',
      'Wash hands frequently',
      'Cover coughs and sneezes',
      'Keep indoor humidity optimal'
    ]
  },
  summer: {
    diseases: ['Heat stroke', 'Dehydration', 'Food poisoning', 'Vector-borne diseases'],
    recommendations: [
      'Stay hydrated',
      'Avoid peak sun hours',
      'Eat fresh, properly cooked food',
      'Use mosquito protection',
      'Wear light, breathable clothing'
    ],
    precautions: [
      'Check food expiry dates',
      'Eliminate stagnant water',
      'Use sunscreen',
      'Recognize heat exhaustion signs'
    ]
  },
  monsoon: {
    diseases: ['Dengue', 'Chikungunya', 'Malaria', 'Typhoid', 'Cholera', 'Hepatitis A'],
    recommendations: [
      'Eliminate breeding sites for mosquitoes',
      'Drink boiled/purified water',
      'Eat hot, freshly cooked food',
      'Use mosquito repellent',
      'Maintain personal hygiene'
    ],
    precautions: [
      'Avoid street food',
      'Keep surroundings clean',
      'Report fever immediately',
      'Use protective clothing'
    ]
  }
};

// Generate outbreak alerts buttons
const generateOutbreakAlertsButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🚨 Health Alerts & Outbreaks'
      },
      body: {
        text: 'Stay informed about current health alerts:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'current_outbreaks',
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
              id: 'local_alerts',
              title: '📍 Local News'
            }
          }
        ]
      }
    }
  };
};

// Generate outbreak level buttons
const generateOutbreakLevelButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🌍 Outbreak Information'
      },
      body: {
        text: 'Select the scope of outbreak information:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'global_outbreaks',
              title: '🌍 Global'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'india_outbreaks',
              title: '🇮🇳 India'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'regional_outbreaks',
              title: '📍 Regional'
            }
          }
        ]
      }
    }
  };
};

// Generate seasonal health buttons
const generateSeasonalHealthButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🌡️ Seasonal Health Guidance'
      },
      body: {
        text: 'Get health advice for different seasons:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'winter_health',
              title: '❄️ Winter'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'summer_health',
              title: '☀️ Summer'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'monsoon_health',
              title: '🌧️ Monsoon'
            }
          }
        ]
      }
    }
  };
};

// Get outbreak information by level
const getOutbreakInfo = (level) => {
  const outbreaks = currentOutbreaks[level] || [];
  
  if (outbreaks.length === 0) {
    return `No current ${level} outbreaks reported. Stay vigilant and follow general health precautions.`;
  }

  let response = `🚨 **Current ${level.charAt(0).toUpperCase() + level.slice(1)} Health Alerts**\n\n`;
  
  outbreaks.forEach((outbreak, index) => {
    const severityIcon = outbreak.severity === 'high' ? '🔴' : outbreak.severity === 'moderate' ? '🟡' : '🟢';
    
    response += `${severityIcon} **${outbreak.disease}**\n`;
    response += `📍 Location: ${outbreak.location}\n`;
    response += `📊 Severity: ${outbreak.severity.toUpperCase()}\n`;
    response += `📝 Description: ${outbreak.description}\n\n`;
    
    response += `**Recommendations:**\n`;
    outbreak.recommendations.forEach(rec => {
      response += `• ${rec}\n`;
    });
    
    response += `\n📅 Last Updated: ${outbreak.lastUpdated}\n`;
    response += `📋 Source: ${outbreak.source}\n`;
    
    if (index < outbreaks.length - 1) {
      response += `\n${'─'.repeat(30)}\n\n`;
    }
  });
  
  response += `\n*Stay informed and follow official health guidelines.*`;
  return response;
};

// Get seasonal health information
const getSeasonalHealthInfo = (season) => {
  const seasonData = seasonalAlerts[season];
  
  if (!seasonData) {
    return `Seasonal health information not available for ${season}.`;
  }

  const seasonIcons = {
    winter: '❄️',
    summer: '☀️',
    monsoon: '🌧️'
  };

  let response = `${seasonIcons[season]} **${season.charAt(0).toUpperCase() + season.slice(1)} Health Guidelines**\n\n`;
  
  response += `**Common ${season} health concerns:**\n`;
  seasonData.diseases.forEach(disease => {
    response += `• ${disease}\n`;
  });
  
  response += `\n**Recommendations:**\n`;
  seasonData.recommendations.forEach(rec => {
    response += `• ${rec}\n`;
  });
  
  response += `\n**Precautions:**\n`;
  seasonData.precautions.forEach(precaution => {
    response += `• ${precaution}\n`;
  });
  
  response += `\n*Follow these guidelines to stay healthy during ${season} season.*`;
  return response;
};

// Generate alert subscription buttons
const generateAlertSubscriptionButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '🔔 Health Alert Notifications'
      },
      body: {
        text: 'Manage your health alert subscriptions:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'subscribe_alerts',
              title: '🔔 Subscribe'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'alert_preferences',
              title: '⚙️ Preferences'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'unsubscribe_alerts',
              title: '🔕 Unsubscribe'
            }
          }
        ]
      }
    }
  };
};

// Mock function to get current season (in production, this would be dynamic)
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  return 'winter'; // Oct-Nov
};

// Get current season health alerts
const getCurrentSeasonAlerts = () => {
  const currentSeason = getCurrentSeason();
  return getSeasonalHealthInfo(currentSeason);
};

module.exports = {
  currentOutbreaks,
  seasonalAlerts,
  generateOutbreakAlertsButtons,
  generateOutbreakLevelButtons,
  generateSeasonalHealthButtons,
  getOutbreakInfo,
  getSeasonalHealthInfo,
  generateAlertSubscriptionButtons,
  getCurrentSeason,
  getCurrentSeasonAlerts
};
