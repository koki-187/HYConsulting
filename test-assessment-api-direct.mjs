import { calculateAssessment } from "./server/assessment.ts";

console.log("🔍 Testing assessment API directly...\n");

try {
  const input = {
    prefecture: "東京都",
    city: "渋谷区",
    propertyType: "condo",
    landAreaM2: undefined,
    buildingAreaM2: undefined,
    buildingYear: undefined,
    stationDistanceMin: undefined,
  };

  console.log("Input:", JSON.stringify(input, null, 2));
  console.log("\n⏳ Calculating assessment...\n");

  const result = await calculateAssessment(input);

  console.log("✅ Assessment completed successfully!");
  console.log("\nResult:");
  console.log("- Estimated Low: ¥" + result.estimatedLowYen.toLocaleString());
  console.log("- Estimated Mid: ¥" + result.estimatedMidYen.toLocaleString());
  console.log("- Estimated High: ¥" + result.estimatedHighYen.toLocaleString());
  console.log("- Comps Used: " + result.compsUsedCount);
  console.log("- Method: " + result.method);
  console.log("- Explanation: " + result.explanation.substring(0, 200) + "...");
} catch (error) {
  console.error("❌ Assessment failed:", error.message);
  console.error("Stack:", error.stack);
}
