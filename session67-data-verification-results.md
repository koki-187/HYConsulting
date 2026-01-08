# Session 67: 神奈川県20パターンデータ存在検証結果

## 検証実施日時
2026年1月8日

## 検証結果サマリー
- **総テスト数**: 20パターン
- **データ存在**: 0件 (0.0%)
- **データなし**: 20件 (100.0%)
- **期待データ総数**: 10,782件
- **実際のデータ総数**: 0件
- **データ充足率**: 0.0%

---

### Test 1: 横浜市鶴見区鶴見中央 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 横浜市鶴見区鶴見中央 |
| 面積 | 75㎡ |
| 築年数 | 15年 |
| 期待データ件数 | 770件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市鶴見区%鶴見中央%,condo |

---

### Test 2: 横浜市港北区新横浜 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 横浜市港北区新横浜 |
| 面積 | 120㎡ |
| 築年数 | 8年 |
| 期待データ件数 | 713件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市港北区%新横浜%,house |

---

### Test 3: 横浜市戸塚区戸塚町 - 土地 ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 土地 (land) |
| 市区町村 | 横浜市戸塚区戸塚町 |
| 面積 | 150㎡ |
| 築年数 | 0年 |
| 期待データ件数 | 698件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市戸塚区%戸塚町%,land |

---

### Test 4: 相模原市南区上鶴間本町 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 相模原市南区上鶴間本町 |
| 面積 | 65㎡ |
| 築年数 | 25年 |
| 期待データ件数 | 649件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%相模原市南区%上鶴間本町%,condo |

---

### Test 5: 横浜市青葉区美しが丘 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 横浜市青葉区美しが丘 |
| 面積 | 110㎡ |
| 築年数 | 12年 |
| 期待データ件数 | 618件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市青葉区%美しが丘%,house |

---

### Test 6: 横浜市港北区大倉山 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 横浜市港北区大倉山 |
| 面積 | 80㎡ |
| 築年数 | 20年 |
| 期待データ件数 | 581件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市港北区%大倉山%,condo |

---

### Test 7: 横浜市港北区日吉本町 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 横浜市港北区日吉本町 |
| 面積 | 95㎡ |
| 築年数 | 5年 |
| 期待データ件数 | 573件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市港北区%日吉本町%,house |

---

### Test 8: 横浜市磯子区森 - 土地 ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 土地 (land) |
| 市区町村 | 横浜市磯子区森 |
| 面積 | 200㎡ |
| 築年数 | 0年 |
| 期待データ件数 | 554件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市磯子区%森%,land |

---

### Test 9: 相模原市中央区相模原 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 相模原市中央区相模原 |
| 面積 | 70㎡ |
| 築年数 | 30年 |
| 期待データ件数 | 531件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%相模原市中央区%相模原%,condo |

---

### Test 10: 横浜市中区山下町 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 横浜市中区山下町 |
| 面積 | 85㎡ |
| 築年数 | 18年 |
| 期待データ件数 | 522件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市中区%山下町%,condo |

---

### Test 11: 川崎市中原区中丸子 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 川崎市中原区中丸子 |
| 面積 | 100㎡ |
| 築年数 | 10年 |
| 期待データ件数 | 482件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%川崎市中原区%中丸子%,house |

---

### Test 12: 大和市中央林間 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 大和市中央林間 |
| 面積 | 75㎡ |
| 築年数 | 22年 |
| 期待データ件数 | 460件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%大和市%中央林間%,condo |

---

### Test 13: 大和市下鶴間 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 大和市下鶴間 |
| 面積 | 115㎡ |
| 築年数 | 7年 |
| 期待データ件数 | 455件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%大和市%下鶴間%,house |

---

### Test 14: 川崎市宮前区犬蔵 - 土地 ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 土地 (land) |
| 市区町村 | 川崎市宮前区犬蔵 |
| 面積 | 180㎡ |
| 築年数 | 0年 |
| 期待データ件数 | 439件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%川崎市宮前区%犬蔵%,land |

---

### Test 15: 横浜市港北区綱島東 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 横浜市港北区綱島東 |
| 面積 | 68㎡ |
| 築年数 | 14年 |
| 期待データ件数 | 438件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市港北区%綱島東%,condo |

---

### Test 16: 横浜市南区六ツ川 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 横浜市南区六ツ川 |
| 面積 | 90㎡ |
| 築年数 | 35年 |
| 期待データ件数 | 436件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市南区%六ツ川%,house |

---

### Test 17: 川崎市高津区末長 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 川崎市高津区末長 |
| 面積 | 72㎡ |
| 築年数 | 16年 |
| 期待データ件数 | 419件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%川崎市高津区%末長%,condo |

---

### Test 18: 川崎市中原区小杉町 - マンション ❌

| 項目 | 値 |
|------|------|
| 物件種別 | マンション (condo) |
| 市区町村 | 川崎市中原区小杉町 |
| 面積 | 78㎡ |
| 築年数 | 3年 |
| 期待データ件数 | 415件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%川崎市中原区%小杉町%,condo |

---

### Test 19: 横浜市港南区港南台 - 戸建て ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 戸建て (house) |
| 市区町村 | 横浜市港南区港南台 |
| 面積 | 105㎡ |
| 築年数 | 28年 |
| 期待データ件数 | 515件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%横浜市港南区%港南台%,house |

---

### Test 20: 座間市相模が丘 - 土地 ❌

| 項目 | 値 |
|------|------|
| 物件種別 | 土地 (land) |
| 市区町村 | 座間市相模が丘 |
| 面積 | 160㎡ |
| 築年数 | 0年 |
| 期待データ件数 | 514件 |
| **実際のデータ件数** | **0件** |
| データ存在 | なし ❌ |
| エラー | Failed query: 
        SELECT COUNT(*) as count
        FROM transactions
        WHERE prefecture = $1
          AND city LIKE $2
          AND type = $3
      
params: 神奈川県,%座間市%相模が丘%,land |

---

