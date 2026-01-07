# 物件種別の不一致問題

**日時**: 2026-01-08  
**問題**: 査定システムが「査定中...」のまま結果を返さない

---

## 根本原因の特定

### CSVファイルの物件種別（英語）
```
condo
house
land
```

### データベースに期待される物件種別（日本語）
スキーマコメントより:
```
"マンション", "一戸建て", "土地", "林地", "農地"
```

### 査定ロジックのマッピング
`server/assessment-aggregated.ts` の `mapPropertyType` 関数:
```typescript
const typeMap: Record<string, string> = {
  "land": "土地",
  "house": "一戸建て",
  "condo": "マンション",
  "apartment": "マンション",
};
```

---

## 問題の詳細

### 1. CSVデータの物件種別が英語のまま
- **CSVファイル**: `property_type` カラムに `condo`, `house`, `land` が格納
- **集計スクリプト**: `scripts/aggregate-csv-data.mjs` が物件種別を日本語に変換せずにそのまま集計
- **結果**: データベースに `condo`, `house`, `land` が格納されている

### 2. 査定ロジックは日本語を期待
- **査定ロジック**: `mapPropertyType` 関数が英語を日本語に変換
- **検索クエリ**: `propertyType = 'マンション'` で検索
- **結果**: データベースには `condo` として格納されているため、マッチしない

---

## 解決策

### オプション1: 集計スクリプトを修正（推奨）
`scripts/aggregate-csv-data.mjs` を修正して、集計時に物件種別を日本語に変換する。

```javascript
function mapPropertyTypeToJapanese(type) {
  const typeMap = {
    "condo": "マンション",
    "house": "一戸建て",
    "land": "土地",
    "apartment": "マンション",
  };
  return typeMap[type] || type;
}
```

### オプション2: 査定ロジックを修正
`server/assessment-aggregated.ts` の `mapPropertyType` 関数を削除し、英語のまま検索する。

**問題点**: スキーマコメントと実際のデータが不一致になる。

---

## 実施する修正

**オプション1を採用**: 集計スクリプトを修正して、データベースに日本語で格納する。

### 修正手順
1. `scripts/aggregate-csv-data.mjs` に物件種別変換関数を追加
2. 既存のデータベースデータを削除
3. 修正したスクリプトで再集計
4. 査定システムをテスト

---

## 次のステップ
1. ✅ 問題の根本原因を特定
2. ⏳ 集計スクリプトを修正
3. ⏳ データベースを再構築
4. ⏳ 査定システムをテスト
5. ⏳ 他の都道府県のデータも確認

---

**ステータス**: 修正準備中
