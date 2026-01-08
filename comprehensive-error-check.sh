#!/bin/bash

echo "🔍 全国不動産査定システム - 包括的エラーチェック"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. データベース接続チェック
echo "📊 1. データベース接続チェック"
node -e "
const mysql2 = require('mysql2/promise');
(async () => {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const connection = await mysql2.createConnection({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      ssl: { rejectUnauthorized: true }
    });
    console.log('   ✅ データベース接続: 正常');
    await connection.end();
  } catch (e) {
    console.log('   ❌ データベース接続エラー:', e.message);
    process.exit(1);
  }
})();
" || exit 1

echo ""

# 2. データベースレコード件数チェック
echo "📊 2. データベースレコード件数チェック"
node -e "
const mysql2 = require('mysql2/promise');
(async () => {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const connection = await mysql2.createConnection({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      ssl: { rejectUnauthorized: true }
    });
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    const count = rows[0].count;
    console.log(\`   ✅ 総レコード数: \${count.toLocaleString('ja-JP')}件\`);
    if (count < 2000000) {
      console.log('   ⚠️  警告: レコード数が200万件未満です');
    }
    await connection.end();
  } catch (e) {
    console.log('   ❌ レコード件数取得エラー:', e.message);
    process.exit(1);
  }
})();
" || exit 1

echo ""

# 3. 都道府県別データ分布チェック
echo "📊 3. 都道府県別データ分布チェック（上位10件）"
node -e "
const mysql2 = require('mysql2/promise');
(async () => {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const connection = await mysql2.createConnection({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      ssl: { rejectUnauthorized: true }
    });
    const [rows] = await connection.query('SELECT prefecture, COUNT(*) as count FROM transactions GROUP BY prefecture ORDER BY count DESC LIMIT 10');
    rows.forEach(row => {
      console.log(\`   \${row.prefecture}: \${row.count.toLocaleString('ja-JP')}件\`);
    });
    await connection.end();
  } catch (e) {
    console.log('   ❌ データ分布取得エラー:', e.message);
    process.exit(1);
  }
})();
" || exit 1

echo ""

# 4. 物件タイプ別データ分布チェック
echo "📊 4. 物件タイプ別データ分布チェック"
node -e "
const mysql2 = require('mysql2/promise');
(async () => {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const connection = await mysql2.createConnection({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      ssl: { rejectUnauthorized: true }
    });
    const [rows] = await connection.query('SELECT propertyType, COUNT(*) as count FROM transactions GROUP BY propertyType ORDER BY count DESC');
    rows.forEach(row => {
      console.log(\`   \${row.propertyType}: \${row.count.toLocaleString('ja-JP')}件\`);
    });
    await connection.end();
  } catch (e) {
    console.log('   ❌ 物件タイプ分布取得エラー:', e.message);
    process.exit(1);
  }
})();
" || exit 1

echo ""

# 5. APIエンドポイント応答時間チェック
echo "⏱️  5. APIエンドポイント応答時間チェック"
start_time=$(date +%s%3N)
response=$(timeout 20 curl -s -X POST "http://localhost:3000/api/trpc/assessment.submit?batch=1" \
  -H 'Content-Type: application/json' \
  -d '{"0":{"json":{"propertyType":"house","prefecture":"東京都","city":"新宿区","location":"東京都新宿区","floorArea":100,"buildingAge":20,"ownerName":"テストユーザー","email":""}}}' \
  2>&1)
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if echo "$response" | grep -q '"success":true'; then
  echo "   ✅ API応答: 正常"
  echo "   ⏱️  応答時間: ${response_time}ms"
  if [ $response_time -gt 10000 ]; then
    echo "   ⚠️  警告: 応答時間が10秒を超えています"
  fi
else
  echo "   ❌ APIエラー"
  exit 1
fi

echo ""

# 6. エッジケーステスト（データなしエリア）
echo "🧪 6. エッジケーステスト（データなしエリア）"
response=$(timeout 20 curl -s -X POST "http://localhost:3000/api/trpc/assessment.submit?batch=1" \
  -H 'Content-Type: application/json' \
  -d '{"0":{"json":{"propertyType":"house","prefecture":"東京都","city":"存在しない市区町村","location":"東京都存在しない市区町村","floorArea":100,"buildingAge":20,"ownerName":"テストユーザー","email":""}}}' \
  2>&1)

if echo "$response" | grep -q '"success":true'; then
  echo "   ✅ エッジケース処理: 正常（フォールバック動作）"
else
  echo "   ⚠️  エッジケース: エラーハンドリング要確認"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 包括的エラーチェック完了"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
