#!/bin/bash

echo "🔍 tRPC API テスト開始"
echo "─────────────────────────────────────────────────"
echo ""

echo "📤 リクエスト送信: 東京都新宿区の戸建て"
echo ""

curl -X POST 'http://localhost:3000/api/trpc/assessment.submit' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": {
      "propertyType": "house",
      "prefecture": "東京都",
      "city": "新宿区",
      "location": "東京都新宿区",
      "floorArea": 100,
      "buildingAge": 20,
      "ownerName": "テストユーザー",
      "email": "test@example.com"
    }
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  2>&1 | grep -v "^  " | grep -v "^{" | grep -v "^}" | head -50

echo ""
echo "─────────────────────────────────────────────────"
echo "✅ テスト完了"
