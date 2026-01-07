/**
 * Aggregate Transactions Data Script
 * Aggregates transaction data from `transactions` table into `aggregated_real_estate_data` table
 * 
 * Aggregation Strategy:
 * - Group by: propertyType, prefecture, city, district, buildingAgeGroup
 * - Calculate: totalPriceYen, totalAreaM2, transactionCount, pricePerTsubo, averagePriceYen, averageAreaM2
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
 * Determine building age group from building year
 */
function getBuildingAgeGroup(buildingYear) {
  if (!buildingYear) return '不明';
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - buildingYear;
  
  if (age < 0) return '0～5年';
  if (age <= 5) return '0～5年';
  if (age <= 10) return '5～10年';
  if (age <= 15) return '10～15年';
  if (age <= 20) return '15～20年';
  if (age <= 30) return '20～30年';
  return '30年以上';
}

/**
 * Map property type to Japanese
 */
function mapPropertyType(type) {
  const typeMap = {
    'land': '土地',
    'house': '一戸建て',
    'condo': 'マンション',
  };
  return typeMap[type] || '土地';
}

/**
 * Aggregate transactions data
 */
async function aggregateTransactions(pool, datasetVersionId) {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n📊 Aggregating transaction data...');
    console.log(`Dataset Version ID: ${datasetVersionId}`);
    
    // Step 1: Fetch all transactions
    console.log('\n1️⃣ Fetching transactions from database...');
    const [transactions] = await connection.query(`
      SELECT 
        propertyType,
        prefecture,
        city,
        district,
        buildingYear,
        priceYen,
        landAreaM2,
        buildingAreaM2
      FROM transactions
      WHERE datasetVersionId = ?
    `, [datasetVersionId]);
    
    console.log(`   ✓ Fetched ${transactions.length.toLocaleString()} transactions`);
    
    // Step 2: Group and aggregate data
    console.log('\n2️⃣ Grouping and aggregating data...');
    const aggregationMap = new Map();
    
    for (const tx of transactions) {
      const propertyTypeJp = mapPropertyType(tx.propertyType);
      const buildingAgeGroup = getBuildingAgeGroup(tx.buildingYear);
      const area = tx.propertyType === 'land' ? tx.landAreaM2 : tx.buildingAreaM2;
      
      // Skip if no area data
      if (!area || area <= 0) continue;
      
      const key = `${propertyTypeJp}|${tx.prefecture}|${tx.city}|${tx.district}|${buildingAgeGroup}`;
      
      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, {
          propertyType: propertyTypeJp,
          prefecture: tx.prefecture,
          city: tx.city,
          district: tx.district,
          buildingAgeGroup: buildingAgeGroup,
          totalPriceYen: 0,
          totalAreaM2: 0,
          transactionCount: 0,
        });
      }
      
      const agg = aggregationMap.get(key);
      agg.totalPriceYen += tx.priceYen;
      agg.totalAreaM2 += area;
      agg.transactionCount += 1;
    }
    
    console.log(`   ✓ Created ${aggregationMap.size.toLocaleString()} aggregated groups`);
    
    // Step 3: Calculate derived fields
    console.log('\n3️⃣ Calculating derived fields...');
    const aggregatedData = [];
    
    for (const [key, agg] of aggregationMap.entries()) {
      const averagePriceYen = Math.floor(agg.totalPriceYen / agg.transactionCount);
      const averageAreaM2 = agg.totalAreaM2 / agg.transactionCount;
      const pricePerTsubo = (averageAreaM2 > 0) ? Math.floor(averagePriceYen / (averageAreaM2 / 3.30579)) : 0; // 1坪 = 3.30579㎡
      
      // Skip if invalid data
      if (isNaN(averagePriceYen) || isNaN(averageAreaM2) || isNaN(pricePerTsubo)) {
        console.warn(`   ⚠️ Skipping invalid data: ${key}`);
        continue;
      }
      
      aggregatedData.push({
        propertyType: agg.propertyType,
        prefecture: agg.prefecture,
        city: agg.city,
        district: agg.district,
        buildingAgeGroup: agg.buildingAgeGroup,
        totalPriceYen: agg.totalPriceYen,
        totalAreaM2: agg.totalAreaM2,
        transactionCount: agg.transactionCount,
        pricePerTsubo: pricePerTsubo,
        averagePriceYen: averagePriceYen,
        averageAreaM2: averageAreaM2,
        datasetVersionId: datasetVersionId,
      });
    }
    
    console.log(`   ✓ Calculated ${aggregatedData.length.toLocaleString()} aggregated records`);
    
    // Step 4: Insert aggregated data in batches
    console.log('\n4️⃣ Inserting aggregated data into database...');
    const batchSize = 500;
    let insertedCount = 0;
    const startTime = Date.now();
    
    for (let i = 0; i < aggregatedData.length; i += batchSize) {
      const batch = aggregatedData.slice(i, Math.min(i + batchSize, aggregatedData.length));
      const values = batch.map(agg => [
        agg.propertyType,
        agg.prefecture,
        agg.city,
        agg.district,
        agg.buildingAgeGroup,
        agg.totalPriceYen,
        agg.totalAreaM2,
        agg.transactionCount,
        agg.pricePerTsubo,
        agg.averagePriceYen,
        agg.averageAreaM2,
        agg.datasetVersionId,
      ]);
      
      await connection.query(`
        INSERT INTO aggregated_real_estate_data (
          propertyType, prefecture, city, district, buildingAgeGroup,
          totalPriceYen, totalAreaM2, transactionCount, pricePerTsubo,
          averagePriceYen, averageAreaM2, datasetVersionId
        ) VALUES ?
      `, [values]);
      
      insertedCount += batch.length;
      
      if (insertedCount % 5000 === 0 || insertedCount === aggregatedData.length) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (insertedCount / ((Date.now() - startTime) / 1000)).toFixed(0);
        console.log(`   📈 Inserted ${insertedCount.toLocaleString()} records in ${elapsed}s (${rate} rec/s)`);
      }
    }
    
    connection.release();
    
    const elapsed = Date.now() - startTime;
    console.log(`\n✅ Aggregation complete!`);
    console.log(`   Total records: ${insertedCount.toLocaleString()}`);
    console.log(`   Time: ${(elapsed / 1000).toFixed(2)}s`);
    
    return insertedCount;
  } catch (error) {
    console.error('❌ Error aggregating transactions:', error.message);
    throw error;
  }
}

/**
 * Verify aggregated data
 */
async function verifyAggregatedData(pool) {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n🔍 Verifying aggregated data...');
    
    // Total count
    const [countResult] = await connection.query('SELECT COUNT(*) as count FROM aggregated_real_estate_data');
    const totalCount = countResult[0].count;
    console.log(`   Total records: ${totalCount.toLocaleString()}`);
    
    // Prefecture breakdown
    const [prefResult] = await connection.query(`
      SELECT prefecture, COUNT(*) as count 
      FROM aggregated_real_estate_data 
      GROUP BY prefecture 
      ORDER BY count DESC 
      LIMIT 10
    `);
    console.log('\n   Top 10 prefectures:');
    prefResult.forEach(row => {
      console.log(`      ${row.prefecture}: ${row.count.toLocaleString()} records`);
    });
    
    // Property type breakdown
    const [typeResult] = await connection.query(`
      SELECT propertyType, COUNT(*) as count 
      FROM aggregated_real_estate_data 
      GROUP BY propertyType
    `);
    console.log('\n   Property types:');
    typeResult.forEach(row => {
      console.log(`      ${row.propertyType}: ${row.count.toLocaleString()} records`);
    });
    
    // Kanagawa breakdown
    const [kanagawaResult] = await connection.query(`
      SELECT city, COUNT(*) as count 
      FROM aggregated_real_estate_data 
      WHERE prefecture = '神奈川県' 
      GROUP BY city 
      ORDER BY count DESC 
      LIMIT 10
    `);
    console.log('\n   神奈川県 Top 10 cities:');
    kanagawaResult.forEach(row => {
      console.log(`      ${row.city}: ${row.count.toLocaleString()} records`);
    });
    
    connection.release();
    console.log('\n✅ Verification complete!');
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  let pool;
  
  try {
    console.log('='.repeat(80));
    console.log('📊 Transaction Data Aggregation Script');
    console.log('='.repeat(80));
    
    // Create connection pool
    const config = parseDbUrl();
    pool = mysql.createPool(config);
    console.log('✅ Connection pool created');
    
    // Get dataset version ID from transactions table
    const connection = await pool.getConnection();
    const [datasets] = await connection.query(`
      SELECT DISTINCT datasetVersionId 
      FROM transactions 
      ORDER BY datasetVersionId DESC 
      LIMIT 1
    `);
    connection.release();
    
    if (datasets.length === 0) {
      console.error('❌ No dataset version found in transactions table');
      process.exit(1);
    }
    
    const datasetVersionId = datasets[0].datasetVersionId;
    console.log(`✅ Found dataset version: ${datasetVersionId}`);
    
    // Aggregate transactions
    await aggregateTransactions(pool, datasetVersionId);
    
    // Verify aggregated data
    await verifyAggregatedData(pool);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ All operations complete!');
    console.log('='.repeat(80));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

main();
