-- Migration: Create Vaccination Schedules & Tracker Tables
-- File: 001_create_vaccination_tables.sql

-- Vaccines master table
CREATE TABLE vaccines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255), -- Hindi name
    name_te VARCHAR(255), -- Telugu name
    name_ta VARCHAR(255), -- Tamil name
    name_bn VARCHAR(255), -- Bengali name
    name_mr VARCHAR(255), -- Marathi name
    description TEXT NOT NULL,
    description_hi TEXT,
    description_te TEXT,
    description_ta TEXT,
    description_bn TEXT,
    description_mr TEXT,
    vaccine_type VARCHAR(50) CHECK (vaccine_type IN ('routine', 'optional', 'emergency', 'seasonal')),
    manufacturer VARCHAR(255),
    dosage_ml DECIMAL(5,2),
    route_of_administration VARCHAR(50) CHECK (route_of_administration IN ('oral', 'injection', 'nasal', 'subcutaneous', 'intramuscular')),
    storage_temperature VARCHAR(50),
    contraindications TEXT,
    contraindications_hi TEXT,
    contraindications_te TEXT,
    contraindications_ta TEXT,
    contraindications_bn TEXT,
    contraindications_mr TEXT,
    side_effects TEXT,
    side_effects_hi TEXT,
    side_effects_te TEXT,
    side_effects_ta TEXT,
    side_effects_bn TEXT,
    side_effects_mr TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    government_code VARCHAR(50), -- For integration with govt systems
    who_code VARCHAR(50), -- WHO vaccine codes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination schedule templates by age groups
CREATE TABLE vaccination_schedules (
    id SERIAL PRIMARY KEY,
    vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
    age_group VARCHAR(50) CHECK (age_group IN ('newborn', 'infant', 'child', 'adolescent', 'adult', 'elderly', 'pregnant')),
    dose_number INTEGER NOT NULL, -- 1st dose, 2nd dose, booster, etc.
    recommended_age_days INTEGER, -- Age in days when vaccine should be given
    recommended_age_months INTEGER, -- Alternative: age in months
    age_range_start_days INTEGER, -- Minimum age for this dose
    age_range_end_days INTEGER, -- Maximum age for this dose
    interval_from_previous_days INTEGER, -- Minimum days from previous dose
    is_mandatory BOOLEAN DEFAULT TRUE,
    priority_level INTEGER DEFAULT 1, -- 1=highest, 5=lowest
    season_dependent BOOLEAN DEFAULT FALSE, -- For seasonal vaccines
    preferred_season VARCHAR(20), -- 'winter', 'monsoon', 'summer', 'pre_monsoon'
    notes TEXT,
    notes_hi TEXT,
    notes_te TEXT,
    notes_ta TEXT,
    notes_bn TEXT,
    notes_mr TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vaccine_id, dose_number, age_group)
);

-- Patient vaccination records
CREATE TABLE patient_vaccinations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
    dose_number INTEGER NOT NULL,
    vaccination_date DATE NOT NULL,
    administered_by VARCHAR(255), -- Healthcare provider/center
    batch_number VARCHAR(100),
    expiry_date DATE,
    vaccination_center VARCHAR(255),
    vaccination_center_code VARCHAR(50), -- Government center code
    adverse_events TEXT,
    adverse_events_severity VARCHAR(20) CHECK (adverse_events_severity IN ('mild', 'moderate', 'severe')),
    next_dose_due_date DATE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_at TIMESTAMP,
    government_record_id VARCHAR(100), -- Link to govt vaccination records
    certificate_number VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination reminders queue
CREATE TABLE vaccination_reminders (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
    dose_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    reminder_type VARCHAR(20) CHECK (reminder_type IN ('due', 'overdue', 'upcoming')),
    reminder_date DATE NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    message_template TEXT,
    message_template_hi TEXT,
    message_template_te TEXT,
    message_template_ta TEXT,
    message_template_bn TEXT,
    message_template_mr TEXT,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    delivery_status VARCHAR(20) CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    response_received BOOLEAN DEFAULT FALSE,
    response_text TEXT,
    rescheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Government immunization programs
CREATE TABLE immunization_programs (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    program_name_hi VARCHAR(255),
    program_name_te VARCHAR(255),
    program_name_ta VARCHAR(255),
    program_name_bn VARCHAR(255),
    program_name_mr VARCHAR(255),
    program_code VARCHAR(50) UNIQUE,
    description TEXT,
    description_hi TEXT,
    description_te TEXT,
    description_ta TEXT,
    description_bn TEXT,
    description_mr TEXT,
    target_population VARCHAR(100), -- 'children', 'pregnant_women', 'elderly', 'all'
    start_date DATE,
    end_date DATE,
    coverage_area VARCHAR(100), -- 'national', 'state', 'district', 'block'
    implementing_agency VARCHAR(255),
    contact_info JSONB, -- Phone, email, website
    eligibility_criteria TEXT,
    eligibility_criteria_hi TEXT,
    eligibility_criteria_te TEXT,
    eligibility_criteria_ta TEXT,
    eligibility_criteria_bn TEXT,
    eligibility_criteria_mr TEXT,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link vaccines to government programs
CREATE TABLE program_vaccines (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES immunization_programs(id) ON DELETE CASCADE,
    vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
    is_free BOOLEAN DEFAULT TRUE,
    cost_per_dose DECIMAL(10,2),
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'limited', 'out_of_stock', 'discontinued')),
    priority_group VARCHAR(100), -- 'high_risk', 'healthcare_workers', 'general'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, vaccine_id)
);

-- Vaccination centers/providers
CREATE TABLE vaccination_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_te VARCHAR(255),
    name_ta VARCHAR(255),
    name_bn VARCHAR(255),
    name_mr VARCHAR(255),
    center_type VARCHAR(50) CHECK (center_type IN ('government', 'private', 'ngo', 'mobile')),
    government_code VARCHAR(50),
    address TEXT NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    operating_hours JSONB, -- {"monday": "9:00-17:00", "tuesday": "9:00-17:00"}
    services_offered TEXT[],
    vaccines_available INTEGER[], -- Array of vaccine IDs
    appointment_required BOOLEAN DEFAULT FALSE,
    online_booking_url VARCHAR(500),
    capacity_per_day INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination coverage analytics
CREATE TABLE vaccination_coverage (
    id SERIAL PRIMARY KEY,
    vaccine_id INTEGER REFERENCES vaccines(id) ON DELETE CASCADE,
    age_group VARCHAR(50),
    district VARCHAR(100),
    state VARCHAR(100),
    target_population INTEGER,
    vaccinated_count INTEGER,
    coverage_percentage DECIMAL(5,2),
    reporting_period_start DATE,
    reporting_period_end DATE,
    data_source VARCHAR(100), -- 'government', 'survey', 'estimated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User vaccination preferences
CREATE TABLE vaccination_preferences (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    reminder_enabled BOOLEAN DEFAULT TRUE,
    reminder_advance_days INTEGER DEFAULT 7, -- Remind 7 days before due date
    preferred_reminder_time TIME DEFAULT '10:00:00',
    language_preference VARCHAR(10) DEFAULT 'en',
    preferred_center_id INTEGER REFERENCES vaccination_centers(id),
    notification_channels TEXT[] DEFAULT ARRAY['whatsapp'], -- whatsapp, sms, email
    auto_schedule BOOLEAN DEFAULT FALSE,
    privacy_consent BOOLEAN DEFAULT FALSE,
    data_sharing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id)
);

-- Indexes for performance
CREATE INDEX idx_vaccines_type ON vaccines(vaccine_type);
CREATE INDEX idx_vaccines_active ON vaccines(is_active);
CREATE INDEX idx_vaccination_schedules_age_group ON vaccination_schedules(age_group);
CREATE INDEX idx_vaccination_schedules_vaccine ON vaccination_schedules(vaccine_id);
CREATE INDEX idx_patient_vaccinations_patient ON patient_vaccinations(patient_id);
CREATE INDEX idx_patient_vaccinations_vaccine ON patient_vaccinations(vaccine_id);
CREATE INDEX idx_patient_vaccinations_date ON patient_vaccinations(vaccination_date);
CREATE INDEX idx_vaccination_reminders_patient ON vaccination_reminders(patient_id);
CREATE INDEX idx_vaccination_reminders_due_date ON vaccination_reminders(due_date);
CREATE INDEX idx_vaccination_reminders_sent ON vaccination_reminders(sent);
CREATE INDEX idx_immunization_programs_active ON immunization_programs(is_active);
CREATE INDEX idx_vaccination_centers_active ON vaccination_centers(is_active);
CREATE INDEX idx_vaccination_centers_location ON vaccination_centers(district, state);
CREATE INDEX idx_vaccination_coverage_vaccine ON vaccination_coverage(vaccine_id);
CREATE INDEX idx_vaccination_preferences_patient ON vaccination_preferences(patient_id);

-- Triggers for updated_at columns
CREATE TRIGGER update_vaccines_updated_at BEFORE UPDATE ON vaccines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_schedules_updated_at BEFORE UPDATE ON vaccination_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_vaccinations_updated_at BEFORE UPDATE ON patient_vaccinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_reminders_updated_at BEFORE UPDATE ON vaccination_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_immunization_programs_updated_at BEFORE UPDATE ON immunization_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_preferences_updated_at BEFORE UPDATE ON vaccination_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE VIEW patient_vaccination_status AS
SELECT 
    p.id as patient_id,
    p.name as patient_name,
    p.date_of_birth,
    EXTRACT(DAYS FROM (CURRENT_DATE - p.date_of_birth)) as age_in_days,
    v.id as vaccine_id,
    v.name as vaccine_name,
    vs.dose_number,
    vs.recommended_age_days,
    pv.vaccination_date,
    pv.next_dose_due_date,
    CASE 
        WHEN pv.vaccination_date IS NOT NULL THEN 'completed'
        WHEN CURRENT_DATE > (p.date_of_birth + vs.recommended_age_days) THEN 'overdue'
        WHEN CURRENT_DATE >= (p.date_of_birth + vs.recommended_age_days - 30) THEN 'due_soon'
        ELSE 'future'
    END as status
FROM patients p
CROSS JOIN vaccination_schedules vs
JOIN vaccines v ON vs.vaccine_id = v.id
LEFT JOIN patient_vaccinations pv ON p.id = pv.patient_id 
    AND v.id = pv.vaccine_id 
    AND vs.dose_number = pv.dose_number
WHERE v.is_active = TRUE
    AND vs.age_range_start_days <= EXTRACT(DAYS FROM (CURRENT_DATE - p.date_of_birth))
    AND (vs.age_range_end_days IS NULL OR vs.age_range_end_days >= EXTRACT(DAYS FROM (CURRENT_DATE - p.date_of_birth)));

CREATE VIEW vaccination_due_today AS
SELECT 
    pvs.*,
    vr.id as reminder_id,
    vr.sent as reminder_sent
FROM patient_vaccination_status pvs
LEFT JOIN vaccination_reminders vr ON pvs.patient_id = vr.patient_id 
    AND pvs.vaccine_id = vr.vaccine_id 
    AND pvs.dose_number = vr.dose_number
WHERE pvs.status IN ('overdue', 'due_soon')
    AND (vr.sent = FALSE OR vr.sent IS NULL);
