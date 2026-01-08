import { getDb } from './server/db.ts';
import { sql } from 'drizzle-orm';

const db = await getDb();

// Get prefecture list
const result = await db.execute(sql`
  SELECT 
    prefecture,
    COUNT(*) as record_count,
    COUNT(DISTINCT city) as city_count,
    SUM(transactionCount) as total_transactions
  FROM aggregated_real_estate_data
  GROUP BY prefecture
  ORDER BY prefecture
`);

console.log('=== 現在のデータベース状況 ===\n');
console.log('都道府県,レコード数,市区町村数,総取引件数');
result.rows.forEach(row => {
  console.log(`${row.prefecture},${row.record_count},${row.city_count},${row.total_transactions}`);
});

console.log(`\n総都道府県数: ${result.rows.length}`);
console.log(`総レコード数: ${result.rows.reduce((sum, row) => sum + parseInt(row.record_count), 0).toLocaleString()}`);
console.log(`総取引件数: ${result.rows.reduce((sum, row) => sum + parseInt(row.total_transactions), 0).toLocaleString()}`);

process.exit(0);
