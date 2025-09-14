// WhatsApp Templates for Vaccination Tracker
// File: templates.js

class VaccinationWhatsAppTemplates {
    /**
     * Vaccination reminder message
     */
    static vaccinationReminder(data, language = 'en') {
        const templates = {
            en: `💉 *Vaccination Reminder*

Hello ${data.patientName}!

Your child's *${data.vaccineName}* (Dose ${data.doseNumber}) is due on *${data.dueDate}*.

📍 Visit your nearest vaccination center:
${data.centerName || 'Any government health center'}

⚠️ Important: Bring vaccination card and Aadhaar card.

Reply with:
• *YES* - to confirm appointment
• *RESCHEDULE* - to change date
• *INFO* - for more details`,

            hi: `💉 *टीकाकरण अनुस्मारक*

नमस्ते ${data.patientName}!

आपके बच्चे का *${data.vaccineName}* (खुराक ${data.doseNumber}) *${data.dueDate}* को देय है।

📍 अपने निकटतम टीकाकरण केंद्र पर जाएं:
${data.centerName || 'कोई भी सरकारी स्वास्थ्य केंद्र'}

⚠️ महत्वपूर्ण: टीकाकरण कार्ड और आधार कार्ड लाएं।

उत्तर दें:
• *हाँ* - अपॉइंटमेंट की पुष्टि के लिए
• *पुनर्निर्धारण* - तारीख बदलने के लिए
• *जानकारी* - अधिक विवरण के लिए`,

            te: `💉 *వ్యాక్సినేషన్ రిమైండర్*

హలో ${data.patientName}!

మీ పిల్లవాడి *${data.vaccineName}* (డోస్ ${data.doseNumber}) *${data.dueDate}*న వచ్చింది.

📍 మీ సమీప వ్యాక్సినేషన్ సెంటర్‌కు వెళ్లండి:
${data.centerName || 'ఏదైనా ప్రభుత్వ ఆరోగ్య కేంద్రం'}

⚠️ ముఖ్యమైనది: వ్యాక్సినేషన్ కార్డ్ మరియు ఆధార్ కార్డ్ తీసుకురండి.

జవాబు ఇవ్వండి:
• *అవును* - అపాయింట్‌మెంట్ ధృవీకరించడానికి
• *రీషెడ్యూల్* - తేదీ మార్చడానికి
• *సమాచారం* - మరిన్ని వివరాలకు`
        };

        return templates[language] || templates.en;
    }

    /**
     * Overdue vaccination alert
     */
    static overdueVaccinationAlert(data, language = 'en') {
        const templates = {
            en: `🚨 *URGENT: Vaccination Overdue*

Dear ${data.patientName},

Your child's *${data.vaccineName}* vaccination is *${data.daysOverdue} days overdue*.

⚠️ This is important for your child's health protection.

📍 Please visit immediately:
${data.nearestCenter || 'Nearest government health center'}

🆘 For emergency: Call 108

Reply *URGENT* for immediate assistance.`,

            hi: `🚨 *तत्काल: टीकाकरण में देरी*

प्रिय ${data.patientName},

आपके बच्चे का *${data.vaccineName}* टीकाकरण *${data.daysOverdue} दिन देर* से है।

⚠️ यह आपके बच्चे के स्वास्थ्य सुरक्षा के लिए महत्वपूर्ण है।

📍 कृपया तुरंत जाएं:
${data.nearestCenter || 'निकटतम सरकारी स्वास्थ्य केंद्र'}

🆘 आपातकाल के लिए: 108 पर कॉल करें

तत्काल सहायता के लिए *तत्काल* का उत्तर दें।`,

            te: `🚨 *అత్యవసరం: వ్యాక్సినేషన్ ఆలస్యం*

ప్రియమైన ${data.patientName},

మీ పిల్లవాడి *${data.vaccineName}* వ్యాక్సినేషన్ *${data.daysOverdue} రోజులు ఆలస్యం*గా ఉంది.

⚠️ ఇది మీ పిల్లవాడి ఆరోగ్య రక్షణకు ముఖ్యమైనది.

📍 దయచేసి వెంటనే వెళ్లండి:
${data.nearestCenter || 'సమీప ప్రభుత్వ ఆరోగ్య కేంద్రం'}

🆘 అత్యవసరానికి: 108కు కాల్ చేయండి

తక్షణ సహాయం కోసం *అత్యవసరం* అని జవాబు ఇవ్వండి.`
        };

        return templates[language] || templates.en;
    }

    /**
     * Vaccination completion confirmation
     */
    static vaccinationCompleted(data, language = 'en') {
        const templates = {
            en: `✅ *Vaccination Completed Successfully*

Great news! ${data.patientName}'s *${data.vaccineName}* (Dose ${data.doseNumber}) has been recorded.

📅 Date: ${data.vaccinationDate}
🏥 Center: ${data.centerName}
📋 Batch: ${data.batchNumber || 'Not specified'}

${data.nextDueDate ? `🔔 Next dose due: *${data.nextDueDate}*` : ''}

💡 Keep vaccination card safe and watch for any side effects.

Reply *CARD* to get digital vaccination certificate.`,

            hi: `✅ *टीकाकरण सफलतापूर्वक पूरा*

बढ़िया खबर! ${data.patientName} का *${data.vaccineName}* (खुराक ${data.doseNumber}) रिकॉर्ड हो गया है।

📅 तारीख: ${data.vaccinationDate}
🏥 केंद्र: ${data.centerName}
📋 बैच: ${data.batchNumber || 'निर्दिष्ट नहीं'}

${data.nextDueDate ? `🔔 अगली खुराक देय: *${data.nextDueDate}*` : ''}

💡 टीकाकरण कार्ड सुरक्षित रखें और किसी भी दुष्प्रभाव पर नज़र रखें।

डिजिटल टीकाकरण प्रमाणपत्र के लिए *कार्ड* का उत्तर दें।`,

            te: `✅ *వ్యాక్సినేషన్ విజయవంతంగా పూర్తయింది*

గొప్ప వార్త! ${data.patientName} యొక్క *${data.vaccineName}* (డోస్ ${data.doseNumber}) రికార్డ్ చేయబడింది.

📅 తేదీ: ${data.vaccinationDate}
🏥 కేంద్రం: ${data.centerName}
📋 బ్యాచ్: ${data.batchNumber || 'పేర్కొనలేదు'}

${data.nextDueDate ? `🔔 తదుపరి డోస్ వచ్చేది: *${data.nextDueDate}*` : ''}

💡 వ్యాక్సినేషన్ కార్డ్‌ను సురక్షితంగా ఉంచండి మరియు ఏవైనా దుష్ప్రభావాలను గమనించండి.

డిజిటల్ వ్యాక్సినేషన్ సర్టిఫికేట్ కోసం *కార్డ్* అని జవాబు ఇవ్వండి.`
        };

        return templates[language] || templates.en;
    }

    /**
     * Vaccination schedule information
     */
    static vaccinationSchedule(data, language = 'en') {
        const templates = {
            en: `📋 *Vaccination Schedule for ${data.patientName}*

Age: ${data.age.years} years, ${data.age.months} months

*Upcoming Vaccinations:*
${data.upcomingVaccines.map(v => 
    `• ${v.name} (Dose ${v.dose}) - Due: ${v.dueDate}`
).join('\n')}

*Completed:* ${data.completedCount}/${data.totalCount} (${data.completionPercentage}%)

📍 Nearest Center: ${data.nearestCenter}
📞 Contact: ${data.centerPhone}

Reply *REMIND* to enable automatic reminders.`,

            hi: `📋 *${data.patientName} के लिए टीकाकरण अनुसूची*

आयु: ${data.age.years} साल, ${data.age.months} महीने

*आगामी टीकाकरण:*
${data.upcomingVaccines.map(v => 
    `• ${v.name} (खुराक ${v.dose}) - देय: ${v.dueDate}`
).join('\n')}

*पूर्ण:* ${data.completedCount}/${data.totalCount} (${data.completionPercentage}%)

📍 निकटतम केंद्र: ${data.nearestCenter}
📞 संपर्क: ${data.centerPhone}

स्वचालित अनुस्मारक सक्षम करने के लिए *अनुस्मारक* का उत्तर दें।`,

            te: `📋 *${data.patientName} కోసం వ్యాక్సినేషన్ షెడ్యూల్*

వయస్సు: ${data.age.years} సంవత్సరాలు, ${data.age.months} నెలలు

*రాబోయే వ్యాక్సినేషన్లు:*
${data.upcomingVaccines.map(v => 
    `• ${v.name} (డోస్ ${v.dose}) - వచ్చేది: ${v.dueDate}`
).join('\n')}

*పూర్తయినవి:* ${data.completedCount}/${data.totalCount} (${data.completionPercentage}%)

📍 సమీప కేంద్రం: ${data.nearestCenter}
📞 సంప్రదింపు: ${data.centerPhone}

ఆటోమేటిక్ రిమైండర్లను ఎనేబుల్ చేయడానికి *రిమైండ్* అని జవాబు ఇవ్వండి.`
        };

        return templates[language] || templates.en;
    }

    /**
     * Government program information
     */
    static governmentProgram(data, language = 'en') {
        const templates = {
            en: `🏛️ *Government Vaccination Program*

*${data.programName}*

📝 Description: ${data.description}

👥 Target: ${data.targetPopulation}
📅 Duration: ${data.startDate} to ${data.endDate}
🌍 Coverage: ${data.coverageArea}

*Free Vaccines Available:*
${data.freeVaccines.map(v => `• ${v.name}`).join('\n')}

📞 Helpline: ${data.contactInfo.phone}
🌐 Website: ${data.contactInfo.website}

Reply *REGISTER* to register for this program.`,

            hi: `🏛️ *सरकारी टीकाकरण कार्यक्रम*

*${data.programName}*

📝 विवरण: ${data.description}

👥 लक्ष्य: ${data.targetPopulation}
📅 अवधि: ${data.startDate} से ${data.endDate}
🌍 कवरेज: ${data.coverageArea}

*उपलब्ध मुफ्त टीके:*
${data.freeVaccines.map(v => `• ${v.name}`).join('\n')}

📞 हेल्पलाइन: ${data.contactInfo.phone}
🌐 वेबसाइट: ${data.contactInfo.website}

इस कार्यक्रम के लिए पंजीकरण करने हेतु *पंजीकरण* का उत्तर दें।`,

            te: `🏛️ *ప్రభుత్వ వ్యాక్సినేషన్ కార్యక్రమం*

*${data.programName}*

📝 వివరణ: ${data.description}

👥 లక్ష్యం: ${data.targetPopulation}
📅 వ్యవధి: ${data.startDate} నుండి ${data.endDate}
🌍 కవరేజ్: ${data.coverageArea}

*అందుబాటులో ఉన్న ఉచిత వ్యాక్సిన్లు:*
${data.freeVaccines.map(v => `• ${v.name}`).join('\n')}

📞 హెల్ప్‌లైన్: ${data.contactInfo.phone}
🌐 వెబ్‌సైట్: ${data.contactInfo.website}

ఈ కార్యక్రమం కోసం రిజిస్టర్ చేయడానికి *రిజిస్టర్* అని జవాబు ఇవ్వండి.`
        };

        return templates[language] || templates.en;
    }

    /**
     * Vaccination center information
     */
    static vaccinationCenter(data, language = 'en') {
        const templates = {
            en: `🏥 *Vaccination Center Information*

*${data.name}*
📍 ${data.address}
📞 ${data.phone}

🕒 *Timings:*
${Object.entries(data.operatingHours).map(([day, hours]) => 
    `${day}: ${hours}`
).join('\n')}

💉 *Available Vaccines:*
${data.availableVaccines.map(v => `• ${v.name}`).join('\n')}

${data.appointmentRequired ? '📅 *Appointment Required*' : '🚶 *Walk-in Available*'}

${data.onlineBookingUrl ? `🌐 Book online: ${data.onlineBookingUrl}` : ''}

Reply *DIRECTIONS* for location directions.`,

            hi: `🏥 *टीकाकरण केंद्र की जानकारी*

*${data.name}*
📍 ${data.address}
📞 ${data.phone}

🕒 *समय:*
${Object.entries(data.operatingHours).map(([day, hours]) => 
    `${day}: ${hours}`
).join('\n')}

💉 *उपलब्ध टीके:*
${data.availableVaccines.map(v => `• ${v.name}`).join('\n')}

${data.appointmentRequired ? '📅 *अपॉइंटमेंट आवश्यक*' : '🚶 *सीधे जा सकते हैं*'}

${data.onlineBookingUrl ? `🌐 ऑनलाइन बुक करें: ${data.onlineBookingUrl}` : ''}

स्थान दिशा के लिए *दिशा* का उत्तर दें।`,

            te: `🏥 *వ్యాక్సినేషన్ సెంటర్ సమాచారం*

*${data.name}*
📍 ${data.address}
📞 ${data.phone}

🕒 *సమయాలు:*
${Object.entries(data.operatingHours).map(([day, hours]) => 
    `${day}: ${hours}`
).join('\n')}

💉 *అందుబాటులో ఉన్న వ్యాక్సిన్లు:*
${data.availableVaccines.map(v => `• ${v.name}`).join('\n')}

${data.appointmentRequired ? '📅 *అపాయింట్‌మెంట్ అవసరం*' : '🚶 *వాక్-ఇన్ అందుబాటులో*'}

${data.onlineBookingUrl ? `🌐 ఆన్‌లైన్ బుక్ చేయండి: ${data.onlineBookingUrl}` : ''}

లొకేషన్ దిశలకు *దిశలు* అని జవాబు ఇవ్వండి.`
        };

        return templates[language] || templates.en;
    }

    /**
     * Quick reply options for vaccination queries
     */
    static getQuickReplies(context, language = 'en') {
        const replies = {
            en: {
                reminder: ['YES', 'RESCHEDULE', 'INFO'],
                schedule: ['REMIND', 'CENTERS', 'PROGRAMS'],
                completed: ['CARD', 'NEXT', 'SIDE_EFFECTS'],
                overdue: ['URGENT', 'BOOK', 'CALL'],
                general: ['SCHEDULE', 'REMINDERS', 'CENTERS', 'HELP']
            },
            hi: {
                reminder: ['हाँ', 'पुनर्निर्धारण', 'जानकारी'],
                schedule: ['अनुस्मारक', 'केंद्र', 'कार्यक्रम'],
                completed: ['कार्ड', 'अगला', 'दुष्प्रभाव'],
                overdue: ['तत्काल', 'बुक', 'कॉल'],
                general: ['अनुसूची', 'अनुस्मारक', 'केंद्र', 'सहायता']
            },
            te: {
                reminder: ['అవును', 'రీషెడ్యూల్', 'సమాచారం'],
                schedule: ['రిమైండ్', 'కేంద్రాలు', 'కార్యక్రమాలు'],
                completed: ['కార్డ్', 'తదుపరి', 'దుష్ప్రభావాలు'],
                overdue: ['అత్యవసరం', 'బుక్', 'కాల్'],
                general: ['షెడ్యూల్', 'రిమైండర్లు', 'కేంద్రాలు', 'సహాయం']
            }
        };

        return replies[language]?.[context] || replies.en[context] || replies.en.general;
    }

    /**
     * Error message for vaccination queries
     */
    static errorMessage(error, language = 'en') {
        const templates = {
            en: `❌ *Error*

Sorry, I couldn't process your vaccination request.

${error.message || 'Please try again later.'}

For immediate assistance:
📞 Call: 108 (Emergency)
📞 Call: 1075 (Health Helpline)

Reply *HELP* for more options.`,

            hi: `❌ *त्रुटि*

क्षमा करें, मैं आपके टीकाकरण अनुरोध को प्रोसेस नहीं कर सका।

${error.message || 'कृपया बाद में पुनः प्रयास करें।'}

तत्काल सहायता के लिए:
📞 कॉल करें: 108 (आपातकाल)
📞 कॉल करें: 1075 (स्वास्थ्य हेल्पलाइन)

अधिक विकल्पों के लिए *सहायता* का उत्तर दें।`,

            te: `❌ *లోపం*

క్షమించండి, నేను మీ వ్యాక్సినేషన్ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాను.

${error.message || 'దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.'}

తక్షణ సహాయం కోసం:
📞 కాల్ చేయండి: 108 (అత్యవసరం)
📞 కాల్ చేయండి: 1075 (హెల్త్ హెల్ప్‌లైన్)

మరిన్ని ఎంపికల కోసం *సహాయం* అని జవాబు ఇవ్వండి.`
        };

        return templates[language] || templates.en;
    }

    /**
     * Help message for vaccination features
     */
    static helpMessage(language = 'en') {
        const templates = {
            en: `💉 *Vaccination Tracker Help*

I can help you with:

📅 *Check Schedule* - Get vaccination timeline
🔔 *Set Reminders* - Enable vaccination alerts  
🏥 *Find Centers* - Locate nearby vaccination centers
📋 *Record Vaccination* - Log completed vaccinations
🏛️ *Government Programs* - Info about free vaccination programs
📊 *Coverage Stats* - View vaccination coverage data

*Quick Commands:*
• Type "schedule" - View vaccination schedule
• Type "remind me" - Enable reminders
• Type "centers near me" - Find nearby centers
• Type "programs" - Government vaccination programs

🆘 Emergency: Call 108
📞 Health Helpline: 1075`,

            hi: `💉 *टीकाकरण ट्रैकर सहायता*

मैं आपकी इनमें सहायता कर सकता हूं:

📅 *अनुसूची जांचें* - टीकाकरण समयसीमा प्राप्त करें
🔔 *अनुस्मारक सेट करें* - टीकाकरण अलर्ट सक्षम करें
🏥 *केंद्र खोजें* - निकटवर्ती टीकाकरण केंद्र खोजें
📋 *टीकाकरण रिकॉर्ड करें* - पूर्ण टीकाकरण लॉग करें
🏛️ *सरकारी कार्यक्रम* - मुफ्त टीकाकरण कार्यक्रमों की जानकारी
📊 *कवरेज आंकड़े* - टीकाकरण कवरेज डेटा देखें

*त्वरित कमांड:*
• "अनुसूची" टाइप करें - टीकाकरण अनुसूची देखें
• "मुझे याद दिलाएं" टाइप करें - अनुस्मारक सक्षम करें
• "मेरे पास केंद्र" टाइप करें - निकटवर्ती केंद्र खोजें
• "कार्यक्रम" टाइप करें - सरकारी टीकाकरण कार्यक्रम

🆘 आपातकाल: 108 पर कॉल करें
📞 स्वास्थ्य हेल्पलाइन: 1075`,

            te: `💉 *వ్యాక్సినేషన్ ట్రాకర్ సహాయం*

నేను మీకు వీటిలో సహాయం చేయగలను:

📅 *షెడ్యూల్ చెక్ చేయండి* - వ్యాక్సినేషన్ టైమ్‌లైన్ పొందండి
🔔 *రిమైండర్లు సెట్ చేయండి* - వ్యాక్సినేషన్ అలర్ట్‌లను ఎనేబుల్ చేయండి
🏥 *కేంద్రాలను కనుగొనండి* - సమీప వ్యాక్సినేషన్ కేంద్రాలను గుర్తించండి
📋 *వ్యాక్సినేషన్ రికార్డ్ చేయండి* - పూర్తయిన వ్యాక్సినేషన్లను లాగ్ చేయండి
🏛️ *ప్రభుత్వ కార్యక్రమాలు* - ఉచిత వ్యాక్సినేషన్ కార్యక్రమాల గురించి సమాచారం
📊 *కవరేజ్ గణాంకాలు* - వ్యాక్సినేషన్ కవరేజ్ డేటాను వీక్షించండి

*త్వరిత కమాండ్లు:*
• "షెడ్యూల్" టైప్ చేయండి - వ్యాక్సినేషన్ షెడ్యూల్ చూడండి
• "నాకు గుర్తు చేయండి" టైప్ చేయండి - రిమైండర్లను ఎనేబుల్ చేయండి
• "నా దగ్గర కేంద్రాలు" టైప్ చేయండి - సమీప కేంద్రాలను కనుగొనండి
• "కార్యక్రమాలు" టైప్ చేయండి - ప్రభుత్వ వ్యాక్సినేషన్ కార్యక్రమాలు

🆘 అత్యవసరం: 108కు కాల్ చేయండి
📞 హెల్త్ హెల్ప్‌లైన్: 1075`
        };

        return templates[language] || templates.en;
    }
}

module.exports = VaccinationWhatsAppTemplates;
