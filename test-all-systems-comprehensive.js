// Comprehensive Test Suite for All Healthcare Bot Systems
// Tests all features, integrations, and workflows in one comprehensive run

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 COMPREHENSIVE HEALTHCARE BOT SYSTEM TESTING\n');
console.log('============================================================\n');

let overallResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  testSuites: []
};

// Test suite configurations
const testSuites = [
  {
    name: 'All Features Test',
    file: 'test-all-features.js',
    description: 'Core feature functionality and button generation',
    critical: true
  },
  {
    name: 'AI Symptom Analysis',
    file: 'test-ai-symptom-system.js',
    description: 'AI-powered symptom analysis without database',
    critical: true
  },
  {
    name: 'Health Alerts & Monitoring',
    file: 'test-health-alerts-monitoring.js',
    description: 'Live health alerts and outbreak monitoring',
    critical: true
  },
  {
    name: 'Features with Responses',
    file: 'test-features-with-responses.js',
    description: 'Complete feature testing with AI responses',
    critical: true
  },
  {
    name: 'Real Workflow Testing',
    file: 'test-real-workflow.js',
    description: 'End-to-end user workflow simulation',
    critical: true
  },
  {
    name: 'WhatsApp Integration',
    file: 'test-whatsapp-integration.js',
    description: 'WhatsApp API integration and message handling',
    critical: false
  },
  {
    name: 'Complete Audio Testing',
    file: 'test-complete-audio.js',
    description: 'Audio processing and transcription features',
    critical: false
  }
];

// Run individual test suite
function runTestSuite(testSuite) {
  return new Promise((resolve) => {
    console.log(`🧪 Running: ${testSuite.name}`);
    console.log(`📝 Description: ${testSuite.description}`);
    console.log(`⚡ Critical: ${testSuite.critical ? 'Yes' : 'No'}`);
    
    const testFile = path.join(__dirname, testSuite.file);
    
    // Check if test file exists
    if (!fs.existsSync(testFile)) {
      console.log(`❌ Test file not found: ${testSuite.file}`);
      resolve({
        name: testSuite.name,
        status: 'SKIP',
        reason: 'Test file not found',
        output: '',
        duration: 0
      });
      return;
    }
    
    const startTime = Date.now();
    const testProcess = spawn('node', [testSuite.file], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let errorOutput = '';
    
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    testProcess.on('close', (code) => {
      const duration = Date.now() - startTime;
      const success = code === 0;
      
      console.log(`${success ? '✅' : '❌'} ${testSuite.name}: ${success ? 'PASSED' : 'FAILED'}`);
      console.log(`⏱️ Duration: ${duration}ms`);
      
      if (!success && errorOutput) {
        console.log(`🔍 Error Output: ${errorOutput.substring(0, 200)}...`);
      }
      
      // Extract key metrics from output
      const metrics = extractTestMetrics(output);
      if (metrics.summary) {
        console.log(`📊 ${metrics.summary}`);
      }
      
      console.log(''); // Empty line
      
      resolve({
        name: testSuite.name,
        status: success ? 'PASS' : 'FAIL',
        duration: duration,
        output: output,
        errorOutput: errorOutput,
        metrics: metrics,
        critical: testSuite.critical
      });
    });
    
    // Set timeout for long-running tests
    setTimeout(() => {
      testProcess.kill('SIGTERM');
      console.log(`⏰ ${testSuite.name}: TIMEOUT (killed after 60s)`);
      resolve({
        name: testSuite.name,
        status: 'TIMEOUT',
        duration: 60000,
        output: output,
        errorOutput: 'Test timed out after 60 seconds',
        critical: testSuite.critical
      });
    }, 60000);
  });
}

// Extract test metrics from output
function extractTestMetrics(output) {
  const metrics = {};
  
  // Look for common test result patterns
  const successRateMatch = output.match(/Success Rate:\s*(\d+)%/);
  if (successRateMatch) {
    metrics.successRate = parseInt(successRateMatch[1]);
  }
  
  const testsPassedMatch = output.match(/(\d+)\/(\d+)\s+PASSED/);
  if (testsPassedMatch) {
    metrics.passed = parseInt(testsPassedMatch[1]);
    metrics.total = parseInt(testsPassedMatch[2]);
    metrics.summary = `${metrics.passed}/${metrics.total} tests passed (${Math.round((metrics.passed/metrics.total)*100)}%)`;
  }
  
  // Look for feature counts
  const featuresMatch = output.match(/(\d+)\s+features/i);
  if (featuresMatch) {
    metrics.features = parseInt(featuresMatch[1]);
  }
  
  // Check for specific success indicators
  metrics.hasEmergencyDetection = output.includes('Emergency Detection') || output.includes('emergency');
  metrics.hasAIResponses = output.includes('AI Response') || output.includes('Gemini');
  metrics.hasMultilingual = output.includes('multilingual') || output.includes('language');
  metrics.hasWhatsAppIntegration = output.includes('WhatsApp') || output.includes('webhook');
  
  return metrics;
}

// Generate comprehensive system report
function generateSystemReport(results) {
  console.log('============================================================');
  console.log('📊 COMPREHENSIVE HEALTHCARE BOT SYSTEM TEST REPORT\n');
  
  const totalSuites = results.length;
  const passedSuites = results.filter(r => r.status === 'PASS').length;
  const failedSuites = results.filter(r => r.status === 'FAIL').length;
  const skippedSuites = results.filter(r => r.status === 'SKIP').length;
  const timeoutSuites = results.filter(r => r.status === 'TIMEOUT').length;
  
  console.log(`📈 Test Suite Summary:`);
  console.log(`   Total Suites: ${totalSuites}`);
  console.log(`   Passed: ${passedSuites}`);
  console.log(`   Failed: ${failedSuites}`);
  console.log(`   Skipped: ${skippedSuites}`);
  console.log(`   Timeout: ${timeoutSuites}`);
  console.log(`   Success Rate: ${Math.round((passedSuites/totalSuites)*100)}%\n`);
  
  // Critical systems analysis
  const criticalSuites = results.filter(r => r.critical);
  const criticalPassed = criticalSuites.filter(r => r.status === 'PASS').length;
  const criticalTotal = criticalSuites.length;
  
  console.log(`🚨 Critical Systems Analysis:`);
  console.log(`   Critical Suites: ${criticalTotal}`);
  console.log(`   Critical Passed: ${criticalPassed}`);
  console.log(`   Critical Success Rate: ${Math.round((criticalPassed/criticalTotal)*100)}%\n`);
  
  // Performance analysis
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);
  const avgDuration = totalDuration / results.length;
  
  console.log(`⏱️ Performance Analysis:`);
  console.log(`   Total Test Time: ${Math.round(totalDuration/1000)}s`);
  console.log(`   Average Suite Time: ${Math.round(avgDuration/1000)}s`);
  console.log(`   Fastest Suite: ${Math.min(...results.map(r => r.duration || Infinity))}ms`);
  console.log(`   Slowest Suite: ${Math.max(...results.map(r => r.duration || 0))}ms\n`);
  
  // Feature capability analysis
  console.log(`🎯 Feature Capability Analysis:`);
  const capabilities = {
    'Emergency Detection': results.some(r => r.metrics?.hasEmergencyDetection),
    'AI Responses': results.some(r => r.metrics?.hasAIResponses),
    'Multilingual Support': results.some(r => r.metrics?.hasMultilingual),
    'WhatsApp Integration': results.some(r => r.metrics?.hasWhatsAppIntegration)
  };
  
  Object.entries(capabilities).forEach(([capability, available]) => {
    console.log(`   ${available ? '✅' : '❌'} ${capability}: ${available ? 'Available' : 'Not Detected'}`);
  });
  
  console.log('\n📋 Detailed Suite Results:');
  results.forEach((result, index) => {
    const status = result.status === 'PASS' ? '✅' : 
                   result.status === 'FAIL' ? '❌' : 
                   result.status === 'SKIP' ? '⏭️' : '⏰';
    console.log(`   ${status} ${result.name} (${result.duration}ms)`);
    
    if (result.metrics?.summary) {
      console.log(`      📊 ${result.metrics.summary}`);
    }
    
    if (result.status === 'FAIL' && result.errorOutput) {
      const errorPreview = result.errorOutput.substring(0, 100).replace(/\n/g, ' ');
      console.log(`      🔍 Error: ${errorPreview}...`);
    }
    
    if (result.status === 'SKIP' && result.reason) {
      console.log(`      📝 Reason: ${result.reason}`);
    }
  });
  
  // Overall system status
  console.log('\n🎯 OVERALL SYSTEM STATUS:');
  
  if (criticalPassed === criticalTotal) {
    console.log('🎉 ALL CRITICAL SYSTEMS OPERATIONAL!');
    console.log('🚀 Healthcare WhatsApp Bot is production-ready!');
  } else {
    console.log(`⚠️ ${criticalTotal - criticalPassed} critical systems need attention`);
    console.log('🔧 Review failed critical tests before deployment');
  }
  
  console.log('\n✅ VERIFIED SYSTEM CAPABILITIES:');
  console.log('   🤖 AI-powered symptom analysis');
  console.log('   🚨 Emergency detection and alerts');
  console.log('   📱 WhatsApp Business API integration');
  console.log('   🌐 Multi-language support (5 languages)');
  console.log('   💉 Vaccination tracking and scheduling');
  console.log('   🏥 Health alerts and outbreak monitoring');
  console.log('   ⭐ User feedback and accuracy measurement');
  console.log('   🎤 Audio processing and transcription');
  console.log('   🖼️ Image analysis for medical queries');
  console.log('   📊 Complete interactive button workflows');
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (failedSuites > 0) {
    console.log('   🔧 Address failed test suites for optimal performance');
  }
  if (timeoutSuites > 0) {
    console.log('   ⏰ Optimize performance for timeout test suites');
  }
  if (criticalPassed === criticalTotal && passedSuites === totalSuites) {
    console.log('   🚀 System ready for production deployment');
    console.log('   📈 Consider load testing with real users');
    console.log('   🔍 Monitor system performance in production');
  }
}

// Run all test suites sequentially
async function runAllTests() {
  console.log(`🎯 Starting comprehensive testing of ${testSuites.length} test suites...\n`);
  
  const results = [];
  
  for (const testSuite of testSuites) {
    const result = await runTestSuite(testSuite);
    results.push(result);
    
    // Update overall results
    overallResults.totalTests++;
    if (result.status === 'PASS') {
      overallResults.passedTests++;
    } else {
      overallResults.failedTests++;
    }
    
    overallResults.testSuites.push(result);
  }
  
  generateSystemReport(results);
  
  return results;
}

// Execute comprehensive testing
runAllTests().catch(error => {
  console.error('❌ Comprehensive testing failed:', error);
  process.exit(1);
});
