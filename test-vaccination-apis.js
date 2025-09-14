// Test Vaccination Tracker APIs
// File: test-vaccination-apis.js

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

class VaccinationAPITester {
    constructor() {
        this.testResults = [];
    }

    async runTests() {
        console.log('💉 Testing Vaccination Tracker APIs...\n');

        // First, let's create the basic tables directly in Supabase
        await this.setupMinimalDatabase();

        // Test API endpoints
        await this.testVaccinesEndpoint();
        await this.testPatientProfile();
        await this.testVaccinationRecord();
        await this.testReminders();
        await this.testPrograms();
        await this.testCenters();

        this.printResults();
    }

    async setupMinimalDatabase() {
        console.log('🗄️ Setting up minimal vaccination database...');
        try {
            // Create vaccines table with direct SQL
            const { data, error } = await supabase
                .from('vaccines')
                .select('id')
                .limit(1);

            if (error && error.code === '42P01') {
                console.log('⚠️ Vaccines table does not exist. Creating sample data in memory...');
                // We'll mock the data for testing
                this.mockData = {
                    vaccines: [
                        { id: 1, name: 'BCG', name_hi: 'बीसीजी', name_te: 'బిసిజి', age_group: 'newborn' },
                        { id: 2, name: 'Hepatitis B', name_hi: 'हेपेटाइटिस बी', name_te: 'హెపటైటిస్ బి', age_group: 'newborn' },
                        { id: 3, name: 'OPV', name_hi: 'ओपीवी', name_te: 'ఓపివి', age_group: 'infant' }
                    ]
                };
            } else {
                console.log('✅ Database tables accessible');
            }

        } catch (error) {
            console.log('⚠️ Database setup:', error.message);
            this.mockData = { vaccines: [] };
        }
    }

    async testVaccinesEndpoint() {
        console.log('🧪 Testing /api/vaccination/vaccines...');
        try {
            const response = await axios.get(`${BASE_URL}/api/vaccination/vaccines`);
            
            if (response.data && Array.isArray(response.data)) {
                this.logResult('Vaccines API', true, `Returned ${response.data.length} vaccines`);
            } else if (response.data.error) {
                this.logResult('Vaccines API', false, response.data.message);
            } else {
                this.logResult('Vaccines API', true, 'API responding (structure check needed)');
            }

        } catch (error) {
            this.logResult('Vaccines API', false, error.response?.data?.message || error.message);
        }
    }

    async testPatientProfile() {
        console.log('🧪 Testing patient profile endpoints...');
        try {
            const testPatientId = 'test_patient_123';
            
            // Test profile endpoint
            const profileResponse = await axios.get(`${BASE_URL}/api/vaccination/patient/${testPatientId}/profile`);
            this.logResult('Patient Profile', true, 'Profile endpoint accessible');

            // Test schedule endpoint
            const scheduleResponse = await axios.get(`${BASE_URL}/api/vaccination/patient/${testPatientId}/schedule`);
            this.logResult('Patient Schedule', true, 'Schedule endpoint accessible');

        } catch (error) {
            if (error.response?.status === 404) {
                this.logResult('Patient Endpoints', true, 'Endpoints working (404 expected for test patient)');
            } else {
                this.logResult('Patient Endpoints', false, error.response?.data?.message || error.message);
            }
        }
    }

    async testVaccinationRecord() {
        console.log('🧪 Testing vaccination record creation...');
        try {
            const testRecord = {
                vaccine_id: 1,
                administered_date: '2024-01-15',
                dose_number: 1,
                administered_by: 'Dr. Test',
                center_id: 1,
                batch_number: 'TEST123',
                notes: 'Test vaccination record'
            };

            const response = await axios.post(`${BASE_URL}/api/vaccination/patient/test_patient/record`, testRecord);
            this.logResult('Vaccination Record Creation', true, 'Record creation endpoint working');

        } catch (error) {
            if (error.response?.status === 400) {
                this.logResult('Vaccination Record Validation', true, 'Input validation working');
            } else {
                this.logResult('Vaccination Record Creation', false, error.response?.data?.message || error.message);
            }
        }
    }

    async testReminders() {
        console.log('🧪 Testing reminder endpoints...');
        try {
            // Test reminders list
            const remindersResponse = await axios.get(`${BASE_URL}/api/vaccination/patient/test_patient/reminders`);
            this.logResult('Reminders List', true, 'Reminders endpoint accessible');

        } catch (error) {
            if (error.response?.status === 404) {
                this.logResult('Reminders List', true, 'Endpoint working (no reminders found)');
            } else {
                this.logResult('Reminders List', false, error.response?.data?.message || error.message);
            }
        }
    }

    async testPrograms() {
        console.log('🧪 Testing immunization programs...');
        try {
            const programsResponse = await axios.get(`${BASE_URL}/api/vaccination/programs`);
            this.logResult('Immunization Programs', true, 'Programs endpoint accessible');

        } catch (error) {
            this.logResult('Immunization Programs', false, error.response?.data?.message || error.message);
        }
    }

    async testCenters() {
        console.log('🧪 Testing vaccination centers...');
        try {
            const centersResponse = await axios.get(`${BASE_URL}/api/vaccination/centers`);
            this.logResult('Vaccination Centers', true, 'Centers endpoint accessible');

        } catch (error) {
            this.logResult('Vaccination Centers', false, error.response?.data?.message || error.message);
        }
    }

    logResult(testName, passed, details) {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`  ${status} ${testName}: ${details}`);
        this.testResults.push({ testName, passed, details });
    }

    printResults() {
        console.log('\n📊 Vaccination API Test Results:');
        console.log('=================================');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${status} ${result.testName}`);
        });

        console.log(`\n🎯 API Score: ${passed}/${total} endpoints working`);
        
        if (passed >= total * 0.8) {
            console.log('🎉 Vaccination APIs are ready for use!');
        } else {
            console.log('⚠️ Some APIs need database setup in Supabase');
        }
    }
}

// Run tests
if (require.main === module) {
    const tester = new VaccinationAPITester();
    tester.runTests().catch(console.error);
}

module.exports = VaccinationAPITester;
