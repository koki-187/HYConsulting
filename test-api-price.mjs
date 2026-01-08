// Test the assessment API directly
const testCases = [
  {
    name: "小平市マンション 80㎡ 築11年",
    data: {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "condo",
      floorArea: 80,
      buildingAge: 11,
      walkingMinutes: 10
    }
  },
  {
    name: "横浜市西区マンション 70㎡ 築8年",
    data: {
      prefecture: "神奈川県",
      city: "横浜市西区",
      propertyType: "condo",
      floorArea: 70,
      buildingAge: 8,
      walkingMinutes: 5
    }
  },
  {
    name: "小平市戸建て 80㎡ 築11年",
    data: {
      prefecture: "東京都",
      city: "小平市",
      propertyType: "house",
      floorArea: 80,
      buildingAge: 11,
      walkingMinutes: 10
    }
  }
];

async function testAssessment() {
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.name} ===`);
    try {
      const response = await fetch('http://localhost:3000/api/trpc/assessment.calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: testCase.data
        })
      });
      
      const result = await response.json();
      console.log('Response:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

testAssessment();
