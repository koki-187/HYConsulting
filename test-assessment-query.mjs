import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function testQuery() {
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });

  console.log('Testing assessment query for 東京都 新宿区 戸建て...');
  
  const [results] = await connection.execute(`
    SELECT COUNT(*) as count
    FROM transactions
    WHERE prefecture = '東京都'
    AND city = '新宿区'
    AND propertyType LIKE '%宅地%'
  `);
  
  console.log('Query results:', results);
  
  await connection.end();
}

testQuery().catch(console.error);
