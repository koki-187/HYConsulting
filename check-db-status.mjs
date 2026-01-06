import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

const result = await db.execute(sql`
  SELECT prefecture, COUNT(*)::int as count 
  FROM transactions 
  GROUP BY prefecture 
  ORDER BY count DESC
`);

console.log('\n=== Database Status ===\n');
const majorCities = ['東京都', '神奈川県', '大阪府', '愛知県', '福岡県'];
let total = 0;

result.forEach((row, index) => {
  const mark = majorCities.includes(row.prefecture) ? '★' : ' ';
  console.log(`${mark} ${String(index + 1).padStart(2)}. ${row.prefecture.padEnd(10)} ${row.count.toLocaleString().padStart(10)} 件`);
  total += row.count;
});

console.log(`\n合計: ${total.toLocaleString()} 件\n`);

await client.end();
process.exit(0);
