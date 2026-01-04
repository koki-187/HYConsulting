// Test data variations
const testCases = [
  {
    name: "Test 1: Apartment in Totsuka, Excellent condition",
    data: {
      propertyType: "apartment",
      location: "横浜市戸塚区",
      buildingAge: 3,
      floorArea: 98,
      condition: "excellent",
      ownerName: "田中太郎",
      email: "tanaka@example.com",
      phone: "090-1234-5678",
    }
  },
  {
    name: "Test 2: House in Midori, Fair condition",
    data: {
      propertyType: "house",
      location: "横浜市緑区",
      buildingAge: 18,
      floorArea: 155,
      condition: "fair",
      ownerName: "山田花子",
      email: "yamada@example.com",
      phone: "090-2345-6789",
    }
  },
  {
    name: "Test 3: Apartment in Totsuka, Good condition",
    data: {
      propertyType: "apartment",
      location: "横浜市戸塚区",
      buildingAge: 7,
      floorArea: 102,
      condition: "good",
      ownerName: "佐藤次郎",
      email: "sato@example.com",
    }
  },
  {
    name: "Test 4: House in Totsuka, Poor condition",
    data: {
      propertyType: "house",
      location: "横浜市戸塚区",
      buildingAge: 25,
      floorArea: 145,
      condition: "poor",
      ownerName: "鈴木美咲",
      email: "suzuki@example.com",
    }
  },
  {
    name: "Test 5: Apartment in Midori, Excellent condition",
    data: {
      propertyType: "apartment",
      location: "横浜市緑区",
      buildingAge: 2,
      floorArea: 115,
      condition: "excellent",
      ownerName: "高橋健太",
      email: "takahashi@example.com",
      phone: "090-3456-7890",
    }
  },
  {
    name: "Test 6: Land in Totsuka",
    data: {
      propertyType: "land",
      location: "横浜市戸塚区",
      landArea: 200,
      condition: "good",
      ownerName: "伊藤由美",
      email: "ito@example.com",
    }
  },
  {
    name: "Test 7: Commercial in Totsuka",
    data: {
      propertyType: "commercial",
      location: "横浜市戸塚区",
      buildingAge: 12,
      floorArea: 300,
      condition: "good",
      ownerName: "中村隆一",
      email: "nakamura@example.com",
    }
  },
  {
    name: "Test 8: Apartment in Totsuka, Minimal data",
    data: {
      propertyType: "apartment",
      location: "横浜市戸塚区",
      ownerName: "小林美樹",
      email: "kobayashi@example.com",
    }
  },
  {
    name: "Test 9: House in Midori, Fair condition",
    data: {
      propertyType: "house",
      location: "横浜市緑区",
      buildingAge: 22,
      floorArea: 165,
      condition: "fair",
      ownerName: "渡辺勇気",
      email: "watanabe@example.com",
      phone: "090-4567-8901",
    }
  },
  {
    name: "Test 10: Apartment in Totsuka, Good condition",
    data: {
      propertyType: "apartment",
      location: "横浜市戸塚区",
      buildingAge: 6,
      floorArea: 105,
      condition: "good",
      ownerName: "山本由香",
      email: "yamamoto@example.com",
    }
  }
];

async function runTests() {
  console.log("🧪 Starting Assessment API Tests...\n");
  
  let passCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Running: ${testCase.name}`);
    
    try {
      const params = new URLSearchParams();
      params.append('input', JSON.stringify(testCase.data));
      
      const response = await fetch(`http://localhost:3000/api/trpc/assessment.submit?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.result?.data?.success) {
        console.log(`✅ PASS - ${testCase.name}`);
        console.log(`   Estimated Price: ${result.result.data.estimatedPrice || 'N/A'}万円`);
        console.log(`   Message: ${result.result.data.message}\n`);
        passCount++;
        results.push({
          test: testCase.name,
          status: "PASS",
          estimatedPrice: result.result.data.estimatedPrice,
        });
      } else if (result.error) {
        console.log(`❌ FAIL - ${testCase.name}`);
        console.log(`   Error: ${result.error.json?.message || JSON.stringify(result.error)}\n`);
        failCount++;
        results.push({
          test: testCase.name,
          status: "FAIL",
          error: result.error.json?.message,
        });
      } else {
        console.log(`❌ FAIL - ${testCase.name}`);
        console.log(`   Error: Unexpected response\n`);
        failCount++;
        results.push({
          test: testCase.name,
          status: "FAIL",
          error: "Unexpected response",
        });
      }
    } catch (error) {
      console.log(`❌ ERROR - ${testCase.name}`);
      console.log(`   Error: ${error.message}\n`);
      failCount++;
      results.push({
        test: testCase.name,
        status: "ERROR",
        error: error.message,
      });
    }
  }

  console.log("\n📊 Test Summary:");
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Success Rate: ${((passCount / testCases.length) * 100).toFixed(1)}%`);
  
  console.log("\n📋 Detailed Results:");
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.test}: ${r.status}`);
    if (r.estimatedPrice) console.log(`   Price: ${r.estimatedPrice}万円`);
    if (r.error) console.log(`   Error: ${r.error}`);
  });
}

runTests().catch(console.error);
