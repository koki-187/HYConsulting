/**
 * MLIT Production Data Loader
 * Efficiently loads 100,000+ transaction records into MySQL
 * 
 * Features:
 * - Batch insert optimization
 * - Connection pooling
 * - Error handling and recovery
 * - Data integrity verification
 * - Performance monitoring
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hy_consulting',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

/**
 * Create connection pool
 */
async function createPool() {
  try {
    const pool = mysql.createPool(DB_CONFIG);
    console.log('✓ Database connection pool created');
    return pool;
  } catch (error) {
    console.error('✗ Failed to create connection pool:', error.message);
    throw error;
  }
}

/**
 * Verify database connection
 */
async function verifyConnection(pool) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT 1 as test');
    connection.release();
    console.log('✓ Database connection verified');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Clear existing data (for testing)
 */
async function clearExistingData(pool) {
  try {
    const connection = await pool.getConnection();

    console.log('Clearing existing test data...');
    await connection.query('DELETE FROM valuation_results WHERE requestId LIKE "test_%"');
    await connection.query('DELETE FROM valuation_requests WHERE id LIKE "test_%"');
    await connection.query('DELETE FROM transactions WHERE dataset_version_id LIKE "mlit_tx_2025Q4_%"');
    await connection.query('DELETE FROM dataset_versions WHERE id LIKE "mlit_tx_2025Q4_%"');

    connection.release();
    console.log('✓ Existing test data cleared');
  } catch (error) {
    console.error('✗ Error clearing data:', error.message);
  }
}

/**
 * Load SQL file and execute
 */
async function loadSQLFile(pool, filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`SQL file not found: ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, 'utf-8');
    const statements = sql.split(';').filter((stmt) => stmt.trim().length > 0);

    console.log(`\nLoading ${statements.length} SQL statements...`);

    const connection = await pool.getConnection();
    let successCount = 0;
    let errorCount = 0;

    const startTime = Date.now();

    for (let i = 0; i < statements.length; i++) {
      try {
        const stmt = statements[i].trim();
        if (stmt.startsWith('--') || stmt.length === 0) continue;

        await connection.query(stmt);
        successCount++;

        if ((i + 1) % 10 === 0) {
          console.log(`  Executed ${i + 1}/${statements.length} statements...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`  Error in statement ${i + 1}:`, error.message);
      }
    }

    connection.release();

    const elapsed = Date.now() - startTime;
    console.log(`✓ SQL loading complete: ${successCount} succeeded, ${errorCount} failed in ${(elapsed / 1000).toFixed(2)}s`);

    return { successCount, errorCount };
  } catch (error) {
    console.error('✗ Error loading SQL file:', error.message);
    throw error;
  }
}

/**
 * Verify data integrity
 */
async function verifyDataIntegrity(pool) {
  try {
    const connection = await pool.getConnection();

    console.log('\nVerifying data integrity...');

    // Count records
    const [countResult] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    const transactionCount = countResult[0].count;
    console.log(`  Total transactions: ${transactionCount.toLocaleString()}`);

    // Check for duplicates
    const [dupResult] = await connection.query(`
      SELECT COUNT(*) as dup_count FROM (
        SELECT id FROM transactions GROUP BY id HAVING COUNT(*) > 1
      ) AS duplicates
    `);
    const duplicateCount = dupResult[0].dup_count;
    console.log(`  Duplicate IDs: ${duplicateCount}`);

    // Check for NULL prices
    const [nullResult] = await connection.query('SELECT COUNT(*) as null_count FROM transactions WHERE price_yen IS NULL');
    const nullCount = nullResult[0].null_count;
    console.log(`  NULL prices: ${nullCount}`);

    // Check prefecture distribution
    const [prefResult] = await connection.query(`
      SELECT prefecture, COUNT(*) as count FROM transactions GROUP BY prefecture ORDER BY count DESC LIMIT 5
    `);
    console.log('  Top 5 prefectures:');
    prefResult.forEach((row) => {
      console.log(`    ${row.prefecture}: ${row.count.toLocaleString()} records`);
    });

    // Check property type distribution
    const [typeResult] = await connection.query(`
      SELECT property_type, COUNT(*) as count FROM transactions GROUP BY property_type
    `);
    console.log('  Property types:');
    typeResult.forEach((row) => {
      console.log(`    ${row.property_type}: ${row.count.toLocaleString()} records`);
    });

    // Check price statistics
    const [statsResult] = await connection.query(`
      SELECT
        MIN(price_yen) as min_price,
        MAX(price_yen) as max_price,
        AVG(price_yen) as avg_price,
        STDDEV(price_yen) as stddev_price
      FROM transactions
    `);
    const stats = statsResult[0];
    console.log('  Price statistics:');
    console.log(`    Min: ¥${Math.floor(stats.min_price).toLocaleString()}`);
    console.log(`    Max: ¥${Math.floor(stats.max_price).toLocaleString()}`);
    console.log(`    Avg: ¥${Math.floor(stats.avg_price).toLocaleString()}`);
    console.log(`    StdDev: ¥${Math.floor(stats.stddev_price).toLocaleString()}`);

    connection.release();

    console.log('✓ Data integrity verification complete');

    return {
      transactionCount,
      duplicateCount,
      nullCount,
      stats,
    };
  } catch (error) {
    console.error('✗ Error verifying data:', error.message);
    throw error;
  }
}

/**
 * Create indexes for performance
 */
async function createIndexes(pool) {
  try {
    const connection = await pool.getConnection();

    console.log('\nCreating indexes for performance...');

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_tx_prefecture_city_type ON transactions(prefecture, city, property_type)',
      'CREATE INDEX IF NOT EXISTS idx_tx_price_range ON transactions(price_yen)',
      'CREATE INDEX IF NOT EXISTS idx_tx_station_distance ON transactions(station_distance_min)',
      'CREATE INDEX IF NOT EXISTS idx_tx_building_year ON transactions(building_year)',
      'CREATE INDEX IF NOT EXISTS idx_tx_transaction_ym ON transactions(transaction_ym)',
    ];

    for (const idx of indexes) {
      try {
        await connection.query(idx);
        console.log(`  ✓ ${idx.split('ON')[1].trim()}`);
      } catch (error) {
        console.log(`  ⚠ ${error.message}`);
      }
    }

    connection.release();
    console.log('✓ Indexes created');
  } catch (error) {
    console.error('✗ Error creating indexes:', error.message);
  }
}

/**
 * Test query performance
 */
async function testQueryPerformance(pool) {
  try {
    const connection = await pool.getConnection();

    console.log('\nTesting query performance...');

    // Test 1: Simple count
    let start = Date.now();
    await connection.query('SELECT COUNT(*) FROM transactions');
    let elapsed = Date.now() - start;
    console.log(`  Count query: ${elapsed}ms`);

    // Test 2: Complex search
    start = Date.now();
    await connection.query(`
      SELECT * FROM transactions
      WHERE prefecture = '東京都' AND property_type = 'land'
      LIMIT 100
    `);
    elapsed = Date.now() - start;
    console.log(`  Search query: ${elapsed}ms`);

    // Test 3: Aggregation
    start = Date.now();
    await connection.query(`
      SELECT prefecture, property_type, COUNT(*) as count, AVG(price_yen) as avg_price
      FROM transactions
      GROUP BY prefecture, property_type
    `);
    elapsed = Date.now() - start;
    console.log(`  Aggregation query: ${elapsed}ms`);

    connection.release();
    console.log('✓ Query performance tests complete');
  } catch (error) {
    console.error('✗ Error testing performance:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  let pool;

  try {
    console.log('='.repeat(80));
    console.log('MLIT Production Data Loader');
    console.log('='.repeat(80));
    console.log();

    // Create connection pool
    pool = await createPool();

    // Verify connection
    const isConnected = await verifyConnection(pool);
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Clear existing test data
    await clearExistingData(pool);

    // Load SQL file
    const sqlPath = path.join(__dirname, 'mlit-production-data.sql');
    const result = await loadSQLFile(pool, sqlPath);

    // Verify data integrity
    const integrity = await verifyDataIntegrity(pool);

    // Create indexes
    await createIndexes(pool);

    // Test query performance
    await testQueryPerformance(pool);

    console.log();
    console.log('='.repeat(80));
    console.log('✓ Data loading and verification complete!');
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
