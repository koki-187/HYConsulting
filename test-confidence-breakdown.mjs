/**
 * Test script for confidence breakdown calculation
 * Tests the assessment API with Yokohama Totsuka data
 */

const API_URL = "http://localhost:3000/trpc/assessment.submit";

const testData = {
  propertyType: "house",
  prefecture: "神奈川県",
  city: "横浜市戸塚区",
  area: 100,
  buildingYear: 2010,
  stationName: "戸塚",
  walkingMinutes: 10,
  wantContact: false
};

console.log("🧪 Testing Confidence Breakdown Calculation");
console.log("=" .repeat(60));
console.log("Test Data:", JSON.stringify(testData, null, 2));
console.log("=" .repeat(60));

try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testData),
  });

  if (!response.ok) {
    console.error("❌ API request failed:", response.status, response.statusText);
    const text = await response.text();
    console.error("Response:", text);
    process.exit(1);
  }

  const result = await response.json();
  console.log("\n✅ API Response received");
  console.log("=" .repeat(60));
  
  // Check if confidenceBreakdown exists
  if (result.result?.data?.confidenceBreakdown) {
    const breakdown = result.result.data.confidenceBreakdown;
    console.log("\n📊 Confidence Breakdown:");
    console.log(`  Total Score: ${breakdown.totalScore}%`);
    console.log(`  Data Volume Score: ${breakdown.dataVolumeScore}% - ${breakdown.dataVolumeDetails}`);
    console.log(`  Location Match Score: ${breakdown.locationMatchScore}% - ${breakdown.locationMatchDetails}`);
    console.log(`  Building Age Similarity Score: ${breakdown.buildingAgeSimilarityScore}% - ${breakdown.buildingAgeSimilarityDetails}`);
    console.log(`  Property Type Match Score: ${breakdown.propertyTypeMatchScore}% - ${breakdown.propertyTypeMatchDetails}`);
    
    // Validate total score
    const expectedTotal = breakdown.dataVolumeScore + breakdown.locationMatchScore + 
                         breakdown.buildingAgeSimilarityScore + breakdown.propertyTypeMatchScore;
    
    if (breakdown.totalScore === expectedTotal) {
      console.log("\n✅ Total score calculation is correct");
    } else {
      console.error(`\n❌ Total score mismatch: ${breakdown.totalScore} !== ${expectedTotal}`);
      process.exit(1);
    }
    
    // Validate score ranges
    const scores = [
      { name: "Data Volume", value: breakdown.dataVolumeScore },
      { name: "Location Match", value: breakdown.locationMatchScore },
      { name: "Building Age Similarity", value: breakdown.buildingAgeSimilarityScore },
      { name: "Property Type Match", value: breakdown.propertyTypeMatchScore }
    ];
    
    let allValid = true;
    for (const score of scores) {
      if (score.value < 0 || score.value > 25) {
        console.error(`\n❌ ${score.name} score out of range: ${score.value} (should be 0-25)`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log("✅ All individual scores are within valid range (0-25%)");
    } else {
      process.exit(1);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ All confidence breakdown tests passed!");
    console.log("=".repeat(60));
    
  } else {
    console.error("\n❌ confidenceBreakdown not found in API response");
    console.log("Full response:", JSON.stringify(result, null, 2));
    process.exit(1);
  }
  
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  process.exit(1);
}
