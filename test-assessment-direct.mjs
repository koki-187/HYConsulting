import { db } from './server/db.js';
import { transactions } from './drizzle/schema.js';
import { eq, and, sql } from 'drizzle-orm';

async function testAssessment() {
  try {
    console.log('=== 査定APIテスト開始 ===');
    console.log('入力データ:');
    console.log('- 都道府県: 東京都');
    console.log('- 市区町村: 千代田区');
    console.log('- 物件種別: マンション');
    console.log('- 面積: 60㎡');
    console.log('- 築年数: 15年');
    console.log('');
    
    // データベースから千代田区のマンションデータを取得
    const result = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.prefecture, '東京都'),
          eq(transactions.city, '千代田区'),
          eq(transactions.propertyType, '中古マンション等')
        )
      )
      .limit(10);
    
    console.log(`✅ データ取得成功: ${result.length}件`);
    
    if (result.length > 0) {
      console.log('\nサンプルデータ:');
      console.log(JSON.stringify(result[0], null, 2));
      
      // 価格の中央値を計算
      const prices = result
        .map(r => r.priceYen)
        .filter(p => p != null && p > 0)
        .sort((a, b) => Number(a) - Number(b));
      
      if (prices.length > 0) {
        const medianPrice = prices[Math.floor(prices.length / 2)];
        console.log(`\n中央値: ${Number(medianPrice).toLocaleString()}円`);
      }
    } else {
      console.log('❌ データが見つかりませんでした');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    console.error('スタック:', error.stack);
    process.exit(1);
  }
}

testAssessment();
