import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';
import { transactions } from './drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

const client = connect({ url: process.env.DATABASE_URL });
const db = drizzle(client);

const result = await db.select().from(transactions)
  .where(and(
    eq(transactions.prefecture, '東京都'),
    eq(transactions.city, '新宿区'),
    eq(transactions.propertyType, '中古戸建')
  ))
  .limit(5);

console.log('Found', result.length, 'records');
console.log(JSON.stringify(result, null, 2));
process.exit(0);
