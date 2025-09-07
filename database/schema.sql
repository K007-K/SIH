-- Healthcare WhatsApp Bot Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    date_of_birth DATE,
    address TEXT,
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    allergies TEXT[],
    chronic_conditions TEXT[],
    current_medications TEXT[],
    blood_type VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Medical history table
CREATE TABLE medical_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    condition_name VARCHAR(200) NOT NULL,
    diagnosis_date DATE,
    severity VARCHAR(20), -- mild, moderate, severe
    status VARCHAR(20), -- active, resolved, chronic
    notes TEXT,
    doctor_name VARCHAR(100),
    hospital_name VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    doctor_name VARCHAR(100),
    hospital_name VARCHAR(200),
    department VARCHAR(100),
    purpose TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccination records table
CREATE TABLE vaccinations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(200) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    batch_number VARCHAR(50),
    administered_by VARCHAR(100),
    location VARCHAR(200),
    side_effects TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccination schedule template
CREATE TABLE vaccination_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vaccine_name VARCHAR(200) NOT NULL,
    age_group VARCHAR(50), -- "0-2 months", "2-4 months", etc.
    recommended_age_months INTEGER,
    dose_number INTEGER,
    interval_months INTEGER, -- months between doses
    is_mandatory BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    message_count INTEGER DEFAULT 0,
    topics_discussed TEXT[],
    ai_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL, -- text, image, audio
    content TEXT,
    image_url TEXT,
    is_from_patient BOOLEAN NOT NULL,
    ai_response TEXT,
    sentiment VARCHAR(20), -- positive, negative, neutral
    medical_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health alerts table
CREATE TABLE health_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- outbreak, vaccination, general
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20), -- low, medium, high, critical
    target_audience VARCHAR(100), -- all, age_group, condition
    region VARCHAR(100),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient alert subscriptions
CREATE TABLE patient_alert_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    is_subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id, alert_type)
);

-- Health tips table
CREATE TABLE health_tips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(100) NOT NULL, -- nutrition, exercise, hygiene, etc.
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_phone ON patients(phone_number);
CREATE INDEX idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id);
CREATE INDEX idx_messages_session ON messages(chat_session_id);
CREATE INDEX idx_messages_patient ON messages(patient_id);
CREATE INDEX idx_health_alerts_active ON health_alerts(is_active, valid_from, valid_until);

-- Insert default vaccination schedule
INSERT INTO vaccination_schedule (vaccine_name, age_group, recommended_age_months, dose_number, interval_months, is_mandatory, description) VALUES
('BCG', '0-1 months', 0, 1, 0, true, 'Bacillus Calmette-Guérin vaccine for tuberculosis'),
('Hepatitis B', '0-1 months', 0, 1, 1, true, 'First dose of Hepatitis B vaccine'),
('Hepatitis B', '1-2 months', 1, 2, 0, true, 'Second dose of Hepatitis B vaccine'),
('DPT', '2-3 months', 2, 1, 4, true, 'Diphtheria, Pertussis, Tetanus first dose'),
('DPT', '4-5 months', 4, 2, 4, true, 'Diphtheria, Pertussis, Tetanus second dose'),
('DPT', '6-7 months', 6, 3, 0, true, 'Diphtheria, Pertussis, Tetanus third dose'),
('Polio', '2-3 months', 2, 1, 4, true, 'Oral Polio Vaccine first dose'),
('Polio', '4-5 months', 4, 2, 4, true, 'Oral Polio Vaccine second dose'),
('Polio', '6-7 months', 6, 3, 0, true, 'Oral Polio Vaccine third dose'),
('Measles', '9-12 months', 9, 1, 0, true, 'Measles vaccine'),
('MMR', '12-15 months', 12, 1, 0, true, 'Measles, Mumps, Rubella vaccine'),
('DPT Booster', '16-24 months', 16, 1, 0, true, 'DPT booster dose'),
('Polio Booster', '16-24 months', 16, 1, 0, true, 'Polio booster dose');

-- Insert sample health tips
INSERT INTO health_tips (category, title, content, target_audience, language) VALUES
('nutrition', 'Balanced Diet', 'Include fruits, vegetables, whole grains, and lean proteins in your daily meals. Drink plenty of water and limit processed foods.', 'all', 'en'),
('exercise', 'Daily Physical Activity', 'Aim for at least 30 minutes of moderate physical activity daily. This can include walking, cycling, or household chores.', 'adults', 'en'),
('hygiene', 'Hand Washing', 'Wash your hands frequently with soap and water for at least 20 seconds, especially before eating and after using the restroom.', 'all', 'en'),
('prevention', 'Regular Health Checkups', 'Schedule regular health checkups with your doctor, even when you feel healthy. Early detection saves lives.', 'adults', 'en'),
('mental_health', 'Stress Management', 'Practice relaxation techniques like deep breathing, meditation, or yoga to manage stress and maintain mental well-being.', 'adults', 'en');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
