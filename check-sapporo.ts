import { getDb } from './server/db.js';

const db = await getDb();

const result = await db.execute(`
  SELECT COUNT(*) as count, city
  FROM aggregated_real_estate_data
  WHERE prefecture = '北海道' AND city LIKE '%札幌%'
  GROUP BY city
  LIMIT 10
`);

console.log('札幌市データ確認:');
console.log(JSON.stringify(result.rows, null, 2));

const total = await db.execute(`
  SELECT COUNT(*) as count
  FROM aggregated_real_estate_data
  WHERE prefecture = '北海道'
`);

console.log('\n北海道総データ数:', total.rows[0]);

process.exit(0);
