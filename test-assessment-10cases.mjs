import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/trpc';

const testCases = [
  {
    name: "Test 1: Apartment in Totsuka, Good condition",
    input: {
      propertyType: "apartment",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 8,
      floorArea: 95,
      condition: "good",
      ownerName: "田中太郎",
      email: "tanaka@example.com",
      phone: "09012345678",
    }
  },
  {
    name: "Test 2: House in Midori, Fair condition",
    input: {
      propertyType: "house",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      buildingAge: 20,
      floorArea: 160,
      condition: "fair",
      ownerName: "佐藤花子",
      email: "sato@example.com",
      phone: "09087654321",
    }
  },
  {
    name: "Test 3: Land in Totsuka",
    input: {
      propertyType: "land",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 0,
      floorArea: 200,
      condition: "excellent",
      ownerName: "鈴木次郎",
      email: "suzuki@example.com",
    }
  },
  {
    name: "Test 4: Commercial in Midori",
    input: {
      propertyType: "commercial",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      buildingAge: 10,
      floorArea: 300,
      condition: "good",
      ownerName: "山田太郎",
      email: "yamada@example.com",
    }
  },
  {
    name: "Test 5: Apartment Excellent condition",
    input: {
      propertyType: "apartment",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 5,
      floorArea: 85,
      condition: "excellent",
      ownerName: "伊藤美咲",
      email: "ito@example.com",
    }
  },
  {
    name: "Test 6: House Poor condition",
    input: {
      propertyType: "house",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 35,
      floorArea: 120,
      condition: "poor",
      ownerName: "渡辺健太",
      email: "watanabe@example.com",
    }
  },
  {
    name: "Test 7: Apartment Minimal data",
    input: {
      propertyType: "apartment",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      ownerName: "高橋由美",
      email: "takahashi@example.com",
    }
  },
  {
    name: "Test 8: Land Large area",
    input: {
      propertyType: "land",
      prefecture: "神奈川県",
      city: "横浜市緑区",
      location: "横浜市緑区",
      floorArea: 500,
      condition: "good",
      ownerName: "中村花子",
      email: "nakamura@example.com",
    }
  },
  {
    name: "Test 9: House with phone",
    input: {
      propertyType: "house",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 12,
      floorArea: 140,
      condition: "good",
      ownerName: "小林太郎",
      email: "kobayashi@example.com",
      phone: "04512345678",
    }
  },
  {
    name: "Test 10: Commercial Large building",
    input: {
      propertyType: "commercial",
      prefecture: "神奈川県",
      city: "横浜市戸塚区",
      location: "横浜市戸塚区",
      buildingAge: 15,
      floorArea: 500,
      condition: "fair",
      ownerName: "石田次郎",
      email: "ishida@example.com",
    }
  },
];

async function runTests() {
  console.log("Starting 10 Assessment API Tests...\n");
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const response = await fetch(`${BASE_URL}/assessment.submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: testCase.input,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.result?.data?.success) {
        console.log(`✓ ${testCase.name}`);
        console.log(`  Message: ${data.result.data.message}`);
        console.log(`  Estimated Price: ${data.result.data.estimatedPrice}万円\n`);
        passed++;
      } else {
        console.log(`✗ ${testCase.name}`);
        console.log(`  Error: ${JSON.stringify(data)}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ ${testCase.name}`);
      console.log(`  Error: ${error.message}\n`);
      failed++;
    }
  }

  console.log(`\n========== TEST RESULTS ==========`);
  console.log(`Passed: ${passed}/10`);
  console.log(`Failed: ${failed}/10`);
  console.log(`Success Rate: ${(passed/10*100).toFixed(1)}%`);
}

runTests().catch(console.error);
