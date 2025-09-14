// Vaccination Schedule Tracker
// Comprehensive vaccination schedules for all age groups

const vaccinationSchedules = {
  // Infant and Child Vaccination Schedule (0-18 years)
  children: {
    birth: {
      vaccines: ['BCG', 'Hepatitis B (1st dose)', 'OPV (0 dose)'],
      age: 'At birth',
      description: {
        en: 'Essential vaccines given immediately after birth',
        hi: 'जन्म के तुरंत बाद दिए जाने वाले आवश्यक टीके',
        te: 'పుట్టిన వెంటనే ఇవ్వాల్సిన అవసరమైన వ్యాక్సిన్లు'
      }
    },
    '6_weeks': {
      vaccines: ['DPT (1st dose)', 'OPV (1st dose)', 'Hepatitis B (2nd dose)', 'Hib (1st dose)', 'Rotavirus (1st dose)', 'PCV (1st dose)'],
      age: '6 weeks',
      description: {
        en: 'First round of combination vaccines',
        hi: 'संयोजन टीकों का पहला दौर',
        te: 'కాంబినేషన్ వ్యాక్సిన్ల మొదటి రౌండ్'
      }
    },
    '10_weeks': {
      vaccines: ['DPT (2nd dose)', 'OPV (2nd dose)', 'Hib (2nd dose)', 'Rotavirus (2nd dose)', 'PCV (2nd dose)'],
      age: '10 weeks',
      description: {
        en: 'Second round of combination vaccines',
        hi: 'संयोजन टीकों का दूसरा दौर',
        te: 'కాంబినేషన్ వ్యాక్సిన్ల రెండవ రౌండ్'
      }
    },
    '14_weeks': {
      vaccines: ['DPT (3rd dose)', 'OPV (3rd dose)', 'Hib (3rd dose)', 'Rotavirus (3rd dose)', 'PCV (3rd dose)'],
      age: '14 weeks',
      description: {
        en: 'Third round of combination vaccines',
        hi: 'संयोजन टीकों का तीसरा दौर',
        te: 'కాంబినేషన్ వ్యాక్సిన్ల మూడవ రౌండ్'
      }
    },
    '6_months': {
      vaccines: ['Hepatitis B (3rd dose)', 'OPV (4th dose)'],
      age: '6 months',
      description: {
        en: 'Completion of Hepatitis B series',
        hi: 'हेपेटाइटिस बी श्रृंखला का समापन',
        te: 'హెపటైటిస్ బి సిరీస్ పూర్తి'
      }
    },
    '9_months': {
      vaccines: ['Measles (1st dose)', 'Vitamin A (1st dose)'],
      age: '9 months',
      description: {
        en: 'Measles protection and Vitamin A supplementation',
        hi: 'खसरा सुरक्षा और विटामिन ए पूरक',
        te: 'మీజిల్స్ రక్షణ మరియు విటమిన్ ఎ సప్లిమెంటేషన్'
      }
    },
    '12_months': {
      vaccines: ['Typhoid Conjugate Vaccine'],
      age: '12 months',
      description: {
        en: 'Protection against typhoid fever',
        hi: 'टाइफाइड बुखार से सुरक्षा',
        te: 'టైఫాయిడ్ జ్వరం నుండి రక్షణ'
      }
    },
    '16_18_months': {
      vaccines: ['DPT (1st booster)', 'OPV (5th dose)', 'Measles (2nd dose)', 'Vitamin A (2nd dose)'],
      age: '16-18 months',
      description: {
        en: 'First booster doses for continued protection',
        hi: 'निरंतर सुरक्षा के लिए पहली बूस्टर खुराक',
        te: 'నిరంతర రక్షణ కోసం మొదటి బూస్టర్ డోస్'
      }
    },
    '5_6_years': {
      vaccines: ['DPT (2nd booster)', 'OPV (6th dose)', 'Vitamin A (3rd dose)'],
      age: '5-6 years',
      description: {
        en: 'School entry booster vaccines',
        hi: 'स्कूल प्रवेश बूस्टर टीके',
        te: 'పాఠశాల ప్రవేశ బూస్టర్ వ్యాక్సిన్లు'
      }
    },
    '10_years': {
      vaccines: ['Tetanus Toxoid (TT)'],
      age: '10 years',
      description: {
        en: 'Tetanus protection for adolescents',
        hi: 'किशोरों के लिए टेटनस सुरक्षा',
        te: 'కిశోరవయస్కుల కోసం టెటనస్ రక్షణ'
      }
    },
    '16_years': {
      vaccines: ['Tetanus Toxoid (TT) - 2nd dose'],
      age: '16 years',
      description: {
        en: 'Second tetanus booster for adolescents',
        hi: 'किशोरों के लिए दूसरा टेटनस बूस्टर',
        te: 'కిశోరవయస్కుల కోసం రెండవ టెటనస్ బూస్టర్'
      }
    }
  },

  // Adult Vaccination Schedule
  adults: {
    'annual_flu': {
      vaccines: ['Influenza vaccine'],
      frequency: 'Annual',
      ageGroup: '18+ years',
      description: {
        en: 'Annual flu vaccination for all adults',
        hi: 'सभी वयस्कों के लिए वार्षिक फ्लू टीकाकरण',
        te: 'అన్ని పెద్దలకు వార్షిక ఫ్లూ వ్యాక్సినేషన్'
      }
    },
    'tetanus_booster': {
      vaccines: ['Tetanus-Diphtheria (Td)'],
      frequency: 'Every 10 years',
      ageGroup: '18+ years',
      description: {
        en: 'Tetanus and diphtheria booster every decade',
        hi: 'हर दशक में टेटनस और डिप्थीरिया बूस्टर',
        te: 'ప్రతి దశాబ్దంలో టెటనస్ మరియు డిఫ్తీరియా బూస్టర్'
      }
    },
    'hepatitis_b': {
      vaccines: ['Hepatitis B series (3 doses)'],
      frequency: 'One-time series',
      ageGroup: '18+ years (if not vaccinated)',
      description: {
        en: 'Hepatitis B protection for unvaccinated adults',
        hi: 'अटीकाकृत वयस्कों के लिए हेपेटाइटिस बी सुरक्षा',
        te: 'వ్యాక్సిన్ తీసుకోని పెద్దలకు హెపటైటిస్ బి రక్షణ'
      }
    },
    'pneumococcal': {
      vaccines: ['Pneumococcal vaccine'],
      frequency: 'One-time (65+ years)',
      ageGroup: '65+ years',
      description: {
        en: 'Pneumonia prevention for elderly',
        hi: 'बुजुर्गों के लिए निमोनिया रोकथाम',
        te: 'వృద్ధుల కోసం న్యుమోనియా నివారణ'
      }
    }
  },

  // Pregnancy Vaccination Schedule
  pregnancy: {
    'tetanus_toxoid': {
      vaccines: ['TT-1', 'TT-2'],
      timing: 'TT-1: As early as possible, TT-2: 4 weeks after TT-1',
      description: {
        en: 'Essential tetanus protection during pregnancy',
        hi: 'गर्भावस्था के दौरान आवश्यक टेटनस सुरक्षा',
        te: 'గర్భధారణ సమయంలో అవసరమైన టెటనస్ రక్షణ'
      }
    },
    'influenza': {
      vaccines: ['Influenza vaccine'],
      timing: 'Any trimester',
      description: {
        en: 'Flu protection for mother and baby',
        hi: 'मां और बच्चे के लिए फ्लू सुरक्षा',
        te: 'తల్లి మరియు బిడ్డ కోసం ఫ్లూ రక్షణ'
      }
    },
    'tdap': {
      vaccines: ['Tdap (Tetanus, Diphtheria, Pertussis)'],
      timing: '27-36 weeks of pregnancy',
      description: {
        en: 'Whooping cough protection for newborn',
        hi: 'नवजात के लिए काली खांसी सुरक्षा',
        te: 'నవజాత శిశువు కోసం వూపింగ్ కఫ్ రక్షణ'
      }
    }
  },

  // Special Risk Groups
  riskGroups: {
    'healthcare_workers': {
      vaccines: ['Hepatitis B', 'Influenza (annual)', 'MMR', 'Varicella', 'Tdap'],
      description: {
        en: 'Enhanced protection for healthcare workers',
        hi: 'स्वास्थ्य कर्मचारियों के लिए बढ़ी हुई सुरक्षा',
        te: 'ఆరోగ్య కార్యకర్తలకు మెరుగైన రక్షణ'
      }
    },
    'diabetics': {
      vaccines: ['Influenza (annual)', 'Pneumococcal', 'Hepatitis B'],
      description: {
        en: 'Additional protection for diabetic patients',
        hi: 'मधुमेह रोगियों के लिए अतिरिक्त सुरक्षा',
        te: 'మధుమేహ రోగులకు అదనపు రక్షణ'
      }
    },
    'elderly_65plus': {
      vaccines: ['Influenza (annual)', 'Pneumococcal', 'Zoster (Shingles)'],
      description: {
        en: 'Age-specific vaccines for seniors',
        hi: 'वरिष्ठों के लिए आयु-विशिष्ट टीके',
        te: 'సీనియర్లకు వయస్సు-నిర్దిష్ట వ్యాక్సిన్లు'
      }
    }
  }
};

// Vaccine information database
const vaccineInfo = {
  'BCG': {
    fullName: 'Bacillus Calmette-Guérin',
    protectsAgainst: 'Tuberculosis (TB)',
    sideEffects: 'Mild fever, small scar at injection site',
    importance: 'Critical for TB prevention in high-risk areas'
  },
  'DPT': {
    fullName: 'Diphtheria, Pertussis, Tetanus',
    protectsAgainst: 'Diphtheria, Whooping Cough, Tetanus',
    sideEffects: 'Mild fever, soreness at injection site',
    importance: 'Prevents three serious childhood diseases'
  },
  'OPV': {
    fullName: 'Oral Polio Vaccine',
    protectsAgainst: 'Poliomyelitis',
    sideEffects: 'Very rare, generally safe',
    importance: 'Essential for polio eradication'
  },
  'Measles': {
    fullName: 'Measles Vaccine',
    protectsAgainst: 'Measles',
    sideEffects: 'Mild fever, rash (rare)',
    importance: 'Prevents serious complications of measles'
  },
  'Hepatitis B': {
    fullName: 'Hepatitis B Vaccine',
    protectsAgainst: 'Hepatitis B infection',
    sideEffects: 'Mild soreness at injection site',
    importance: 'Prevents liver infection and cancer'
  }
};

// Function to get vaccination schedule by age group
const getVaccinationSchedule = (ageGroup, language = 'en') => {
  const schedule = vaccinationSchedules[ageGroup];
  if (!schedule) return null;
  
  const formattedSchedule = [];
  for (const [key, value] of Object.entries(schedule)) {
    formattedSchedule.push({
      period: key,
      age: value.age || value.timing || value.frequency,
      vaccines: value.vaccines,
      description: value.description[language] || value.description.en,
      ageGroup: value.ageGroup
    });
  }
  
  return formattedSchedule;
};

// Function to check vaccination status
const checkVaccinationStatus = (birthDate, completedVaccines = []) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const ageInMonths = Math.floor((today - birth) / (1000 * 60 * 60 * 24 * 30.44));
  const ageInYears = Math.floor(ageInMonths / 12);
  
  const dueVaccines = [];
  const overdueVaccines = [];
  
  // Check child vaccines if under 18
  if (ageInYears < 18) {
    const childSchedule = vaccinationSchedules.children;
    
    for (const [period, info] of Object.entries(childSchedule)) {
      let dueAge = 0;
      
      // Convert age to months for comparison
      if (period === 'birth') dueAge = 0;
      else if (period === '6_weeks') dueAge = 1.5;
      else if (period === '10_weeks') dueAge = 2.5;
      else if (period === '14_weeks') dueAge = 3.5;
      else if (period === '6_months') dueAge = 6;
      else if (period === '9_months') dueAge = 9;
      else if (period === '12_months') dueAge = 12;
      else if (period === '16_18_months') dueAge = 17;
      else if (period === '5_6_years') dueAge = 66; // 5.5 years
      else if (period === '10_years') dueAge = 120;
      else if (period === '16_years') dueAge = 192;
      
      if (ageInMonths >= dueAge) {
        for (const vaccine of info.vaccines) {
          if (!completedVaccines.includes(vaccine)) {
            if (ageInMonths > dueAge + 2) { // 2 months grace period
              overdueVaccines.push({
                vaccine,
                dueAge: info.age,
                period
              });
            } else {
              dueVaccines.push({
                vaccine,
                dueAge: info.age,
                period
              });
            }
          }
        }
      }
    }
  }
  
  return {
    ageInMonths,
    ageInYears,
    dueVaccines,
    overdueVaccines,
    completedVaccines
  };
};

// Function to generate vaccination reminder
const generateVaccinationReminder = (birthDate, completedVaccines = [], language = 'en') => {
  const status = checkVaccinationStatus(birthDate, completedVaccines);
  
  const reminderTexts = {
    en: {
      title: '💉 Vaccination Status & Reminders',
      age: `Child's Age: ${status.ageInYears} years, ${status.ageInMonths % 12} months`,
      overdue: '🚨 **OVERDUE VACCINES (Immediate Action Required):**',
      due: '⏰ **DUE VACCINES:**',
      upToDate: '✅ **Great! Your child is up to date with vaccinations.**',
      nextDue: '📅 **Next vaccines due:**',
      importance: '\n💡 **Why vaccinations are important:**\n• Protect against serious diseases\n• Build community immunity\n• Required for school admission\n• Prevent outbreaks in rural areas',
      reminder: '\n📍 **Visit your nearest:**\n• Primary Health Center (PHC)\n• Community Health Center (CHC)\n• Anganwadi Center\n• Government Hospital'
    },
    hi: {
      title: '💉 टीकाकरण स्थिति और अनुस्मारक',
      age: `बच्चे की उम्र: ${status.ageInYears} साल, ${status.ageInMonths % 12} महीने`,
      overdue: '🚨 **देर से लगने वाले टीके (तत्काल कार्रवाई आवश्यक):**',
      due: '⏰ **देय टीके:**',
      upToDate: '✅ **बहुत बढ़िया! आपका बच्चा टीकाकरण के साथ अप टू डेट है।**',
      nextDue: '📅 **अगले टीके देय:**',
      importance: '\n💡 **टीकाकरण क्यों महत्वपूर्ण है:**\n• गंभीर बीमारियों से सुरक्षा\n• सामुदायिक प्रतिरक्षा निर्माण\n• स्कूल प्रवेश के लिए आवश्यक\n• ग्रामीण क्षेत्रों में प्रспादन रोकना',
      reminder: '\n📍 **अपने निकटतम केंद्र पर जाएं:**\n• प्राथमिक स्वास्थ्य केंद्र (PHC)\n• सामुदायिक स्वास्थ्य केंद्र (CHC)\n• आंगनवाड़ी केंद्र\n• सरकारी अस्पताल'
    }
  };
  
  const texts = reminderTexts[language] || reminderTexts.en;
  let response = `${texts.title}\n\n${texts.age}\n\n`;
  
  if (status.overdueVaccines.length > 0) {
    response += `${texts.overdue}\n`;
    status.overdueVaccines.forEach(vaccine => {
      response += `• ${vaccine.vaccine} (was due at ${vaccine.dueAge})\n`;
    });
    response += '\n';
  }
  
  if (status.dueVaccines.length > 0) {
    response += `${texts.due}\n`;
    status.dueVaccines.forEach(vaccine => {
      response += `• ${vaccine.vaccine} (due at ${vaccine.dueAge})\n`;
    });
    response += '\n';
  }
  
  if (status.overdueVaccines.length === 0 && status.dueVaccines.length === 0) {
    response += `${texts.upToDate}\n`;
  }
  
  response += texts.importance;
  response += texts.reminder;
  
  return response;
};

// Function to get next vaccination due
const getNextVaccinationDue = (birthDate, completedVaccines = []) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const ageInMonths = Math.floor((today - birth) / (1000 * 60 * 60 * 24 * 30.44));
  
  const childSchedule = vaccinationSchedules.children;
  const upcomingVaccines = [];
  
  for (const [period, info] of Object.entries(childSchedule)) {
    let dueAge = 0;
    
    // Convert age to months
    if (period === 'birth') dueAge = 0;
    else if (period === '6_weeks') dueAge = 1.5;
    else if (period === '10_weeks') dueAge = 2.5;
    else if (period === '14_weeks') dueAge = 3.5;
    else if (period === '6_months') dueAge = 6;
    else if (period === '9_months') dueAge = 9;
    else if (period === '12_months') dueAge = 12;
    else if (period === '16_18_months') dueAge = 17;
    else if (period === '5_6_years') dueAge = 66;
    else if (period === '10_years') dueAge = 120;
    else if (period === '16_years') dueAge = 192;
    
    if (ageInMonths < dueAge) {
      for (const vaccine of info.vaccines) {
        if (!completedVaccines.includes(vaccine)) {
          upcomingVaccines.push({
            vaccine,
            dueAge: info.age,
            period,
            monthsUntilDue: dueAge - ageInMonths
          });
        }
      }
    }
  }
  
  return upcomingVaccines.sort((a, b) => a.monthsUntilDue - b.monthsUntilDue);
};

// Generate vaccination menu for WhatsApp
const generateVaccinationMenu = (language = 'en') => {
  const menuTexts = {
    en: {
      header: '💉 Vaccination Information',
      body: 'Select what you need help with:',
      options: {
        schedule: '📅 Vaccination Schedule',
        reminder: '⏰ Check Due Vaccines',
        info: 'ℹ️ Vaccine Information'
      }
    },
    hi: {
      header: '💉 टीकाकरण जानकारी',
      body: 'आपको किस चीज़ में मदद चाहिए:',
      options: {
        schedule: '📅 टीकाकरण अनुसूची',
        reminder: '⏰ देय टीके जांचें',
        info: 'ℹ️ टीका जानकारी'
      }
    }
  };
  
  const text = menuTexts[language] || menuTexts.en;
  
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: text.header
      },
      body: {
        text: text.body
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'vacc_schedule',
              title: text.options.schedule
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_reminder',
              title: text.options.reminder
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'vacc_info',
              title: text.options.info
            }
          }
        ]
      }
    }
  };
};

module.exports = {
  getVaccinationSchedule,
  checkVaccinationStatus,
  generateVaccinationReminder,
  getNextVaccinationDue,
  generateVaccinationMenu,
  vaccinationSchedules,
  vaccineInfo
};
