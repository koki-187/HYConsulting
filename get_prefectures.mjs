import { getDb } from './server/db.ts';
import { aggregatedRealEstateData } from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

const db = await getDb();

const result = await db.select({
  prefecture: aggregatedRealEstateData.prefecture,
  record_count: sql`COUNT(*)`.as('record_count'),
  city_count: sql`COUNT(DISTINCT ${aggregatedRealEstateData.city})`.as('city_count'),
  total_transactions: sql`SUM(${aggregatedRealEstateData.transactionCount})`.as('total_transactions')
})
.from(aggregatedRealEstateData)
.groupBy(aggregatedRealEstateData.prefecture)
.orderBy(aggregatedRealEstateData.prefecture);

console.log('都道府県,レコード数,市区町村数,総取引件数');
result.forEach(row => {
  console.log(`${row.prefecture},${row.record_count},${row.city_count},${row.total_transactions}`);
});

console.log(`\n総都道府県数: ${result.length}`);

process.exit(0);
