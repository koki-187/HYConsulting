import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function query() {
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });

  const [rows] = await connection.execute(`
    SELECT DISTINCT city 
    FROM transactions 
    WHERE prefecture = '東京都' 
    LIMIT 20
  `);
  
  console.log('Tokyo cities:');
  rows.forEach(row => console.log(`  - ${row.city}`));
  
  await connection.end();
}

query().catch(console.error);
