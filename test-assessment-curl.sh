#!/bin/bash

echo "=== 全国複数エリア査定テスト ==="
echo ""

test_assessment() {
  local prefecture="$1"
  local city="$2"
  local propertyType="$3"
  local area="$4"
  local buildYear="$5"
  
  echo "テスト: $prefecture $city ($propertyType)"
  
  local response=$(curl -s -X POST http://localhost:3000/api/assessment \
    -H "Content-Type: application/json" \
    -d "{
      \"propertyType\": \"$propertyType\",
      \"prefecture\": \"$prefecture\",
      \"city\": \"$city\",
      \"area\": $area,
      \"buildYear\": $buildYear
    }" --max-time 30)
  
  if [ -z "$response" ]; then
    echo "  ❌ タイムアウトまたはエラー"
    return 1
  fi
  
  # JSONからデータを抽出
  local estimatedPrice=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('estimatedPrice', 0))" 2>/dev/null)
  local minPrice=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('priceRange', {}).get('min', 0))" 2>/dev/null)
  local maxPrice=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('priceRange', {}).get('max', 0))" 2>/dev/null)
  local similarTx=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('similarTransactions', 0))" 2>/dev/null)
  local confidence=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('confidence', 0))" 2>/dev/null)
  
  if [ -z "$estimatedPrice" ] || [ "$estimatedPrice" == "0" ]; then
    echo "  ❌ 査定価格が取得できませんでした"
    echo "  レスポンス: $response"
    return 1
  fi
  
  # 万円に変換
  local estPriceMan=$(python3 -c "print(f'{$estimatedPrice / 10000:,.0f}')")
  local minPriceMan=$(python3 -c "print(f'{$minPrice / 10000:,.0f}')")
  local maxPriceMan=$(python3 -c "print(f'{$maxPrice / 10000:,.0f}')")
  
  echo "  ✅ 査定価格: ${estPriceMan}万円"
  echo "  価格レンジ: ${minPriceMan}万円〜${maxPriceMan}万円"
  echo "  類似取引: ${similarTx}件"
  echo "  信頼度: ${confidence}%"
  echo ""
  return 0
}

# テストケース実行
passed=0
failed=0

test_assessment "東京都" "新宿区" "マンション" 70 2015 && ((passed++)) || ((failed++))
test_assessment "東京都" "渋谷区" "戸建て" 120 2010 && ((passed++)) || ((failed++))
test_assessment "神奈川県" "横浜市戸塚区" "戸建て" 125 2015 && ((passed++)) || ((failed++))
test_assessment "神奈川県" "川崎市中原区" "マンション" 65 2018 && ((passed++)) || ((failed++))
test_assessment "大阪府" "大阪市中央区" "マンション" 80 2012 && ((passed++)) || ((failed++))
test_assessment "福岡県" "福岡市博多区" "戸建て" 100 2008 && ((passed++)) || ((failed++))
test_assessment "北海道" "札幌市中央区" "マンション" 75 2016 && ((passed++)) || ((failed++))
test_assessment "愛知県" "名古屋市中区" "土地" 150 null && ((passed++)) || ((failed++))

echo "=== テスト結果サマリー ==="
echo "PASSED: $passed/8"
echo "FAILED: $failed/8"
