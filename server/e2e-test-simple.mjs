/**
 * Simplified End-to-End Testing Suite
 * Tests database integrity and query performance
 */

import mysql from 'mysql2/promise';

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

test('Test 2: Query Performance', async () => {
  const connection = await pool.getConnection();
  try {
    const startTime = Date.now();
    const [rows] = await connection.query(
      'SELECT COUNT(*) as count FROM transactions WHERE prefecture = "神奈川県" AND propertyType = "house"'
    );
    const endTime = Date.now();
    
    assertExists(rows[0], 'Query result missing');
    console.log(`  Query time: ${endTime - startTime}ms, Results: ${rows[0].count}`);
  } finally {
    connection.release();
  }
});

test('Test 3: Regional Data Distribution', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT prefecture, COUNT(*) as count FROM transactions GROUP BY prefecture ORDER BY count DESC LIMIT 5'
    );
    assertExists(rows, 'Regional distribution query failed');
    assert(rows.length > 0, 'No regional data found');
    console.log(`  Top 5 prefectures by transaction count:`);
    rows.forEach(row => console.log(`    ${row.prefecture}: ${row.count}件`));
  } finally {
    connection.release();
  }
});

test('Test 4: Property Type Distribution', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT propertyType, COUNT(*) as count FROM transactions GROUP BY propertyType'
    );
    assertExists(rows, 'Property type distribution query failed');
    assert(rows.length > 0, 'No property type data found');
    console.log(`  Property type distribution:`);
    rows.forEach(row => console.log(`    ${row.propertyType}: ${row.count}件`));
  } finally {
    connection.release();
  }
});

test('Test 5: Price Statistics', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT MIN(price) as minPrice, MAX(price) as maxPrice, AVG(price) as avgPrice, COUNT(*) as count FROM transactions'
    );
    assertExists(rows[0], 'Price statistics query failed');
    const stats = rows[0];
    console.log(`  Price statistics:`);
    console.log(`    Min: ¥${stats.minPrice.toLocaleString()}`);
    console.log(`    Max: ¥${stats.maxPrice.toLocaleString()}`);
    console.log(`    Avg: ¥${Math.round(stats.avgPrice).toLocaleString()}`);
    console.log(`    Count: ${stats.count}`);
  } finally {
    connection.release();
  }
});

test('Test 6: Building Age Analysis', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT YEAR(CURDATE()) - buildingYear as buildingAge, AVG(price) as avgPrice, COUNT(*) as count FROM transactions WHERE buildingYear IS NOT NULL GROUP BY buildingAge ORDER BY buildingAge DESC LIMIT 5'
    );
    assertExists(rows, 'Building age analysis query failed');
    console.log(`  Price by building age:`);
    rows.forEach(row => console.log(`    ${row.buildingAge}年: ¥${Math.round(row.avgPrice).toLocaleString()} (${row.count}件)`));
  } finally {
    connection.release();
  }
});

test('Test 7: Floor Area Analysis', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT CASE WHEN floorArea < 50 THEN "<50" WHEN floorArea < 100 THEN "50-100" WHEN floorArea < 150 THEN "100-150" ELSE ">150" END as areaRange, AVG(price) as avgPrice, COUNT(*) as count FROM transactions WHERE floorArea IS NOT NULL GROUP BY areaRange'
    );
    assertExists(rows, 'Floor area analysis query failed');
    console.log(`  Price by floor area:`);
    rows.forEach(row => console.log(`    ${row.areaRange}㎡: ¥${Math.round(row.avgPrice).toLocaleString()} (${row.count}件)`));
  } finally {
    connection.release();
  }
});

test('Test 8: City-Level Distribution', async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT city, COUNT(*) as count FROM transactions GROUP BY city ORDER BY count DESC LIMIT 10'
    );
    assertExists(rows, 'City distribution query failed');
    console.log(`  Top 10 cities by transaction count:`);
    rows.forEach(row => console.log(`    ${row.city}: ${row.count}件`));
  } finally {
    connection.release();
  }
});

test('Test 9: Data Integrity Check', async () => {
  const connection = await pool.getConnection();
  try {
    const [nullPrices] = await connection.query(
      'SELECT COUNT(*) as count FROM transactions WHERE price IS NULL'
    );
    assertEquals(nullPrices[0].count, 0, 'Found NULL prices in transactions');
    
    const [count] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    assert(count[0].count >= 100000, 'Insufficient transaction records');
    console.log(`  ✓ Total transactions: ${count[0].count}`);
    console.log(`  ✓ NULL prices: 0`);
  } finally {
    connection.release();
  }
});

test('Test 10: Concurrent Query Performance', async () => {
  const startTime = Date.now();
  
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      (async () => {
        const connection = await pool.getConnection();
        try {
          const [rows] = await connection.query(
            'SELECT COUNT(*) as count FROM transactions WHERE prefecture = "神奈川県" LIMIT 1'
          );
          return rows[0].count;
        } finally {
          connection.release();
        }
      })()
    );
  }
  
  await Promise.all(promises);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log(`  10 concurrent queries completed in ${duration}ms`);
  console.log(`  Average: ${(duration / 10).toFixed(0)}ms per query`);
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

runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
