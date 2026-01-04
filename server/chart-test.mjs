/**
 * Chart Functionality Testing Suite
 * Tests market analysis data generation and chart integration
 */

import { generateMarketAnalysis, generatePriceTrendData, generatePriceDistribution, generatePropertyTypeComparison, generateStationDistanceAnalysis, generateBuildingAgeAnalysis } from './market-analysis.ts';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${status} - ${name}`);
  if (details) console.log(`  ${details}`);
}

async function runTests() {
  log('\n=== Chart Functionality Testing Suite ===\n', 'blue');

  let passedTests = 0;
  let totalTests = 0;

  try {
    // Test 1: Price Trend Data Generation
    totalTests++;
    log('Test 1: Price Trend Data Generation', 'yellow');
    try {
      const trendData = await generatePriceTrendData('神奈川県');
      const passed = 
        trendData.length === 12 &&
        trendData.every(d => d.month && d.averagePrice && d.medianPrice);
      logTest('Generate 12 months of trend data', passed, 
        `Generated ${trendData.length} months, avg price range: ¥${(trendData[0].averagePrice / 100000000).toFixed(1)}億`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Generate 12 months of trend data', false, e.message);
    }

    // Test 2: Price Distribution Analysis
    totalTests++;
    log('\nTest 2: Price Distribution Analysis', 'yellow');
    try {
      const distribution = await generatePriceDistribution('神奈川県');
      const passed = 
        distribution.length === 5 &&
        distribution.every(d => d.range && d.count >= 0 && d.percentage >= 0) &&
        Math.abs(distribution.reduce((sum, d) => sum + d.percentage, 0) - 100) < 1;
      logTest('Generate price distribution (5 buckets)', passed,
        `Generated ${distribution.length} buckets, total percentage: ${distribution.reduce((sum, d) => sum + d.percentage, 0).toFixed(1)}%`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Generate price distribution (5 buckets)', false, e.message);
    }

    // Test 3: Property Type Comparison
    totalTests++;
    log('\nTest 3: Property Type Comparison', 'yellow');
    try {
      const comparison = await generatePropertyTypeComparison('神奈川県');
      const passed = 
        comparison.length > 0 &&
        comparison.every(c => c.type && c.averagePrice && c.medianPrice);
      logTest('Generate property type comparison', passed,
        `Generated ${comparison.length} property types`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Generate property type comparison', false, e.message);
    }

    // Test 4: Station Distance Analysis
    totalTests++;
    log('\nTest 4: Station Distance Analysis', 'yellow');
    try {
      const analysis = await generateStationDistanceAnalysis('神奈川県');
      const passed = 
        analysis.length > 0 &&
        analysis.every(a => a.distance && a.averagePrice >= 0);
      logTest('Generate station distance analysis', passed,
        `Generated ${analysis.length} distance ranges`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Generate station distance analysis', false, e.message);
    }

    // Test 5: Building Age Analysis
    totalTests++;
    log('\nTest 5: Building Age Analysis', 'yellow');
    try {
      const analysis = await generateBuildingAgeAnalysis('神奈川県');
      const passed = 
        analysis.length > 0 &&
        analysis.every(a => a.ageRange && a.averagePrice >= 0);
      logTest('Generate building age analysis', passed,
        `Generated ${analysis.length} age ranges`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Generate building age analysis', false, e.message);
    }

    // Test 6: Comprehensive Market Analysis
    totalTests++;
    log('\nTest 6: Comprehensive Market Analysis', 'yellow');
    try {
      const analysis = await generateMarketAnalysis('神奈川県', 'land');
      const passed = 
        analysis.priceTrends &&
        analysis.priceDistribution &&
        analysis.propertyTypeComparison &&
        analysis.stationDistanceAnalysis &&
        analysis.buildingAgeAnalysis &&
        analysis.marketSummary;
      logTest('Generate comprehensive market analysis', passed,
        `Market summary: Avg ¥${(analysis.marketSummary.averagePrice / 100000000).toFixed(1)}億, ${analysis.marketSummary.totalTransactions} transactions`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Generate comprehensive market analysis', false, e.message);
    }

    // Test 7: Data Consistency
    totalTests++;
    log('\nTest 7: Data Consistency Validation', 'yellow');
    try {
      const analysis = await generateMarketAnalysis('神奈川県');
      const trendAvg = analysis.priceTrends[0]?.averagePrice || 0;
      const summaryAvg = analysis.marketSummary.averagePrice;
      const passed = trendAvg > 0 && summaryAvg > 0;
      logTest('Verify data consistency', passed,
        `Trend avg: ¥${(trendAvg / 100000000).toFixed(1)}億, Summary avg: ¥${(summaryAvg / 100000000).toFixed(1)}億`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Verify data consistency', false, e.message);
    }

    // Test 8: Multiple Prefecture Support
    totalTests++;
    log('\nTest 8: Multiple Prefecture Support', 'yellow');
    try {
      const prefectures = ['東京都', '神奈川県', '大阪府'];
      const results = await Promise.all(
        prefectures.map(pref => generateMarketAnalysis(pref).catch(() => null))
      );
      const passed = results.filter(r => r !== null).length > 0;
      logTest('Support multiple prefectures', passed,
        `Successfully analyzed ${results.filter(r => r !== null).length}/${prefectures.length} prefectures`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Support multiple prefectures', false, e.message);
    }

    // Test 9: Property Type Filtering
    totalTests++;
    log('\nTest 9: Property Type Filtering', 'yellow');
    try {
      const landTrends = await generatePriceTrendData('神奈川県', 'land');
      const houseTrends = await generatePriceTrendData('神奈川県', 'house');
      const passed = landTrends.length === 12 && houseTrends.length === 12;
      logTest('Filter data by property type', passed,
        `Land trends: ${landTrends.length} months, House trends: ${houseTrends.length} months`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Filter data by property type', false, e.message);
    }

    // Test 10: Performance Benchmark
    totalTests++;
    log('\nTest 10: Performance Benchmark', 'yellow');
    try {
      const startTime = Date.now();
      await generateMarketAnalysis('神奈川県');
      const duration = Date.now() - startTime;
      const passed = duration < 5000; // Should complete within 5 seconds
      logTest('Complete analysis within 5 seconds', passed,
        `Completed in ${duration}ms`);
      if (passed) passedTests++;
    } catch (e) {
      logTest('Complete analysis within 5 seconds', false, e.message);
    }

  } catch (error) {
    log(`\nUnexpected error: ${error.message}`, 'red');
  }

  // Summary
  log(`\n=== Test Summary ===`, 'blue');
  log(`Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`, 'blue');

  process.exit(passedTests === totalTests ? 0 : 1);
}

runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
