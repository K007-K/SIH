// Vaccination Service Layer
// File: vaccinationService.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

class VaccinationService {
    /**
     * Get vaccination profile for a patient
     */
    async getVaccinationProfile(patientId, language = 'en') {
        try {
            // Get patient basic info
            const { data: patient, error: patientError } = await supabase
                .from('patients')
                .select('*')
                .eq('id', patientId)
                .single();

            if (patientError || !patient) {
                throw new Error('Patient not found');
            }

            // Calculate patient age in days
            const birthDate = new Date(patient.date_of_birth);
            const today = new Date();
            const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
            const ageInMonths = Math.floor(ageInDays / 30.44);
            const ageInYears = Math.floor(ageInDays / 365.25);

            // Get vaccination status using the view
            const { data: vaccinationStatus, error: statusError } = await supabase
                .from('patient_vaccination_status')
                .select('*')
                .eq('patient_id', patientId)
                .order('recommended_age_days', { ascending: true });

            if (statusError) {
                console.error('Error fetching vaccination status:', statusError);
                throw new Error('Failed to fetch vaccination status');
            }

            // Get vaccination preferences
            const { data: preferences } = await supabase
                .from('vaccination_preferences')
                .select('*')
                .eq('patient_id', patientId)
                .single();

            // Group vaccinations by status
            const statusGroups = {
                completed: vaccinationStatus.filter(v => v.status === 'completed'),
                overdue: vaccinationStatus.filter(v => v.status === 'overdue'),
                due_soon: vaccinationStatus.filter(v => v.status === 'due_soon'),
                future: vaccinationStatus.filter(v => v.status === 'future')
            };

            // Calculate completion percentage
            const totalRequired = vaccinationStatus.filter(v => v.status !== 'future').length;
            const completed = statusGroups.completed.length;
            const completionPercentage = totalRequired > 0 ? Math.round((completed / totalRequired) * 100) : 0;

            return {
                patient: {
                    id: patient.id,
                    name: patient.name,
                    dateOfBirth: patient.date_of_birth,
                    age: {
                        days: ageInDays,
                        months: ageInMonths,
                        years: ageInYears
                    },
                    phone: patient.phone,
                    language: patient.language || language
                },
                vaccinationSummary: {
                    totalVaccines: vaccinationStatus.length,
                    completed: statusGroups.completed.length,
                    overdue: statusGroups.overdue.length,
                    dueSoon: statusGroups.due_soon.length,
                    future: statusGroups.future.length,
                    completionPercentage
                },
                vaccinations: statusGroups,
                preferences: preferences || null,
                lastUpdated: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error in getVaccinationProfile:', error);
            throw error;
        }
    }

    /**
     * Get vaccination schedule based on patient's age
     */
    async getVaccinationSchedule(patientId, language = 'en', includeCompleted = false) {
        try {
            // Get patient info
            const { data: patient, error: patientError } = await supabase
                .from('patients')
                .select('date_of_birth')
                .eq('id', patientId)
                .single();

            if (patientError || !patient) {
                throw new Error('Patient not found');
            }

            const birthDate = new Date(patient.date_of_birth);
            const today = new Date();
            const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

            // Build query for vaccination schedules
            let query = supabase
                .from('vaccination_schedules')
                .select(`
                    *,
                    vaccines!inner (
                        id, name, name_${language}, description, description_${language},
                        vaccine_type, route_of_administration, contraindications, contraindications_${language},
                        side_effects, side_effects_${language}
                    )
                `)
                .eq('vaccines.is_active', true)
                .lte('age_range_start_days', ageInDays)
                .order('recommended_age_days', { ascending: true });

            // Filter by age range end if specified
            if (!includeCompleted) {
                query = query.or('age_range_end_days.is.null,age_range_end_days.gte.' + ageInDays);
            }

            const { data: schedules, error: scheduleError } = await query;

            if (scheduleError) {
                console.error('Error fetching vaccination schedules:', scheduleError);
                throw new Error('Failed to fetch vaccination schedules');
            }

            // Get existing vaccination records
            const { data: existingVaccinations } = await supabase
                .from('patient_vaccinations')
                .select('vaccine_id, dose_number, vaccination_date')
                .eq('patient_id', patientId);

            // Create a map of existing vaccinations
            const existingMap = new Map();
            if (existingVaccinations) {
                existingVaccinations.forEach(v => {
                    const key = `${v.vaccine_id}_${v.dose_number}`;
                    existingMap.set(key, v.vaccination_date);
                });
            }

            // Process schedules with status
            const processedSchedules = schedules.map(schedule => {
                const key = `${schedule.vaccine_id}_${schedule.dose_number}`;
                const isCompleted = existingMap.has(key);
                const recommendedDate = new Date(birthDate.getTime() + (schedule.recommended_age_days * 24 * 60 * 60 * 1000));
                const dueDate = new Date(birthDate.getTime() + (schedule.age_range_start_days * 24 * 60 * 60 * 1000));
                const endDate = schedule.age_range_end_days ? 
                    new Date(birthDate.getTime() + (schedule.age_range_end_days * 24 * 60 * 60 * 1000)) : null;

                let status = 'future';
                if (isCompleted) {
                    status = 'completed';
                } else if (today > recommendedDate) {
                    status = today > (endDate || new Date('2099-12-31')) ? 'overdue' : 'due';
                } else if (today >= new Date(recommendedDate.getTime() - (30 * 24 * 60 * 60 * 1000))) {
                    status = 'due_soon';
                }

                return {
                    id: schedule.id,
                    vaccine: {
                        id: schedule.vaccines.id,
                        name: schedule.vaccines[`name_${language}`] || schedule.vaccines.name,
                        description: schedule.vaccines[`description_${language}`] || schedule.vaccines.description,
                        type: schedule.vaccines.vaccine_type,
                        route: schedule.vaccines.route_of_administration,
                        contraindications: schedule.vaccines[`contraindications_${language}`] || schedule.vaccines.contraindications,
                        sideEffects: schedule.vaccines[`side_effects_${language}`] || schedule.vaccines.side_effects
                    },
                    doseNumber: schedule.dose_number,
                    ageGroup: schedule.age_group,
                    recommendedAge: {
                        days: schedule.recommended_age_days,
                        months: schedule.recommended_age_months
                    },
                    ageRange: {
                        startDays: schedule.age_range_start_days,
                        endDays: schedule.age_range_end_days
                    },
                    dates: {
                        recommended: recommendedDate.toISOString().split('T')[0],
                        due: dueDate.toISOString().split('T')[0],
                        end: endDate ? endDate.toISOString().split('T')[0] : null,
                        completed: isCompleted ? existingMap.get(key) : null
                    },
                    status,
                    isMandatory: schedule.is_mandatory,
                    priority: schedule.priority_level,
                    notes: schedule[`notes_${language}`] || schedule.notes,
                    intervalFromPrevious: schedule.interval_from_previous_days
                };
            });

            // Filter out completed if not requested
            const filteredSchedules = includeCompleted ? 
                processedSchedules : 
                processedSchedules.filter(s => s.status !== 'completed');

            return {
                patientId: parseInt(patientId),
                patientAge: {
                    days: ageInDays,
                    months: Math.floor(ageInDays / 30.44),
                    years: Math.floor(ageInDays / 365.25)
                },
                schedules: filteredSchedules,
                summary: {
                    total: processedSchedules.length,
                    completed: processedSchedules.filter(s => s.status === 'completed').length,
                    due: processedSchedules.filter(s => s.status === 'due').length,
                    overdue: processedSchedules.filter(s => s.status === 'overdue').length,
                    dueSoon: processedSchedules.filter(s => s.status === 'due_soon').length,
                    future: processedSchedules.filter(s => s.status === 'future').length
                },
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error in getVaccinationSchedule:', error);
            throw error;
        }
    }

    /**
     * Get due/overdue vaccinations across patients
     */
    async getDueVaccinations({ status = 'all', limit = 50, offset = 0, language = 'en' }) {
        try {
            let query = supabase
                .from('vaccination_due_today')
                .select('*')
                .order('recommended_age_days', { ascending: true })
                .range(offset, offset + limit - 1);

            // Filter by status if specified
            if (status !== 'all') {
                if (status === 'due') {
                    query = query.in('status', ['due_soon', 'overdue']);
                } else {
                    query = query.eq('status', status);
                }
            }

            const { data: dueVaccinations, error } = await query;

            if (error) {
                console.error('Error fetching due vaccinations:', error);
                throw new Error('Failed to fetch due vaccinations');
            }

            return {
                vaccinations: dueVaccinations || [],
                pagination: {
                    limit,
                    offset,
                    total: dueVaccinations?.length || 0
                },
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error in getDueVaccinations:', error);
            throw error;
        }
    }

    /**
     * Record a vaccination administration
     */
    async recordVaccination(vaccinationData) {
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
            } = vaccinationData;

            // Check if vaccination already exists
            const { data: existing } = await supabase
                .from('patient_vaccinations')
                .select('id')
                .eq('patient_id', patientId)
                .eq('vaccine_id', vaccineId)
                .eq('dose_number', doseNumber)
                .single();

            if (existing) {
                throw new Error('Vaccination for this dose already recorded');
            }

            // Get patient info for next dose calculation
            const { data: patient } = await supabase
                .from('patients')
                .select('date_of_birth')
                .eq('id', patientId)
                .single();

            // Get next dose info
            const { data: nextDose } = await supabase
                .from('vaccination_schedules')
                .select('*')
                .eq('vaccine_id', vaccineId)
                .eq('dose_number', doseNumber + 1)
                .single();

            let nextDoseDueDate = null;
            if (nextDose && patient) {
                const birthDate = new Date(patient.date_of_birth);
                nextDoseDueDate = new Date(birthDate.getTime() + (nextDose.recommended_age_days * 24 * 60 * 60 * 1000));
            }

            // Insert vaccination record
            const { data: record, error } = await supabase
                .from('patient_vaccinations')
                .insert({
                    patient_id: patientId,
                    vaccine_id: vaccineId,
                    dose_number: doseNumber,
                    vaccination_date: vaccinationDate,
                    administered_by: administeredBy,
                    vaccination_center: vaccinationCenter,
                    batch_number: batchNumber,
                    expiry_date: expiryDate,
                    adverse_events: adverseEvents,
                    next_dose_due_date: nextDoseDueDate ? nextDoseDueDate.toISOString().split('T')[0] : null
                })
                .select('*')
                .single();

            if (error) {
                console.error('Error recording vaccination:', error);
                throw new Error('Failed to record vaccination');
            }

            // Schedule next dose reminder if applicable
            if (nextDoseDueDate) {
                await this.scheduleReminder({
                    patientId,
                    vaccineId,
                    doseNumber: doseNumber + 1,
                    dueDate: nextDoseDueDate.toISOString().split('T')[0],
                    reminderType: 'due',
                    priority: 'medium',
                    language
                });
            }

            return record;

        } catch (error) {
            console.error('Error in recordVaccination:', error);
            throw error;
        }
    }

    /**
     * Update vaccination record
     */
    async updateVaccinationRecord(recordId, updateData) {
        try {
            const { data: record, error } = await supabase
                .from('patient_vaccinations')
                .update(updateData)
                .eq('id', recordId)
                .select('*')
                .single();

            if (error) {
                console.error('Error updating vaccination record:', error);
                throw new Error('Failed to update vaccination record');
            }

            return record;

        } catch (error) {
            console.error('Error in updateVaccinationRecord:', error);
            throw error;
        }
    }

    /**
     * Get vaccination reminders for a patient
     */
    async getVaccinationReminders(patientId, language = 'en', status = 'pending') {
        try {
            let query = supabase
                .from('vaccination_reminders')
                .select(`
                    *,
                    vaccines (
                        name, name_${language}, description, description_${language}
                    )
                `)
                .eq('patient_id', patientId)
                .order('due_date', { ascending: true });

            if (status !== 'all') {
                query = query.eq('sent', status === 'sent');
            }

            const { data: reminders, error } = await query;

            if (error) {
                console.error('Error fetching vaccination reminders:', error);
                throw new Error('Failed to fetch vaccination reminders');
            }

            return reminders || [];

        } catch (error) {
            console.error('Error in getVaccinationReminders:', error);
            throw error;
        }
    }

    /**
     * Schedule vaccination reminder
     */
    async scheduleReminder(reminderData) {
        try {
            const {
                patientId,
                vaccineId,
                doseNumber,
                dueDate,
                reminderType = 'due',
                priority = 'medium',
                language = 'en'
            } = reminderData;

            // Get vaccine info for message template
            const { data: vaccine } = await supabase
                .from('vaccines')
                .select(`name, name_${language}`)
                .eq('id', vaccineId)
                .single();

            const vaccineName = vaccine ? (vaccine[`name_${language}`] || vaccine.name) : 'Vaccination';

            // Create reminder message template
            const messageTemplates = {
                en: `Reminder: ${vaccineName} dose ${doseNumber} is due on ${dueDate}. Please visit your nearest vaccination center.`,
                hi: `अनुस्मारक: ${vaccineName} की ${doseNumber} खुराक ${dueDate} को देय है। कृपया अपने निकटतम टीकाकरण केंद्र पर जाएं।`,
                te: `రిమైండర్: ${vaccineName} డోస్ ${doseNumber} ${dueDate}న వచ్చింది. దయచేసి మీ సమీప వ్యాక్సినేషన్ సెంటర్‌కు వెళ్లండి.`
            };

            const reminderDate = new Date(dueDate);
            reminderDate.setDate(reminderDate.getDate() - 7); // Remind 7 days before

            const { data: reminder, error } = await supabase
                .from('vaccination_reminders')
                .insert({
                    patient_id: patientId,
                    vaccine_id: vaccineId,
                    dose_number: doseNumber,
                    due_date: dueDate,
                    reminder_type: reminderType,
                    reminder_date: reminderDate.toISOString().split('T')[0],
                    priority,
                    message_template: messageTemplates.en,
                    message_template_hi: messageTemplates.hi,
                    message_template_te: messageTemplates.te
                })
                .select('*')
                .single();

            if (error) {
                console.error('Error scheduling reminder:', error);
                throw new Error('Failed to schedule reminder');
            }

            return reminder;

        } catch (error) {
            console.error('Error in scheduleReminder:', error);
            throw error;
        }
    }

    /**
     * Update reminder status
     */
    async updateReminderStatus(reminderId, statusData) {
        try {
            const { status, responseText, rescheduledDate } = statusData;

            const updateData = {
                delivery_status: status,
                response_text: responseText,
                rescheduled_date: rescheduledDate
            };

            if (status === 'sent') {
                updateData.sent = true;
                updateData.sent_at = new Date().toISOString();
            }

            if (responseText) {
                updateData.response_received = true;
            }

            const { data: reminder, error } = await supabase
                .from('vaccination_reminders')
                .update(updateData)
                .eq('id', reminderId)
                .select('*')
                .single();

            if (error) {
                console.error('Error updating reminder status:', error);
                throw new Error('Failed to update reminder status');
            }

            return reminder;

        } catch (error) {
            console.error('Error in updateReminderStatus:', error);
            throw error;
        }
    }

    /**
     * Get available vaccines
     */
    async getVaccines({ type = 'all', language = 'en', active = true }) {
        try {
            let query = supabase
                .from('vaccines')
                .select('*')
                .eq('is_active', active)
                .order('name', { ascending: true });

            if (type !== 'all') {
                query = query.eq('vaccine_type', type);
            }

            const { data: vaccines, error } = await query;

            if (error) {
                console.error('Error fetching vaccines:', error);
                throw new Error('Failed to fetch vaccines');
            }

            // Localize vaccine data
            const localizedVaccines = vaccines?.map(vaccine => ({
                id: vaccine.id,
                name: vaccine[`name_${language}`] || vaccine.name,
                description: vaccine[`description_${language}`] || vaccine.description,
                type: vaccine.vaccine_type,
                manufacturer: vaccine.manufacturer,
                dosage: vaccine.dosage_ml,
                route: vaccine.route_of_administration,
                storage: vaccine.storage_temperature,
                contraindications: vaccine[`contraindications_${language}`] || vaccine.contraindications,
                sideEffects: vaccine[`side_effects_${language}`] || vaccine.side_effects,
                governmentCode: vaccine.government_code,
                whoCode: vaccine.who_code
            })) || [];

            return localizedVaccines;

        } catch (error) {
            console.error('Error in getVaccines:', error);
            throw error;
        }
    }

    /**
     * Get immunization programs
     */
    async getImmunizationPrograms({ language = 'en', active = true }) {
        try {
            const { data: programs, error } = await supabase
                .from('immunization_programs')
                .select('*')
                .eq('is_active', active)
                .order('program_name', { ascending: true });

            if (error) {
                console.error('Error fetching immunization programs:', error);
                throw new Error('Failed to fetch immunization programs');
            }

            // Localize program data
            const localizedPrograms = programs?.map(program => ({
                id: program.id,
                name: program[`program_name_${language}`] || program.program_name,
                code: program.program_code,
                description: program[`description_${language}`] || program.description,
                targetPopulation: program.target_population,
                startDate: program.start_date,
                endDate: program.end_date,
                coverageArea: program.coverage_area,
                implementingAgency: program.implementing_agency,
                contactInfo: program.contact_info,
                eligibilityCriteria: program[`eligibility_criteria_${language}`] || program.eligibility_criteria,
                registrationRequired: program.registration_required,
                registrationUrl: program.registration_url
            })) || [];

            return localizedPrograms;

        } catch (error) {
            console.error('Error in getImmunizationPrograms:', error);
            throw error;
        }
    }

    /**
     * Get vaccination centers
     */
    async getVaccinationCenters({ district, state, type = 'all', language = 'en', active = true }) {
        try {
            let query = supabase
                .from('vaccination_centers')
                .select('*')
                .eq('is_active', active)
                .order('name', { ascending: true });

            if (district) {
                query = query.eq('district', district);
            }

            if (state) {
                query = query.eq('state', state);
            }

            if (type !== 'all') {
                query = query.eq('center_type', type);
            }

            const { data: centers, error } = await query;

            if (error) {
                console.error('Error fetching vaccination centers:', error);
                throw new Error('Failed to fetch vaccination centers');
            }

            // Localize center data
            const localizedCenters = centers?.map(center => ({
                id: center.id,
                name: center[`name_${language}`] || center.name,
                type: center.center_type,
                governmentCode: center.government_code,
                address: center.address,
                district: center.district,
                state: center.state,
                pincode: center.pincode,
                location: {
                    latitude: center.latitude,
                    longitude: center.longitude
                },
                contact: {
                    phone: center.contact_phone,
                    email: center.contact_email
                },
                operatingHours: center.operating_hours,
                servicesOffered: center.services_offered,
                vaccinesAvailable: center.vaccines_available,
                appointmentRequired: center.appointment_required,
                onlineBookingUrl: center.online_booking_url,
                capacityPerDay: center.capacity_per_day,
                lastUpdated: center.last_updated
            })) || [];

            return localizedCenters;

        } catch (error) {
            console.error('Error in getVaccinationCenters:', error);
            throw error;
        }
    }

    /**
     * Get vaccination coverage statistics
     */
    async getVaccinationCoverage(filters) {
        try {
            let query = supabase
                .from('vaccination_coverage')
                .select(`
                    *,
                    vaccines (name, name_${filters.language || 'en'})
                `)
                .order('reporting_period_end', { ascending: false });

            if (filters.vaccineId) {
                query = query.eq('vaccine_id', filters.vaccineId);
            }

            if (filters.ageGroup) {
                query = query.eq('age_group', filters.ageGroup);
            }

            if (filters.district) {
                query = query.eq('district', filters.district);
            }

            if (filters.state) {
                query = query.eq('state', filters.state);
            }

            if (filters.startDate) {
                query = query.gte('reporting_period_start', filters.startDate);
            }

            if (filters.endDate) {
                query = query.lte('reporting_period_end', filters.endDate);
            }

            const { data: coverage, error } = await query;

            if (error) {
                console.error('Error fetching vaccination coverage:', error);
                throw new Error('Failed to fetch vaccination coverage');
            }

            return coverage || [];

        } catch (error) {
            console.error('Error in getVaccinationCoverage:', error);
            throw error;
        }
    }

    /**
     * Set vaccination preferences
     */
    async setVaccinationPreferences(preferencesData) {
        try {
            const { data: preferences, error } = await supabase
                .from('vaccination_preferences')
                .upsert(preferencesData, { onConflict: 'patient_id' })
                .select('*')
                .single();

            if (error) {
                console.error('Error setting vaccination preferences:', error);
                throw new Error('Failed to save vaccination preferences');
            }

            return preferences;

        } catch (error) {
            console.error('Error in setVaccinationPreferences:', error);
            throw error;
        }
    }

    /**
     * Get vaccination preferences
     */
    async getVaccinationPreferences(patientId) {
        try {
            const { data: preferences, error } = await supabase
                .from('vaccination_preferences')
                .select('*')
                .eq('patient_id', patientId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error fetching vaccination preferences:', error);
                throw new Error('Failed to fetch vaccination preferences');
            }

            return preferences;

        } catch (error) {
            console.error('Error in getVaccinationPreferences:', error);
            throw error;
        }
    }
}

module.exports = new VaccinationService();
