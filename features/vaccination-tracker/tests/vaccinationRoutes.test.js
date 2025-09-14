// Unit Tests for Vaccination Routes
// File: vaccinationRoutes.test.js

const request = require('supertest');
const express = require('express');
const vaccinationRoutes = require('../routes/vaccinationRoutes');
const vaccinationService = require('../services/vaccinationService');

// Mock the vaccination service
jest.mock('../services/vaccinationService');

const app = express();
app.use(express.json());
app.use('/api/vaccination', vaccinationRoutes);

describe('Vaccination Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/vaccination/profile/:patientId', () => {
        it('should return vaccination profile for valid patient', async () => {
            const mockProfile = {
                patient: {
                    id: 1,
                    name: 'Test Child',
                    dateOfBirth: '2023-01-01',
                    age: { days: 365, months: 12, years: 1 }
                },
                vaccinationSummary: {
                    totalVaccines: 10,
                    completed: 5,
                    overdue: 1,
                    dueSoon: 2,
                    future: 2,
                    completionPercentage: 50
                }
            };

            vaccinationService.getVaccinationProfile.mockResolvedValue(mockProfile);

            const response = await request(app)
                .get('/api/vaccination/profile/1')
                .query({ language: 'en' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockProfile);
            expect(vaccinationService.getVaccinationProfile).toHaveBeenCalledWith(1, 'en');
        });

        it('should return 400 for invalid patient ID', async () => {
            const response = await request(app)
                .get('/api/vaccination/profile/invalid');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid patient ID');
        });

        it('should return 404 for non-existent patient', async () => {
            vaccinationService.getVaccinationProfile.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/vaccination/profile/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Patient not found');
        });

        it('should handle service errors', async () => {
            vaccinationService.getVaccinationProfile.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/vaccination/profile/1');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
        });
    });

    describe('GET /api/vaccination/schedule/:patientId', () => {
        it('should return vaccination schedule for patient', async () => {
            const mockSchedule = {
                patientId: 1,
                patientAge: { days: 365, months: 12, years: 1 },
                schedules: [
                    {
                        vaccine: { name: 'BCG', type: 'routine' },
                        doseNumber: 1,
                        status: 'completed'
                    },
                    {
                        vaccine: { name: 'Hepatitis B', type: 'routine' },
                        doseNumber: 1,
                        status: 'due'
                    }
                ],
                summary: { total: 2, completed: 1, due: 1 }
            };

            vaccinationService.getVaccinationSchedule.mockResolvedValue(mockSchedule);

            const response = await request(app)
                .get('/api/vaccination/schedule/1')
                .query({ language: 'hi', includeCompleted: 'true' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockSchedule);
            expect(vaccinationService.getVaccinationSchedule).toHaveBeenCalledWith(1, 'hi', true);
        });
    });

    describe('GET /api/vaccination/due', () => {
        it('should return due vaccinations', async () => {
            const mockDueVaccinations = {
                vaccinations: [
                    {
                        patient_name: 'Test Child',
                        vaccine_name: 'Measles',
                        dose_number: 1,
                        status: 'overdue'
                    }
                ],
                pagination: { limit: 50, offset: 0, total: 1 }
            };

            vaccinationService.getDueVaccinations.mockResolvedValue(mockDueVaccinations);

            const response = await request(app)
                .get('/api/vaccination/due')
                .query({ status: 'overdue', limit: '10' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(vaccinationService.getDueVaccinations).toHaveBeenCalledWith({
                status: 'overdue',
                limit: 10,
                offset: 0,
                language: 'en'
            });
        });
    });

    describe('POST /api/vaccination/record', () => {
        it('should record vaccination successfully', async () => {
            const mockRecord = {
                id: 1,
                patient_id: 1,
                vaccine_id: 1,
                dose_number: 1,
                vaccination_date: '2024-01-15'
            };

            const vaccinationData = {
                patientId: 1,
                vaccineId: 1,
                doseNumber: 1,
                vaccinationDate: '2024-01-15',
                administeredBy: 'Dr. Smith',
                vaccinationCenter: 'Health Center A'
            };

            vaccinationService.recordVaccination.mockResolvedValue(mockRecord);

            const response = await request(app)
                .post('/api/vaccination/record')
                .send(vaccinationData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockRecord);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/vaccination/record')
                .send({ patientId: 1 }); // Missing required fields

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing required fields');
        });

        it('should validate date format', async () => {
            const response = await request(app)
                .post('/api/vaccination/record')
                .send({
                    patientId: 1,
                    vaccineId: 1,
                    doseNumber: 1,
                    vaccinationDate: 'invalid-date'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid date format');
        });

        it('should handle duplicate vaccination error', async () => {
            vaccinationService.recordVaccination.mockRejectedValue(
                new Error('Vaccination for this dose already recorded')
            );

            const response = await request(app)
                .post('/api/vaccination/record')
                .send({
                    patientId: 1,
                    vaccineId: 1,
                    doseNumber: 1,
                    vaccinationDate: '2024-01-15'
                });

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Duplicate vaccination');
        });
    });

    describe('PUT /api/vaccination/record/:recordId', () => {
        it('should update vaccination record', async () => {
            const mockUpdatedRecord = {
                id: 1,
                adverse_events: 'Mild fever',
                updated_at: '2024-01-16T10:00:00Z'
            };

            vaccinationService.updateVaccinationRecord.mockResolvedValue(mockUpdatedRecord);

            const response = await request(app)
                .put('/api/vaccination/record/1')
                .send({ adverseEvents: 'Mild fever' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockUpdatedRecord);
        });

        it('should return 404 for non-existent record', async () => {
            vaccinationService.updateVaccinationRecord.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/vaccination/record/999')
                .send({ adverseEvents: 'None' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Record not found');
        });
    });

    describe('GET /api/vaccination/reminders/:patientId', () => {
        it('should return vaccination reminders', async () => {
            const mockReminders = [
                {
                    id: 1,
                    vaccine_id: 1,
                    dose_number: 2,
                    due_date: '2024-02-01',
                    sent: false
                }
            ];

            vaccinationService.getVaccinationReminders.mockResolvedValue(mockReminders);

            const response = await request(app)
                .get('/api/vaccination/reminders/1')
                .query({ status: 'pending' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockReminders);
        });
    });

    describe('POST /api/vaccination/reminder/schedule', () => {
        it('should schedule vaccination reminder', async () => {
            const mockReminder = {
                id: 1,
                patient_id: 1,
                vaccine_id: 1,
                dose_number: 2,
                due_date: '2024-02-01'
            };

            const reminderData = {
                patientId: 1,
                vaccineId: 1,
                doseNumber: 2,
                dueDate: '2024-02-01'
            };

            vaccinationService.scheduleReminder.mockResolvedValue(mockReminder);

            const response = await request(app)
                .post('/api/vaccination/reminder/schedule')
                .send(reminderData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockReminder);
        });
    });

    describe('PUT /api/vaccination/reminder/:reminderId/status', () => {
        it('should update reminder status', async () => {
            const mockUpdatedReminder = {
                id: 1,
                delivery_status: 'sent',
                sent: true,
                sent_at: '2024-01-16T10:00:00Z'
            };

            vaccinationService.updateReminderStatus.mockResolvedValue(mockUpdatedReminder);

            const response = await request(app)
                .put('/api/vaccination/reminder/1/status')
                .send({ status: 'sent' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockUpdatedReminder);
        });
    });

    describe('GET /api/vaccination/vaccines', () => {
        it('should return list of vaccines', async () => {
            const mockVaccines = [
                {
                    id: 1,
                    name: 'BCG',
                    type: 'routine',
                    description: 'Tuberculosis prevention'
                },
                {
                    id: 2,
                    name: 'Hepatitis B',
                    type: 'routine',
                    description: 'Liver protection'
                }
            ];

            vaccinationService.getVaccines.mockResolvedValue(mockVaccines);

            const response = await request(app)
                .get('/api/vaccination/vaccines')
                .query({ type: 'routine', language: 'hi' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockVaccines);
            expect(vaccinationService.getVaccines).toHaveBeenCalledWith({
                type: 'routine',
                language: 'hi',
                active: true
            });
        });
    });

    describe('GET /api/vaccination/programs', () => {
        it('should return immunization programs', async () => {
            const mockPrograms = [
                {
                    id: 1,
                    name: 'Universal Immunization Programme',
                    code: 'UIP',
                    targetPopulation: 'children'
                }
            ];

            vaccinationService.getImmunizationPrograms.mockResolvedValue(mockPrograms);

            const response = await request(app)
                .get('/api/vaccination/programs')
                .query({ language: 'te' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockPrograms);
        });
    });

    describe('GET /api/vaccination/centers', () => {
        it('should return vaccination centers', async () => {
            const mockCenters = [
                {
                    id: 1,
                    name: 'Primary Health Centre',
                    type: 'government',
                    district: 'Test District'
                }
            ];

            vaccinationService.getVaccinationCenters.mockResolvedValue(mockCenters);

            const response = await request(app)
                .get('/api/vaccination/centers')
                .query({ district: 'Test District', type: 'government' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockCenters);
        });
    });

    describe('GET /api/vaccination/coverage', () => {
        it('should return vaccination coverage statistics', async () => {
            const mockCoverage = [
                {
                    vaccine_id: 1,
                    age_group: 'infant',
                    coverage_percentage: 85.5,
                    target_population: 1000,
                    vaccinated_count: 855
                }
            ];

            vaccinationService.getVaccinationCoverage.mockResolvedValue(mockCoverage);

            const response = await request(app)
                .get('/api/vaccination/coverage')
                .query({ vaccineId: '1', ageGroup: 'infant' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockCoverage);
        });
    });

    describe('POST /api/vaccination/preferences', () => {
        it('should set vaccination preferences', async () => {
            const mockPreferences = {
                id: 1,
                patient_id: 1,
                reminder_enabled: true,
                language_preference: 'hi'
            };

            const preferencesData = {
                patientId: 1,
                reminderEnabled: true,
                languagePreference: 'hi'
            };

            vaccinationService.setVaccinationPreferences.mockResolvedValue(mockPreferences);

            const response = await request(app)
                .post('/api/vaccination/preferences')
                .send(preferencesData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockPreferences);
        });

        it('should validate required patient ID', async () => {
            const response = await request(app)
                .post('/api/vaccination/preferences')
                .send({ reminderEnabled: true });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing patient ID');
        });
    });

    describe('GET /api/vaccination/preferences/:patientId', () => {
        it('should return vaccination preferences', async () => {
            const mockPreferences = {
                id: 1,
                patient_id: 1,
                reminder_enabled: true,
                reminder_advance_days: 7
            };

            vaccinationService.getVaccinationPreferences.mockResolvedValue(mockPreferences);

            const response = await request(app)
                .get('/api/vaccination/preferences/1');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockPreferences);
        });

        it('should return 404 for non-existent preferences', async () => {
            vaccinationService.getVaccinationPreferences.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/vaccination/preferences/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Preferences not found');
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors gracefully', async () => {
            vaccinationService.getVaccinationProfile.mockRejectedValue(
                new Error('Database connection failed')
            );

            const response = await request(app)
                .get('/api/vaccination/profile/1');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
            expect(response.body.message).toBe('Failed to fetch vaccination profile');
        });

        it('should validate input parameters', async () => {
            const response = await request(app)
                .get('/api/vaccination/profile/0'); // Invalid ID

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid patient ID');
        });
    });

    describe('Rate Limiting', () => {
        it('should apply rate limiting to requests', async () => {
            // This test would require setting up rate limiting mock
            // For now, we'll just verify the middleware is applied
            expect(vaccinationRoutes.stack.some(layer => 
                layer.name === 'rateLimitMiddleware' || 
                layer.handle.name === 'rateLimitMiddleware'
            )).toBeTruthy();
        });
    });
});

describe('Vaccination Service Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Data Validation', () => {
        it('should validate vaccination date constraints', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);

            const response = await request(app)
                .post('/api/vaccination/record')
                .send({
                    patientId: 1,
                    vaccineId: 1,
                    doseNumber: 1,
                    vaccinationDate: futureDate.toISOString().split('T')[0]
                });

            expect(response.status).toBe(400);
        });

        it('should validate dose number range', async () => {
            const response = await request(app)
                .post('/api/vaccination/record')
                .send({
                    patientId: 1,
                    vaccineId: 1,
                    doseNumber: 15, // Invalid dose number
                    vaccinationDate: '2024-01-15'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Language Support', () => {
        it('should handle different language parameters', async () => {
            const languages = ['en', 'hi', 'te', 'ta', 'bn', 'mr'];
            
            for (const lang of languages) {
                vaccinationService.getVaccines.mockResolvedValue([]);
                
                const response = await request(app)
                    .get('/api/vaccination/vaccines')
                    .query({ language: lang });

                expect(response.status).toBe(200);
                expect(vaccinationService.getVaccines).toHaveBeenCalledWith(
                    expect.objectContaining({ language: lang })
                );
            }
        });
    });
});
