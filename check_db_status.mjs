import { getDb } from './server/db.ts';
import { aggregatedRealEstateData } from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

try {
  const db = await getDb();
  
  // Get prefecture list
  const result = await db.select({
    prefecture: aggregatedRealEstateData.prefecture,
    record_count: sql`COUNT(*)`.mapWith(Number),
    city_count: sql`COUNT(DISTINCT ${aggregatedRealEstateData.city})`.mapWith(Number),
    total_transactions: sql`SUM(${aggregatedRealEstateData.transactionCount})`.mapWith(Number)
  })
  .from(aggregatedRealEstateData)
  .groupBy(aggregatedRealEstateData.prefecture)
  .orderBy(aggregatedRealEstateData.prefecture);

  console.log('=== 現在のデータベース状況 ===\n');
  console.log('都道府県,レコード数,市区町村数,総取引件数');
  
  let totalRecords = 0;
  let totalTransactions = 0;
  
  result.forEach(row => {
    console.log(`${row.prefecture},${row.record_count},${row.city_count},${row.total_transactions}`);
    totalRecords += row.record_count;
    totalTransactions += row.total_transactions;
  });

  console.log(`\n総都道府県数: ${result.length}`);
  console.log(`総レコード数: ${totalRecords.toLocaleString()}`);
  console.log(`総取引件数: ${totalTransactions.toLocaleString()}`);
  
  process.exit(0);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
