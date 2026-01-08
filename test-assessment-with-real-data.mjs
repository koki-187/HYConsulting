import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
const connection = await mysql.createConnection(url);

try {
  // Test query similar to what assessment.ts does
  console.log('Testing assessment query for Tokyo Chiyoda condo...\n');
  
  const [result] = await connection.query(`
    SELECT * FROM transactions 
    WHERE prefecture = '東京都' 
    AND city = '千代田区' 
    AND propertyType = 'condo'
    LIMIT 10
  `);
  
  console.log(`Found ${result.length} comparable condos in Chiyoda`);
  
  if (result.length > 0) {
    console.log('\nSample data:');
    result.slice(0, 3).forEach((row, idx) => {
      console.log(`\n${idx + 1}. Property:`);
      console.log(`   - Type: ${row.propertyType}`);
      console.log(`   - City: ${row.city}`);
      console.log(`   - Price: ¥${row.priceYen ? row.priceYen.toLocaleString() : 'N/A'}`);
      console.log(`   - Building Area: ${row.buildingAreaM2}m²`);
      console.log(`   - Building Year: ${row.buildingYear || 'N/A'}`);
      console.log(`   - Unit Price: ¥${row.unitPriceYenPerM2 ? row.unitPriceYenPerM2.toLocaleString() : 'N/A'}/m²`);
    });
    
    // Calculate median price
    const prices = result.map(r => r.priceYen).filter(p => p && p > 0);
    if (prices.length > 0) {
      prices.sort((a, b) => a - b);
      const median = prices[Math.floor(prices.length / 2)];
      console.log(`\n📊 Median price: ¥${median.toLocaleString()}`);
    }
  } else {
    console.log('⚠️  No condo data found for Chiyoda');
    
    // Try broader search
    const [broader] = await connection.query(`
      SELECT COUNT(*) as count, propertyType 
      FROM transactions 
      WHERE prefecture = '東京都' 
      GROUP BY propertyType
    `);
    console.log('\nAvailable property types in Tokyo:');
    broader.forEach(row => {
      console.log(`- ${row.propertyType}: ${row.count} records`);
    });
  }

} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
