// Preventive Healthcare Education Module
// Provides comprehensive health education content for rural/semi-urban populations

const preventiveHealthcareData = {
  // Nutrition and Diet
  nutrition: {
    en: {
      title: "🥗 Nutrition & Healthy Diet",
      content: `**Essential Nutrition Guidelines:**

🌾 **Balanced Diet Components:**
• Cereals & Grains: Rice, wheat, millets (50-60% of diet)
• Proteins: Dal, eggs, fish, chicken (15-20%)
• Vegetables: Green leafy, seasonal vegetables (20-25%)
• Fruits: Seasonal fruits rich in vitamins (10-15%)
• Dairy: Milk, curd for calcium (1-2 glasses daily)

🥛 **Daily Requirements:**
• Water: 8-10 glasses per day
• Salt: Less than 5g per day
• Sugar: Limit processed sweets
• Oil: 2-3 teaspoons per day

⚠️ **Foods to Avoid:**
• Processed and packaged foods
• Excessive oil and fried items
• Too much salt and sugar
• Stale or contaminated food

💡 **Tips for Rural Areas:**
• Use local seasonal vegetables
• Include traditional grains like ragi, bajra
• Consume fresh, home-cooked meals
• Store food properly to prevent contamination`,
      keywords: ['nutrition', 'diet', 'food', 'healthy eating', 'balanced diet']
    },
    hi: {
      title: "🥗 पोषण और स्वस्थ आहार",
      content: `**आवश्यक पोषण दिशानिर्देश:**

🌾 **संतुलित आहार के घटक:**
• अनाज: चावल, गेहूं, बाजरा (आहार का 50-60%)
• प्रोटीन: दाल, अंडे, मछली, चिकन (15-20%)
• सब्जियां: हरी पत्तेदार, मौसमी सब्जियां (20-25%)
• फल: विटामिन युक्त मौसमी फल (10-15%)
• डेयरी: दूध, दही कैल्शियम के लिए (दिन में 1-2 गिलास)

🥛 **दैनिक आवश्यकताएं:**
• पानी: दिन में 8-10 गिलास
• नमक: दिन में 5 ग्राम से कम
• चीनी: प्रसंस्कृत मिठाइयों को सीमित करें
• तेल: दिन में 2-3 चम्मच

⚠️ **बचने योग्य खाद्य पदार्थ:**
• प्रसंस्कृत और पैकेज्ड खाना
• अधिक तेल और तली हुई चीजें
• बहुत ज्यादा नमक और चीनी
• बासी या दूषित भोजन

💡 **ग्रामीण क्षेत्रों के लिए सुझाव:**
• स्थानीय मौसमी सब्जियों का उपयोग करें
• रागी, बाजरा जैसे पारंपरिक अनाज शामिल करें
• ताजा, घर का बना खाना खाएं
• संदूषण से बचने के लिए भोजन को सही तरीके से स्टोर करें`
    },
    te: {
      title: "🥗 పోషణ మరియు ఆరోగ్యకరమైన ఆహారం",
      content: `**అవసరమైన పోషణ మార్గదర్శకాలు:**

🌾 **సమతుల్య ఆహార భాగాలు:**
• ధాన్యాలు: బియ్యం, గోధుమలు, రాగులు (ఆహారంలో 50-60%)
• ప్రోటీన్లు: పప్పులు, గుడ్లు, చేపలు, కోడి (15-20%)
• కూరగాయలు: ఆకుకూరలు, కాలానుగుణ కూరగాయలు (20-25%)
• పండ్లు: విటమిన్లు అధికంగా ఉండే కాలానుగుణ పండ్లు (10-15%)
• పాల ఉత్పాదాలు: పాలు, పెరుగు కాల్షియం కోసం (రోజుకు 1-2 గ్లాసులు)

🥛 **రోజువారీ అవసరాలు:**
• నీరు: రోజుకు 8-10 గ్లాసులు
• ఉప్పు: రోజుకు 5 గ్రాముల కంటే తక్కువ
• చక్కెర: ప్రాసెస్ చేసిన తీపిని పరిమితం చేయండి
• నూనె: రోజుకు 2-3 టీస్పూన్లు

⚠️ **తప్పించవలసిన ఆహారాలు:**
• ప్రాసెస్ చేసిన మరియు ప్యాకేజీ చేసిన ఆహారాలు
• అధిక నూనె మరియు వేయించిన వస్తువులు
• చాలా ఎక్కువ ఉప్పు మరియు చక్కెర
• పాత లేదా కలుషితమైన ఆహారం

💡 **గ్రామీణ ప్రాంతాలకు చిట్కాలు:**
• స్థానిక కాలానుగుణ కూరగాయలను ఉపయోగించండి
• రాగి, సజ్జ వంటి సాంప్రదాయ ధాన్యాలను చేర్చండి
• తాజా, ఇంట్లో వండిన భోజనం తీసుకోండి
• కలుషణను నివారించడానికి ఆహారాన్ని సరిగ్గా నిల్వ చేయండి`
    }
  },

  // Personal Hygiene
  hygiene: {
    en: {
      title: "🧼 Personal Hygiene & Sanitation",
      content: `**Essential Hygiene Practices:**

🚿 **Daily Hygiene:**
• Bath daily with soap and clean water
• Brush teeth twice daily (morning & night)
• Wash hands frequently with soap for 20 seconds
• Keep nails short and clean
• Wear clean clothes daily

👐 **Hand Hygiene (Critical):**
• Before eating meals
• After using toilet
• After touching animals
• Before cooking food
• After coughing/sneezing
• When returning home

🏠 **Home Sanitation:**
• Keep living area clean and ventilated
• Dispose garbage properly in covered bins
• Clean water storage containers regularly
• Maintain clean kitchen and cooking utensils
• Keep toilets clean and disinfected

💧 **Water Safety:**
• Boil water if source is doubtful
• Store water in clean, covered containers
• Clean water storage tanks monthly
• Use separate utensils for drinking water

⚠️ **Disease Prevention:**
• Proper hygiene prevents 60% of diseases
• Reduces diarrhea, cholera, typhoid risk
• Prevents skin infections and respiratory diseases
• Essential for family health protection`,
      keywords: ['hygiene', 'sanitation', 'cleanliness', 'handwashing', 'water safety']
    },
    hi: {
      title: "🧼 व्यक्तिगत स्वच्छता और सफाई",
      content: `**आवश्यक स्वच्छता प्रथाएं:**

🚿 **दैनिक स्वच्छता:**
• रोज साबुन और साफ पानी से नहाएं
• दिन में दो बार दांत साफ करें (सुबह और रात)
• 20 सेकंड तक साबुन से हाथ धोएं
• नाखून छोटे और साफ रखें
• रोज साफ कपड़े पहनें

👐 **हाथों की सफाई (महत्वपूर्ण):**
• खाना खाने से पहले
• शौचालय इस्तेमाल के बाद
• जानवरों को छूने के बाद
• खाना बनाने से पहले
• खांसने/छींकने के बाद
• घर वापस आने पर

🏠 **घर की सफाई:**
• रहने की जगह को साफ और हवादार रखें
• कूड़े को ढके हुए डिब्बे में फेंकें
• पानी के बर्तनों को नियमित साफ करें
• रसोई और बर्तनों को साफ रखें
• शौचालय को साफ और कीटाणुरहित रखें

💧 **पानी की सुरक्षा:**
• संदिग्ध स्रोत का पानी उबालें
• साफ, ढके हुए बर्तनों में पानी स्टोर करें
• पानी की टंकी महीने में एक बार साफ करें
• पीने के पानी के लिए अलग बर्तन इस्तेमाल करें

⚠️ **बीमारी की रोकथाम:**
• उचित स्वच्छता 60% बीमारियों को रोकती है
• दस्त, हैजा, टाइफाइड का खतरा कम करती है
• त्वचा संक्रमण और सांस की बीमारियों को रोकती है
• पारिवारिक स्वास्थ्य सुरक्षा के लिए आवश्यक`
    }
  },

  // Exercise and Physical Activity
  exercise: {
    en: {
      title: "🏃‍♂️ Exercise & Physical Activity",
      content: `**Physical Activity Guidelines:**

🚶‍♀️ **Daily Activities (30 minutes minimum):**
• Brisk walking in morning/evening
• Household work and farming activities
• Climbing stairs instead of elevators
• Cycling for short distances
• Traditional exercises like yoga

💪 **Simple Exercises for Rural Areas:**
• Morning stretches (5-10 minutes)
• Squats and lunges (10-15 reps)
• Push-ups against wall (for beginners)
• Deep breathing exercises
• Walking meditation

🧘‍♀️ **Yoga & Traditional Practices:**
• Surya Namaskars (Sun Salutations)
• Pranayama (breathing exercises)
• Basic asanas for flexibility
• Meditation for mental health
• Traditional dance forms

⚡ **Benefits of Regular Exercise:**
• Strengthens heart and lungs
• Improves blood circulation
• Reduces diabetes and BP risk
• Enhances mental health
• Increases energy levels
• Better sleep quality

👥 **Community Activities:**
• Group walking in villages
• Traditional sports and games
• Community yoga sessions
• Farming as physical activity
• Festival celebrations with dancing

⚠️ **Safety Tips:**
• Start slowly and gradually increase
• Stay hydrated during exercise
• Avoid exercising in extreme heat
• Listen to your body
• Consult doctor if you have health conditions`,
      keywords: ['exercise', 'physical activity', 'yoga', 'walking', 'fitness']
    }
  },

  // Mental Health
  mentalHealth: {
    en: {
      title: "🧠 Mental Health & Well-being",
      content: `**Mental Health Awareness:**

😌 **Understanding Mental Health:**
• Mental health is as important as physical health
• Common issues: stress, anxiety, depression
• Affects daily life, relationships, and work
• Can be treated with proper care and support

🌱 **Signs of Good Mental Health:**
• Feeling positive about life
• Handling stress effectively
• Maintaining relationships
• Making decisions confidently
• Enjoying daily activities

⚠️ **Warning Signs to Watch:**
• Persistent sadness or worry
• Loss of interest in activities
• Changes in sleep or appetite
• Difficulty concentrating
• Thoughts of self-harm

🛠️ **Self-Care Strategies:**
• Regular sleep schedule (7-8 hours)
• Healthy eating and exercise
• Connect with family and friends
• Practice relaxation techniques
• Engage in hobbies and interests

🤝 **Community Support:**
• Talk to trusted family members
• Seek help from community elders
• Join local support groups
• Participate in religious/spiritual activities
• Help others in community

💡 **Stress Management:**
• Deep breathing exercises
• Meditation and prayer
• Time in nature
• Physical activity
• Limiting negative news/social media

🏥 **When to Seek Help:**
• Symptoms persist for weeks
• Interfering with daily life
• Thoughts of harming self/others
• Substance abuse problems
• Family/friends express concern

Remember: Mental health problems are treatable. Seeking help is a sign of strength, not weakness.`,
      keywords: ['mental health', 'stress', 'anxiety', 'depression', 'well-being']
    }
  }
};

// Function to get preventive healthcare content
const getPreventiveHealthcareContent = (topic, language = 'en') => {
  const content = preventiveHealthcareData[topic];
  if (!content) {
    return null;
  }
  
  return content[language] || content['en'];
};

// Function to search preventive healthcare topics
const searchPreventiveHealthcare = (query, language = 'en') => {
  const results = [];
  const searchQuery = query.toLowerCase();
  
  for (const [topic, content] of Object.entries(preventiveHealthcareData)) {
    const langContent = content[language] || content['en'];
    
    // Check if query matches title or keywords
    const titleMatch = langContent.title.toLowerCase().includes(searchQuery);
    const keywordMatch = langContent.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchQuery) || 
      searchQuery.includes(keyword.toLowerCase())
    );
    
    if (titleMatch || keywordMatch) {
      results.push({
        topic,
        title: langContent.title,
        content: langContent.content,
        relevance: titleMatch ? 2 : 1
      });
    }
  }
  
  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
};

// Function to get all available topics
const getAllPreventiveHealthcareTopics = (language = 'en') => {
  const topics = [];
  
  for (const [topic, content] of Object.entries(preventiveHealthcareData)) {
    const langContent = content[language] || content['en'];
    topics.push({
      topic,
      title: langContent.title,
      keywords: langContent.keywords
    });
  }
  
  return topics;
};

// Function to generate preventive healthcare menu
const generatePreventiveHealthcareMenu = (language = 'en') => {
  const menuTexts = {
    en: {
      header: '🏥 Preventive Healthcare Education',
      body: 'Select a topic to learn about preventive healthcare:',
      topics: {
        nutrition: '🥗 Nutrition & Diet',
        hygiene: '🧼 Hygiene & Sanitation',
        exercise: '🏃‍♂️ Exercise & Fitness',
        mentalHealth: '🧠 Mental Health'
      }
    },
    hi: {
      header: '🏥 निवारक स्वास्थ्य शिक्षा',
      body: 'निवारक स्वास्थ्य के बारे में जानने के लिए एक विषय चुनें:',
      topics: {
        nutrition: '🥗 पोषण और आहार',
        hygiene: '🧼 स्वच्छता और सफाई',
        exercise: '🏃‍♂️ व्यायाम और फिटनेस',
        mentalHealth: '🧠 मानसिक स्वास्थ्य'
      }
    }
  };
  
  const text = menuTexts[language] || menuTexts['en'];
  
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
              id: 'prev_nutrition',
              title: text.topics.nutrition
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'prev_hygiene',
              title: text.topics.hygiene
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'prev_exercise',
              title: text.topics.exercise
            }
          }
        ]
      }
    }
  };
};

module.exports = {
  getPreventiveHealthcareContent,
  searchPreventiveHealthcare,
  getAllPreventiveHealthcareTopics,
  generatePreventiveHealthcareMenu,
  preventiveHealthcareData
};
