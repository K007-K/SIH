// Vaccination scheduler with age-based recommendations and interactive tracking

// Age-based vaccination schedule (India's Universal Immunization Programme)
const vaccinationSchedule = {
  birth: {
    vaccines: ['BCG', 'OPV-0', 'Hepatitis B-1'],
    description: 'Vaccines given at birth',
    importance: 'Critical for newborn protection'
  },
  '6_weeks': {
    vaccines: ['DPT-1', 'OPV-1', 'Hepatitis B-2', 'Hib-1', 'Rotavirus-1', 'PCV-1'],
    description: 'First round of routine vaccines',
    importance: 'Builds initial immunity'
  },
  '10_weeks': {
    vaccines: ['DPT-2', 'OPV-2', 'Hib-2', 'Rotavirus-2', 'PCV-2'],
    description: 'Second round of routine vaccines',
    importance: 'Strengthens immunity'
  },
  '14_weeks': {
    vaccines: ['DPT-3', 'OPV-3', 'Hib-3', 'Rotavirus-3', 'PCV-3', 'Hepatitis B-3'],
    description: 'Third round of routine vaccines',
    importance: 'Completes primary series'
  },
  '9_months': {
    vaccines: ['Measles-1', 'Vitamin A-1'],
    description: 'Measles protection',
    importance: 'Prevents serious complications'
  },
  '12_months': {
    vaccines: ['Hepatitis A-1'],
    description: 'Hepatitis A protection',
    importance: 'Liver protection'
  },
  '15_months': {
    vaccines: ['MMR-1', 'Varicella-1', 'PCV Booster'],
    description: 'MMR and Chickenpox vaccines',
    importance: 'Prevents multiple diseases'
  },
  '18_months': {
    vaccines: ['DPT Booster-1', 'OPV Booster', 'Hib Booster', 'Hepatitis A-2'],
    description: 'First booster doses',
    importance: 'Maintains immunity'
  },
  '2_years': {
    vaccines: ['Typhoid'],
    description: 'Typhoid protection',
    importance: 'Prevents typhoid fever'
  },
  '4_6_years': {
    vaccines: ['DPT Booster-2', 'OPV Booster-2', 'MMR-2', 'Varicella-2'],
    description: 'School entry boosters',
    importance: 'School readiness'
  },
  '10_12_years': {
    vaccines: ['Tdap', 'HPV (girls)', 'Meningococcal'],
    description: 'Pre-teen vaccines',
    importance: 'Adolescent protection'
  },
  'adult': {
    vaccines: ['Influenza (yearly)', 'Tdap (every 10 years)', 'COVID-19'],
    description: 'Adult routine vaccines',
    importance: 'Ongoing protection'
  },
  'pregnancy': {
    vaccines: ['Tdap', 'Influenza'],
    description: 'Pregnancy vaccines',
    importance: 'Protects mother and baby'
  },
  '65_plus': {
    vaccines: ['Pneumococcal', 'Shingles', 'Influenza (yearly)'],
    description: 'Senior citizen vaccines',
    importance: 'Age-related protection'
  }
};

// Vaccine information database
const vaccineInfo = {
  'BCG': {
    fullName: 'Bacille Calmette-Guérin',
    protects: 'Tuberculosis',
    sideEffects: 'Mild swelling at injection site',
    contraindications: 'Immunocompromised individuals'
  },
  'DPT': {
    fullName: 'Diphtheria, Pertussis, Tetanus',
    protects: 'Diphtheria, Whooping cough, Tetanus',
    sideEffects: 'Fever, soreness at injection site',
    contraindications: 'Severe illness, previous severe reaction'
  },
  'OPV': {
    fullName: 'Oral Polio Vaccine',
    protects: 'Poliomyelitis',
    sideEffects: 'Very rare - vaccine-associated paralytic polio',
    contraindications: 'Immunodeficiency, severe illness'
  },
  'MMR': {
    fullName: 'Measles, Mumps, Rubella',
    protects: 'Measles, Mumps, German measles',
    sideEffects: 'Mild fever, rash',
    contraindications: 'Pregnancy, immunodeficiency'
  },
  'Hepatitis B': {
    fullName: 'Hepatitis B Vaccine',
    protects: 'Hepatitis B infection',
    sideEffects: 'Soreness at injection site',
    contraindications: 'Severe yeast allergy'
  },
  'COVID-19': {
    fullName: 'COVID-19 Vaccine',
    protects: 'COVID-19 infection',
    sideEffects: 'Mild fever, fatigue, arm soreness',
    contraindications: 'Severe allergic reaction to previous dose'
  }
};

// Generate vaccination tracker buttons
const generateVaccinationTrackerButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '💉 Vaccination Tracker'
      },
      body: {
        text: 'Track and manage your vaccination schedule:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'vacc_age_schedule',
              title: '📅 Age Schedule'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_due_check',
              title: '⏰ Check Due'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_record',
              title: '📋 My Record'
            }
          }
        ]
      }
    }
  };
};

// Generate age group selection buttons
const generateAgeGroupButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '👶👧🧑👴 Select Age Group'
      },
      body: {
        text: 'Choose the age group for vaccination schedule:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'age_infant',
              title: '👶 Infant'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'age_child',
              title: '👧 Child'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'age_teen',
              title: '🧑 Teen'
            }
          }
        ]
      }
    }
  };
};

// Generate more age groups
const generateMoreAgeGroups = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '👨👩👴 More Age Groups'
      },
      body: {
        text: 'Additional age categories:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'age_adult',
              title: '👨 Adult'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'age_senior',
              title: '👴 Senior'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'age_pregnancy',
              title: '🤰 Pregnancy'
            }
          }
        ]
      }
    }
  };
};

// Generate vaccine information buttons
const generateVaccineInfoButtons = (vaccines) => {
  const buttons = vaccines.slice(0, 3).map((vaccine, index) => ({
    type: 'reply',
    reply: {
      id: `vaccine_info_${vaccine.replace(/[^a-zA-Z0-9]/g, '_')}`,
      title: `ℹ️ ${vaccine}`
    }
  }));

  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '💉 Vaccine Information'
      },
      body: {
        text: 'Get detailed information about vaccines:'
      },
      action: {
        buttons: buttons
      }
    }
  };
};

// Get vaccination schedule for age group
const getVaccinationScheduleForAge = (ageGroup) => {
  const schedules = {
    infant: ['birth', '6_weeks', '10_weeks', '14_weeks', '9_months', '12_months', '15_months', '18_months'],
    child: ['2_years', '4_6_years'],
    teen: ['10_12_years'],
    adult: ['adult'],
    senior: ['65_plus'],
    pregnancy: ['pregnancy']
  };

  const ageSchedules = schedules[ageGroup] || [];
  let response = `📅 **Vaccination Schedule for ${ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}**\n\n`;

  ageSchedules.forEach(ageKey => {
    const schedule = vaccinationSchedule[ageKey];
    if (schedule) {
      response += `**${ageKey.replace(/_/g, ' ').toUpperCase()}:**\n`;
      response += `• Vaccines: ${schedule.vaccines.join(', ')}\n`;
      response += `• ${schedule.description}\n`;
      response += `• Importance: ${schedule.importance}\n\n`;
    }
  });

  response += `*Always consult with your healthcare provider for personalized vaccination advice.*`;
  return response;
};

// Get vaccine detailed information
const getVaccineDetails = (vaccineName) => {
  const vaccine = vaccineInfo[vaccineName];
  if (!vaccine) {
    return `Sorry, I don't have detailed information about ${vaccineName}. Please consult your healthcare provider.`;
  }

  let response = `💉 **${vaccineName} Vaccine Information**\n\n`;
  response += `**Full Name:** ${vaccine.fullName}\n`;
  response += `**Protects Against:** ${vaccine.protects}\n`;
  response += `**Common Side Effects:** ${vaccine.sideEffects}\n`;
  response += `**Contraindications:** ${vaccine.contraindications}\n\n`;
  response += `*Always discuss with your healthcare provider before vaccination.*`;
  
  return response;
};

// Generate reminder setup buttons
const generateReminderButtons = () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: '⏰ Vaccination Reminders'
      },
      body: {
        text: 'Set up vaccination reminders:'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'reminder_setup',
              title: '🔔 Setup'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'reminder_view',
              title: '📋 View'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'reminder_update',
              title: '✏️ Update'
            }
          }
        ]
      }
    }
  };
};

module.exports = {
  vaccinationSchedule,
  vaccineInfo,
  generateVaccinationTrackerButtons,
  generateAgeGroupButtons,
  generateMoreAgeGroups,
  generateVaccineInfoButtons,
  getVaccinationScheduleForAge,
  getVaccineDetails,
  generateReminderButtons
};
