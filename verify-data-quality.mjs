import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('=' .repeat(100));
console.log('データ品質チェック');
console.log('=' .repeat(100));

// Check 1: Total records
const totalResult = await db.execute(sql`SELECT COUNT(*) as total FROM aggregated_real_estate_data`);
const totalRecords = totalResult[0][0].total;
console.log(`\n1. 総レコード数: ${totalRecords.toLocaleString()} 件`);

// Check 2: Prefecture coverage (should be 47)
const prefResult = await db.execute(sql`SELECT COUNT(DISTINCT prefecture) as count FROM aggregated_real_estate_data`);
const prefCount = prefResult[0][0].count;
console.log(`\n2. 都道府県カバレッジ: ${prefCount} / 47`);
if (prefCount === 47) {
  console.log('   ✓ 全47都道府県のデータが存在します');
} else {
  console.log('   ✗ 一部の都道府県のデータが欠けています');
}

// Check 3: Property type distribution
console.log('\n3. 物件タイプ別レコード数:');
const typeResult = await db.execute(sql`
  SELECT propertyType, COUNT(*) as count 
  FROM aggregated_real_estate_data 
  GROUP BY propertyType 
  ORDER BY count DESC
`);
for (const row of typeResult[0]) {
  console.log(`   ${row.propertyType.padEnd(15)}: ${row.count.toLocaleString().padStart(10)} 件`);
}

// Check 4: Building age group distribution
console.log('\n4. 築年数グループ別レコード数:');
const ageResult = await db.execute(sql`
  SELECT buildingAgeGroup, COUNT(*) as count 
  FROM aggregated_real_estate_data 
  GROUP BY buildingAgeGroup 
  ORDER BY count DESC
`);
for (const row of ageResult[0]) {
  console.log(`   ${row.buildingAgeGroup.padEnd(15)}: ${row.count.toLocaleString().padStart(10)} 件`);
}

// Check 5: Data quality - check for nulls or invalid values
console.log('\n5. データ品質チェック:');

const nullCheckResult = await db.execute(sql`
  SELECT 
    SUM(CASE WHEN propertyType IS NULL OR propertyType = '' THEN 1 ELSE 0 END) as null_property_type,
    SUM(CASE WHEN prefecture IS NULL OR prefecture = '' THEN 1 ELSE 0 END) as null_prefecture,
    SUM(CASE WHEN city IS NULL OR city = '' THEN 1 ELSE 0 END) as null_city,
    SUM(CASE WHEN averagePriceYen <= 0 THEN 1 ELSE 0 END) as invalid_price,
    SUM(CASE WHEN transactionCount <= 0 THEN 1 ELSE 0 END) as invalid_count
  FROM aggregated_real_estate_data
`);

const nullCheck = nullCheckResult[0][0];
console.log(`   物件タイプ NULL: ${nullCheck.null_property_type} 件`);
console.log(`   都道府県 NULL: ${nullCheck.null_prefecture} 件`);
console.log(`   市区町村 NULL: ${nullCheck.null_city} 件`);
console.log(`   無効な価格: ${nullCheck.invalid_price} 件`);
console.log(`   無効な取引件数: ${nullCheck.invalid_count} 件`);

if (nullCheck.null_property_type === 0 && nullCheck.null_prefecture === 0 && 
    nullCheck.null_city === 0 && nullCheck.invalid_price === 0 && nullCheck.invalid_count === 0) {
  console.log('   ✓ データ品質に問題はありません');
} else {
  console.log('   ✗ データ品質に問題があります');
}

// Check 6: Sample data from different prefectures
console.log('\n6. サンプルデータ確認（各都道府県から1件ずつ）:');
const samplePrefectures = ['東京都', '大阪府', '神奈川県', '愛知県', '北海道', '福岡県', '沖縄県'];

for (const pref of samplePrefectures) {
  const sampleResult = await db.execute(sql`
    SELECT prefecture, city, district, propertyType, buildingAgeGroup, 
           transactionCount, averagePriceYen, pricePerTsubo
    FROM aggregated_real_estate_data 
    WHERE prefecture = ${pref}
    LIMIT 1
  `);
  
  if (sampleResult[0].length > 0) {
    const sample = sampleResult[0][0];
    console.log(`\n   ${pref}:`);
    console.log(`     市区町村: ${sample.city} ${sample.district}`);
    console.log(`     物件タイプ: ${sample.propertyType}`);
    console.log(`     築年数: ${sample.buildingAgeGroup}`);
    console.log(`     取引件数: ${sample.transactionCount} 件`);
    console.log(`     平均価格: ${sample.averagePriceYen.toLocaleString()} 円`);
    console.log(`     坪単価: ${sample.pricePerTsubo.toLocaleString()} 円/坪`);
  } else {
    console.log(`\n   ${pref}: データなし`);
  }
}

// Check 7: Price range validation
console.log('\n7. 価格範囲の検証:');
const priceRangeResult = await db.execute(sql`
  SELECT 
    MIN(averagePriceYen) as min_price,
    MAX(averagePriceYen) as max_price,
    AVG(averagePriceYen) as avg_price,
    MIN(pricePerTsubo) as min_tsubo,
    MAX(pricePerTsubo) as max_tsubo,
    AVG(pricePerTsubo) as avg_tsubo
  FROM aggregated_real_estate_data
`);

const priceRange = priceRangeResult[0][0];
console.log(`   最低価格: ${priceRange.min_price.toLocaleString()} 円`);
console.log(`   最高価格: ${priceRange.max_price.toLocaleString()} 円`);
console.log(`   平均価格: ${Math.round(priceRange.avg_price).toLocaleString()} 円`);
console.log(`   最低坪単価: ${priceRange.min_tsubo.toLocaleString()} 円/坪`);
console.log(`   最高坪単価: ${priceRange.max_tsubo.toLocaleString()} 円/坪`);
console.log(`   平均坪単価: ${Math.round(priceRange.avg_tsubo).toLocaleString()} 円/坪`);

console.log('\n' + '=' .repeat(100));
console.log('データ品質チェック完了');
console.log('=' .repeat(100));

await connection.end();
