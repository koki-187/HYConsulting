import { calculateAssessment } from "./server/assessment";

async function testAssessment() {
  try {
    console.log("=== Testing Full Assessment Calculation ===\n");

    const input = {
      propertyType: "戸建て",
      prefecture: "東京都",
      city: "小平市",
      location: undefined,
      buildingAge: 2015,
      floorArea: 80,
      landArea: undefined,
      stationDistanceMin: undefined,
      condition: undefined,
    };

    console.log("Input:");
    console.log(JSON.stringify(input, null, 2));
    console.log("");

    const result = await calculateAssessment(input);

    console.log("Assessment Result:");
    console.log(`  estimatedLowYen: ${result.estimatedLowYen}`);
    console.log(`  estimatedHighYen: ${result.estimatedHighYen}`);
    console.log(`  estimatedMidYen: ${result.estimatedMidYen}`);
    console.log(`  estimatedLowYen (万円): ${result.estimatedLowYen / 10000}`);
    console.log(`  estimatedHighYen (万円): ${result.estimatedHighYen / 10000}`);
    console.log(`  estimatedMidYen (万円): ${result.estimatedMidYen / 10000}`);
    console.log(`  explanation: ${result.explanation}`);
    console.log(`  compsUsedCount: ${result.compsUsedCount}`);
    console.log("");

    // Check if values are abnormally large
    if (result.estimatedLowYen > 1000000000) {
      console.log("⚠️  WARNING: estimatedLowYen is abnormally large!");
      console.log(`   Value: ${result.estimatedLowYen}`);
      console.log(`   This suggests a calculation error or data issue.`);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

testAssessment();
