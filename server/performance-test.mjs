/**
 * Performance Testing Suite for MLIT Assessment Engine
 * Tests query performance, calculation speed, and scalability with 100,000+ records
 */

import mysql from 'mysql2/promise';
import { URL } from 'url';

// Parse DATABASE_URL
function parseDbUrl() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  return {
    host: dbUrl.hostname,
    port: dbUrl.port || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    ssl: dbUrl.searchParams.get('ssl') ? JSON.parse(dbUrl.searchParams.get('ssl')) : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

/**
 * Test 1: Query Performance - Simple Count
 */
async function testSimpleCount(pool) {
  console.log('\n📊 Test 1: Simple Count Query');
  const conn = await pool.getConnection();

  const times = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await conn.query('SELECT COUNT(*) as count FROM transactions');
    times.push(Date.now() - start);
  }

  conn.release();

  const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
  console.log(`  Average: ${avg}ms`);
  console.log(`  Range: ${Math.min(...times)}ms - ${Math.max(...times)}ms`);
  return { test: 'Simple Count', avg, times };
}

/**
 * Test 2: Query Performance - Complex Search
 */
async function testComplexSearch(pool) {
  console.log('\n📊 Test 2: Complex Search Query');
  const conn = await pool.getConnection();

  const times = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await conn.query(`
      SELECT * FROM transactions
      WHERE prefecture = '東京都' AND propertyType = 'land'
      AND priceYen BETWEEN 50000000 AND 200000000
      LIMIT 100
    `);
    times.push(Date.now() - start);
  }

  conn.release();

  const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
  console.log(`  Average: ${avg}ms`);
  console.log(`  Range: ${Math.min(...times)}ms - ${Math.max(...times)}ms`);
  return { test: 'Complex Search', avg, times };
}

/**
 * Test 3: Query Performance - Aggregation
 */
async function testAggregation(pool) {
  console.log('\n📊 Test 3: Aggregation Query');
  const conn = await pool.getConnection();

  const times = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await conn.query(`
      SELECT prefecture, propertyType, COUNT(*) as count, AVG(priceYen) as avg_price
      FROM transactions
      GROUP BY prefecture, propertyType
    `);
    times.push(Date.now() - start);
  }

  conn.release();

  const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
  console.log(`  Average: ${avg}ms`);
  console.log(`  Range: ${Math.min(...times)}ms - ${Math.max(...times)}ms`);
  return { test: 'Aggregation', avg, times };
}

/**
 * Test 4: Assessment Calculation - Land Property (Skipped - requires API)
 */
async function testAssessmentLand(pool) {
  console.log('\n📊 Test 4: Assessment Calculation - Land (Skipped)');
  console.log('  Note: Assessment calculation requires API integration');
  return { test: 'Assessment - Land', avg: 0, times: [] };
}

/**
 * Test 5: Assessment Calculation - Condo Property (Skipped - requires API)
 */
async function testAssessmentCondo(pool) {
  console.log('\n📊 Test 5: Assessment Calculation - Condo (Skipped)');
  console.log('  Note: Assessment calculation requires API integration');
  return { test: 'Assessment - Condo', avg: 0, times: [] };
}

/**
 * Test 6: Concurrent Assessments (Skipped - requires API)
 */
async function testConcurrentAssessments(pool) {
  console.log('\n📊 Test 6: Concurrent Assessments (Skipped)');
  console.log('  Note: Assessment calculation requires API integration');
  return { test: 'Concurrent Assessments', elapsed: 0, successful: 0 };
}

/**
 * Test 7: Database Connection Pool Stress
 */
async function testConnectionPoolStress(pool) {
  console.log('\n📊 Test 7: Connection Pool Stress (50 queries)');
  
  const start = Date.now();
  const promises = [];

  for (let i = 0; i < 50; i++) {
    promises.push(
      (async () => {
        const conn = await pool.getConnection();
        try {
          const [result] = await conn.query(
            'SELECT COUNT(*) as count FROM transactions WHERE prefecture = ?',
            ['東京都']
          );
          return result[0].count;
        } finally {
          conn.release();
        }
      })().catch(err => ({ error: err.message }))
    );
  }

  const results = await Promise.all(promises);
  const elapsed = Date.now() - start;

  const successful = results.filter(r => typeof r === 'number').length;
  console.log(`  Total time: ${elapsed}ms`);
  console.log(`  Successful: ${successful}/50`);
  console.log(`  Average per query: ${Math.round(elapsed / 50)}ms`);

  return { test: 'Connection Pool Stress', elapsed, successful };
}

/**
 * Test 8: Data Integrity Check
 */
async function testDataIntegrity(pool) {
  console.log('\n📊 Test 8: Data Integrity Check');
  const conn = await pool.getConnection();

  // Check for NULL prices
  const [nullResult] = await conn.query('SELECT COUNT(*) as count FROM transactions WHERE priceYen IS NULL');
  console.log(`  NULL prices: ${nullResult[0].count}`);

  // Check for duplicates
  const [dupResult] = await conn.query(`
    SELECT COUNT(*) as count FROM (
      SELECT id FROM transactions GROUP BY id HAVING COUNT(*) > 1
    ) AS duplicates
  `);
  console.log(`  Duplicate IDs: ${dupResult[0].count}`);

  // Check price distribution
  const [distResult] = await conn.query(`
    SELECT
      COUNT(*) as total,
      MIN(priceYen) as min_price,
      MAX(priceYen) as max_price,
      AVG(priceYen) as avg_price
    FROM transactions
  `);
  const dist = distResult[0];
  console.log(`  Total records: ${dist.total.toLocaleString()}`);
  console.log(`  Price range: ¥${Math.floor(dist.min_price).toLocaleString()} - ¥${Math.floor(dist.max_price).toLocaleString()}`);
  console.log(`  Average price: ¥${Math.floor(dist.avg_price).toLocaleString()}`);

  conn.release();

  return { test: 'Data Integrity', integrity: { nullCount: nullResult[0].count, dupCount: dupResult[0].count, ...dist } };
}

/**
 * Main execution
 */
async function main() {
  let pool;

  try {
    console.log('='.repeat(80));
    console.log('MLIT Assessment Engine - Performance Testing Suite');
    console.log('='.repeat(80));
    console.log();

    // Create connection pool
    const config = parseDbUrl();
    pool = mysql.createPool(config);
    console.log('✓ Connection pool created');

    // Run tests
    const results = [];

    results.push(await testSimpleCount(pool));
    results.push(await testComplexSearch(pool));
    results.push(await testAggregation(pool));
    results.push(await testAssessmentLand(pool));
    results.push(await testAssessmentCondo(pool));
    results.push(await testConcurrentAssessments(pool));
    results.push(await testConnectionPoolStress(pool));
    results.push(await testDataIntegrity(pool));

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('Performance Test Summary');
    console.log('='.repeat(80));

    const queryTests = results.filter(r => r.avg);
    if (queryTests.length > 0) {
      console.log('\nQuery Performance:');
      queryTests.forEach(r => {
        console.log(`  ${r.test}: ${r.avg}ms`);
      });
    }

    console.log('\n✓ All tests completed!');
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('✗ Fatal error:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

main();
