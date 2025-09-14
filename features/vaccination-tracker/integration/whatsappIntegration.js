// WhatsApp Integration for Vaccination Tracker
// File: whatsappIntegration.js

const vaccinationService = require('../services/vaccinationService');
const VaccinationWhatsAppTemplates = require('../whatsapp/templates');
const VaccinationSafetyGuards = require('../utils/safetyGuards');

class VaccinationWhatsAppIntegration {
    /**
     * Handle vaccination-related WhatsApp messages
     */
    static async handleVaccinationMessage(message, contact, language = 'en') {
        try {
            const messageText = message.text?.body?.toLowerCase() || '';
            const phone = contact.wa_id;

            // Log the vaccination query
            console.log(`Vaccination query from ${phone}: ${messageText}`);

            // Check for emergency vaccination scenarios
            const emergencyCheck = VaccinationSafetyGuards.checkEmergencyScenarios({ message: messageText });
            if (emergencyCheck.isEmergency) {
                return {
                    response: emergencyCheck.message,
                    quickReplies: ['CALL_108', 'NEAREST_CENTER', 'HELP']
                };
            }

            // Get patient info
            const patient = await this.getPatientByPhone(phone);
            if (!patient) {
                return {
                    response: this.getRegistrationMessage(language),
                    quickReplies: ['REGISTER', 'HELP']
                };
            }

            // Route message based on content
            if (this.isScheduleQuery(messageText)) {
                return await this.handleScheduleQuery(patient.id, language);
            }
            
            if (this.isReminderQuery(messageText)) {
                return await this.handleReminderQuery(patient.id, messageText, language);
            }
            
            if (this.isCenterQuery(messageText)) {
                return await this.handleCenterQuery(patient, language);
            }
            
            if (this.isProgramQuery(messageText)) {
                return await this.handleProgramQuery(language);
            }
            
            if (this.isRecordQuery(messageText)) {
                return await this.handleRecordQuery(patient.id, messageText, language);
            }

            if (this.isHelpQuery(messageText)) {
                return {
                    response: VaccinationWhatsAppTemplates.helpMessage(language),
                    quickReplies: VaccinationWhatsAppTemplates.getQuickReplies('general', language)
                };
            }

            // Default response for unrecognized vaccination queries
            return {
                response: this.getDefaultVaccinationResponse(language),
                quickReplies: VaccinationWhatsAppTemplates.getQuickReplies('general', language)
            };

        } catch (error) {
            console.error('Error in vaccination WhatsApp integration:', error);
            
            // Log safety event
            await VaccinationSafetyGuards.logSafetyEvent({
                type: 'whatsapp_error',
                severity: 'error',
                message: 'WhatsApp integration error',
                details: error.message,
                phone: contact.wa_id
            });

            return {
                response: VaccinationWhatsAppTemplates.errorMessage(error, language),
                quickReplies: ['HELP', 'SUPPORT']
            };
        }
    }

    /**
     * Check if message is vaccination-related
     */
    static isVaccinationMessage(messageText) {
        const vaccinationKeywords = [
            'vaccine', 'vaccination', 'immunization', 'shot', 'dose',
            'bcg', 'polio', 'opv', 'pentavalent', 'measles', 'mmr',
            'hepatitis', 'rotavirus', 'tetanus', 'covid', 'flu',
            'schedule', 'reminder', 'due', 'overdue', 'center',
            'टीका', 'टीकाकरण', 'वैक्सीन', 'इम्यूनाइजेशन',
            'వ్యాక్సిన్', 'వ్యాక్సినేషన్', 'రోగనిరోధకం',
            'தடுப்பூசி', 'நோய்த்தடுப்பு', 'টিকা', 'প্রতিরোধক', 'लस'
        ];

        return vaccinationKeywords.some(keyword => 
            messageText.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    /**
     * Check if message is asking for vaccination schedule
     */
    static isScheduleQuery(messageText) {
        const scheduleKeywords = [
            'schedule', 'timeline', 'when', 'due', 'next',
            'अनुसूची', 'समय', 'कब', 'देय',
            'షెడ్యూల్', 'సమయం', 'ఎప్పుడు',
            'அட்டவணை', 'সময়সূচী'
        ];

        return scheduleKeywords.some(keyword => 
            messageText.includes(keyword)
        );
    }

    /**
     * Check if message is about reminders
     */
    static isReminderQuery(messageText) {
        const reminderKeywords = [
            'remind', 'reminder', 'alert', 'notification',
            'अनुस्मारक', 'याद', 'सूचना',
            'రిమైండర్', 'గుర్తు', 'హెచ్చరిక',
            'நினைவூட்டல்', 'স্মরণ'
        ];

        return reminderKeywords.some(keyword => 
            messageText.includes(keyword)
        );
    }

    /**
     * Check if message is asking for vaccination centers
     */
    static isCenterQuery(messageText) {
        const centerKeywords = [
            'center', 'centre', 'hospital', 'clinic', 'where', 'location',
            'केंद्र', 'अस्पताल', 'क्लिनिक', 'कहाँ',
            'కేంద్రం', 'ఆసుపత్రి', 'క్లినిక్', 'ఎక్కడ',
            'மையம்', 'மருத্ত্বালয়', 'কেন্দ্র'
        ];

        return centerKeywords.some(keyword => 
            messageText.includes(keyword)
        );
    }

    /**
     * Check if message is asking for government programs
     */
    static isProgramQuery(messageText) {
        const programKeywords = [
            'program', 'programme', 'government', 'free', 'scheme',
            'कार्यक्रम', 'सरकार', 'मुफ्त', 'योजना',
            'కార్యక్రమం', 'ప్రభుత్వం', 'ఉచితం',
            'திட்டம்', 'সরকারি', 'বিনামূল্যে'
        ];

        return programKeywords.some(keyword => 
            messageText.includes(keyword)
        );
    }

    /**
     * Check if message is about recording vaccination
     */
    static isRecordQuery(messageText) {
        const recordKeywords = [
            'record', 'completed', 'done', 'taken', 'received',
            'रिकॉर्ड', 'पूरा', 'लिया', 'मिला',
            'రికార్డ్', 'పూర్తయింది', 'తీసుకున్నాను',
            'பதிவு', 'முடிந্ত', 'রেকর্ড', 'সম্পন্ন'
        ];

        return recordKeywords.some(keyword => 
            messageText.includes(keyword)
        );
    }

    /**
     * Check if message is asking for help
     */
    static isHelpQuery(messageText) {
        const helpKeywords = [
            'help', 'support', 'assist', 'guide',
            'सहायता', 'मदद', 'गाइड',
            'సహాయం', 'మార్గదర్శకం',
            'உதவி', 'সাহায্য'
        ];

        return helpKeywords.some(keyword => 
            messageText.includes(keyword)
        );
    }

    /**
     * Handle vaccination schedule queries
     */
    static async handleScheduleQuery(patientId, language) {
        try {
            const schedule = await vaccinationService.getVaccinationSchedule(patientId, language, false);
            
            if (!schedule.schedules || schedule.schedules.length === 0) {
                return {
                    response: this.getNoScheduleMessage(language),
                    quickReplies: ['REGISTER', 'HELP']
                };
            }

            // Get upcoming vaccines
            const upcomingVaccines = schedule.schedules
                .filter(s => ['due', 'due_soon', 'future'].includes(s.status))
                .slice(0, 5)
                .map(s => ({
                    name: s.vaccine.name,
                    dose: s.doseNumber,
                    dueDate: s.dates.recommended
                }));

            const scheduleData = {
                patientName: schedule.patientId, // You might want to get actual name
                age: schedule.patientAge,
                upcomingVaccines,
                completedCount: schedule.summary.completed,
                totalCount: schedule.summary.total,
                completionPercentage: Math.round((schedule.summary.completed / schedule.summary.total) * 100),
                nearestCenter: 'Nearest Government Health Center',
                centerPhone: '1075'
            };

            return {
                response: VaccinationWhatsAppTemplates.vaccinationSchedule(scheduleData, language),
                quickReplies: VaccinationWhatsAppTemplates.getQuickReplies('schedule', language)
            };

        } catch (error) {
            console.error('Error handling schedule query:', error);
            throw error;
        }
    }

    /**
     * Handle vaccination reminder queries
     */
    static async handleReminderQuery(patientId, messageText, language) {
        try {
            if (messageText.includes('enable') || messageText.includes('on') || messageText.includes('yes')) {
                // Enable reminders
                await vaccinationService.setVaccinationPreferences({
                    patientId,
                    reminderEnabled: true,
                    languagePreference: language
                });

                return {
                    response: this.getReminderEnabledMessage(language),
                    quickReplies: ['SCHEDULE', 'CENTERS', 'HELP']
                };
            }

            // Get existing reminders
            const reminders = await vaccinationService.getVaccinationReminders(patientId, language, 'pending');

            if (reminders.length === 0) {
                return {
                    response: this.getNoRemindersMessage(language),
                    quickReplies: ['ENABLE_REMINDERS', 'SCHEDULE', 'HELP']
                };
            }

            const reminderList = reminders.slice(0, 3).map(r => 
                `• ${r.vaccines.name} (Dose ${r.dose_number}) - Due: ${r.due_date}`
            ).join('\n');

            const response = this.getRemindersListMessage(reminderList, language);

            return {
                response,
                quickReplies: ['ENABLE_REMINDERS', 'SCHEDULE', 'HELP']
            };

        } catch (error) {
            console.error('Error handling reminder query:', error);
            throw error;
        }
    }

    /**
     * Handle vaccination center queries
     */
    static async handleCenterQuery(patient, language) {
        try {
            const centers = await vaccinationService.getVaccinationCenters({
                district: patient.district,
                state: patient.state,
                type: 'all',
                language,
                active: true
            });

            if (centers.length === 0) {
                return {
                    response: this.getNoCentersMessage(language),
                    quickReplies: ['HELP', 'SUPPORT']
                };
            }

            const nearestCenter = centers[0]; // Assuming first is nearest
            const centerData = {
                name: nearestCenter.name,
                address: nearestCenter.address,
                phone: nearestCenter.contact.phone,
                operatingHours: nearestCenter.operatingHours || {
                    'Monday-Friday': '9:00 AM - 5:00 PM',
                    'Saturday': '9:00 AM - 1:00 PM'
                },
                availableVaccines: [
                    { name: 'All routine vaccines' },
                    { name: 'COVID-19' },
                    { name: 'Seasonal flu' }
                ],
                appointmentRequired: nearestCenter.appointmentRequired,
                onlineBookingUrl: nearestCenter.onlineBookingUrl
            };

            return {
                response: VaccinationWhatsAppTemplates.vaccinationCenter(centerData, language),
                quickReplies: ['DIRECTIONS', 'BOOK', 'MORE_CENTERS']
            };

        } catch (error) {
            console.error('Error handling center query:', error);
            throw error;
        }
    }

    /**
     * Handle government program queries
     */
    static async handleProgramQuery(language) {
        try {
            const programs = await vaccinationService.getImmunizationPrograms({
                language,
                active: true
            });

            if (programs.length === 0) {
                return {
                    response: this.getNoProgramsMessage(language),
                    quickReplies: ['HELP', 'SUPPORT']
                };
            }

            const mainProgram = programs.find(p => p.code === 'UIP') || programs[0];
            const programData = {
                programName: mainProgram.name,
                description: mainProgram.description,
                targetPopulation: mainProgram.targetPopulation,
                startDate: mainProgram.startDate || 'Ongoing',
                endDate: mainProgram.endDate || 'Ongoing',
                coverageArea: mainProgram.coverageArea,
                freeVaccines: [
                    { name: 'BCG' },
                    { name: 'Hepatitis B' },
                    { name: 'OPV' },
                    { name: 'Pentavalent' },
                    { name: 'Measles' },
                    { name: 'MMR' }
                ],
                contactInfo: {
                    phone: '1075',
                    website: 'https://www.mohfw.gov.in'
                }
            };

            return {
                response: VaccinationWhatsAppTemplates.governmentProgram(programData, language),
                quickReplies: ['REGISTER', 'CENTERS', 'HELP']
            };

        } catch (error) {
            console.error('Error handling program query:', error);
            throw error;
        }
    }

    /**
     * Handle vaccination record queries
     */
    static async handleRecordQuery(patientId, messageText, language) {
        try {
            // This would typically involve a more complex flow to capture vaccination details
            // For now, we'll provide guidance on how to record vaccinations
            
            const response = this.getRecordGuidanceMessage(language);
            
            return {
                response,
                quickReplies: ['UPLOAD_CARD', 'MANUAL_ENTRY', 'HELP']
            };

        } catch (error) {
            console.error('Error handling record query:', error);
            throw error;
        }
    }

    /**
     * Send vaccination reminder
     */
    static async sendVaccinationReminder(reminderData, language = 'en') {
        try {
            const response = VaccinationWhatsAppTemplates.vaccinationReminder(reminderData, language);
            const quickReplies = VaccinationWhatsAppTemplates.getQuickReplies('reminder', language);

            // Add safety disclaimer
            const disclaimer = VaccinationSafetyGuards.generateSafetyDisclaimer(language);
            const fullResponse = `${response}\n\n${disclaimer}`;

            return {
                response: fullResponse,
                quickReplies
            };

        } catch (error) {
            console.error('Error sending vaccination reminder:', error);
            throw error;
        }
    }

    /**
     * Send overdue vaccination alert
     */
    static async sendOverdueAlert(alertData, language = 'en') {
        try {
            const response = VaccinationWhatsAppTemplates.overdueVaccinationAlert(alertData, language);
            const quickReplies = VaccinationWhatsAppTemplates.getQuickReplies('overdue', language);

            return {
                response,
                quickReplies
            };

        } catch (error) {
            console.error('Error sending overdue alert:', error);
            throw error;
        }
    }

    /**
     * Get patient by phone number
     */
    static async getPatientByPhone(phone) {
        try {
            // This would query the database for patient by phone
            // For now, return a mock patient or null
            return null; // Implement actual database query
        } catch (error) {
            console.error('Error getting patient by phone:', error);
            return null;
        }
    }

    /**
     * Helper methods for various messages
     */
    static getRegistrationMessage(language) {
        const messages = {
            en: `Welcome to Vaccination Tracker! 💉\n\nTo get started, please register by providing:\n• Child's name\n• Date of birth\n• Your location\n\nReply *REGISTER* to begin registration.`,
            hi: `टीकाकरण ट्रैकर में आपका स्वागत है! 💉\n\nशुरू करने के लिए, कृपया प्रदान करके पंजीकरण करें:\n• बच्चे का नाम\n• जन्म तिथि\n• आपका स्थान\n\nपंजीकरण शुरू करने के लिए *पंजीकरण* का उत्तर दें।`,
            te: `వ్యాక్సినేషన్ ట్రాకర్‌కు స్వాగతం! 💉\n\nప్రారంభించడానికి, దయచేసి అందించడం ద్వారా రిజిస్టర్ చేయండి:\n• పిల్లవాడి పేరు\n• పుట్టిన తేదీ\n• మీ లొకేషన్\n\nరిజిస్ట్రేషన్ ప్రారంభించడానికి *రిజిస్టర్* అని జవాబు ఇవ్వండి.`
        };
        return messages[language] || messages.en;
    }

    static getDefaultVaccinationResponse(language) {
        const messages = {
            en: `I can help you with vaccination information! 💉\n\nTry asking:\n• "Show my vaccination schedule"\n• "Remind me about vaccines"\n• "Find vaccination centers"\n• "Government vaccination programs"`,
            hi: `मैं टीकाकरण जानकारी में आपकी सहायता कर सकता हूं! 💉\n\nपूछने का प्रयास करें:\n• "मेरी टीकाकरण अनुसूची दिखाएं"\n• "टीकों के बारे में याद दिलाएं"\n• "टीकाकरण केंद्र खोजें"\n• "सरकारी टीकाकरण कार्यक्रम"`,
            te: `నేను వ్యాక్సినేషన్ సమాచారంలో మీకు సహాయం చేయగలను! 💉\n\nఅడగడానికి ప్రయత్నించండి:\n• "నా వ్యాక్సినేషన్ షెడ్యూల్ చూపించు"\n• "వ్యాక్సిన్ల గురించి గుర్తు చేయండి"\n• "వ్యాక్సినేషన్ కేంద్రాలను కనుగొనండి"\n• "ప్రభుత్వ వ్యాక్సినేషన్ కార్యక్రమాలు"`
        };
        return messages[language] || messages.en;
    }

    static getNoScheduleMessage(language) {
        const messages = {
            en: `No vaccination schedule found. Please register first to get personalized vaccination timeline.`,
            hi: `कोई टीकाकरण अनुसूची नहीं मिली। व्यक्तिगत टीकाकरण समयसीमा प्राप्त करने के लिए कृपया पहले पंजीकरण करें।`,
            te: `వ్యాక్సినేషన్ షెడ్యూల్ కనుగొనబడలేదు. వ్యక్తిగతీకరించిన వ్యాక్సినేషన్ టైమ్‌లైన్ పొందడానికి దయచేసి మొదట రిజిస్టర్ చేయండి.`
        };
        return messages[language] || messages.en;
    }

    static getReminderEnabledMessage(language) {
        const messages = {
            en: `✅ Vaccination reminders enabled! You'll receive alerts 7 days before each due vaccination.`,
            hi: `✅ टीकाकरण अनुस्मारक सक्षम! आपको प्रत्येक देय टीकाकरण से 7 दिन पहले अलर्ट मिलेंगे।`,
            te: `✅ వ్యాక్సినేషన్ రిమైండర్లు ఎనేబుల్ చేయబడ్డాయి! ప్రతి వ్యాక్సినేషన్ వచ్చే 7 రోజుల ముందు మీకు అలర్ట్‌లు వస్తాయి.`
        };
        return messages[language] || messages.en;
    }

    static getNoRemindersMessage(language) {
        const messages = {
            en: `No pending vaccination reminders found. Enable reminders to get notified about upcoming vaccines.`,
            hi: `कोई लंबित टीकाकरण अनुस्मारक नहीं मिला। आगामी टीकों के बारे में सूचित होने के लिए अनुस्मारक सक्षम करें।`,
            te: `పెండింగ్‌లో ఉన్న వ్యాక్సినేషన్ రిమైండర్లు కనుగొనబడలేదు. రాబోయే వ్యాక్సిన్‌ల గురించి తెలియజేయడానికి రిమైండర్లను ఎనేబుల్ చేయండి.`
        };
        return messages[language] || messages.en;
    }

    static getRemindersListMessage(reminderList, language) {
        const messages = {
            en: `📋 Your upcoming vaccination reminders:\n\n${reminderList}\n\nReply *ENABLE* to turn on automatic reminders.`,
            hi: `📋 आपके आगामी टीकाकरण अनुस्मारक:\n\n${reminderList}\n\nस्वचालित अनुस्मारक चालू करने के लिए *सक्षम* का उत्तर दें।`,
            te: `📋 మీ రాబోయే వ్యాక్సినేషన్ రిమైండర్లు:\n\n${reminderList}\n\nఆటోమేటిక్ రిమైండర్లను ఆన్ చేయడానికి *ఎనేబుల్* అని జవాబు ఇవ్వండి.`
        };
        return messages[language] || messages.en;
    }

    static getNoCentersMessage(language) {
        const messages = {
            en: `No vaccination centers found in your area. Please contact health helpline 1075 for assistance.`,
            hi: `आपके क्षेत्र में कोई टीकाकरण केंद्र नहीं मिला। सहायता के लिए कृपया स्वास्थ्य हेल्पलाइन 1075 पर संपर्क करें।`,
            te: `మీ ప్రాంతంలో వ్యాక్సినేషన్ కేంద్రాలు కనుగొనబడలేదు. సహాయం కోసం దయచేసి హెల్త్ హెల్ప్‌లైన్ 1075కు సంప్రదించండి.`
        };
        return messages[language] || messages.en;
    }

    static getNoProgramsMessage(language) {
        const messages = {
            en: `No active vaccination programs found. Please check back later or contact health authorities.`,
            hi: `कोई सक्रिय टीकाकरण कार्यक्रम नहीं मिला। कृपया बाद में जांचें या स्वास्थ्य अधिकारियों से संपर्क करें।`,
            te: `చురుకైన వ్యాక్సినేషన్ కార్యక్రమాలు కనుగొనబడలేదు. దయచేసి తర్వాత తనిఖీ చేయండి లేదా ఆరోగ్య అధికారులను సంప్రదించండి.`
        };
        return messages[language] || messages.en;
    }

    static getRecordGuidanceMessage(language) {
        const messages = {
            en: `📋 To record a vaccination:\n\n1. Take a photo of vaccination card\n2. Send the image here\n3. Or manually provide details\n\nI'll help you update your records!`,
            hi: `📋 टीकाकरण रिकॉर्ड करने के लिए:\n\n1. टीकाकरण कार्ड की फोटो लें\n2. यहां छवि भेजें\n3. या मैन्युअल रूप से विवरण प्रदान करें\n\nमैं आपके रिकॉर्ड अपडेट करने में मदद करूंगा!`,
            te: `📋 వ్యాక్సినేషన్ రికార్డ్ చేయడానికి:\n\n1. వ్యాక్సినేషన్ కార్డ్ ఫోటో తీయండి\n2. ఇక్కడ ఇమేజ్ పంపండి\n3. లేదా మాన్యువల్‌గా వివరాలు అందించండి\n\nమీ రికార్డ్‌లను అప్‌డేట్ చేయడంలో నేను సహాయం చేస్తాను!`
        };
        return messages[language] || messages.en;
    }
}

module.exports = VaccinationWhatsAppIntegration;
