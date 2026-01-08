import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '4000'),
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

const db = drizzle(connection);

console.log('✅ データベース接続成功\n');

// 総レコード件数
const [totalCount] = await connection.execute('SELECT COUNT(*) as count FROM transactions');
console.log(`📊 総レコード件数: ${totalCount[0].count.toLocaleString()}件\n`);

// 都道府県別件数
const [prefectures] = await connection.execute(`
  SELECT prefecture, COUNT(*) as count 
  FROM transactions 
  GROUP BY prefecture 
  ORDER BY prefecture
`);

console.log('📍 都道府県別データ件数:');
console.log('─'.repeat(50));
prefectures.forEach((row, index) => {
  console.log(`${(index + 1).toString().padStart(2, '0')}. ${row.prefecture.padEnd(10, '　')}: ${row.count.toLocaleString().padStart(10, ' ')}件`);
});
console.log('─'.repeat(50));
console.log(`合計: ${prefectures.length}都道府県\n`);

await connection.end();
