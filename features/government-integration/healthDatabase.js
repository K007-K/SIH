// Simulated Government Health Database Integration
// Mock implementation for SIH demonstration

const simulatedHealthDatabase = {
  // Simulated COWIN API data
  cowinData: {
    vaccinationCenters: [
      {
        center_id: 1001,
        name: "Primary Health Center Rajamahendravaram",
        address: "Main Road, Rajamahendravaram, East Godavari",
        district: "East Godavari",
        state: "Andhra Pradesh",
        pincode: "533101",
        lat: 17.0005,
        long: 81.8040,
        from: "09:00:00",
        to: "17:00:00",
        fee_type: "Free",
        sessions: [
          {
            session_id: "s1001",
            date: "2024-01-15",
            available_capacity: 150,
            min_age_limit: 18,
            vaccine: "COVISHIELD",
            slots: ["09:00AM-11:00AM", "11:00AM-01:00PM", "02:00PM-04:00PM"]
          }
        ]
      },
      {
        center_id: 1002,
        name: "Community Health Center Kakinada",
        address: "Hospital Road, Kakinada, East Godavari",
        district: "East Godavari",
        state: "Andhra Pradesh",
        pincode: "533001",
        lat: 16.9891,
        long: 82.2475,
        from: "10:00:00",
        to: "16:00:00",
        fee_type: "Free",
        sessions: [
          {
            session_id: "s1002",
            date: "2024-01-15",
            available_capacity: 200,
            min_age_limit: 12,
            vaccine: "COVAXIN",
            slots: ["10:00AM-12:00PM", "01:00PM-03:00PM", "03:00PM-05:00PM"]
          }
        ]
      }
    ],
    userVaccinationStatus: {
      "9876543210": {
        name: "Ramesh Kumar",
        age: 35,
        gender: "Male",
        mobile: "9876543210",
        doses: [
          {
            dose: 1,
            vaccine: "COVISHIELD",
            date: "2023-05-15",
            center: "PHC Rajamahendravaram",
            certificate_id: "12345678901234"
          },
          {
            dose: 2,
            vaccine: "COVISHIELD",
            date: "2023-08-20",
            center: "PHC Rajamahendravaram",
            certificate_id: "12345678901235"
          }
        ],
        next_due: null,
        status: "Fully Vaccinated"
      }
    }
  },

  // Simulated HMIS (Health Management Information System) data
  hmisData: {
    healthFacilities: [
      {
        facility_id: "AP_EG_001",
        name: "District Hospital Kakinada",
        type: "District Hospital",
        district: "East Godavari",
        state: "Andhra Pradesh",
        services: ["Emergency", "Surgery", "Maternity", "Pediatrics", "ICU"],
        bed_capacity: 300,
        available_beds: 45,
        doctors: 25,
        nurses: 60,
        contact: "0884-2345678",
        emergency_contact: "108"
      },
      {
        facility_id: "AP_EG_002",
        name: "PHC Rajamahendravaram",
        type: "Primary Health Center",
        district: "East Godavari",
        state: "Andhra Pradesh",
        services: ["OPD", "Vaccination", "Maternity", "Basic Emergency"],
        bed_capacity: 30,
        available_beds: 8,
        doctors: 3,
        nurses: 8,
        contact: "0883-2456789",
        emergency_contact: "108"
      }
    ],
    diseaseOutbreaks: [
      {
        outbreak_id: "OUT_2024_001",
        disease: "Dengue",
        district: "East Godavari",
        state: "Andhra Pradesh",
        cases_reported: 45,
        deaths: 0,
        status: "Active",
        alert_level: "Medium",
        start_date: "2024-01-10",
        affected_areas: ["Kakinada", "Rajamahendravaram", "Amalapuram"],
        prevention_measures: [
          "Eliminate stagnant water",
          "Use mosquito nets",
          "Seek immediate medical help for fever"
        ]
      }
    ]
  },

  // Simulated IDSP (Integrated Disease Surveillance Programme) data
  idspData: {
    weeklyReports: [
      {
        week: "2024-W02",
        district: "East Godavari",
        state: "Andhra Pradesh",
        diseases: {
          "Acute Diarrheal Disease": { cases: 23, deaths: 0 },
          "Enteric Fever": { cases: 8, deaths: 0 },
          "Viral Hepatitis": { cases: 5, deaths: 0 },
          "Malaria": { cases: 12, deaths: 0 },
          "Dengue": { cases: 15, deaths: 0 },
          "Chikungunya": { cases: 3, deaths: 0 }
        },
        trends: {
          "Dengue": "Increasing",
          "Malaria": "Stable",
          "Diarrheal Disease": "Decreasing"
        }
      }
    ],
    alerts: [
      {
        alert_id: "ALERT_2024_001",
        type: "Disease Outbreak",
        disease: "Dengue",
        severity: "Medium",
        district: "East Godavari",
        message: "Increased dengue cases reported. Take preventive measures.",
        issued_date: "2024-01-12",
        valid_until: "2024-01-26"
      }
    ]
  },

  // Simulated Ayushman Bharat data
  ayushmanBharatData: {
    beneficiaries: {
      "9876543210": {
        name: "Ramesh Kumar",
        family_id: "AB_AP_EG_123456",
        card_number: "93847562847362",
        status: "Active",
        family_members: 4,
        entitlement: 500000,
        used_amount: 25000,
        available_amount: 475000,
        last_treatment: {
          hospital: "District Hospital Kakinada",
          date: "2023-12-15",
          treatment: "Diabetes Management",
          amount: 5000
        }
      }
    },
    empanelledHospitals: [
      {
        hospital_id: "HOSP_AP_001",
        name: "District Hospital Kakinada",
        type: "Government",
        district: "East Godavari",
        state: "Andhra Pradesh",
        specialties: ["Cardiology", "Orthopedics", "General Surgery", "Pediatrics"],
        contact: "0884-2345678"
      }
    ]
  }
};

// Function to get vaccination centers by location
const getVaccinationCenters = async (district, state = "Andhra Pradesh") => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const centers = simulatedHealthDatabase.cowinData.vaccinationCenters.filter(
    center => center.district.toLowerCase().includes(district.toLowerCase()) &&
              center.state.toLowerCase().includes(state.toLowerCase())
  );
  
  return {
    success: true,
    data: centers,
    message: `Found ${centers.length} vaccination centers in ${district}`
  };
};

// Function to get user vaccination status
const getVaccinationStatus = async (mobileNumber) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const status = simulatedHealthDatabase.cowinData.userVaccinationStatus[mobileNumber];
  
  if (status) {
    return {
      success: true,
      data: status,
      message: "Vaccination status retrieved successfully"
    };
  } else {
    return {
      success: false,
      message: "No vaccination record found for this mobile number"
    };
  }
};

// Function to get nearby health facilities
const getNearbyHealthFacilities = async (district, facilityType = null) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  let facilities = simulatedHealthDatabase.hmisData.healthFacilities.filter(
    facility => facility.district.toLowerCase().includes(district.toLowerCase())
  );
  
  if (facilityType) {
    facilities = facilities.filter(
      facility => facility.type.toLowerCase().includes(facilityType.toLowerCase())
    );
  }
  
  return {
    success: true,
    data: facilities,
    message: `Found ${facilities.length} health facilities in ${district}`
  };
};

// Function to get disease outbreak alerts
const getDiseaseOutbreaks = async (district = null, state = "Andhra Pradesh") => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let outbreaks = simulatedHealthDatabase.hmisData.diseaseOutbreaks;
  
  if (district) {
    outbreaks = outbreaks.filter(
      outbreak => outbreak.district.toLowerCase().includes(district.toLowerCase())
    );
  }
  
  return {
    success: true,
    data: outbreaks,
    message: `Found ${outbreaks.length} active disease outbreaks`
  };
};

// Function to get weekly disease surveillance data
const getWeeklySurveillanceData = async (district, week = null) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  let reports = simulatedHealthDatabase.idspData.weeklyReports.filter(
    report => report.district.toLowerCase().includes(district.toLowerCase())
  );
  
  if (week) {
    reports = reports.filter(report => report.week === week);
  }
  
  return {
    success: true,
    data: reports,
    message: `Retrieved surveillance data for ${district}`
  };
};

// Function to get health alerts
const getHealthAlerts = async (district) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const alerts = simulatedHealthDatabase.idspData.alerts.filter(
    alert => alert.district.toLowerCase().includes(district.toLowerCase())
  );
  
  return {
    success: true,
    data: alerts,
    message: `Found ${alerts.length} active health alerts for ${district}`
  };
};

// Function to check Ayushman Bharat eligibility
const checkAyushmanEligibility = async (mobileNumber) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const beneficiary = simulatedHealthDatabase.ayushmanBharatData.beneficiaries[mobileNumber];
  
  if (beneficiary) {
    return {
      success: true,
      data: beneficiary,
      message: "Ayushman Bharat beneficiary found"
    };
  } else {
    return {
      success: false,
      message: "Not registered under Ayushman Bharat scheme"
    };
  }
};

// Function to get empanelled hospitals
const getEmpanelledHospitals = async (district, specialty = null) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let hospitals = simulatedHealthDatabase.ayushmanBharatData.empanelledHospitals.filter(
    hospital => hospital.district.toLowerCase().includes(district.toLowerCase())
  );
  
  if (specialty) {
    hospitals = hospitals.filter(
      hospital => hospital.specialties.some(
        spec => spec.toLowerCase().includes(specialty.toLowerCase())
      )
    );
  }
  
  return {
    success: true,
    data: hospitals,
    message: `Found ${hospitals.length} empanelled hospitals`
  };
};

// Function to generate government services menu
const generateGovServicesMenu = (language = 'en') => {
  const menuTexts = {
    en: {
      header: '🏛️ Government Health Services',
      body: 'Access government health databases and services:',
      options: {
        vaccination: '💉 Vaccination Centers',
        facilities: '🏥 Health Facilities',
        outbreaks: '🚨 Disease Alerts',
        ayushman: '💳 Ayushman Bharat'
      }
    },
    hi: {
      header: '🏛️ सरकारी स्वास्थ्य सेवाएं',
      body: 'सरकारी स्वास्थ्य डेटाबेस और सेवाओं तक पहुंच:',
      options: {
        vaccination: '💉 टीकाकरण केंद्र',
        facilities: '🏥 स्वास्थ्य सुविधाएं',
        outbreaks: '🚨 रोग अलर्ट',
        ayushman: '💳 आयुष्मान भारत'
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
              id: 'gov_vaccination',
              title: text.options.vaccination
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'gov_facilities',
              title: text.options.facilities
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'gov_outbreaks',
              title: text.options.outbreaks
            }
          }
        ]
      }
    }
  };
};

// Function to format government service response
const formatGovServiceResponse = (serviceType, data, language = 'en') => {
  const responseTexts = {
    en: {
      vaccination_centers: '💉 **Vaccination Centers Near You:**',
      health_facilities: '🏥 **Health Facilities in Your Area:**',
      disease_outbreaks: '🚨 **Active Disease Alerts:**',
      ayushman_status: '💳 **Ayushman Bharat Status:**'
    },
    hi: {
      vaccination_centers: '💉 **आपके पास टीकाकरण केंद्र:**',
      health_facilities: '🏥 **आपके क्षेत्र में स्वास्थ्य सुविधाएं:**',
      disease_outbreaks: '🚨 **सक्रिय रोग अलर्ट:**',
      ayushman_status: '💳 **आयुष्मान भारत स्थिति:**'
    }
  };
  
  const texts = responseTexts[language] || responseTexts.en;
  let response = '';
  
  switch (serviceType) {
    case 'vaccination_centers':
      response = `${texts.vaccination_centers}\n\n`;
      data.forEach((center, index) => {
        response += `**${index + 1}. ${center.name}**\n`;
        response += `📍 ${center.address}\n`;
        response += `⏰ ${center.from} - ${center.to}\n`;
        response += `💰 ${center.fee_type}\n`;
        if (center.sessions && center.sessions.length > 0) {
          response += `💉 Available: ${center.sessions[0].vaccine}\n`;
          response += `👥 Capacity: ${center.sessions[0].available_capacity}\n`;
        }
        response += `📞 Contact: 108 (Emergency)\n\n`;
      });
      break;
      
    case 'health_facilities':
      response = `${texts.health_facilities}\n\n`;
      data.forEach((facility, index) => {
        response += `**${index + 1}. ${facility.name}**\n`;
        response += `🏥 Type: ${facility.type}\n`;
        response += `🛏️ Beds: ${facility.available_beds}/${facility.bed_capacity} available\n`;
        response += `👨‍⚕️ Doctors: ${facility.doctors}\n`;
        response += `📞 Contact: ${facility.contact}\n`;
        response += `🚨 Emergency: ${facility.emergency_contact}\n\n`;
      });
      break;
      
    case 'disease_outbreaks':
      response = `${texts.disease_outbreaks}\n\n`;
      data.forEach((outbreak, index) => {
        response += `**${index + 1}. ${outbreak.disease} Outbreak**\n`;
        response += `📍 Area: ${outbreak.district}\n`;
        response += `📊 Cases: ${outbreak.cases_reported}\n`;
        response += `⚠️ Alert Level: ${outbreak.alert_level}\n`;
        response += `📅 Since: ${outbreak.start_date}\n`;
        response += `🛡️ **Prevention:**\n`;
        outbreak.prevention_measures.forEach(measure => {
          response += `• ${measure}\n`;
        });
        response += '\n';
      });
      break;
  }
  
  return response;
};

module.exports = {
  getVaccinationCenters,
  getVaccinationStatus,
  getNearbyHealthFacilities,
  getDiseaseOutbreaks,
  getWeeklySurveillanceData,
  getHealthAlerts,
  checkAyushmanEligibility,
  getEmpanelledHospitals,
  generateGovServicesMenu,
  formatGovServiceResponse,
  simulatedHealthDatabase
};
