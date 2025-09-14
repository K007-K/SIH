// Safety Guards for Vaccination Tracker
// File: safetyGuards.js

const rateLimit = require('express-rate-limit');

class VaccinationSafetyGuards {
    /**
     * Rate limiting middleware for vaccination APIs
     */
    static rateLimitMiddleware = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 100, // Limit each IP to 100 requests per hour
        message: {
            error: 'Too many requests from this IP, please try again later.',
            error_hi: 'इस IP से बहुत सारे अनुरोध, कृपया बाद में पुनः प्रयास करें।',
            error_te: 'ఈ IP నుండి చాలా అభ్యర్థనలు, దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // Use the built-in IP key generator to handle IPv6 properly
            const forwarded = req.headers['x-forwarded-for'];
            const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
            return ip || 'unknown';
        }
    });

    /**
     * Input validation middleware
     */
    static inputValidationMiddleware = (req, res, next) => {
        try {
            // Sanitize input data
            if (req.body) {
                req.body = VaccinationSafetyGuards.sanitizeInput(req.body);
            }
            
            if (req.query) {
                req.query = VaccinationSafetyGuards.sanitizeInput(req.query);
            }

            // Validate critical fields
            if (req.method === 'POST' || req.method === 'PUT') {
                const validationErrors = VaccinationSafetyGuards.validateVaccinationData(req.body, req.path);
                if (validationErrors.length > 0) {
                    return res.status(400).json({
                        error: 'Validation failed',
                        message: 'Invalid input data',
                        details: validationErrors
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Input validation error:', error);
            res.status(400).json({
                error: 'Invalid input',
                message: 'Request data validation failed'
            });
        }
    };

    /**
     * Sanitize input to prevent injection attacks
     */
    static sanitizeInput(data) {
        if (typeof data === 'string') {
            return data
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+\s*=/gi, '') // Remove event handlers
                .trim();
        }
        
        if (Array.isArray(data)) {
            return data.map(item => VaccinationSafetyGuards.sanitizeInput(item));
        }
        
        if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = VaccinationSafetyGuards.sanitizeInput(value);
            }
            return sanitized;
        }
        
        return data;
    }

    /**
     * Validate vaccination-specific data
     */
    static validateVaccinationData(data, path) {
        const errors = [];

        // Common validations
        if (data.patientId !== undefined) {
            if (!data.patientId || isNaN(data.patientId) || data.patientId <= 0) {
                errors.push('Patient ID must be a positive number');
            }
        }

        if (data.vaccineId !== undefined) {
            if (!data.vaccineId || isNaN(data.vaccineId) || data.vaccineId <= 0) {
                errors.push('Vaccine ID must be a positive number');
            }
        }

        if (data.doseNumber !== undefined) {
            if (!data.doseNumber || isNaN(data.doseNumber) || data.doseNumber <= 0 || data.doseNumber > 10) {
                errors.push('Dose number must be between 1 and 10');
            }
        }

        // Date validations
        if (data.vaccinationDate) {
            if (!VaccinationSafetyGuards.isValidDate(data.vaccinationDate)) {
                errors.push('Vaccination date must be in YYYY-MM-DD format');
            } else {
                const vaccinationDate = new Date(data.vaccinationDate);
                const today = new Date();
                const hundredYearsAgo = new Date();
                hundredYearsAgo.setFullYear(today.getFullYear() - 100);

                if (vaccinationDate > today) {
                    errors.push('Vaccination date cannot be in the future');
                }
                if (vaccinationDate < hundredYearsAgo) {
                    errors.push('Vaccination date cannot be more than 100 years ago');
                }
            }
        }

        if (data.dueDate) {
            if (!VaccinationSafetyGuards.isValidDate(data.dueDate)) {
                errors.push('Due date must be in YYYY-MM-DD format');
            }
        }

        if (data.expiryDate) {
            if (!VaccinationSafetyGuards.isValidDate(data.expiryDate)) {
                errors.push('Expiry date must be in YYYY-MM-DD format');
            }
        }

        // String length validations
        if (data.administeredBy && data.administeredBy.length > 255) {
            errors.push('Administered by field cannot exceed 255 characters');
        }

        if (data.vaccinationCenter && data.vaccinationCenter.length > 255) {
            errors.push('Vaccination center field cannot exceed 255 characters');
        }

        if (data.batchNumber && data.batchNumber.length > 100) {
            errors.push('Batch number cannot exceed 100 characters');
        }

        if (data.adverseEvents && data.adverseEvents.length > 1000) {
            errors.push('Adverse events description cannot exceed 1000 characters');
        }

        // Enum validations
        if (data.reminderType && !['due', 'overdue', 'upcoming'].includes(data.reminderType)) {
            errors.push('Reminder type must be one of: due, overdue, upcoming');
        }

        if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
            errors.push('Priority must be one of: low, medium, high, urgent');
        }

        if (data.status && !['pending', 'sent', 'delivered', 'failed', 'read'].includes(data.status)) {
            errors.push('Status must be one of: pending, sent, delivered, failed, read');
        }

        // Language validation
        if (data.language && !['en', 'hi', 'te', 'ta', 'bn', 'mr'].includes(data.language)) {
            errors.push('Language must be one of: en, hi, te, ta, bn, mr');
        }

        // Array validations
        if (data.notificationChannels) {
            if (!Array.isArray(data.notificationChannels)) {
                errors.push('Notification channels must be an array');
            } else {
                const validChannels = ['whatsapp', 'sms', 'email'];
                const invalidChannels = data.notificationChannels.filter(channel => !validChannels.includes(channel));
                if (invalidChannels.length > 0) {
                    errors.push(`Invalid notification channels: ${invalidChannels.join(', ')}`);
                }
            }
        }

        // Boolean validations
        const booleanFields = ['reminderEnabled', 'autoSchedule', 'privacyConsent', 'dataSharingConsent'];
        booleanFields.forEach(field => {
            if (data[field] !== undefined && typeof data[field] !== 'boolean') {
                errors.push(`${field} must be a boolean value`);
            }
        });

        // Time validation
        if (data.preferredReminderTime) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timeRegex.test(data.preferredReminderTime)) {
                errors.push('Preferred reminder time must be in HH:MM:SS format');
            }
        }

        return errors;
    }

    /**
     * Check if date string is valid
     */
    static isValidDate(dateString) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) return false;
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split('T')[0];
    }

    /**
     * Validate vaccination safety constraints
     */
    static validateVaccinationSafety(vaccinationData) {
        const warnings = [];
        const errors = [];

        // Check minimum age constraints
        if (vaccinationData.patientAge && vaccinationData.minimumAge) {
            if (vaccinationData.patientAge < vaccinationData.minimumAge) {
                errors.push(`Patient is too young for this vaccine. Minimum age: ${vaccinationData.minimumAge} days`);
            }
        }

        // Check maximum age constraints
        if (vaccinationData.patientAge && vaccinationData.maximumAge) {
            if (vaccinationData.patientAge > vaccinationData.maximumAge) {
                warnings.push(`Patient may be too old for this vaccine. Maximum recommended age: ${vaccinationData.maximumAge} days`);
            }
        }

        // Check interval between doses
        if (vaccinationData.lastVaccinationDate && vaccinationData.minimumInterval) {
            const daysSinceLastVaccination = Math.floor(
                (new Date() - new Date(vaccinationData.lastVaccinationDate)) / (1000 * 60 * 60 * 24)
            );
            
            if (daysSinceLastVaccination < vaccinationData.minimumInterval) {
                errors.push(`Too soon for next dose. Minimum interval: ${vaccinationData.minimumInterval} days`);
            }
        }

        // Check for contraindications
        if (vaccinationData.contraindications && vaccinationData.patientConditions) {
            const conflictingConditions = vaccinationData.patientConditions.filter(condition =>
                vaccinationData.contraindications.includes(condition)
            );
            
            if (conflictingConditions.length > 0) {
                errors.push(`Contraindications present: ${conflictingConditions.join(', ')}`);
            }
        }

        // Check vaccine expiry
        if (vaccinationData.expiryDate) {
            const expiryDate = new Date(vaccinationData.expiryDate);
            const today = new Date();
            
            if (expiryDate < today) {
                errors.push('Vaccine has expired and cannot be administered');
            } else if (expiryDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
                warnings.push('Vaccine expires within 30 days');
            }
        }

        return { errors, warnings };
    }

    /**
     * Log safety events
     */
    static async logSafetyEvent(eventData) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type: eventData.type || 'safety_check',
                severity: eventData.severity || 'info',
                patientId: eventData.patientId,
                vaccineId: eventData.vaccineId,
                message: eventData.message,
                details: eventData.details,
                userAgent: eventData.userAgent,
                ipAddress: eventData.ipAddress
            };

            console.log('Vaccination Safety Event:', JSON.stringify(logEntry, null, 2));

            // In production, you might want to store this in a dedicated logging system
            // or send alerts for critical safety events

        } catch (error) {
            console.error('Error logging safety event:', error);
        }
    }

    /**
     * Generate safety disclaimer for vaccination information
     */
    static generateSafetyDisclaimer(language = 'en') {
        const disclaimers = {
            en: "⚠️ IMPORTANT: This is for informational purposes only. Always consult healthcare professionals before vaccination decisions. In case of adverse reactions, seek immediate medical attention.",
            hi: "⚠️ महत्वपूर्ण: यह केवल जानकारी के लिए है। टीकाकरण के निर्णय से पहले हमेशा स्वास्थ्य पेशेवरों से सलाह लें। प्रतिकूल प्रतिक्रिया की स्थिति में तुरंत चिकित्सा सहायता लें।",
            te: "⚠️ ముఖ్యమైనది: ఇది కేవలం సమాచార ప్రయోజనాల కోసం మాత్రమే. వ్యాక్సినేషన్ నిర్ణయాలకు ముందు ఎల్లప్పుడూ ఆరోగ్య నిపుణులను సంప్రదించండి. ప్రతికూల ప్రతిచర్యల విషయంలో వెంటనే వైద్య సహాయం పొందండి।",
            ta: "⚠️ முக்கியம்: இது தகவல் நோக்கங்களுக்காக மட்டுமே. தடுப்பூசி முடிவுகளுக்கு முன் எப்போதும் சுகாதார நிபுணர்களை அணுகவும். பாதகமான எதிர்வினைகள் ஏற்பட்டால் உடனடியாக மருத்துவ உதவியை நாடவும்।",
            bn: "⚠️ গুরুত্বপূর্ণ: এটি শুধুমাত্র তথ্যগত উদ্দেশ্যে। টিকাদানের সিদ্ধান্তের আগে সর্বদা স্বাস্থ্য পেশাদারদের সাথে পরামর্শ করুন। প্রতিকূল প্রতিক্রিয়ার ক্ষেত্রে অবিলম্বে চিকিৎসা সহায়তা নিন।",
            mr: "⚠️ महत्त्वाचे: हे केवळ माहितीच्या उद्देशाने आहे. लसीकरणाच्या निर्णयांपूर्वी नेहमी आरोग्य व्यावसायिकांचा सल्ला घ्या. प्रतिकूल प्रतिक्रियांच्या बाबतीत तातडीने वैद्यकीय मदत घ्या."
        };

        return disclaimers[language] || disclaimers.en;
    }

    /**
     * Check for emergency vaccination scenarios
     */
    static checkEmergencyScenarios(vaccinationData) {
        const emergencyKeywords = [
            'outbreak', 'epidemic', 'emergency', 'urgent', 'immediate',
            'rabies', 'tetanus', 'wound', 'bite', 'exposure'
        ];

        const isEmergency = emergencyKeywords.some(keyword =>
            JSON.stringify(vaccinationData).toLowerCase().includes(keyword)
        );

        if (isEmergency) {
            return {
                isEmergency: true,
                message: "🚨 EMERGENCY: This appears to be an emergency vaccination scenario. Please contact healthcare services immediately or call emergency number 108.",
                priority: 'urgent'
            };
        }

        return { isEmergency: false };
    }

    /**
     * Validate batch number format
     */
    static validateBatchNumber(batchNumber) {
        if (!batchNumber) return true; // Optional field

        // Basic batch number validation (alphanumeric, hyphens, underscores)
        const batchRegex = /^[A-Za-z0-9\-_]+$/;
        return batchRegex.test(batchNumber) && batchNumber.length <= 100;
    }

    /**
     * Check for duplicate vaccination records
     */
    static async checkDuplicateVaccination(patientId, vaccineId, doseNumber, vaccinationDate) {
        try {
            // This would typically check against the database
            // For now, we'll return a basic validation structure
            return {
                isDuplicate: false,
                message: null
            };
        } catch (error) {
            console.error('Error checking duplicate vaccination:', error);
            return {
                isDuplicate: false,
                message: 'Unable to verify duplicate vaccination'
            };
        }
    }
}

module.exports = VaccinationSafetyGuards;
