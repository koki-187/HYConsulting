import { getDb } from "./server/db";
import { transactions } from "./drizzle/schema";
import { eq, and, like, sql } from "drizzle-orm";

async function debugAssessment() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("=== 査定計算デバッグ ===\n");
  console.log("テストケース: 東京都小平市 マンション 80㎡ 築11年（2015年築）\n");

  // 1. 小平市のマンションデータを取得
  const comps = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, "東京都"),
        eq(transactions.city, "小平市"),
        eq(transactions.propertyType, "中古マンション等")
      )
    )
    .limit(100);

  console.log(`取得したコンプス数: ${comps.length}`);

  // 2. 価格データを確認
  const prices = comps.map((c) => Number(c.priceYen) || 0).filter((p) => p > 0);
  console.log(`有効な価格データ数: ${prices.length}`);

  // 3. 価格の統計
  const sorted = [...prices].sort((a, b) => a - b);
  const n = sorted.length;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const q1 = sorted[Math.floor(n / 4)];
  const q3 = sorted[Math.floor((3 * n) / 4)];
  const mean = sorted.reduce((a, b) => a + b, 0) / n;

  console.log("\n=== 価格統計（円） ===");
  console.log(`最小: ${sorted[0].toLocaleString()}円 (${(sorted[0]/10000).toFixed(0)}万円)`);
  console.log(`Q1: ${q1.toLocaleString()}円 (${(q1/10000).toFixed(0)}万円)`);
  console.log(`中央値: ${median.toLocaleString()}円 (${(median/10000).toFixed(0)}万円)`);
  console.log(`Q3: ${q3.toLocaleString()}円 (${(q3/10000).toFixed(0)}万円)`);
  console.log(`最大: ${sorted[n-1].toLocaleString()}円 (${(sorted[n-1]/10000).toFixed(0)}万円)`);
  console.log(`平均: ${mean.toLocaleString()}円 (${(mean/10000).toFixed(0)}万円)`);

  // 4. 面積でフィルタリング（80㎡ ±30%）
  const targetArea = 80;
  const filteredByArea = comps.filter((c) => {
    const compArea = Number(c.buildingAreaM2) || 0;
    return compArea >= targetArea * 0.7 && compArea <= targetArea * 1.3;
  });
  console.log(`\n面積フィルタ後 (${targetArea}㎡ ±30%): ${filteredByArea.length}件`);

  // 5. 築年数でフィルタリング（2015年 ±10年）
  const targetYear = 2015;
  const filteredByYear = comps.filter((c) => {
    if (!c.buildingYear) return true;
    return Math.abs(c.buildingYear - targetYear) <= 10;
  });
  console.log(`築年数フィルタ後 (${targetYear}年 ±10年): ${filteredByYear.length}件`);

  // 6. 両方のフィルタを適用
  const fullyFiltered = comps.filter((c) => {
    const compArea = Number(c.buildingAreaM2) || 0;
    const areaOk = compArea === 0 || (compArea >= targetArea * 0.7 && compArea <= targetArea * 1.3);
    const yearOk = !c.buildingYear || Math.abs(c.buildingYear - targetYear) <= 10;
    return areaOk && yearOk;
  });
  console.log(`両方のフィルタ後: ${fullyFiltered.length}件`);

  // 7. フィルタ後の価格統計
  const filteredPrices = fullyFiltered.map((c) => Number(c.priceYen) || 0).filter((p) => p > 0);
  if (filteredPrices.length > 0) {
    const sortedFiltered = [...filteredPrices].sort((a, b) => a - b);
    const nf = sortedFiltered.length;
    const medianFiltered = nf % 2 === 0 ? (sortedFiltered[nf / 2 - 1] + sortedFiltered[nf / 2]) / 2 : sortedFiltered[Math.floor(nf / 2)];
    
    console.log("\n=== フィルタ後の価格統計 ===");
    console.log(`最小: ${(sortedFiltered[0]/10000).toFixed(0)}万円`);
    console.log(`中央値: ${(medianFiltered/10000).toFixed(0)}万円`);
    console.log(`最大: ${(sortedFiltered[nf-1]/10000).toFixed(0)}万円`);
  }

  // 8. buildingAreaM2の値を確認
  console.log("\n=== buildingAreaM2の値確認 ===");
  const areasWithValues = comps.filter(c => c.buildingAreaM2 && Number(c.buildingAreaM2) > 0);
  console.log(`buildingAreaM2が設定されている件数: ${areasWithValues.length}/${comps.length}`);
  
  if (areasWithValues.length > 0) {
    const areas = areasWithValues.map(c => Number(c.buildingAreaM2));
    console.log(`面積範囲: ${Math.min(...areas)}㎡ ～ ${Math.max(...areas)}㎡`);
    console.log(`サンプル面積: ${areas.slice(0, 10).join(', ')}㎡`);
  }

  // 9. 生データサンプル
  console.log("\n=== 生データサンプル（10件） ===");
  comps.slice(0, 10).forEach((c, i) => {
    console.log(`${i+1}. ${c.district} | ${(Number(c.priceYen)/10000).toFixed(0)}万円 | ${c.buildingAreaM2 || 'N/A'}㎡ | ${c.buildingYear || 'N/A'}年築`);
  });

  process.exit(0);
}

debugAssessment().catch(console.error);
