/**
 * MLIT Production Data Loader - Production Version
 * Loads 100,000+ transaction records using DATABASE_URL
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
 * Create connection pool
 */
async function createPool() {
  const config = parseDbUrl();
  console.log('Database Configuration:');
  console.log(`  Host: ${config.host}:${config.port}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  SSL: ${config.ssl ? 'enabled' : 'disabled'}`);
  console.log();

  try {
    const pool = mysql.createPool(config);
    console.log('✓ Connection pool created');
    return pool;
  } catch (error) {
    console.error('✗ Failed to create pool:', error.message);
    throw error;
  }
}

/**
 * Load SQL file in chunks
 */
async function loadSQLFileChunked(pool, filePath, chunkSize = 1000) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`SQL file not found: ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, 'utf-8');
    const statements = sql.split(';').filter((stmt) => stmt.trim().length > 0 && !stmt.trim().startsWith('--'));

    console.log(`Loading ${statements.length} SQL statements in chunks of ${chunkSize}...`);
    console.log();

    const connection = await pool.getConnection();
    let successCount = 0;
    let errorCount = 0;

    const startTime = Date.now();

    for (let i = 0; i < statements.length; i++) {
      try {
        const stmt = statements[i].trim();
        if (stmt.length === 0) continue;

        await connection.query(stmt);
        successCount++;

        if ((i + 1) % 10 === 0) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate = (successCount / ((Date.now() - startTime) / 1000)).toFixed(0);
          console.log(`  [${i + 1}/${statements.length}] Executed in ${elapsed}s (${rate} stmt/s)`);
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 5) {
          console.error(`  ✗ Error in statement ${i + 1}: ${error.message}`);
        }
      }
    }

    connection.release();

    const elapsed = Date.now() - startTime;
    console.log();
    console.log(`✓ SQL loading complete:`);
    console.log(`  Succeeded: ${successCount}`);
    console.log(`  Failed: ${errorCount}`);
    console.log(`  Time: ${(elapsed / 1000).toFixed(2)}s`);

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
      console.log(`    ${row.prefecture}: ${row.count.toLocaleString()}`);
    });

    // Check property type distribution
    const [typeResult] = await connection.query(`
      SELECT property_type, COUNT(*) as count FROM transactions GROUP BY property_type
    `);
    console.log('  Property types:');
    typeResult.forEach((row) => {
      console.log(`    ${row.property_type}: ${row.count.toLocaleString()}`);
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

    connection.release();

    console.log('✓ Data integrity verified');

    return { transactionCount, stats };
  } catch (error) {
    console.error('✗ Error verifying data:', error.message);
    throw error;
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

    // Load SQL file
    const sqlPath = path.join(__dirname, 'mlit-production-data.sql');
    const result = await loadSQLFileChunked(pool, sqlPath);

    // Verify data integrity
    const integrity = await verifyDataIntegrity(pool);

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
