/**
 * Test Aggregated Assessment Logic
 * Tests the new assessment calculation using aggregated data
 */

import { calculateAssessment } from "./server/assessment-aggregated.js";

const testCases = [
  {
    name: "札幌市中央区 マンション",
    input: {
      prefecture: "北海道",
      city: "札幌市中央区",
      propertyType: "condo",
      buildingAreaM2: 70,
      buildingYear: 2010,
    },
  },
  {
    name: "札幌市北区 一戸建て",
    input: {
      prefecture: "北海道",
      city: "札幌市北区",
      propertyType: "house",
      buildingAreaM2: 100,
      landAreaM2: 150,
      buildingYear: 2005,
    },
  },
  {
    name: "札幌市 土地",
    input: {
      prefecture: "北海道",
      city: "札幌市中央区",
      propertyType: "land",
      landAreaM2: 200,
    },
  },
];

async function runTests() {
  console.log("\n" + "=".repeat(80));
  console.log("集計データ査定ロジック テスト");
  console.log("=".repeat(80) + "\n");

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
      console.log(`  計算手法: ${result.method} (${result.methodVersion})`);
      console.log(`\n📝 説明:`);
      console.log(`  ${result.explanation}`);
      console.log(`\n🔧 補正係数:`);
      console.log(`  築年数補正: ${(result.adjustmentFactors.buildingYearAdjustment * 100).toFixed(1)}%`);
      console.log(`  面積補正: ${(result.adjustmentFactors.areaAdjustment * 100).toFixed(1)}%`);
      console.log(`\n📈 将来予測:`);
      console.log(`  1年後: ¥${result.forecastAnalysis.forecast1Year.toLocaleString()}`);
      console.log(`  3年後: ¥${result.forecastAnalysis.forecast3Year.toLocaleString()}`);
      console.log(`  5年後: ¥${result.forecastAnalysis.forecast5Year.toLocaleString()}`);
    } catch (error) {
      console.log("\n❌ 査定失敗");
      console.log(`  エラー: ${error.message}`);
      if (error.stack) {
        console.log(`\nスタックトレース:`);
        console.log(error.stack);
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("テスト完了");
  console.log("=".repeat(80) + "\n");
}

runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
