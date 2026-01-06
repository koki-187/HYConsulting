/**
 * Test Assessment with Currently Available Data
 */

import { calculateAssessment } from "./server/assessment-aggregated.js";

const testCases = [
  {
    name: "北海道 札幌市中央区 土地",
    input: {
      prefecture: "北海道",
      city: "札幌市中央区",
      propertyType: "land",
      landAreaM2: 200,
    },
  },
  {
    name: "東京都 新宿区 マンション",
    input: {
      prefecture: "東京都",
      city: "新宿区",
      propertyType: "condo",
      buildingAreaM2: 70,
      buildingYear: 2010,
    },
  },
  {
    name: "東京都 港区 一戸建て",
    input: {
      prefecture: "東京都",
      city: "港区",
      propertyType: "house",
      buildingAreaM2: 120,
      landAreaM2: 180,
      buildingYear: 2005,
    },
  },
];

async function runTests() {
  console.log("\n" + "=".repeat(80));
  console.log("現在利用可能なデータでの査定テスト");
  console.log("=".repeat(80) + "\n");

  let successCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    console.log(`\n${"─".repeat(80)}`);
    console.log(`テストケース: ${testCase.name}`);
    console.log(`${"─".repeat(80)}`);

    try {
      const result = await calculateAssessment(testCase.input);

      console.log("\n✅ 査定成功");
      console.log(`\n📋 査定結果:`);
      console.log(`  推定価格帯: ¥${result.estimatedLowYen.toLocaleString()} - ¥${result.estimatedHighYen.toLocaleString()}`);
      console.log(`  中央値: ¥${result.estimatedMidYen.toLocaleString()}`);
      console.log(`  使用データ: ${result.compsUsedCount}件 (${result.marketAnalysis.transactionCount}取引)`);
      console.log(`  平均坪単価: ¥${result.marketAnalysis.avgPricePerM2.toLocaleString()}/m²`);
      console.log(`\n📝 説明:`);
      console.log(`  ${result.explanation}`);
      
      successCount++;
    } catch (error) {
      console.log("\n❌ 査定失敗");
      console.log(`  エラー: ${error.message}`);
      failCount++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("テスト結果サマリー");
  console.log("=".repeat(80));
  console.log(`成功: ${successCount}/${testCases.length}`);
  console.log(`失敗: ${failCount}/${testCases.length}`);
  console.log("=".repeat(80) + "\n");
}

runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
