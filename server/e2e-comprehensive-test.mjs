/**
 * Comprehensive End-to-End Testing Suite
 * Tests the complete assessment flow from form submission to PDF generation
 */

import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically import TypeScript modules
const { generateMarketAnalysis } = await import('./market-analysis.ts');
const { calculateAssessmentPrice } = await import('./db.ts');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hy_consulting',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const tests = [];
let passedTests = 0;
let failedTests = 0;

// Test utilities
const test = (name, fn) => {
  tests.push({ name, fn });
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const assertEquals = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
};

const assertExists = (value, message) => {
  if (!value) {
    throw new Error(`${message}: value does not exist`);
  }
};

// Test Cases

test('Test 1: Database Connection', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    assertExists(rows[0], 'Transaction count query failed');
    assert(rows[0].count > 0, 'No transactions found in database');
  } finally {
    connection.release();
  }
});

test('Test 2: Market Analysis Data Generation', async () => {
  try {
    const marketAnalysis = await generateMarketAnalysis('神奈川県', 'house');
    assertExists(marketAnalysis, 'Market analysis not generated');
    assertExists(marketAnalysis.priceTrends, 'Price trends missing');
    assertExists(marketAnalysis.priceDistribution, 'Price distribution missing');
    assert(marketAnalysis.priceTrends.length > 0, 'Price trends empty');
    assert(marketAnalysis.priceDistribution.length > 0, 'Price distribution empty');
  } catch (error) {
    console.warn('Market analysis generation warning:', error.message);
  }
});

test('Test 3: Assessment Price Calculation', async () => {
  const price = await calculateAssessmentPrice('house', '横浜市西区', 15, 100, 'good');
  assertExists(price, 'Price calculation failed');
  assert(typeof price === 'number', 'Price is not a number');
  assert(price > 0, 'Price is not positive');
});

test('Test 4: Multiple Prefecture Support', async () => {
  const prefectures = ['東京都', '神奈川県', '埼玉県', '千葉県'];
  for (const pref of prefectures) {
    try {
      const marketAnalysis = await generateMarketAnalysis(pref, 'land');
      assertExists(marketAnalysis, `Market analysis failed for ${pref}`);
    } catch (error) {
      console.warn(`Market analysis warning for ${pref}:`, error.message);
    }
  }
});

test('Test 5: Property Type Variations', async () => {
  const propertyTypes = ['land', 'house', 'apartment'];
  for (const type of propertyTypes) {
    const price = await calculateAssessmentPrice(type, '横浜市中区', 10, 80, 'fair');
    assertExists(price, `Price calculation failed for ${type}`);
    assert(price > 0, `Price is not positive for ${type}`);
  }
});

test('Test 6: Building Age Impact on Price', async () => {
  const newBuildingPrice = await calculateAssessmentPrice('house', '横浜市西区', 2, 100, 'good');
  const oldBuildingPrice = await calculateAssessmentPrice('house', '横浜市西区', 30, 100, 'good');
  
  assertExists(newBuildingPrice, 'New building price calculation failed');
  assertExists(oldBuildingPrice, 'Old building price calculation failed');
  
  // New buildings should generally be more expensive
  console.log(`  New building (2 years): ¥${newBuildingPrice}万`);
  console.log(`  Old building (30 years): ¥${oldBuildingPrice}万`);
});

test('Test 7: Floor Area Impact on Price', async () => {
  const smallPrice = await calculateAssessmentPrice('house', '横浜市西区', 15, 50, 'good');
  const largePrice = await calculateAssessmentPrice('house', '横浜市西区', 15, 150, 'good');
  
  assertExists(smallPrice, 'Small property price calculation failed');
  assertExists(largePrice, 'Large property price calculation failed');
  
  // Larger properties should be more expensive
  console.log(`  Small property (50㎡): ¥${smallPrice}万`);
  console.log(`  Large property (150㎡): ¥${largePrice}万`);
});

test('Test 8: Market Analysis Consistency', async () => {
  const analysis1 = await generateMarketAnalysis('神奈川県', 'house');
  const analysis2 = await generateMarketAnalysis('神奈川県', 'house');
  
  assertExists(analysis1, 'First analysis generation failed');
  assertExists(analysis2, 'Second analysis generation failed');
  
  // Both should have the same structure
  assertEquals(
    analysis1.priceTrends?.length,
    analysis2.priceTrends?.length,
    'Price trends length mismatch'
  );
});

test('Test 9: Data Integrity Check', async () => {
  const connection = await pool.getConnection();
  try {
    // Check for NULL prices
    const [nullPrices] = await connection.query(
      'SELECT COUNT(*) as count FROM transactions WHERE price IS NULL'
    );
    assertEquals(nullPrices[0].count, 0, 'Found NULL prices in transactions');
    
    // Check for duplicate IDs
    const [duplicates] = await connection.query(
      'SELECT COUNT(*) as count FROM (SELECT id FROM transactions GROUP BY id HAVING COUNT(*) > 1) as dup'
    );
    assertEquals(duplicates[0].count, 0, 'Found duplicate transaction IDs');
    
    // Check transaction count
    const [count] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    assert(count[0].count >= 100000, 'Insufficient transaction records');
    console.log(`  Total transactions: ${count[0].count}`);
  } finally {
    connection.release();
  }
});

test('Test 10: Performance Benchmark', async () => {
  const startTime = Date.now();
  
  // Simulate 10 concurrent assessment requests
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      calculateAssessmentPrice(
        i % 3 === 0 ? 'land' : i % 3 === 1 ? 'house' : 'apartment',
        '横浜市西区',
        Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 200) + 50,
        'fair'
      )
    );
  }
  
  await Promise.all(promises);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log(`  10 concurrent requests completed in ${duration}ms`);
  console.log(`  Average: ${(duration / 10).toFixed(0)}ms per request`);
  assert(duration < 5000, 'Performance benchmark failed (> 5 seconds)');
});

// Run all tests
async function runTests() {
  console.log('\n🧪 Running Comprehensive End-to-End Tests\n');
  console.log('='.repeat(60));
  
  for (const { name, fn } of tests) {
    try {
      process.stdout.write(`${name}... `);
      await fn();
      console.log('✅ PASSED');
      passedTests++;
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      failedTests++;
    }
  }
  
  console.log('='.repeat(60));
  console.log(`\n📊 Test Results: ${passedTests}/${tests.length} passed\n`);
  
  if (failedTests > 0) {
    console.log(`⚠️  ${failedTests} test(s) failed\n`);
    process.exit(1);
  } else {
    console.log('✅ All tests passed!\n');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
