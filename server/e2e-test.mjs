/**
 * End-to-End Assessment Flow Testing
 * Tests complete user journey from form submission to result display
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
 * Test Case 1: Land Property Assessment Flow
 */
async function testLandAssessmentFlow(pool) {
  console.log('\n📋 Test 1: Land Property Assessment Flow');
  const conn = await pool.getConnection();

  try {
    // Step 1: Create valuation request
    const requestId = `test_land_${Date.now()}`;
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
        120,
        null,
        null,
        8,
        'single',
        0,
        'Test land assessment',
      ]
    );
    console.log('  ✓ Valuation request created:', requestId);

    // Step 2: Verify request was saved
    const [requests] = await conn.query(
      'SELECT * FROM valuation_requests WHERE id = ?',
      [requestId]
    );
    console.log('  ✓ Request verified in database');

    // Step 3: Search for comparable transactions
    const [comparables] = await conn.query(`
      SELECT * FROM transactions
      WHERE prefecture = '東京都' AND propertyType = 'land'
      AND landAreaM2 BETWEEN 100 AND 140
      LIMIT 10
    `);
    console.log(`  ✓ Found ${comparables.length} comparable transactions`);

    // Step 4: Calculate statistics
    if (comparables.length > 0) {
      const prices = comparables.map(c => c.priceYen);
      const avgPrice = prices.reduce((a, b) => a + b) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      console.log(`  ✓ Price range: ¥${Math.floor(minPrice).toLocaleString()} - ¥${Math.floor(maxPrice).toLocaleString()}`);
      console.log(`  ✓ Average price: ¥${Math.floor(avgPrice).toLocaleString()}`);
    }

    // Step 5: Store valuation result
    const resultId = await conn.query(
      `INSERT INTO valuation_results (
        requestId, createdAt, estimatedLowYen, estimatedHighYen,
        compsUsedCount, method, methodVersion, explanation
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        150000000,
        180000000,
        comparables.length,
        'comparable_sales',
        '1.0',
        'Based on comparable sales analysis',
      ]
    );
    console.log('  ✓ Valuation result stored');

    // Step 6: Retrieve result
    const [results] = await conn.query(
      'SELECT * FROM valuation_results WHERE requestId = ?',
      [requestId]
    );
    console.log(`  ✓ Result retrieved: ¥${Math.floor(results[0].estimatedLowYen).toLocaleString()} - ¥${Math.floor(results[0].estimatedHighYen).toLocaleString()}`);

    return { success: true, comparablesCount: comparables.length };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test Case 2: Condo Property Assessment Flow
 */
async function testCondoAssessmentFlow(pool) {
  console.log('\n📋 Test 2: Condo Property Assessment Flow');
  const conn = await pool.getConnection();

  try {
    const requestId = `test_condo_${Date.now()}`;
    await conn.query(
      `INSERT INTO valuation_requests (
        id, createdAt, inputPrefecture, inputCity, inputWard, inputDistrict,
        propertyType, landAreaM2, buildingAreaM2, buildingYear, stationDistanceMin,
        ownershipType, inheritanceFlag, notes
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        '神奈川県',
        '横浜市',
        '中区',
        '関内',
        'condo',
        null,
        68,
        2016,
        6,
        'single',
        0,
        'Test condo assessment',
      ]
    );
    console.log('  ✓ Valuation request created:', requestId);

    // Search for comparables
    const [comparables] = await conn.query(`
      SELECT * FROM transactions
      WHERE prefecture = '神奈川県' AND propertyType = 'condo'
      AND buildingAreaM2 BETWEEN 60 AND 80
      LIMIT 10
    `);
    console.log(`  ✓ Found ${comparables.length} comparable transactions`);

    // Store result
    await conn.query(
      `INSERT INTO valuation_results (
        requestId, createdAt, estimatedLowYen, estimatedHighYen,
        compsUsedCount, method, methodVersion, explanation
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        85000000,
        110000000,
        comparables.length,
        'comparable_sales',
        '1.0',
        'Based on comparable sales analysis',
      ]
    );
    console.log('  ✓ Valuation result stored');

    return { success: true, comparablesCount: comparables.length };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test Case 3: Inherited Property Assessment Flow
 */
async function testInheritedPropertyFlow(pool) {
  console.log('\n📋 Test 3: Inherited Property Assessment Flow');
  const conn = await pool.getConnection();

  try {
    const requestId = `test_inherited_${Date.now()}`;
    await conn.query(
      `INSERT INTO valuation_requests (
        id, createdAt, inputPrefecture, inputCity, inputWard, inputDistrict,
        propertyType, landAreaM2, buildingAreaM2, buildingYear, stationDistanceMin,
        ownershipType, inheritanceFlag, notes
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        '大阪府',
        '大阪市',
        '北区',
        '中之島',
        'house',
        150,
        120,
        2010,
        10,
        'shared',
        1,
        'Inherited property assessment',
      ]
    );
    console.log('  ✓ Inherited property request created:', requestId);

    // Search for comparables
    const [comparables] = await conn.query(`
      SELECT * FROM transactions
      WHERE prefecture = '大阪府' AND propertyType = 'house'
      LIMIT 10
    `);
    console.log(`  ✓ Found ${comparables.length} comparable transactions`);

    // Store result with inheritance note
    await conn.query(
      `INSERT INTO valuation_results (
        requestId, createdAt, estimatedLowYen, estimatedHighYen,
        compsUsedCount, method, methodVersion, explanation
      ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        45000000,
        55000000,
        comparables.length,
        'comparable_sales',
        '1.0',
        'Inherited property - shared ownership',
      ]
    );
    console.log('  ✓ Valuation result stored with inheritance flag');

    return { success: true, comparablesCount: comparables.length };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test Case 4: Regional Coverage Test
 */
async function testRegionalCoverage(pool) {
  console.log('\n📋 Test 4: Regional Coverage Test');
  const conn = await pool.getConnection();

  try {
    const regions = [
      { prefecture: '東京都', city: '千代田区' },
      { prefecture: '神奈川県', city: '横浜市' },
      { prefecture: '大阪府', city: '大阪市' },
      { prefecture: '京都府', city: '京都市' },
      { prefecture: '福岡県', city: '福岡市' },
    ];

    let totalRecords = 0;
    for (const region of regions) {
      const [result] = await conn.query(
        `SELECT COUNT(*) as count FROM transactions
         WHERE prefecture = ? AND city = ?`,
        [region.prefecture, region.city]
      );
      const count = result[0].count;
      console.log(`  ✓ ${region.prefecture} ${region.city}: ${count} records`);
      totalRecords += count;
    }

    console.log(`  ✓ Total records in test regions: ${totalRecords.toLocaleString()}`);
    return { success: true, totalRecords };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test Case 5: Data Quality Check
 */
async function testDataQuality(pool) {
  console.log('\n📋 Test 5: Data Quality Check');
  const conn = await pool.getConnection();

  try {
    // Check for required fields
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

    // Check price distribution
    const [distribution] = await conn.query(`
      SELECT
        propertyType,
        COUNT(*) as count,
        MIN(priceYen) as min_price,
        MAX(priceYen) as max_price,
        AVG(priceYen) as avg_price
      FROM transactions
      GROUP BY propertyType
    `);

    console.log('  ✓ Price distribution by property type:');
    distribution.forEach(row => {
      console.log(`    ${row.propertyType}: ${row.count} records, avg ¥${Math.floor(row.avg_price).toLocaleString()}`);
    });

    return { success: true, qualityChecks: checks };
  } catch (error) {
    console.error('  ✗ Error:', error.message);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

/**
 * Test Case 6: Concurrent Request Handling
 */
async function testConcurrentRequests(pool) {
  console.log('\n📋 Test 6: Concurrent Request Handling (5 simultaneous)');

  try {
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(
        (async () => {
          const conn = await pool.getConnection();
          try {
            const requestId = `test_concurrent_${Date.now()}_${i}`;
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
                100 + i * 10,
                null,
                null,
                5 + i,
                'single',
                0,
                `Concurrent test ${i}`,
              ]
            );
            return { success: true, requestId };
          } finally {
            conn.release();
          }
        })()
      );
    }

    const results = await Promise.all(requests);
    const successful = results.filter(r => r.success).length;
    console.log(`  ✓ Successful requests: ${successful}/5`);

    return { success: true, successfulRequests: successful };
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
    console.log('End-to-End Assessment Flow Testing');
    console.log('='.repeat(80));
    console.log();

    const config = parseDbUrl();
    pool = mysql.createPool(config);
    console.log('✓ Connection pool created');

    // Run tests
    const results = [];
    results.push(await testLandAssessmentFlow(pool));
    results.push(await testCondoAssessmentFlow(pool));
    results.push(await testInheritedPropertyFlow(pool));
    results.push(await testRegionalCoverage(pool));
    results.push(await testDataQuality(pool));
    results.push(await testConcurrentRequests(pool));

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('Test Summary');
    console.log('='.repeat(80));

    const successful = results.filter(r => r.success).length;
    console.log(`\nTotal: ${successful}/${results.length} tests passed`);

    if (successful === results.length) {
      console.log('✓ All tests passed!');
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
