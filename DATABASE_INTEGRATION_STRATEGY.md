# 全国不動産データベース統合戦略

## 📋 実行日: 2026年1月7日

## 🎯 目標
全国47都道府県の不動産データを安全に統合し、エラーを徹底的に防止した実運用可能な査定システムを構築する。

---

## 📊 Phase 1完了: 現状分析

### 既存データ
- **テーブル**: `propertyDatabase`
- **件数**: 12件（横浜市3区のサンプルデータ）
- **構造**: 個別取引データ
  - `pricePerSqm`: 万円/㎡
  - `soldPrice`: 万円
  - `floorArea`: ㎡
  - `buildingAge`: 年

### 新データ
- **ファイル**: `realEstateDataByType_FINAL.json` (86.9MB)
- **件数**: 353,102エントリ
- **カバレッジ**: 全47都道府県、7,760市区町村、189,391地区
- **構造**: 集計データ
  ```json
  {
    "物件種別": {
      "都道府県": {
        "市区町村": {
          "地区": {
            "築年帯": {
              "totalPrice": 合計価格（円）,
              "totalArea": 合計面積（㎡）,
              "count": 件数,
              "pricePerTsubo": 坪単価（円/坪）,
              "averagePrice": 平均価格（円）,
              "averageArea": 平均面積（㎡）
            }
          }
        }
      }
    }
  }
  ```

### 重複チェック結果
✅ **データ構造が完全に異なるため、直接的な重複なし**
- 既存: 個別取引レベルのデータ
- 新データ: 地区×築年帯ごとの集計データ

---

## 🏗️ Phase 2: データ容量対策と最適化戦略

### 戦略A: 集計データ専用テーブル（推奨）

#### 新テーブル設計: `aggregated_real_estate_data`

```typescript
export const aggregatedRealEstateData = mysqlTable(
  "aggregated_real_estate_data",
  {
    id: int("id").autoincrement().primaryKey(),
    
    // 地理情報
    propertyType: varchar("propertyType", { length: 50 }).notNull(), // "マンション", "一戸建て", "土地", "林地", "農地"
    prefecture: varchar("prefecture", { length: 50 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    district: varchar("district", { length: 100 }).notNull(),
    
    // 築年帯
    buildingAgeGroup: varchar("buildingAgeGroup", { length: 50 }).notNull(), // "0～5年", "5～10年", etc.
    
    // 集計データ
    totalPriceYen: bigint("totalPriceYen", { mode: "number" }).notNull(), // 合計価格（円）
    totalAreaM2: decimal("totalAreaM2", { precision: 15, scale: 2 }).notNull(), // 合計面積（㎡）
    transactionCount: int("transactionCount").notNull(), // 取引件数
    pricePerTsubo: int("pricePerTsubo").notNull(), // 坪単価（円/坪）
    averagePriceYen: int("averagePriceYen").notNull(), // 平均価格（円）
    averageAreaM2: decimal("averageAreaM2", { precision: 10, scale: 2 }).notNull(), // 平均面積（㎡）
    
    // メタデータ
    datasetVersionId: varchar("datasetVersionId", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    // 複合インデックス（査定クエリの最適化）
    lookupIdx: index("idx_agg_lookup").on(
      table.propertyType,
      table.prefecture,
      table.city,
      table.district,
      table.buildingAgeGroup
    ),
    prefectureIdx: index("idx_agg_prefecture").on(table.prefecture),
    cityIdx: index("idx_agg_city").on(table.city),
  })
);
```

#### メリット
1. ✅ 既存の`propertyDatabase`を保持（後方互換性）
2. ✅ 集計データの高速検索（インデックス最適化）
3. ✅ データ構造が明確で保守しやすい
4. ✅ エラー時のフォールバック実装が容易

#### データ容量見積もり
- **エントリ数**: 353,102件
- **1エントリあたり**: 約200バイト（推定）
- **総容量**: 約70MB（インデックス含めて約100MB）
- **MySQLの許容範囲**: ✅ 問題なし

### 戦略B: JSONカラムでの格納（非推奨）

#### 理由
- ❌ クエリパフォーマンスが低下
- ❌ インデックスが効かない
- ❌ データ整合性の検証が困難

---

## 🛡️ Phase 3: エラー防止策

### 3.1 データ不整合検出

```typescript
// データ検証関数
function validateAggregatedData(data: AggregatedRealEstateData): boolean {
  // 必須フィールドチェック
  if (!data.propertyType || !data.prefecture || !data.city || !data.district) {
    return false;
  }
  
  // 数値の妥当性チェック
  if (data.transactionCount <= 0 || data.averagePriceYen <= 0) {
    return false;
  }
  
  // 計算の整合性チェック
  const calculatedAverage = data.totalPriceYen / data.transactionCount;
  const diff = Math.abs(calculatedAverage - data.averagePriceYen);
  if (diff > data.averagePriceYen * 0.01) { // 1%以上の誤差
    console.warn(`Data inconsistency detected: ${JSON.stringify(data)}`);
    return false;
  }
  
  return true;
}
```

### 3.2 フォールバック処理

```typescript
// 査定ロジックのフォールバック
async function calculateAssessment(input: AssessmentInput) {
  try {
    // Step 1: 新しい集計データで検索
    const aggregatedData = await db
      .select()
      .from(aggregatedRealEstateData)
      .where(
        and(
          eq(aggregatedRealEstateData.propertyType, input.propertyType),
          eq(aggregatedRealEstateData.prefecture, input.prefecture),
          eq(aggregatedRealEstateData.city, input.city)
        )
      );
    
    if (aggregatedData.length > 0) {
      return calculateFromAggregated(aggregatedData, input);
    }
    
    // Step 2: フォールバック - 既存のpropertyDatabaseを使用
    console.warn(`No aggregated data found, falling back to propertyDatabase`);
    const fallbackData = await db
      .select()
      .from(propertyDatabase)
      .where(
        and(
          eq(propertyDatabase.propertyType, input.propertyType),
          eq(propertyDatabase.prefecture, input.prefecture)
        )
      );
    
    if (fallbackData.length > 0) {
      return calculateFromPropertyDatabase(fallbackData, input);
    }
    
    // Step 3: データなし - ユーザーフレンドリーなエラー
    throw new Error("ASSESSMENT_DATA_NOT_FOUND");
    
  } catch (error) {
    // エラーログ記録
    await logAssessmentError(input, error);
    
    // ユーザー向けメッセージ
    if (error.message === "ASSESSMENT_DATA_NOT_FOUND") {
      return {
        error: true,
        message: "申し訳ございません。ご指定の地域のデータが不足しているため、正確な査定ができません。お手数ですが、お問い合わせフォームからご連絡ください。"
      };
    }
    
    return {
      error: true,
      message: "システムエラーが発生しました。しばらくしてから再度お試しください。"
    };
  }
}
```

### 3.3 バリデーション強化

```typescript
// ユーザー入力のバリデーション
const assessmentInputSchema = z.object({
  propertyType: z.enum(["マンション", "一戸建て", "土地", "林地", "農地"]),
  prefecture: z.string().min(2).max(10),
  city: z.string().min(2).max(50),
  district: z.string().optional(),
  floorArea: z.number().min(1).max(10000), // 1㎡～10,000㎡
  buildingAge: z.number().min(0).max(100).optional(), // 0～100年
});
```

### 3.4 エラーログ記録

```typescript
// 査定エラーログテーブル
export const assessmentErrorLog = mysqlTable("assessment_error_log", {
  id: int("id").autoincrement().primaryKey(),
  errorType: varchar("errorType", { length: 100 }).notNull(),
  input: text("input").notNull(), // JSON
  errorMessage: text("errorMessage"),
  stackTrace: text("stackTrace"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

---

## 📈 Phase 4: テスト計画

### 4.1 単体テスト
- [ ] データ投入スクリプトのテスト
- [ ] バリデーション関数のテスト
- [ ] フォールバック処理のテスト

### 4.2 統合テスト
- [ ] 東京都のみのデータで統合テスト
- [ ] 査定ロジックの動作確認
- [ ] エラーケースのテスト

### 4.3 パフォーマンステスト
- [ ] 査定API応答時間測定（目標: <500ms）
- [ ] 都道府県一覧取得時間（目標: <100ms）
- [ ] メモリ使用量監視（目標: <500MB）

---

## 🚀 Phase 5: 段階的統合計画

### ステップ1: Priority 1地域（3都道府県）
- 東京都
- 大阪府
- 神奈川県

### ステップ2: Priority 2地域（10都道府県）
- 北海道、愛知県、福岡県、埼玉県、千葉県
- 兵庫県、京都府、広島県、宮城県、新潟県

### ステップ3: 全国展開（残り34都道府県）
- 全データ投入
- 総合テスト

---

## ✅ Phase 6: 実運用テスト項目

### 6.1 機能テスト
- [ ] 全47都道府県で査定フォーム動作確認
- [ ] 各物件種別での査定精度確認
- [ ] エラーメッセージの表示確認

### 6.2 品質指標
- **査定成功率**: 目標 >95%
- **平均応答時間**: 目標 <500ms
- **エラー発生率**: 目標 <5%

### 6.3 ユーザビリティ
- [ ] データなし時のメッセージが分かりやすいか
- [ ] 査定結果の表示が適切か
- [ ] お問い合わせへの誘導が明確か

---

## 📝 次のアクション

1. **スキーマファイルの更新**: `aggregatedRealEstateData`テーブルを追加
2. **マイグレーションの作成**: `pnpm db:push`
3. **データ投入スクリプトの作成**: JSONからDBへの変換
4. **査定ロジックの拡張**: フォールバック処理を含む
5. **テストの実行**: 段階的にテスト
6. **本番デプロイ**: チェックポイント作成後

---

**作成日**: 2026年1月7日  
**ステータス**: Phase 2完了、Phase 3開始準備完了
