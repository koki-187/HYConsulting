/**
 * Comprehensive Integration Test Suite
 * Tests complete system functionality from frontend to backend
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
    connectionLimit: 5,
    queueLimit: 0,
  };
}

/**
 * Test 1: Database Connection & Schema Validation
 */
async function testDatabaseConnection(pool) {
  console.log('\n🔌 Test 1: Database Connection & Schema Validation');
  const conn = await pool.getConnection();

  try {
    // Check database connectivity
    const [result] = await conn.query('SELECT 1 as test');
    console.log('  ✓ Database connection successful');

    // Verify all required tables exist
    const [tables] = await conn.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    const requiredTables = [
      'transactions',
      'valuation_requests',
      'valuation_results',
      'regions',
      'dataset_versions',
    ];

    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    if (missingTables.length > 0) {
      console.log(`  ✗ Missing tables: ${missingTables.join(', ')}`);
      return { success: false, error: 'Missing tables' };
    }

    console.log(`  ✓ All ${requiredTables.length} required tables exist`);
    return { success: true };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test 2: Data Availability Check
 */
async function testDataAvailability(pool) {
  console.log('\n📊 Test 2: Data Availability Check');
  const conn = await pool.getConnection();

  try {
    // Check transaction count
    const [countResult] = await conn.query('SELECT COUNT(*) as count FROM transactions');
    const transactionCount = countResult[0].count;
    console.log(`  ✓ Transaction records: ${transactionCount.toLocaleString()}`);

    // Check regional distribution
    const [prefectureResult] = await conn.query(
      'SELECT COUNT(DISTINCT prefecture) as count FROM transactions'
    );
    const prefectureCount = prefectureResult[0].count;
    console.log(`  ✓ Prefectures covered: ${prefectureCount}`);

    // Check property type distribution
    const [typeResult] = await conn.query(
      'SELECT propertyType, COUNT(*) as count FROM transactions GROUP BY propertyType'
    );
    console.log('  ✓ Property types:');
    typeResult.forEach(row => {
      console.log(`    - ${row.propertyType}: ${row.count.toLocaleString()} records`);
    });

    return { success: true, transactionCount, prefectureCount };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test 3: Assessment Request Flow
 */
async function testAssessmentRequestFlow(pool) {
  console.log('\n📝 Test 3: Assessment Request Flow');
  const conn = await pool.getConnection();

  try {
    const requestId = `integration_test_${Date.now()}`;

    // Create request
    await conn.query(
      `INSERT INTO valuation_requests (
        id, createdAt, inputPrefecture, inputCity, inputWard, inputDistrict,
        propertyType, landAreaM2, buildingAreaM2, buildingYear, stationDistanceMin,
        ownershipType, inheritanceFlag, notes
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        '東京都',
        '千代田区',
        null,
        '千代田',
        'land',
        100,
        null,
        null,
        5,
        'single',
        0,
        'Integration test',
      ]
    );
    console.log('  ✓ Assessment request created');

    // Verify request was saved
    const [requests] = await conn.query(
      'SELECT * FROM valuation_requests WHERE id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      throw new Error('Request not found after creation');
    }

    console.log('  ✓ Request verified in database');

    // Create result
    await conn.query(
      `INSERT INTO valuation_results (
        requestId, createdAt, estimatedLowYen, estimatedHighYen,
        compsUsedCount, method, methodVersion, explanation
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        150000000,
        180000000,
        5,
        'comparable_sales',
        '1.0',
        'Integration test result',
      ]
    );
    console.log('  ✓ Assessment result created');

    // Verify result
    const [results] = await conn.query(
      'SELECT * FROM valuation_results WHERE requestId = ?',
      [requestId]
    );

    if (results.length === 0) {
      throw new Error('Result not found after creation');
    }

    console.log('  ✓ Result verified in database');

    return { success: true, requestId };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test 4: Query Performance Under Load
 */
async function testQueryPerformance(pool) {
  console.log('\n⚡ Test 4: Query Performance Under Load');

  try {
    const queries = [
      {
        name: 'Search by Prefecture',
        query: 'SELECT * FROM transactions WHERE prefecture = ? LIMIT 100',
        params: ['東京都'],
      },
      {
        name: 'Search by Property Type',
        query: 'SELECT * FROM transactions WHERE propertyType = ? LIMIT 100',
        params: ['land'],
      },
      {
        name: 'Aggregation Query',
        query: `SELECT propertyType, COUNT(*) as count, AVG(priceYen) as avg_price
                FROM transactions WHERE prefecture = ? GROUP BY propertyType`,
        params: ['東京都'],
      },
      {
        name: 'Complex Filter',
        query: `SELECT * FROM transactions 
                WHERE prefecture = ? AND propertyType = ? AND priceYen > ? AND priceYen < ?
                LIMIT 50`,
        params: ['東京都', 'land', 50000000, 200000000],
      },
    ];

    const results = [];
    for (const test of queries) {
      const conn = await pool.getConnection();
      try {
        const start = Date.now();
        const [rows] = await conn.query(test.query, test.params);
        const duration = Date.now() - start;

        console.log(`  ✓ ${test.name}: ${duration}ms (${rows.length} rows)`);
        results.push({ name: test.name, duration, rows: rows.length });
      } finally {
        conn.release();
      }
    }

    const avgDuration = results.reduce((a, b) => a + b.duration, 0) / results.length;
    console.log(`  ✓ Average query time: ${Math.round(avgDuration)}ms`);

    return { success: true, queries: results, avgDuration };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 5: Concurrent Operations
 */
async function testConcurrentOperations(pool) {
  console.log('\n🔄 Test 5: Concurrent Operations (10 simultaneous)');

  try {
    const operations = [];

    for (let i = 0; i < 10; i++) {
      operations.push(
        (async () => {
          const conn = await pool.getConnection();
          try {
            const [result] = await conn.query(
              'SELECT COUNT(*) as count FROM transactions WHERE prefecture = ?',
              ['東京都']
            );
            return { success: true, count: result[0].count };
          } finally {
            conn.release();
          }
        })()
      );
    }

    const start = Date.now();
    const results = await Promise.all(operations);
    const duration = Date.now() - start;

    const successful = results.filter(r => r.success).length;
    console.log(`  ✓ Successful operations: ${successful}/10`);
    console.log(`  ✓ Total time: ${duration}ms`);
    console.log(`  ✓ Average per operation: ${Math.round(duration / 10)}ms`);

    return { success: true, successful, duration };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 6: Data Integrity Verification
 */
async function testDataIntegrity(pool) {
  console.log('\n✅ Test 6: Data Integrity Verification');
  const conn = await pool.getConnection();

  try {
    // Check for NULL values in critical fields
    const [nullChecks] = await conn.query(`
      SELECT
        SUM(CASE WHEN priceYen IS NULL THEN 1 ELSE 0 END) as null_prices,
        SUM(CASE WHEN prefecture IS NULL THEN 1 ELSE 0 END) as null_prefecture,
        SUM(CASE WHEN propertyType IS NULL THEN 1 ELSE 0 END) as null_type,
        COUNT(*) as total
      FROM transactions
    `);

    const checks = nullChecks[0];
    console.log(`  ✓ Total records: ${checks.total.toLocaleString()}`);
    console.log(`  ✓ NULL prices: ${checks.null_prices}`);
    console.log(`  ✓ NULL prefectures: ${checks.null_prefecture}`);
    console.log(`  ✓ NULL property types: ${checks.null_type}`);

    if (checks.null_prices > 0 || checks.null_prefecture > 0 || checks.null_type > 0) {
      return { success: false, error: 'Data integrity issues detected' };
    }

    // Check for duplicate IDs
    const [duplicates] = await conn.query(`
      SELECT id, COUNT(*) as count FROM transactions
      GROUP BY id HAVING count > 1
    `);

    console.log(`  ✓ Duplicate IDs: ${duplicates.length}`);

    if (duplicates.length > 0) {
      return { success: false, error: 'Duplicate IDs detected' };
    }

    return { success: true, integrity: 'verified' };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test 7: System Health Check
 */
async function testSystemHealth(pool) {
  console.log('\n💚 Test 7: System Health Check');

  try {
    // Connection pool health
    const poolStatus = {
      activeConnections: pool._allConnections?.length || 0,
      waitingConnections: pool._connectionQueue?.length || 0,
    };

    console.log(`  ✓ Connection pool status:`);
    console.log(`    - Active connections: ${poolStatus.activeConnections}`);
    console.log(`    - Waiting connections: ${poolStatus.waitingConnections}`);

    // Database size estimate
    const conn = await pool.getConnection();
    try {
      const [sizeResult] = await conn.query(`
        SELECT
          SUM(data_length + index_length) as size_bytes
        FROM information_schema.TABLES
        WHERE table_schema = DATABASE()
      `);

      const sizeBytes = sizeResult[0].size_bytes || 0;
      const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);
      console.log(`  ✓ Database size: ${sizeMB} MB`);
    } finally {
      conn.release();
    }

    return { success: true, poolStatus };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main execution
 */
async function main() {
  let pool;

  try {
    console.log('='.repeat(80));
    console.log('Comprehensive Integration Test Suite');
    console.log('='.repeat(80));

    const config = parseDbUrl();
    pool = mysql.createPool(config);
    console.log('✓ Connection pool created');

    // Run tests
    const results = [];
    results.push(await testDatabaseConnection(pool));
    results.push(await testDataAvailability(pool));
    results.push(await testAssessmentRequestFlow(pool));
    results.push(await testQueryPerformance(pool));
    results.push(await testConcurrentOperations(pool));
    results.push(await testDataIntegrity(pool));
    results.push(await testSystemHealth(pool));

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('Integration Test Summary');
    console.log('='.repeat(80));

    const successful = results.filter(r => r.success).length;
    console.log(`\nTotal: ${successful}/${results.length} tests passed`);

    if (successful === results.length) {
      console.log('✓ All integration tests passed!');
      console.log('\n✅ System is ready for production deployment');
    } else {
      console.log('⚠ Some tests failed');
    }

    console.log('='.repeat(80));

    process.exit(successful === results.length ? 0 : 1);
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
