import mysql from 'mysql2/promise';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('小平市のデータを確認中...\n');

// 小平市のデータ件数を確認
const [countResult] = await connection.execute(
  'SELECT COUNT(*) as count FROM transactions WHERE prefecture = ? AND city = ?',
  ['東京都', '小平市']
);
console.log('小平市のデータ件数:', countResult[0].count);

// 物件種別ごとの件数を確認
const [typeResult] = await connection.execute(
  'SELECT propertyType, COUNT(*) as count FROM transactions WHERE prefecture = ? AND city = ? GROUP BY propertyType',
  ['東京都', '小平市']
);
console.log('\n物件種別ごとの件数:');
typeResult.forEach(row => {
  console.log(`  ${row.propertyType}: ${row.count}件`);
});

// マンションのサンプルデータを確認
const [sampleResult] = await connection.execute(
  'SELECT * FROM transactions WHERE prefecture = ? AND city = ? AND propertyType = ? LIMIT 3',
  ['東京都', '小平市', '中古マンション等']
);
console.log('\nマンションのサンプルデータ:');
sampleResult.forEach((row, index) => {
  console.log(`\n  サンプル ${index + 1}:`);
  console.log(`    物件種別: ${row.propertyType}`);
  console.log(`    市区町村: ${row.city}`);
  console.log(`    地区名: ${row.district || 'なし'}`);
  console.log(`    取引価格: ${row.priceYen ? row.priceYen.toLocaleString() : 'なし'}円`);
  console.log(`    建物面積: ${row.buildingAreaM2 || 'なし'}㎡`);
  console.log(`    築年: ${row.buildingYear || 'なし'}`);
  console.log(`    最寄駅: ${row.nearestStation || 'なし'}`);
  console.log(`    駅徒歩: ${row.stationDistanceMin || 'なし'}分`);
});

await connection.end();
