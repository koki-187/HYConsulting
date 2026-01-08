import { calculateAssessment } from "./server/assessment";

async function testKodairaAssessment() {
  console.log("🔍 Testing assessment for 小平市...");
  const startTime = Date.now();
  
  try {
    const result = await calculateAssessment({
      prefecture: "東京都",
      city: "小平市",
      propertyType: "house",
      buildingAreaM2: 80,
      buildingYear: 2015,
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log("\n✅ Assessment completed successfully!");
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log("\n📊 Results:");
    console.log(`  Estimated Low:  ¥${result.estimatedLowYen.toLocaleString()}`);
    console.log(`  Estimated Mid:  ¥${result.estimatedMidYen.toLocaleString()}`);
    console.log(`  Estimated High: ¥${result.estimatedHighYen.toLocaleString()}`);
    console.log(`  Comps Used: ${result.compsUsedCount}`);
    console.log(`  Method: ${result.method}`);
    console.log(`\n💬 Explanation:\n${result.explanation}`);
    
    // Check if prices are reasonable (not in 億円 range)
    const midPriceManYen = Math.round(result.estimatedMidYen / 10000);
    console.log(`\n🏷️  Price in 万円: ${midPriceManYen.toLocaleString()}万円`);
    
    if (midPriceManYen > 10000) {
      console.error("\n❌ ERROR: Price is too high! (over 1億円)");
      console.error("This suggests a data or calculation error.");
    } else if (midPriceManYen < 1000) {
      console.error("\n⚠️  WARNING: Price seems low for Tokyo property");
    } else {
      console.log("\n✅ Price range seems reasonable");
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.error(`\n❌ Assessment failed after ${duration}ms`);
    console.error("Error:", error);
  }
}

testKodairaAssessment().then(() => {
  console.log("\n✅ Test completed");
  process.exit(0);
}).catch((error) => {
  console.error("\n❌ Test failed:", error);
  process.exit(1);
});
