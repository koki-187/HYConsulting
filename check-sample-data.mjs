import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('既存データのサンプル確認\n');

// Sample data from Tokyo
const sampleResult = await db.execute(sql`
  SELECT * FROM aggregated_real_estate_data 
  WHERE prefecture = '東京都'
  LIMIT 3
`);

console.log('東京都のサンプルデータ:');
console.log('=' .repeat(100));
for (const row of sampleResult[0]) {
  console.log('\n物件タイプ:', row.propertyType);
  console.log('都道府県:', row.prefecture);
  console.log('市区町村:', row.city);
  console.log('地区:', row.district);
  console.log('築年数グループ:', row.buildingAgeGroup);
  console.log('取引件数:', row.transactionCount);
  console.log('平均価格:', row.averagePriceYen?.toLocaleString(), '円');
  console.log('坪単価:', row.pricePerTsubo?.toLocaleString(), '円/坪');
  console.log('データセットID:', row.datasetVersionId);
  console.log('-'.repeat(100));
}

await connection.end();
