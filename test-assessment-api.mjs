// Test assessment API with correct parameters
const testData = {
  propertyType: "condo",
  prefecture: "東京都",
  city: "小平市",
  location: "小平市内",
  buildingAge: 11,  // 築11年
  floorArea: 80,    // 80㎡
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
    console.log("=== API Response ===");
    console.log(JSON.stringify(result, null, 2));

    if (result.result?.data?.json) {
      const data = result.result.data.json;
      console.log("\n=== 査定結果 ===");
      console.log(`推定価格（低）: ${data.estimatedLowYen ? (data.estimatedLowYen / 10000).toFixed(0) : 'N/A'}万円`);
      console.log(`推定価格（中）: ${data.estimatedMidYen ? (data.estimatedMidYen / 10000).toFixed(0) : 'N/A'}万円`);
      console.log(`推定価格（高）: ${data.estimatedHighYen ? (data.estimatedHighYen / 10000).toFixed(0) : 'N/A'}万円`);
      console.log(`使用したコンプス数: ${data.compsUsedCount || 'N/A'}`);
      console.log(`調整係数:`, data.adjustmentFactors || 'N/A');
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testAssessment();
