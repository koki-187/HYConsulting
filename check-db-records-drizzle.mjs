import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

// DATABASE_URLを使用してMySQL接続を作成
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('✅ データベース接続成功\n');

// 総レコード数
const totalResult = await db.execute(sql`SELECT COUNT(*) as total FROM transactions`);
const totalCount = totalResult[0][0].total;
console.log(`📊 総レコード数: ${totalCount.toLocaleString()}件\n`);

// 神奈川県のレコード数
const kanagawaResult = await db.execute(sql`SELECT COUNT(*) as total FROM transactions WHERE prefecture = '神奈川県'`);
const kanagawaCount = kanagawaResult[0][0].total;
console.log(`📍 神奈川県のレコード数: ${kanagawaCount.toLocaleString()}件\n`);

// 神奈川県の市区町村別件数
const cityResult = await db.execute(sql`
  SELECT city, district, COUNT(*) as count 
  FROM transactions 
  WHERE prefecture = '神奈川県' 
  GROUP BY city, district 
  ORDER BY count DESC 
  LIMIT 30
`);

console.log('🏙️ 神奈川県の市区町村別データ件数（上位30）:');
console.log('─'.repeat(60));
cityResult[0].forEach((row, index) => {
  const location = row.district ? `${row.city}${row.district}` : row.city;
  console.log(`${(index + 1).toString().padStart(2)}. ${location.padEnd(30)} ${row.count.toString().padStart(10)}件`);
});

await connection.end();
