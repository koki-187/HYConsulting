#!/bin/bash

echo "🗾 全国不動産査定システム - 複数エリアテスト"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# テストケース配列
declare -a test_cases=(
  "東京都:新宿区:house:100:20"
  "神奈川県:横浜市戸塚区:condo:70:14"
  "大阪府:大阪市:land:150:0"
  "福岡県:福岡市:house:120:25"
  "北海道:札幌市:condo:80:10"
  "愛知県:名古屋市:house:110:15"
  "京都府:京都市:land:200:0"
  "沖縄県:那覇市:condo:60:8"
)

success_count=0
fail_count=0

for test_case in "${test_cases[@]}"; do
  IFS=':' read -r prefecture city property_type floor_area building_age <<< "$test_case"
  
  echo "📍 テスト: ${prefecture}${city} (${property_type})"
  echo "   面積: ${floor_area}㎡, 築年数: ${building_age}年"
  
  # tRPCバッチリクエスト形式でAPIを呼び出し
  response=$(timeout 20 curl -s -X POST "http://localhost:3000/api/trpc/assessment.submit?batch=1" \
    -H 'Content-Type: application/json' \
    -d "{\"0\":{\"json\":{\"propertyType\":\"${property_type}\",\"prefecture\":\"${prefecture}\",\"city\":\"${city}\",\"location\":\"${prefecture}${city}\",\"floorArea\":${floor_area},\"buildingAge\":${building_age},\"ownerName\":\"テストユーザー\",\"email\":\"\"}}}" \
    2>&1)
  
  if echo "$response" | grep -q '"success":true'; then
    estimated_price=$(echo "$response" | grep -o '"estimatedPrice":[0-9]*' | cut -d':' -f2)
    comps_count=$(echo "$response" | grep -o '"compsUsedCount":[0-9]*' | cut -d':' -f2)
    
    echo "   ✅ 成功: 査定価格 ${estimated_price}万円 (参照取引: ${comps_count}件)"
    ((success_count++))
  else
    echo "   ❌ 失敗"
    ((fail_count++))
  fi
  
  echo ""
  sleep 1
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 テスト結果サマリー"
echo "   成功: ${success_count}件"
echo "   失敗: ${fail_count}件"
echo "   成功率: $(( success_count * 100 / (success_count + fail_count) ))%"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
