// Test assessment API - Yokohama Nishi-ku
const testData = {
  propertyType: "condo",
  prefecture: "神奈川県",
  city: "横浜市西区",
  location: "横浜市西区内",
  buildingAge: 8,  // 築8年
  floorArea: 70,   // 70㎡
};

async function testAssessment() {
  try {
    const response = await fetch('http://localhost:3000/api/trpc/assessment.submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: testData
      })
    });

    const result = await response.json();
    console.log("=== 横浜市西区 マンション 70㎡ 築8年 ===");
    
    if (result.result?.data?.json) {
      const data = result.result.data.json;
      console.log(`推定価格（低）: ${(data.estimatedLowYen / 10000).toFixed(0)}万円`);
      console.log(`推定価格（中）: ${(data.estimatedMidYen / 10000).toFixed(0)}万円`);
      console.log(`推定価格（高）: ${(data.estimatedHighYen / 10000).toFixed(0)}万円`);
      console.log(`使用したコンプス数: ${data.compsUsedCount}`);
      console.log(`築年数調整: ${((data.adjustmentFactors.buildingYearAdjustment - 1) * 100).toFixed(0)}%`);
    } else {
      console.log("Error:", JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testAssessment();
