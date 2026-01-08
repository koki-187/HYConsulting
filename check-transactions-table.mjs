import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: true }
});

const db = drizzle(connection);

try {
  // Check total count
  const [totalResult] = await connection.query('SELECT COUNT(*) as total FROM transactions');
  console.log('Total transactions:', totalResult[0].total);

  // Check Tokyo Chiyoda data
  const [tokyoResult] = await connection.query(`
    SELECT * FROM transactions 
    WHERE prefecture = '東京都' AND city LIKE '%千代田%' 
    LIMIT 5
  `);
  console.log('\nTokyo Chiyoda sample data:');
  console.log(JSON.stringify(tokyoResult, null, 2));

  // Check property types
  const [typeResult] = await connection.query(`
    SELECT propertyType, COUNT(*) as count 
    FROM transactions 
    GROUP BY propertyType
  `);
  console.log('\nProperty types:');
  console.log(typeResult);

} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}
