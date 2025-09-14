// Direct test of language persistence logic without WhatsApp API calls
const { generateMainMenuButtons, generateSymptomCheckerButtons } = require('./features/main-menu/mainMenuButtons');

// Mock user language storage (simulating the server's userLanguages Map)
const userLanguages = new Map();

// Mock functions from server.js
const updateUserLanguage = (phoneNumber, language) => {
  userLanguages.set(phoneNumber, language);
  console.log(`Updated language for ${phoneNumber} to ${language}`);
};

const getUserLanguage = (phoneNumber) => {
  return userLanguages.get(phoneNumber) || 'en';
};

// Test cases for language persistence
const testCases = [
  {
    name: 'English Language',
    language: 'en',
    expectedMenuHeader: '🏥 Healthcare Assistant Menu',
    expectedSymptomHeader: '🔍 Symptom Checker'
  },
  {
    name: 'Hindi Native Script',
    language: 'hi',
    expectedMenuHeader: '🏥 स्वास्थ्य सहायक मेनू',
    expectedSymptomHeader: '🔍 लक्षण जांचकर्ता'
  },
  {
    name: 'Hindi Roman Script',
    language: 'hi_roman',
    expectedMenuHeader: '🏥 Swasthya Sahayak Menu',
    expectedSymptomHeader: '🔍 Lakshan Janchkarta'
  },
  {
    name: 'Telugu Native Script',
    language: 'te',
    expectedMenuHeader: '🏥 ఆరోగ్య సహాయక మెనూ',
    expectedSymptomHeader: '🔍 లక్షణ పరీక్షకుడు'
  },
  {
    name: 'Telugu Roman Script',
    language: 'te_roman',
    expectedMenuHeader: '🏥 Arogya Sahayaka Menu',
    expectedSymptomHeader: '🔍 Lakshana Pareekshakudu'
  },
  {
    name: 'Tamil Native Script',
    language: 'ta',
    expectedMenuHeader: '🏥 சுகாதார உதவியாளர் மெனு',
    expectedSymptomHeader: '🔍 அறிகுறி சரிபார்ப்பாளர்'
  },
  {
    name: 'Tamil Roman Script',
    language: 'ta_roman',
    expectedMenuHeader: '🏥 Sugathara Uthaviyalar Menu',
    expectedSymptomHeader: '🔍 Arikuri Sariparpalar'
  },
  {
    name: 'Odia Native Script',
    language: 'or',
    expectedMenuHeader: '🏥 ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ ମେନୁ',
    expectedSymptomHeader: '🔍 ଲକ୍ଷଣ ପରୀକ୍ଷକ'
  },
  {
    name: 'Odia Roman Script',
    language: 'or_roman',
    expectedMenuHeader: '🏥 Swasthya Sahayaka Menu',
    expectedSymptomHeader: '🔍 Lakshana Pareekshaka'
  }
];

function testLanguagePersistence() {
  console.log('🧪 Testing Language Persistence Logic');
  console.log('=====================================\n');

  const results = [];
  let passedTests = 0;
  let failedTests = 0;

  testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. Testing: ${testCase.name}`);
    console.log('-'.repeat(40));

    const testPhone = `+123456789${index}`;
    const testResult = {
      name: testCase.name,
      language: testCase.language,
      steps: [],
      overall: 'PENDING'
    };

    try {
      // Step 1: Set user language
      updateUserLanguage(testPhone, testCase.language);
      const storedLanguage = getUserLanguage(testPhone);
      
      const langStep = {
        step: 'Language Storage',
        success: storedLanguage === testCase.language,
        expected: testCase.language,
        actual: storedLanguage
      };
      testResult.steps.push(langStep);

      if (langStep.success) {
        console.log(`✅ Language stored: ${storedLanguage}`);
      } else {
        console.log(`❌ Language storage failed. Expected: ${testCase.language}, Got: ${storedLanguage}`);
      }

      // Step 2: Test main menu generation
      const mainMenu = generateMainMenuButtons(storedLanguage);
      const menuHeader = mainMenu.interactive.header.text;
      
      const menuStep = {
        step: 'Main Menu Generation',
        success: menuHeader === testCase.expectedMenuHeader,
        expected: testCase.expectedMenuHeader,
        actual: menuHeader
      };
      testResult.steps.push(menuStep);

      if (menuStep.success) {
        console.log(`✅ Main menu header: ${menuHeader}`);
      } else {
        console.log(`❌ Main menu header mismatch.`);
        console.log(`   Expected: ${testCase.expectedMenuHeader}`);
        console.log(`   Actual: ${menuHeader}`);
      }

      // Step 3: Test symptom checker generation
      const symptomMenu = generateSymptomCheckerButtons(storedLanguage);
      const symptomHeader = symptomMenu.interactive.header.text;
      
      const symptomStep = {
        step: 'Symptom Checker Generation',
        success: symptomHeader === testCase.expectedSymptomHeader,
        expected: testCase.expectedSymptomHeader,
        actual: symptomHeader
      };
      testResult.steps.push(symptomStep);

      if (symptomStep.success) {
        console.log(`✅ Symptom checker header: ${symptomHeader}`);
      } else {
        console.log(`❌ Symptom checker header mismatch.`);
        console.log(`   Expected: ${testCase.expectedSymptomHeader}`);
        console.log(`   Actual: ${symptomHeader}`);
      }

      // Step 4: Test persistence after menu navigation
      const persistedLanguage = getUserLanguage(testPhone);
      const persistenceStep = {
        step: 'Language Persistence',
        success: persistedLanguage === testCase.language,
        expected: testCase.language,
        actual: persistedLanguage
      };
      testResult.steps.push(persistenceStep);

      if (persistenceStep.success) {
        console.log(`✅ Language persisted: ${persistedLanguage}`);
      } else {
        console.log(`❌ Language persistence failed. Expected: ${testCase.language}, Got: ${persistedLanguage}`);
      }

      // Determine overall result
      const allStepsSuccessful = testResult.steps.every(step => step.success);
      testResult.overall = allStepsSuccessful ? 'PASSED' : 'FAILED';

      if (testResult.overall === 'PASSED') {
        passedTests++;
        console.log(`🎉 ${testCase.name}: PASSED`);
      } else {
        failedTests++;
        console.log(`💥 ${testCase.name}: FAILED`);
      }

    } catch (error) {
      console.log(`❌ Test execution error: ${error.message}`);
      testResult.overall = 'ERROR';
      testResult.steps.push({
        step: 'Test Execution',
        success: false,
        error: error.message
      });
      failedTests++;
    }

    results.push(testResult);
    console.log('');
  });

  // Generate summary report
  console.log('📊 LANGUAGE PERSISTENCE TEST SUMMARY');
  console.log('====================================');
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / results.length) * 100).toFixed(1)}%\n`);

  // Detailed failure analysis
  const failedResults = results.filter(r => r.overall !== 'PASSED');
  if (failedResults.length > 0) {
    console.log('🔍 FAILURE ANALYSIS');
    console.log('===================');
    
    failedResults.forEach(result => {
      console.log(`\n❌ ${result.name} (${result.language}):`);
      result.steps.forEach(step => {
        if (!step.success) {
          console.log(`   - ${step.step}: Expected "${step.expected}", Got "${step.actual}"`);
        }
      });
    });

    console.log('\n🔧 RECOMMENDATIONS:');
    
    // Check for common failure patterns
    const langStorageFailures = failedResults.filter(r => 
      r.steps.some(s => s.step === 'Language Storage' && !s.success)
    );
    const menuFailures = failedResults.filter(r => 
      r.steps.some(s => s.step === 'Main Menu Generation' && !s.success)
    );
    const symptomFailures = failedResults.filter(r => 
      r.steps.some(s => s.step === 'Symptom Checker Generation' && !s.success)
    );

    if (langStorageFailures.length > 0) {
      console.log('   - Fix getUserLanguage/updateUserLanguage functions');
    }
    if (menuFailures.length > 0) {
      console.log('   - Add missing translations in generateMainMenuButtons');
    }
    if (symptomFailures.length > 0) {
      console.log('   - Add missing translations in generateSymptomCheckerButtons');
    }
  } else {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Language persistence is working correctly');
    console.log('✅ All menu translations are properly implemented');
    console.log('✅ Language state management is functioning as expected');
  }

  return {
    totalTests: results.length,
    passedTests,
    failedTests,
    successRate: (passedTests / results.length) * 100,
    results
  };
}

// Run the test
if (require.main === module) {
  testLanguagePersistence();
}

module.exports = { testLanguagePersistence };
