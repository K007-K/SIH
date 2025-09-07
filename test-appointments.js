const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test appointment functionality
async function testAppointments() {
  console.log('🧪 Testing Appointment Functionality...\n');

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Test 1: Get patient ID
    console.log('1️⃣ Getting patient ID...');
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('phone_number', '+1234567890')
      .single();

    if (patientError) {
      console.log('❌ Error fetching patient:', patientError.message);
      return false;
    }

    console.log('✅ Patient ID:', patient.id);

    // Test 2: Create an appointment
    console.log('\n2️⃣ Creating appointment...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];
    
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        appointment_date: appointmentDate,
        appointment_time: '10:00:00',
        doctor_name: 'Dr. Smith',
        hospital_name: 'City Hospital',
        department: 'General Medicine',
        purpose: 'Regular checkup',
        status: 'scheduled'
      })
      .select()
      .single();

    if (appointmentError) {
      console.log('❌ Error creating appointment:', appointmentError.message);
      return false;
    }

    console.log('✅ Appointment created:', appointment.id);
    console.log('📅 Date:', appointment.appointment_date);
    console.log('🕐 Time:', appointment.appointment_time);

    // Test 3: Get patient appointments
    console.log('\n3️⃣ Fetching patient appointments...');
    
    const { data: appointments, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patient.id)
      .order('appointment_date', { ascending: true });

    if (fetchError) {
      console.log('❌ Error fetching appointments:', fetchError.message);
      return false;
    }

    console.log('✅ Found', appointments.length, 'appointments');
    appointments.forEach((apt, index) => {
      console.log(`   ${index + 1}. ${apt.appointment_date} at ${apt.appointment_time} - ${apt.doctor_name}`);
    });

    // Test 4: Test vaccination schedule
    console.log('\n4️⃣ Testing vaccination schedule...');
    
    const { data: vaccines, error: vaccineError } = await supabase
      .from('vaccination_schedule')
      .select('*')
      .limit(5);

    if (vaccineError) {
      console.log('❌ Error fetching vaccines:', vaccineError.message);
      return false;
    }

    console.log('✅ Found', vaccines.length, 'vaccination schedules');
    vaccines.forEach((vaccine, index) => {
      console.log(`   ${index + 1}. ${vaccine.vaccine_name} - Age: ${vaccine.age_group}`);
    });

    // Test 5: Test health tips
    console.log('\n5️⃣ Testing health tips...');
    
    const { data: tips, error: tipsError } = await supabase
      .from('health_tips')
      .select('*')
      .limit(3);

    if (tipsError) {
      console.log('❌ Error fetching tips:', tipsError.message);
      return false;
    }

    console.log('✅ Found', tips.length, 'health tips');
    tips.forEach((tip, index) => {
      console.log(`   ${index + 1}. ${tip.title}: ${tip.content.substring(0, 50)}...`);
    });

    console.log('\n🎉 All appointment tests passed!');
    console.log('\n📋 What was tested:');
    console.log('✅ Patient retrieval');
    console.log('✅ Appointment creation');
    console.log('✅ Appointment fetching');
    console.log('✅ Vaccination schedule');
    console.log('✅ Health tips');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testAppointments().catch(console.error);
