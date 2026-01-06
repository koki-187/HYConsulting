import { db } from './server/db.ts';
import { mlitRealEstateData } from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

const result = await db.select({
  prefecture: mlitRealEstateData.prefecture,
  count: sql`count(*)`.mapWith(Number)
}).from(mlitRealEstateData).groupBy(mlitRealEstateData.prefecture).orderBy(sql`count(*) DESC`);

console.log('Current database records by prefecture:');
result.forEach(r => console.log(`${r.prefecture}: ${r.count} records`));

process.exit(0);
