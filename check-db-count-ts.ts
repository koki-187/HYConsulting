import { getDb } from './server/db';
import { aggregatedRealEstateData } from './drizzle/schema';
import { sql, count } from 'drizzle-orm';

async function checkDatabaseCount() {
  try {
    const db = await getDb();
    
    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(aggregatedRealEstateData);
    
    console.log('========================================');
    console.log('全国データ投入状況確認');
    console.log('========================================');
    console.log(`総レコード数: ${totalResult[0].count.toLocaleString()} 件`);
    console.log(`目標: 353,102 件`);
    console.log(`達成率: ${((totalResult[0].count / 353102) * 100).toFixed(2)}%`);
    console.log('========================================\n');
    
    // Get prefecture breakdown
    const prefectureResult = await db
      .select({
        prefecture: aggregatedRealEstateData.prefecture,
        count: count(),
      })
      .from(aggregatedRealEstateData)
      .groupBy(aggregatedRealEstateData.prefecture)
      .orderBy(aggregatedRealEstateData.prefecture)
      .limit(10);
    
    console.log('都道府県別レコード数（最初の10件）:');
    console.log('----------------------------------------');
    prefectureResult.forEach((row) => {
      console.log(`${row.prefecture}: ${row.count.toLocaleString()} 件`);
    });
    console.log('========================================\n');
    
    // Check if Tokyo, Osaka, Fukuoka data exists
    const majorCities = ['東京都', '大阪府', '福岡県'];
    console.log('主要都市データ確認:');
    console.log('----------------------------------------');
    
    for (const prefecture of majorCities) {
      const cityResult = await db
        .select({ count: count() })
        .from(aggregatedRealEstateData)
        .where(sql`${aggregatedRealEstateData.prefecture} = ${prefecture}`);
      
      console.log(`${prefecture}: ${cityResult[0].count.toLocaleString()} 件`);
    }
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

checkDatabaseCount();
