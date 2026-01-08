import { calculateAssessment } from './server/assessment';

async function testCalculateAssessment() {
  console.log("Testing calculateAssessment function...");
  
  const input = {
    prefecture: "東京都",
    city: "新宿区",
    propertyType: "house" as const,
    landAreaM2: 100,
    buildingAreaM2: 100,
    buildingYear: 2014, // 10 years old
    stationDistanceMin: undefined,
  };
  
  console.log("Input:", JSON.stringify(input, null, 2));
  
  try {
    const result = await calculateAssessment(input);
    console.log("\n✅ Success!");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Error:");
    console.error(error);
  }
}

testCalculateAssessment().catch(console.error);
