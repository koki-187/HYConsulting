import { calculateAssessment } from "./server/assessment.ts";

console.log("=== 査定APIテスト開始 ===");
console.log("入力データ:");
console.log("- 都道府県: 東京都");
console.log("- 市区町村: 新宿区");
console.log("- 物件種別: 戸建て (house)");
console.log("- 面積: 100㎡");
console.log("- 築年数: 10年");
console.log("");

try {
  const result = await calculateAssessment({
    prefecture: "東京都",
    city: "新宿区",
    propertyType: "house",
    landAreaM2: 100,
    buildingYear: 2016, // 2026 - 10 = 2016
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
