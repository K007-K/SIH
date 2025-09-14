// Vaccination Tracker Routes
// File: vaccinationRoutes.js

const express = require('express');
const router = express.Router();
const vaccinationService = require('../services/vaccinationService');
const safetyGuards = require('../utils/safetyGuards');

// Middleware for input validation and rate limiting
router.use(safetyGuards.rateLimitMiddleware);
router.use(safetyGuards.inputValidationMiddleware);

/**
 * GET /api/vaccination/profile/:patientId
 * Get vaccination profile and status for a patient
 */
router.get('/profile/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { language = 'en' } = req.query;

        // Validate patient ID
        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({
                error: 'Invalid patient ID',
                message: 'Patient ID must be a valid number'
            });
        }

        const profile = await vaccinationService.getVaccinationProfile(patientId, language);
        
        if (!profile) {
            return res.status(404).json({
                error: 'Patient not found',
                message: 'No vaccination profile found for this patient'
            });
        }

        res.json({
            success: true,
            data: profile,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccination profile:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccination profile'
        });
    }
});

/**
 * GET /api/vaccination/schedule/:patientId
 * Get vaccination schedule based on patient's age/DOB
 */
router.get('/schedule/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { language = 'en', includeCompleted = false } = req.query;

        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({
                error: 'Invalid patient ID',
                message: 'Patient ID must be a valid number'
            });
        }

        const schedule = await vaccinationService.getVaccinationSchedule(
            patientId, 
            language, 
            includeCompleted === 'true'
        );

        res.json({
            success: true,
            data: schedule,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccination schedule:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccination schedule'
        });
    }
});

/**
 * GET /api/vaccination/due
 * Get all due/overdue vaccinations across patients
 */
router.get('/due', async (req, res) => {
    try {
        const { 
            status = 'all', // 'due', 'overdue', 'upcoming', 'all'
            limit = 50,
            offset = 0,
            language = 'en'
        } = req.query;

        const dueVaccinations = await vaccinationService.getDueVaccinations({
            status,
            limit: parseInt(limit),
            offset: parseInt(offset),
            language
        });

        res.json({
            success: true,
            data: dueVaccinations,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching due vaccinations:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch due vaccinations'
        });
    }
});

/**
 * POST /api/vaccination/record
 * Record a vaccination administration
 */
router.post('/record', async (req, res) => {
    try {
        const {
            patientId,
            vaccineId,
            doseNumber,
            vaccinationDate,
            administeredBy,
            vaccinationCenter,
            batchNumber,
            expiryDate,
            adverseEvents,
            language = 'en'
        } = req.body;

        // Validate required fields
        if (!patientId || !vaccineId || !doseNumber || !vaccinationDate) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'patientId, vaccineId, doseNumber, and vaccinationDate are required'
            });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(vaccinationDate)) {
            return res.status(400).json({
                error: 'Invalid date format',
                message: 'vaccinationDate must be in YYYY-MM-DD format'
            });
        }

        const record = await vaccinationService.recordVaccination({
            patientId,
            vaccineId,
            doseNumber,
            vaccinationDate,
            administeredBy,
            vaccinationCenter,
            batchNumber,
            expiryDate,
            adverseEvents,
            language
        });

        res.status(201).json({
            success: true,
            data: record,
            message: 'Vaccination recorded successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error recording vaccination:', error);
        
        if (error.message.includes('already recorded')) {
            return res.status(409).json({
                error: 'Duplicate vaccination',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to record vaccination'
        });
    }
});

/**
 * PUT /api/vaccination/record/:recordId
 * Update vaccination record
 */
router.put('/record/:recordId', async (req, res) => {
    try {
        const { recordId } = req.params;
        const updateData = req.body;

        if (!recordId || isNaN(recordId)) {
            return res.status(400).json({
                error: 'Invalid record ID',
                message: 'Record ID must be a valid number'
            });
        }

        const updatedRecord = await vaccinationService.updateVaccinationRecord(
            recordId, 
            updateData
        );

        if (!updatedRecord) {
            return res.status(404).json({
                error: 'Record not found',
                message: 'Vaccination record not found'
            });
        }

        res.json({
            success: true,
            data: updatedRecord,
            message: 'Vaccination record updated successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error updating vaccination record:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to update vaccination record'
        });
    }
});

/**
 * GET /api/vaccination/reminders/:patientId
 * Get vaccination reminders for a patient
 */
router.get('/reminders/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const { language = 'en', status = 'pending' } = req.query;

        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({
                error: 'Invalid patient ID',
                message: 'Patient ID must be a valid number'
            });
        }

        const reminders = await vaccinationService.getVaccinationReminders(
            patientId, 
            language, 
            status
        );

        res.json({
            success: true,
            data: reminders,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccination reminders:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccination reminders'
        });
    }
});

/**
 * POST /api/vaccination/reminder/schedule
 * Schedule vaccination reminder
 */
router.post('/reminder/schedule', async (req, res) => {
    try {
        const {
            patientId,
            vaccineId,
            doseNumber,
            dueDate,
            reminderType = 'due',
            priority = 'medium',
            language = 'en'
        } = req.body;

        if (!patientId || !vaccineId || !doseNumber || !dueDate) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'patientId, vaccineId, doseNumber, and dueDate are required'
            });
        }

        const reminder = await vaccinationService.scheduleReminder({
            patientId,
            vaccineId,
            doseNumber,
            dueDate,
            reminderType,
            priority,
            language
        });

        res.status(201).json({
            success: true,
            data: reminder,
            message: 'Reminder scheduled successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error scheduling reminder:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to schedule reminder'
        });
    }
});

/**
 * PUT /api/vaccination/reminder/:reminderId/status
 * Update reminder status (mark as sent, delivered, etc.)
 */
router.put('/reminder/:reminderId/status', async (req, res) => {
    try {
        const { reminderId } = req.params;
        const { status, responseText, rescheduledDate } = req.body;

        if (!reminderId || isNaN(reminderId)) {
            return res.status(400).json({
                error: 'Invalid reminder ID',
                message: 'Reminder ID must be a valid number'
            });
        }

        const updatedReminder = await vaccinationService.updateReminderStatus(
            reminderId,
            { status, responseText, rescheduledDate }
        );

        if (!updatedReminder) {
            return res.status(404).json({
                error: 'Reminder not found',
                message: 'Vaccination reminder not found'
            });
        }

        res.json({
            success: true,
            data: updatedReminder,
            message: 'Reminder status updated successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error updating reminder status:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to update reminder status'
        });
    }
});

/**
 * GET /api/vaccination/vaccines
 * Get list of available vaccines
 */
router.get('/vaccines', async (req, res) => {
    try {
        const { 
            type = 'all', // 'routine', 'optional', 'emergency', 'seasonal', 'all'
            language = 'en',
            active = true
        } = req.query;

        const vaccines = await vaccinationService.getVaccines({
            type,
            language,
            active: active === 'true'
        });

        res.json({
            success: true,
            data: vaccines,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccines:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccines'
        });
    }
});

/**
 * GET /api/vaccination/programs
 * Get government immunization programs
 */
router.get('/programs', async (req, res) => {
    try {
        const { language = 'en', active = true } = req.query;

        const programs = await vaccinationService.getImmunizationPrograms({
            language,
            active: active === 'true'
        });

        res.json({
            success: true,
            data: programs,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching immunization programs:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch immunization programs'
        });
    }
});

/**
 * GET /api/vaccination/centers
 * Get vaccination centers
 */
router.get('/centers', async (req, res) => {
    try {
        const { 
            district,
            state,
            type = 'all', // 'government', 'private', 'ngo', 'mobile', 'all'
            language = 'en',
            active = true
        } = req.query;

        const centers = await vaccinationService.getVaccinationCenters({
            district,
            state,
            type,
            language,
            active: active === 'true'
        });

        res.json({
            success: true,
            data: centers,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccination centers:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccination centers'
        });
    }
});

/**
 * GET /api/vaccination/coverage
 * Get vaccination coverage statistics
 */
router.get('/coverage', async (req, res) => {
    try {
        const {
            vaccineId,
            ageGroup,
            district,
            state,
            startDate,
            endDate,
            language = 'en'
        } = req.query;

        const coverage = await vaccinationService.getVaccinationCoverage({
            vaccineId: vaccineId ? parseInt(vaccineId) : null,
            ageGroup,
            district,
            state,
            startDate,
            endDate,
            language
        });

        res.json({
            success: true,
            data: coverage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccination coverage:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccination coverage'
        });
    }
});

/**
 * POST /api/vaccination/preferences
 * Set vaccination preferences for a patient
 */
router.post('/preferences', async (req, res) => {
    try {
        const {
            patientId,
            reminderEnabled = true,
            reminderAdvanceDays = 7,
            preferredReminderTime = '10:00:00',
            languagePreference = 'en',
            preferredCenterId,
            notificationChannels = ['whatsapp'],
            autoSchedule = false,
            privacyConsent = false,
            dataSharingConsent = false
        } = req.body;

        if (!patientId) {
            return res.status(400).json({
                error: 'Missing patient ID',
                message: 'Patient ID is required'
            });
        }

        const preferences = await vaccinationService.setVaccinationPreferences({
            patientId,
            reminderEnabled,
            reminderAdvanceDays,
            preferredReminderTime,
            languagePreference,
            preferredCenterId,
            notificationChannels,
            autoSchedule,
            privacyConsent,
            dataSharingConsent
        });

        res.status(201).json({
            success: true,
            data: preferences,
            message: 'Vaccination preferences saved successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error setting vaccination preferences:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to save vaccination preferences'
        });
    }
});

/**
 * GET /api/vaccination/preferences/:patientId
 * Get vaccination preferences for a patient
 */
router.get('/preferences/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId || isNaN(patientId)) {
            return res.status(400).json({
                error: 'Invalid patient ID',
                message: 'Patient ID must be a valid number'
            });
        }

        const preferences = await vaccinationService.getVaccinationPreferences(patientId);

        if (!preferences) {
            return res.status(404).json({
                error: 'Preferences not found',
                message: 'No vaccination preferences found for this patient'
            });
        }

        res.json({
            success: true,
            data: preferences,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching vaccination preferences:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch vaccination preferences'
        });
    }
});

module.exports = router;
