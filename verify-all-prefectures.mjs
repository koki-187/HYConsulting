/**
 * Verify that all 47 prefectures have transaction data in the database
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { transactions } from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

// Create database connection
const queryClient = postgres(DATABASE_URL, { ssl: 'require' });
const db = drizzle(queryClient);

// List of all 47 prefectures in Japan
const ALL_PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

async function verifyAllPrefectures() {
  console.log('='.repeat(80));
  console.log('全国47都道府県のデータ存在確認');
  console.log('='.repeat(80));
  console.log();

  const results = [];
  let totalCount = 0;
  let prefecturesWithData = 0;

  for (const prefecture of ALL_PREFECTURES) {
    try {
      const result = await db.execute(
        sql`SELECT COUNT(*) as count FROM transactions WHERE prefecture = ${prefecture}`
      );
      
      const count = parseInt(result[0].count);
      totalCount += count;
      
      if (count > 0) {
        prefecturesWithData++;
      }
      
      results.push({
        prefecture,
        count,
        hasData: count > 0
      });
      
      console.log(`${prefecture.padEnd(10)}: ${count.toLocaleString().padStart(10)} 件 ${count > 0 ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`${prefecture}: エラー - ${error.message}`);
      results.push({
        prefecture,
        count: 0,
        hasData: false,
        error: error.message
      });
    }
  }

  console.log();
  console.log('='.repeat(80));
  console.log('サマリー');
  console.log('='.repeat(80));
  console.log(`総都道府県数: ${ALL_PREFECTURES.length}`);
  console.log(`データ有り: ${prefecturesWithData} 都道府県 ✅`);
  console.log(`データ無し: ${ALL_PREFECTURES.length - prefecturesWithData} 都道府県 ❌`);
  console.log(`総レコード数: ${totalCount.toLocaleString()} 件`);
  console.log();

  // データが無い都道府県をリストアップ
  const prefecturesWithoutData = results.filter(r => !r.hasData);
  if (prefecturesWithoutData.length > 0) {
    console.log('データが無い都道府県:');
    prefecturesWithoutData.forEach(p => {
      console.log(`  - ${p.prefecture}`);
    });
  } else {
    console.log('✅ 全47都道府県のデータが存在します！');
  }

  await queryClient.end();
}

verifyAllPrefectures().catch(console.error);
