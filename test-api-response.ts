import { calculateAssessment } from "./server/assessment";

async function main() {
  console.log("=== API Response Test ===\n");

  const input = {
    propertyType: "house",
    prefecture: "東京都",
    city: "小平市",
    location: "小平市",
    buildingAreaM2: 80,
    buildingYear: 2015,
  };

  console.log("Input:", JSON.stringify(input, null, 2));

  const assessmentResult = await calculateAssessment(input);

  console.log("\n=== Assessment Result ===");
  console.log(`estimatedLowYen: ${assessmentResult.estimatedLowYen}`);
  console.log(`estimatedHighYen: ${assessmentResult.estimatedHighYen}`);
  console.log(`estimatedMidYen: ${assessmentResult.estimatedMidYen}`);

  console.log("\n=== What routers.ts returns ===");
  console.log(`estimatedLowYen: ${assessmentResult.estimatedLowYen} (円)`);
  console.log(`estimatedHighYen: ${assessmentResult.estimatedHighYen} (円)`);
  console.log(`estimatedPrice: ${Math.round(assessmentResult.estimatedMidYen / 10000)} (万円)`);

  console.log("\n=== What frontend displays ===");
  const formatPrice = (price: number) => {
    const manYen = Math.round(price / 10000);
    return `${manYen.toLocaleString('ja-JP')}万円`;
  };

  console.log(`Low: ${formatPrice(assessmentResult.estimatedLowYen)}`);
  console.log(`High: ${formatPrice(assessmentResult.estimatedHighYen)}`);
  console.log(`Mid: ${formatPrice(assessmentResult.estimatedMidYen)}`);

  console.log("\n=== Expected vs Actual ===");
  console.log(`Expected: 2,300万円 ~ 4,400万円`);
  console.log(`Actual (from browser): 153,103万円 ~ 207,139万円`);
  console.log(`\nDifference factor: ${153103 / (assessmentResult.estimatedLowYen / 10000)}`);
}

main().catch(console.error);
