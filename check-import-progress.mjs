import { getDb } from './server/db.ts';
import { aggregatedRealEstateData } from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

const db = await getDb();
const result = await db.select({ count: sql`COUNT(*)` }).from(aggregatedRealEstateData);
console.log('Total records in database:', result[0].count);
process.exit(0);
