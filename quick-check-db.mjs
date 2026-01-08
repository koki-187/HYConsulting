import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('DATABASE_URL not found');
  process.exit(1);
}

const connection = await mysql.createConnection(url);

try {
  const [totalResult] = await connection.query('SELECT COUNT(*) as total FROM transactions');
  console.log('Total transactions:', totalResult[0].total);

  const [tokyoResult] = await connection.query(`
    SELECT COUNT(*) as count 
    FROM transactions 
    WHERE prefecture = '東京都'
  `);
  console.log('Tokyo transactions:', tokyoResult[0].count);

  const [chiyodaResult] = await connection.query(`
    SELECT * FROM transactions 
    WHERE prefecture = '東京都' AND city LIKE '%千代田%'
    LIMIT 3
  `);
  console.log('\nChiyoda sample:');
  chiyodaResult.forEach(row => {
    console.log(`- ${row.propertyType}, ${row.city}, Price: ${row.tradePriceYen}, Area: ${row.buildingAreaM2}m2`);
  });

} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
