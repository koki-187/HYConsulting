const http = require('http');

console.log("🔍 査定API直接テスト開始\n");

const testData = JSON.stringify({
  propertyType: "house",
  prefecture: "東京都",
  city: "新宿区",
  location: "東京都新宿区",
  floorArea: 100,
  buildingAge: 20,
  ownerName: "テストユーザー",
  email: "test@example.com"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/trpc/assessment.submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  },
  timeout: 30000
};

console.log("📤 リクエスト送信:");
console.log("  URL: http://localhost:3000/api/trpc/assessment.submit");
console.log("  データ:", JSON.parse(testData));
console.log("");

const req = http.request(options, (res) => {
  console.log(`✅ レスポンス受信: ${res.statusCode}`);
  console.log(`ヘッダー:`, res.headers);
  console.log("");
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
    console.log("📥 データ受信中... (length:", data.length, ")");
  });
  
  res.on('end', () => {
    console.log("\n📊 完全なレスポンス:");
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ リクエストエラー: ${e.message}`);
});

req.on('timeout', () => {
  console.error('❌ タイムアウト (30秒)');
  req.destroy();
});

req.write(testData);
req.end();

console.log("⏳ レスポンス待機中...\n");
