import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { aggregatedRealEstateData } from './drizzle/schema';
import { sql } from 'drizzle-orm';

async function checkCoverage() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  console.log('Checking database coverage by prefecture...\n');

  const results = await db
    .select({
      prefecture: aggregatedRealEstateData.prefecture,
      recordCount: sql<number>`COUNT(*)`,
      totalTransactions: sql<number>`SUM(${aggregatedRealEstateData.transactionCount})`,
    })
    .from(aggregatedRealEstateData)
    .groupBy(aggregatedRealEstateData.prefecture)
    .orderBy(aggregatedRealEstateData.prefecture);

  console.log('Prefecture Coverage:');
  console.log('='.repeat(70));
  results.forEach(row => {
    console.log(`${row.prefecture.padEnd(10)} | Records: ${String(row.recordCount).padStart(6)} | Transactions: ${String(row.totalTransactions).padStart(8)}`);
  });
  console.log('='.repeat(70));
  console.log(`Total Prefectures: ${results.length} / 47`);
  console.log(`Total Records: ${results.reduce((sum, r) => sum + Number(r.recordCount), 0)}`);
  console.log(`Total Transactions: ${results.reduce((sum, r) => sum + Number(r.totalTransactions), 0)}`);

  const allPrefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const existingPrefectures = new Set(results.map(r => r.prefecture));
  const missingPrefectures = allPrefectures.filter(p => !existingPrefectures.has(p));

  if (missingPrefectures.length > 0) {
    console.log('\nMissing Prefectures:');
    console.log('='.repeat(70));
    missingPrefectures.forEach(p => console.log(`  - ${p}`));
  } else {
    console.log('\n✅ All 47 prefectures are covered!');
  }

  await connection.end();
}

checkCoverage().catch(console.error);
