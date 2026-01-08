import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('既存データベースの状態確認\n');
console.log('=' .repeat(80));

// Total records
const totalResult = await db.execute(sql`SELECT COUNT(*) as total FROM aggregated_real_estate_data`);
console.log(`\n総レコード数: ${totalResult[0][0].total.toLocaleString()} 件\n`);

// Prefecture breakdown
const prefResult = await db.execute(sql`
  SELECT prefecture, COUNT(*) as count 
  FROM aggregated_real_estate_data 
  GROUP BY prefecture 
  ORDER BY prefecture
`);

console.log('都道府県別レコード数:');
console.log('-'.repeat(80));
for (const row of prefResult[0]) {
  console.log(`${row.prefecture.padEnd(20)}: ${row.count.toLocaleString().padStart(10)} 件`);
}
console.log('=' .repeat(80));

await connection.end();
