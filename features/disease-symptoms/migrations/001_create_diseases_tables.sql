-- Migration: Create Disease Symptoms Education Tables
-- File: 001_create_diseases_tables.sql

-- Diseases master table
CREATE TABLE diseases (
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
    severity_level VARCHAR(20) CHECK (severity_level IN ('low', 'medium', 'high', 'emergency')),
    is_contagious BOOLEAN DEFAULT FALSE,
    prevention_tips TEXT,
    prevention_tips_hi TEXT,
    prevention_tips_te TEXT,
    prevention_tips_ta TEXT,
    prevention_tips_bn TEXT,
    prevention_tips_mr TEXT,
    when_to_seek_help TEXT NOT NULL,
    when_to_seek_help_hi TEXT,
    when_to_seek_help_te TEXT,
    when_to_seek_help_ta TEXT,
    when_to_seek_help_bn TEXT,
    when_to_seek_help_mr TEXT,
    emergency_signs TEXT,
    emergency_signs_hi TEXT,
    emergency_signs_te TEXT,
    emergency_signs_ta TEXT,
    emergency_signs_bn TEXT,
    emergency_signs_mr TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Symptoms master table
CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_te VARCHAR(255),
    name_ta VARCHAR(255),
    name_bn VARCHAR(255),
    name_mr VARCHAR(255),
    description TEXT,
    description_hi TEXT,
    description_te TEXT,
    description_ta TEXT,
    description_bn TEXT,
    description_mr TEXT,
    body_part VARCHAR(100), -- head, chest, abdomen, etc.
    severity_indicator VARCHAR(20) CHECK (severity_indicator IN ('mild', 'moderate', 'severe', 'emergency')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease-Symptom relationship table
CREATE TABLE disease_symptoms (
    id SERIAL PRIMARY KEY,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    symptom_id INTEGER REFERENCES symptoms(id) ON DELETE CASCADE,
    frequency VARCHAR(20) CHECK (frequency IN ('common', 'occasional', 'rare')),
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(disease_id, symptom_id)
);

-- Disease categories for better organization
CREATE TABLE disease_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_te VARCHAR(255),
    name_ta VARCHAR(255),
    name_bn VARCHAR(255),
    name_mr VARCHAR(255),
    description TEXT,
    icon VARCHAR(50), -- for UI representation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link diseases to categories
CREATE TABLE disease_category_mapping (
    id SERIAL PRIMARY KEY,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES disease_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(disease_id, category_id)
);

-- Awareness campaign content
CREATE TABLE awareness_campaigns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    title_te VARCHAR(255),
    title_ta VARCHAR(255),
    title_bn VARCHAR(255),
    title_mr VARCHAR(255),
    content TEXT NOT NULL,
    content_hi TEXT,
    content_te TEXT,
    content_ta TEXT,
    content_bn TEXT,
    content_mr TEXT,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('prevention', 'awareness', 'symptoms', 'treatment')),
    target_audience VARCHAR(50) CHECK (target_audience IN ('general', 'children', 'elderly', 'pregnant', 'chronic')),
    media_type VARCHAR(20) CHECK (media_type IN ('text', 'audio', 'image', 'video')),
    media_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency keywords for red-flag detection
CREATE TABLE emergency_keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    keyword_hi VARCHAR(255),
    keyword_te VARCHAR(255),
    keyword_ta VARCHAR(255),
    keyword_bn VARCHAR(255),
    keyword_mr VARCHAR(255),
    severity_level VARCHAR(20) CHECK (severity_level IN ('high', 'emergency')),
    auto_response TEXT NOT NULL,
    auto_response_hi TEXT,
    auto_response_te TEXT,
    auto_response_ta TEXT,
    auto_response_bn TEXT,
    auto_response_mr TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User symptom queries log for analytics
CREATE TABLE symptom_queries (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    query_text TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    matched_symptoms INTEGER[], -- array of symptom IDs
    suggested_diseases INTEGER[], -- array of disease IDs
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    emergency_triggered BOOLEAN DEFAULT FALSE,
    user_feedback VARCHAR(20) CHECK (user_feedback IN ('helpful', 'not_helpful', 'partially_helpful')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_diseases_severity ON diseases(severity_level);
CREATE INDEX idx_diseases_contagious ON diseases(is_contagious);
CREATE INDEX idx_symptoms_body_part ON symptoms(body_part);
CREATE INDEX idx_symptoms_severity ON symptoms(severity_indicator);
CREATE INDEX idx_disease_symptoms_disease ON disease_symptoms(disease_id);
CREATE INDEX idx_disease_symptoms_symptom ON disease_symptoms(symptom_id);
CREATE INDEX idx_awareness_campaigns_active ON awareness_campaigns(is_active);
CREATE INDEX idx_awareness_campaigns_dates ON awareness_campaigns(start_date, end_date);
CREATE INDEX idx_emergency_keywords_severity ON emergency_keywords(severity_level);
CREATE INDEX idx_symptom_queries_patient ON symptom_queries(patient_id);
CREATE INDEX idx_symptom_queries_emergency ON symptom_queries(emergency_triggered);
CREATE INDEX idx_symptom_queries_created ON symptom_queries(created_at);

-- Update trigger for diseases table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON diseases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON symptoms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_awareness_campaigns_updated_at BEFORE UPDATE ON awareness_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
