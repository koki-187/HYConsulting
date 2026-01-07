import { calculateAssessment } from "./server/assessment-aggregated.ts";

console.log("=== 査定APIテスト開始 ===");
console.log("入力データ:");
console.log("- 都道府県: 東京都");
console.log("- 市区町村: 千代田区");
console.log("- 物件種別: マンション (condo)");
console.log("- 面積: 70㎡");
console.log("- 築年数: 15年");
console.log("");

try {
  const result = await calculateAssessment({
    prefecture: "東京都",
    city: "千代田区",
    propertyType: "condo",
    buildingAreaM2: 70,
    buildingYear: 2011, // 2026 - 15 = 2011
  });
  
  console.log("✅ 査定成功！");
  console.log("");
  console.log("結果:");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("❌ 査定エラー:");
  console.error(error);
  console.error("");
  console.error("スタックトレース:");
  console.error(error.stack);
}
