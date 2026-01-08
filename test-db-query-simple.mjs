import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function testQuery() {
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });

  console.log('Testing database query for 東京都 新宿区 戸建て...\n');

  // Test 1: Count records
  console.log('Test 1: Counting records...');
  const [countResult] = await connection.execute(`
    SELECT COUNT(*) as count
    FROM transactions
    WHERE prefecture = ?
    AND city = ?
    AND propertyType = ?
  `, ['東京都', '新宿区', '宅地(土地と建物)']);
  
  console.log(`  Found ${countResult[0].count} records\n`);

  // Test 2: Get sample records
  if (countResult[0].count > 0) {
    console.log('Test 2: Fetching sample records...');
    const [sampleRecords] = await connection.execute(`
      SELECT prefecture, city, propertyType, priceYen, landAreaM2, buildingYear
      FROM transactions
      WHERE prefecture = ?
      AND city = ?
      AND propertyType = ?
      LIMIT 3
    `, ['東京都', '新宿区', '宅地(土地と建物)']);
    
    console.log(`  Sample records (${sampleRecords.length}):`);
    sampleRecords.forEach((record, i) => {
      console.log(`\n  Record ${i + 1}:`);
      console.log(`    Prefecture: ${record.prefecture}`);
      console.log(`    City: ${record.city}`);
      console.log(`    PropertyType: ${record.propertyType}`);
      console.log(`    Price: ${record.priceYen}`);
      console.log(`    LandArea: ${record.landAreaM2}`);
      console.log(`    BuildingYear: ${record.buildingYear}`);
    });
  }

  await connection.end();
  console.log('\n✓ Test completed successfully');
}

testQuery().catch(error => {
  console.error('✗ Test failed:', error.message);
  process.exit(1);
});
