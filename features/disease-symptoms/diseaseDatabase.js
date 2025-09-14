// Disease symptoms database with structured data for symptom checker

const diseaseDatabase = {
  // Common diseases with symptoms, severity, and recommendations
  fever: {
    name: "Fever",
    category: "general",
    symptoms: ["high temperature", "chills", "sweating", "headache", "muscle aches", "fatigue"],
    severity: "mild-moderate",
    causes: ["viral infection", "bacterial infection", "heat exhaustion", "medication reaction"],
    recommendations: [
      "Rest and drink plenty of fluids",
      "Take paracetamol/acetaminophen for comfort",
      "Monitor temperature regularly",
      "Seek medical attention if fever >102°F (39°C) or persists >3 days"
    ],
    emergency_signs: ["difficulty breathing", "severe headache", "stiff neck", "confusion", "persistent vomiting"],
    prevention: ["Good hygiene", "adequate rest", "proper nutrition", "vaccination as recommended"]
  },

  cold_flu: {
    name: "Common Cold/Flu",
    category: "respiratory",
    symptoms: ["runny nose", "sneezing", "cough", "sore throat", "congestion", "mild fever", "body aches"],
    severity: "mild",
    causes: ["viral infection", "seasonal changes", "weakened immunity"],
    recommendations: [
      "Rest and stay hydrated",
      "Use saline nasal drops for congestion",
      "Gargle with warm salt water for sore throat",
      "Take steam inhalation",
      "Avoid cold foods and drinks"
    ],
    emergency_signs: ["difficulty breathing", "chest pain", "high fever >102°F", "severe headache"],
    prevention: ["Frequent handwashing", "avoid close contact with sick people", "maintain good nutrition", "get adequate sleep"]
  },

  diarrhea: {
    name: "Diarrhea",
    category: "gastrointestinal",
    symptoms: ["loose stools", "frequent bowel movements", "abdominal cramps", "nausea", "dehydration"],
    severity: "mild-moderate",
    causes: ["food poisoning", "viral infection", "bacterial infection", "contaminated water", "stress"],
    recommendations: [
      "Stay well hydrated with ORS (Oral Rehydration Solution)",
      "Eat bland foods like rice, bananas, toast",
      "Avoid dairy, fatty, and spicy foods",
      "Take probiotics if available",
      "Rest and maintain hygiene"
    ],
    emergency_signs: ["severe dehydration", "blood in stool", "high fever", "severe abdominal pain", "signs of shock"],
    prevention: ["Safe drinking water", "proper food hygiene", "handwashing", "avoid street food"]
  },

  headache: {
    name: "Headache",
    category: "neurological",
    symptoms: ["head pain", "pressure sensation", "sensitivity to light", "nausea", "neck stiffness"],
    severity: "mild-moderate",
    causes: ["stress", "dehydration", "lack of sleep", "eye strain", "hormonal changes", "certain foods"],
    recommendations: [
      "Rest in a quiet, dark room",
      "Apply cold or warm compress to head/neck",
      "Stay hydrated",
      "Practice relaxation techniques",
      "Take paracetamol if needed"
    ],
    emergency_signs: ["sudden severe headache", "headache with fever and stiff neck", "headache after head injury", "vision changes", "confusion"],
    prevention: ["Regular sleep schedule", "stress management", "stay hydrated", "limit screen time", "regular meals"]
  },

  skin_rash: {
    name: "Skin Rash",
    category: "dermatological",
    symptoms: ["red patches", "itching", "bumps", "scaling", "swelling", "burning sensation"],
    severity: "mild-moderate",
    causes: ["allergic reaction", "infection", "heat", "contact with irritants", "insect bites"],
    recommendations: [
      "Keep affected area clean and dry",
      "Apply cool compress for relief",
      "Avoid scratching",
      "Use mild, fragrance-free soap",
      "Wear loose, breathable clothing"
    ],
    emergency_signs: ["difficulty breathing", "swelling of face/throat", "widespread rash with fever", "severe pain", "signs of infection"],
    prevention: ["Identify and avoid triggers", "maintain good hygiene", "use gentle skincare products", "protect from sun"]
  },

  diabetes_symptoms: {
    name: "Diabetes Warning Signs",
    category: "metabolic",
    symptoms: ["excessive thirst", "frequent urination", "unexplained weight loss", "fatigue", "blurred vision", "slow healing wounds"],
    severity: "moderate-severe",
    causes: ["insulin deficiency", "insulin resistance", "genetic factors", "lifestyle factors"],
    recommendations: [
      "Consult healthcare provider immediately for blood sugar testing",
      "Monitor symptoms closely",
      "Maintain healthy diet",
      "Stay physically active as tolerated",
      "Follow up with regular medical care"
    ],
    emergency_signs: ["severe dehydration", "difficulty breathing", "confusion", "loss of consciousness", "severe abdominal pain"],
    prevention: ["Healthy diet", "regular exercise", "maintain healthy weight", "regular health checkups", "family history awareness"]
  },

  hypertension: {
    name: "High Blood Pressure",
    category: "cardiovascular",
    symptoms: ["headaches", "dizziness", "shortness of breath", "chest pain", "nosebleeds", "fatigue"],
    severity: "moderate-severe",
    causes: ["lifestyle factors", "genetics", "stress", "obesity", "high salt intake", "lack of exercise"],
    recommendations: [
      "Monitor blood pressure regularly",
      "Reduce salt intake",
      "Exercise regularly",
      "Maintain healthy weight",
      "Manage stress",
      "Take prescribed medications as directed"
    ],
    emergency_signs: ["severe headache", "chest pain", "difficulty breathing", "vision problems", "confusion"],
    prevention: ["Healthy diet low in salt", "regular exercise", "maintain healthy weight", "limit alcohol", "don't smoke", "manage stress"]
  }
};

// Symptom categories for easy navigation
const symptomCategories = {
  respiratory: {
    name: "Respiratory Issues",
    icon: "🫁",
    symptoms: ["cough", "shortness of breath", "chest pain", "wheezing", "sore throat", "runny nose"]
  },
  gastrointestinal: {
    name: "Stomach & Digestion",
    icon: "🍽️",
    symptoms: ["nausea", "vomiting", "diarrhea", "constipation", "abdominal pain", "loss of appetite"]
  },
  neurological: {
    name: "Head & Nervous System",
    icon: "🧠",
    symptoms: ["headache", "dizziness", "confusion", "memory problems", "seizures", "numbness"]
  },
  dermatological: {
    name: "Skin & Hair",
    icon: "🩹",
    symptoms: ["rash", "itching", "swelling", "changes in moles", "hair loss", "nail changes"]
  },
  cardiovascular: {
    name: "Heart & Circulation",
    icon: "❤️",
    symptoms: ["chest pain", "palpitations", "swelling in legs", "fatigue", "dizziness"]
  },
  metabolic: {
    name: "Metabolism & Hormones",
    icon: "⚖️",
    symptoms: ["weight changes", "excessive thirst", "frequent urination", "fatigue", "temperature sensitivity"]
  },
  general: {
    name: "General Symptoms",
    icon: "🌡️",
    symptoms: ["fever", "fatigue", "weakness", "loss of appetite", "sleep problems"]
  }
};

// Emergency symptoms that require immediate medical attention
const emergencySymptoms = [
  "difficulty breathing",
  "chest pain",
  "severe bleeding",
  "loss of consciousness",
  "severe allergic reaction",
  "signs of stroke",
  "severe abdominal pain",
  "high fever with stiff neck",
  "severe dehydration",
  "poisoning symptoms"
];

// Function to search diseases by symptoms
const searchDiseasesBySymptoms = (userSymptoms) => {
  const matches = [];
  const userSymptomsLower = userSymptoms.map(s => s.toLowerCase());
  
  Object.keys(diseaseDatabase).forEach(diseaseKey => {
    const disease = diseaseDatabase[diseaseKey];
    const matchingSymptoms = disease.symptoms.filter(symptom => 
      userSymptomsLower.some(userSymptom => 
        symptom.toLowerCase().includes(userSymptom) || 
        userSymptom.includes(symptom.toLowerCase())
      )
    );
    
    if (matchingSymptoms.length > 0) {
      matches.push({
        disease: disease,
        matchingSymptoms: matchingSymptoms,
        matchScore: matchingSymptoms.length / disease.symptoms.length
      });
    }
  });
  
  // Sort by match score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

// Function to check for emergency symptoms
const checkEmergencySymptoms = (userSymptoms) => {
  const userSymptomsLower = userSymptoms.map(s => s.toLowerCase());
  
  return emergencySymptoms.filter(emergencySymptom =>
    userSymptomsLower.some(userSymptom =>
      emergencySymptom.toLowerCase().includes(userSymptom) ||
      userSymptom.includes(emergencySymptom.toLowerCase())
    )
  );
};

module.exports = {
  diseaseDatabase,
  symptomCategories,
  emergencySymptoms,
  searchDiseasesBySymptoms,
  checkEmergencySymptoms
};
