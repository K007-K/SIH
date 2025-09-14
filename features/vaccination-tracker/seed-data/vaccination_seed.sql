-- Seed Data: Indian Government Vaccination Schedule
-- File: vaccination_seed.sql

-- Insert common vaccines from Indian immunization schedule
INSERT INTO vaccines (
    name, name_hi, name_te, name_ta, name_bn, name_mr,
    description, description_hi, description_te, description_ta, description_bn, description_mr,
    vaccine_type, route_of_administration, government_code, who_code
) VALUES
-- Birth vaccines
(
    'BCG', 'बीसीजी', 'బిసిజి', 'பிசிஜி', 'বিসিজি', 'बीसीजी',
    'Bacillus Calmette-Guerin vaccine for tuberculosis prevention', 'तपेदिक की रोकथाम के लिए बीसीजी टीका', 'క్షయవ్యాధి నివారణ కోసం బిసిజి వ్యాక్సిన్', 'காசநோய் தடுப्पुக்காக பிசிஜி தடுப्पूசி', 'যক্ষ্মা প্রতিরোধের জন্য বিসিজি টিকা', 'क्षयरोग प्रतिबंधासाठी बीसीजी लस',
    'routine', 'injection', 'BCG', 'J07AN01'
),
(
    'Hepatitis B', 'हेपेटाइटिस बी', 'హెపటైటిస్ బి', 'ஹெபடைட்டிஸ் பி', 'হেপাটাইটিস বি', 'हेपेटायटिस बी',
    'Hepatitis B vaccine for liver protection', 'यकृत सुरक्षा के लिए हेपेटाइटिस बी टीका', 'కాలేయ రక్షణ కోసం హెపటైటిస్ బి వ్యాక్సిన్', 'கல்லீरல் பாதுகாப्पुக்காக ஹெபடைட்டிஸ் பி தடுப्पूசி', 'যকৃত সুরক্ষার জন্য হেপাটাইটিস বি টিকা', 'यकृत संरक्षणासाठी हेपेटायटिस बी लस',
    'routine', 'injection', 'HEPB', 'J07BC01'
),
-- 6 weeks vaccines
(
    'OPV', 'ओपीवी', 'ఓపివి', 'ஓபிவி', 'ওপিভি', 'ओपीव्ही',
    'Oral Polio Vaccine for polio prevention', 'पोलियो की रोकथाम के लिए मौखिक पोलियो टीका', 'పోలియో నివారణ కోసం నోటి పోలియో వ్యాక్సిన్', 'போலியோ தடுप्पுக्காक வாய்வழி போலியோ தடुप्पूसी', 'পোলিও প্রতিরোধের জন্য মুখে খাওয়ার পোলিও টিকা', 'पोलिओ प्रतिबंधासाठी तोंडी पोलिओ लस',
    'routine', 'oral', 'OPV', 'J07BF01'
),
(
    'Pentavalent', 'पेंटावैलेंट', 'పెంటావాలెంట్', 'பென்டாவேலன்ட்', 'পেন্টাভ্যালেন্ট', 'पेंटाव्हॅलेंट',
    'Five-in-one vaccine (DPT+HepB+Hib)', 'पांच-में-एक टीका (डीपीटी+हेपबी+हिब)', 'ఐదు-లో-ఒకటి వ్యాక్సిన్ (డిపిటి+హెప్‌బి+హిబ్)', 'ஐந்து-இல்-ஒன்று தடुप्पूसी (டிபிटி+ஹெப்பி+ஹிப்)', 'পাঁচ-এক-এ টিকা (ডিপিটি+হেপবি+হিব)', 'पाच-एक-मध्ये लस (डीपीटी+हेपबी+हिब)',
    'routine', 'injection', 'PENTA', 'J07CA09'
),
-- 10 weeks vaccines
(
    'Rotavirus', 'रोटावायरस', 'రోటావైరస్', 'ரோட்டாவைரஸ்', 'রোটাভাইরাস', 'रोटाव्हायरस',
    'Rotavirus vaccine for diarrhea prevention', 'दस्त की रोकथाम के लिए रोटावायरस टीका', 'అతిసారం నివారణ కోసం రోటావైరస్ వ్యాక్సిన్', 'வயிற்றுப்போக்கு தடुप्पुक्காक ரோட்டாவைரஸ் தடुप्पूसी', 'ডায়রিয়া প্রতিরোধের জন্য রোটাভাইরাস টিকা', 'अतिसार प्रतिबंधासाठी रोटाव्हायरस लस',
    'routine', 'oral', 'RV', 'J07BH01'
),
-- 9 months vaccines
(
    'Measles', 'खसरा', 'మీజిల్స్', 'தட்டம்மை', 'হাম', 'गोवर',
    'Measles vaccine for measles prevention', 'खसरे की रोकथाम के लिए खसरा टीका', 'మీజిల్స్ నివారణ కోసం మీజిల్స్ వ్యాక్సిన్', 'தட்டம்மை தடुप्पुक्காक தட்டம்மை தடुप्पूसी', 'হাম প্রতিরোধের জন্য হাম টিকা', 'गोवर प्रतिबंधासाठी गोवर लस',
    'routine', 'injection', 'MEASLES', 'J07BD01'
),
-- 16-24 months vaccines
(
    'MMR', 'एमएमआर', 'ఎంఎంఆర్', 'எம்எம்ஆர்', 'এমএমআর', 'एमएमआर',
    'Measles, Mumps, Rubella vaccine', 'खसरा, कण्ठमाला, रूबेला टीका', 'మీజిల్స్, మంప్స్, రుబెల్లా వ్యాక్సిన్', 'தட்டம்மை, பொன்னுக்கு வீக்கம், ரூபெல்லா தடुप्पूसी', 'হাম, মাম্পস, রুবেলা টিকা', 'गोवर, कण्ठमाला, रुबेला लस',
    'routine', 'injection', 'MMR', 'J07BD52'
),
-- Adult vaccines
(
    'Tetanus Toxoid', 'टिटनेस टॉक्सॉयड', 'టెటనస్ టాక్సాయిడ్', 'டெட்டனஸ் டாக்ஸாய்டு', 'টিটেনাস টক্সয়েড', 'टिटॅनस टॉक्सॉईड',
    'Tetanus prevention for pregnant women and adults', 'गर्भवती महिलाओं और वयस्कों के लिए टिटनेस की रोकथाम', 'గర్భిణీ మహిళలు మరియు పెద్దలకు టెటనస్ నివారణ', 'கர்ப்பிணிப் பெண்கள் மற்றும் பெரியவர்களுக்கு டெட்டனஸ் தடுப्पு', 'গর্ভবতী মহিলা এবং প্রাপ্তবয়স্কদের জন্য টিটেনাস প্রতিরোধ', 'गर्भवती महिला आणि प्रौढांसाठी टिटॅनस प्रतिबंध',
    'routine', 'injection', 'TT', 'J07AM01'
),
-- COVID-19 vaccines
(
    'COVID-19', 'कोविड-19', 'కోవిడ్-19', 'கோவிட்-19', 'কোভিড-১৯', 'कोविड-19',
    'COVID-19 vaccine for coronavirus protection', 'कोरोनावायरस सुरक्षा के लिए कोविड-19 टीका', 'కరోనావైరస్ రక్షణ కోసం కోవిడ్-19 వ్యాక్సిన్', 'கொரோனாவைரஸ் பாதுகாप्पুக्காक கோவிட்-19 தடुप्पूसी', 'করোনাভাইরাস সুরক্ষার জন্য কোভিড-১৯ টিকা', 'कोरोनाव्हायरस संरक्षणासाठी कोविड-19 लस',
    'emergency', 'injection', 'COVID19', 'J07BX03'
),
-- Seasonal vaccines
(
    'Influenza', 'इन्फ्लूएंजा', 'ఇన్ఫ్లుఎంజా', 'இன்ஃப்ளூயன்சா', 'ইনফ্লুয়েঞ্জা', 'इन्फ्लुएंझा',
    'Seasonal flu vaccine', 'मौसमी फ्लू टीका', 'కాలానుగుణ ఫ్లూ వ్యాక్సిన్', 'பருவகால காய்ச்சல் தடुप्पूसी', 'মৌসুমী ফ্লু টিকা', 'हंगामी फ्लू लस',
    'seasonal', 'injection', 'FLU', 'J07BB02'
);

-- Insert vaccination schedules based on Indian immunization program
INSERT INTO vaccination_schedules (
    vaccine_id, age_group, dose_number, recommended_age_days, age_range_start_days, age_range_end_days, 
    interval_from_previous_days, is_mandatory, priority_level, notes, notes_hi, notes_te
) VALUES
-- Birth vaccines (0-15 days)
(1, 'newborn', 1, 0, 0, 15, NULL, TRUE, 1, 'Given at birth or within 15 days', 'जन्म के समय या 15 दिनों के भीतर दिया जाता है', 'పుట్టినప్పుడు లేదా 15 రోజులలో ఇవ్వాలి'),
(2, 'newborn', 1, 0, 0, 15, NULL, TRUE, 1, 'First dose at birth', 'जन्म के समय पहली खुराक', 'పుట్టినప్పుడు మొదటి డోస్'),

-- 6 weeks vaccines
(3, 'infant', 1, 42, 42, 70, NULL, TRUE, 1, 'First dose at 6 weeks', '6 सप्ताह में पहली खुराक', '6 వారాలలో మొదటి డోస్'),
(4, 'infant', 1, 42, 42, 70, NULL, TRUE, 1, 'First dose of Pentavalent', 'पेंटावैलेंट की पहली खुराक', 'పెంటావాలెంట్ మొదటి డోస్'),

-- 10 weeks vaccines
(3, 'infant', 2, 70, 70, 98, 28, TRUE, 1, 'Second dose at 10 weeks', '10 सप्ताह में दूसरी खुराक', '10 వారాలలో రెండవ డోస్'),
(4, 'infant', 2, 70, 70, 98, 28, TRUE, 1, 'Second dose of Pentavalent', 'पेंटावैलेंट की दूसरी खुराक', 'పెంటావాలెంట్ రెండవ డోస్'),
(5, 'infant', 1, 70, 70, 98, NULL, TRUE, 1, 'First dose of Rotavirus', 'रोटावायरस की पहली खुराक', 'రోటావైరస్ మొదటి డోస్'),

-- 14 weeks vaccines
(3, 'infant', 3, 98, 98, 126, 28, TRUE, 1, 'Third dose at 14 weeks', '14 सप्ताह में तीसरी खुराक', '14 వారాలలో మూడవ డోస్'),
(4, 'infant', 3, 98, 98, 126, 28, TRUE, 1, 'Third dose of Pentavalent', 'पेंटावैलेंट की तीसरी खुराक', 'పెంటావాలెంట్ మూడవ డోస్'),
(5, 'infant', 2, 98, 98, 126, 28, TRUE, 1, 'Second dose of Rotavirus', 'रोटावायरस की दूसरी खुराक', 'రోటావైరస్ రెండవ డోస్'),

-- 9 months vaccines
(6, 'infant', 1, 270, 270, 365, NULL, TRUE, 1, 'Measles at 9 months', '9 महीने में खसरा', '9 నెలలలో మీజిల్స్'),

-- 16-24 months vaccines
(7, 'child', 1, 480, 480, 730, NULL, TRUE, 1, 'MMR between 16-24 months', '16-24 महीने के बीच एमएमआर', '16-24 నెలల మధ్య ఎంఎంఆర్'),
(3, 'child', 4, 480, 480, 730, NULL, TRUE, 1, 'OPV booster', 'ओपीवी बूस्टर', 'ఓపివి బూస్టర్'),
(4, 'child', 4, 480, 480, 730, NULL, TRUE, 1, 'DPT booster', 'डीपीटी बूस्टर', 'డిపిటి బూస్టర్'),

-- 5-6 years vaccines
(4, 'child', 5, 1825, 1825, 2190, NULL, TRUE, 2, 'DPT booster at 5-6 years', '5-6 साल में डीपीटी बूस्टर', '5-6 సంవత్సరాలలో డిపిటి బూస్టర్'),

-- 10 years vaccines
(8, 'child', 1, 3650, 3650, 4015, NULL, TRUE, 2, 'TT at 10 years', '10 साल में टीटी', '10 సంవత్సరాలలో టిటి'),

-- 16 years vaccines
(8, 'adolescent', 2, 5840, 5840, 6205, NULL, TRUE, 2, 'TT booster at 16 years', '16 साल में टीटी बूस्टर', '16 సంవత్సరాలలో టిటి బూస్టర్'),

-- Pregnant women vaccines
(8, 'pregnant', 1, NULL, NULL, NULL, NULL, TRUE, 1, 'TT1 during pregnancy', 'गर्भावस्था के दौरान टीटी1', 'గర్భధారణ సమయంలో టిటి1'),
(8, 'pregnant', 2, NULL, NULL, NULL, 28, TRUE, 1, 'TT2 during pregnancy', 'गर्भावस्था के दौरान टीटी2', 'గర్భధారణ సమయంలో టిటి2'),

-- Adult vaccines
(9, 'adult', 1, 6570, 6570, NULL, NULL, FALSE, 2, 'COVID-19 first dose for adults', 'वयस्कों के लिए कोविड-19 पहली खुराक', 'పెద్దలకు కోవిడ్-19 మొదటి డోస్'),
(9, 'adult', 2, 6570, 6570, NULL, 28, FALSE, 2, 'COVID-19 second dose', 'कोविड-19 दूसरी खुराक', 'కోవిడ్-19 రెండవ డోస్'),

-- Seasonal vaccines
(10, 'adult', 1, NULL, NULL, NULL, NULL, FALSE, 3, 'Annual flu vaccine', 'वार्षिक फ्लू टीका', 'వార్షిక ఫ్లూ వ్యాక్సిన్'),
(10, 'elderly', 1, NULL, NULL, NULL, NULL, FALSE, 2, 'Annual flu vaccine for elderly', 'बुजुर्गों के लिए वार्षिक फ्लू टीका', 'వృద్ధులకు వార్షిక ఫ్లూ వ్యాక్సిన్');

-- Insert government immunization programs
INSERT INTO immunization_programs (
    program_name, program_name_hi, program_name_te, program_code,
    description, description_hi, description_te,
    target_population, coverage_area, implementing_agency, is_active
) VALUES
(
    'Universal Immunization Programme', 'सार्वभौमिक टीकाकरण कार्यक्रम', 'సార్వత్రిక రోగనిరోధక కార్యక్రమం', 'UIP',
    'National immunization program providing free vaccines to all children', 'सभी बच्चों को मुफ्त टीके प्रदान करने वाला राष्ट्रीय टीकाकरण कार्यक्रम', 'అన్ని పిల్లలకు ఉచిత వ్యాక్సిన్‌లు అందించే జాతీయ రోగనిరోధక కార్యక్రమం',
    'children', 'national', 'Ministry of Health and Family Welfare', TRUE
),
(
    'Mission Indradhanush', 'मिशन इंद्रधनुष', 'మిషన్ ఇంద్రధనుష్', 'MI',
    'Intensive immunization mission to achieve full immunization coverage', 'पूर्ण टीकाकरण कवरेज प्राप्त करने के लिए गहन टीकाकरण मिशन', 'పూర్తి రోగనిరోధక కవరేజ్ సాధించడానికి ఇంటెన్సివ్ రోగనిరోధక మిషన్',
    'children', 'national', 'Ministry of Health and Family Welfare', TRUE
),
(
    'COVID-19 Vaccination Drive', 'कोविड-19 टीकाकरण अभियान', 'కోవిడ్-19 వ్యాక్సినేషన్ డ్రైవ్', 'COVID19',
    'National COVID-19 vaccination campaign for all eligible citizens', 'सभी पात्र नागरिकों के लिए राष्ट्रीय कोविड-19 टीकाकरण अभियान', 'అన్ని అర్హ పౌరులకు జాతీయ కోవిడ్-19 వ్యాక్సినేషన్ ప్రచారం',
    'all', 'national', 'Ministry of Health and Family Welfare', TRUE
);

-- Link vaccines to programs
INSERT INTO program_vaccines (program_id, vaccine_id, is_free, availability_status) VALUES
-- UIP vaccines
(1, 1, TRUE, 'available'), -- BCG
(1, 2, TRUE, 'available'), -- Hepatitis B
(1, 3, TRUE, 'available'), -- OPV
(1, 4, TRUE, 'available'), -- Pentavalent
(1, 5, TRUE, 'available'), -- Rotavirus
(1, 6, TRUE, 'available'), -- Measles
(1, 7, TRUE, 'available'), -- MMR
(1, 8, TRUE, 'available'), -- Tetanus Toxoid

-- Mission Indradhanush
(2, 1, TRUE, 'available'),
(2, 2, TRUE, 'available'),
(2, 3, TRUE, 'available'),
(2, 4, TRUE, 'available'),
(2, 5, TRUE, 'available'),
(2, 6, TRUE, 'available'),
(2, 7, TRUE, 'available'),

-- COVID-19 program
(3, 9, TRUE, 'available'); -- COVID-19

-- Insert sample vaccination centers
INSERT INTO vaccination_centers (
    name, name_hi, name_te, center_type, address, district, state, 
    contact_phone, services_offered, is_active
) VALUES
(
    'Primary Health Centre - Block A', 'प्राथमिक स्वास्थ्य केंद्र - ब्लॉक ए', 'ప్రాథమిక ఆరోగ్య కేంద్రం - బ్లాక్ ఎ',
    'government', 'Block A, District Hospital Road', 'Sample District', 'Sample State',
    '+91-9876543210', ARRAY['routine_immunization', 'covid_vaccination', 'anc_services'], TRUE
),
(
    'Community Health Centre - Rural', 'सामुदायिक स्वास्थ्य केंद्र - ग्रामीण', 'కమ్యూనిటి హెల్త్ సెంటర్ - రూరల్',
    'government', 'Village Road, Rural Area', 'Sample District', 'Sample State',
    '+91-9876543211', ARRAY['routine_immunization', 'emergency_services'], TRUE
),
(
    'Private Clinic - City Center', 'निजी क्लिनिक - सिटी सेंटर', 'ప్రైవేట్ క్లినిక్ - సిటీ సెంటర్',
    'private', 'Main Market, City Center', 'Sample District', 'Sample State',
    '+91-9876543212', ARRAY['routine_immunization', 'travel_vaccines'], TRUE
);

-- Insert sample vaccination coverage data
INSERT INTO vaccination_coverage (
    vaccine_id, age_group, district, state, target_population, vaccinated_count, 
    coverage_percentage, reporting_period_start, reporting_period_end, data_source
) VALUES
(1, 'newborn', 'Sample District', 'Sample State', 1000, 950, 95.0, '2024-01-01', '2024-03-31', 'government'),
(4, 'infant', 'Sample District', 'Sample State', 1000, 920, 92.0, '2024-01-01', '2024-03-31', 'government'),
(6, 'infant', 'Sample District', 'Sample State', 1000, 880, 88.0, '2024-01-01', '2024-03-31', 'government'),
(7, 'child', 'Sample District', 'Sample State', 1000, 850, 85.0, '2024-01-01', '2024-03-31', 'government'),
(9, 'adult', 'Sample District', 'Sample State', 10000, 8500, 85.0, '2024-01-01', '2024-03-31', 'government');
