# フロントエンドコード分析結果

**日時**: 2026-01-08  
**ファイル**: `client/src/components/sections/AssessmentForm.tsx`

---

## コードの流れ

### 1. 査定ボタンのクリック
```tsx
<Button
  onClick={handleSearch}
  disabled={isSearching || submitAssessment.isPending}
>
  {isSearching || submitAssessment.isPending ? (
    <>
      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      査定中...
    </>
  ) : (
    <>
      査定結果を見る
      <ArrowRight className="ml-2 w-5 h-5" />
    </>
  )}
</Button>
```

### 2. handleSearch関数
```typescript
const handleSearch = async () => {
  // バリデーション
  if (!propertyType) {
    setError("物件種別を選択してください");
    return;
  }

  if (!prefecture || !city) {
    setError("都道府県と市区町村を入力してください");
    return;
  }

  if (!validateContactInfo()) {
    return;
  }

  console.log("🔍 Starting assessment with data:", {...});

  setIsSearching(true);  // ← ローディング開始
  setError(null);

  try {
    console.log("📤 Sending API request...");
    const result = await submitAssessment.mutateAsync({
      propertyType,
      prefecture,
      city,
      location: location,
      floorArea: area ? parseFloat(area) : undefined,
      buildingAge: buildingYear ? parseInt(buildingYear) : undefined,
      ownerName: wantContact ? name : "Anonymous",
      email: wantContact ? email : "",
      phone: wantContact ? phone : undefined,
      nearestStation: stationName || undefined,
      walkingMinutes: walkingMinutes ? parseInt(walkingMinutes) : undefined,
    });
    console.log("📥 API response received:", result);
  } catch (err) {
    console.error("❌ Assessment error in handleSearch:", err);
    setError(err instanceof Error ? err.message : "査定処理中にエラーが発生しました");
  } finally {
    console.log("🏁 Assessment process completed, setting isSearching to false");
    setIsSearching(false);  // ← ローディング終了
  }
};
```

### 3. submitAssessment (tRPC mutation)
```typescript
const submitAssessment = trpc.assessment.submit.useMutation({
  onSuccess: (data) => {
    console.log("✅ Assessment API Success:", data);
    setAssessmentResult(data);  // ← 結果を設定
    setError(null);
    setIsSearching(false);  // ← ローディング終了
  },
  onError: (err) => {
    console.error("❌ Assessment API Error:", err);
    setError(err.message || "査定処理中にエラーが発生しました");
    setIsSearching(false);  // ← ローディング終了
  },
});
```

---

## 問題の可能性

### 1. **物件種別の値が不一致**
フロントエンドの物件種別の値:
```tsx
{ value: "house", label: "戸建て" },
{ value: "mansion", label: "マンション" },  // ← "mansion"
{ value: "land", label: "土地" },
{ value: "apartment", label: "アパート" },
```

バックエンドが期待する値 (`server/assessment-aggregated.ts`):
```typescript
propertyType: "land" | "house" | "condo" | "apartment";
```

**問題点**: フロントエンドは `"mansion"` を送信しているが、バックエンドは `"condo"` を期待している！

### 2. **物件種別マッピングの不一致**
- フロントエンド: `mansion` → バックエンド: `condo` を期待
- バックエンドのマッピング関数は `condo` → `マンション` に変換
- `mansion` は変換されず、デフォルトの `土地` になる可能性

---

## 解決策

### オプション1: フロントエンドを修正（推奨）
`client/src/components/sections/AssessmentForm.tsx` の物件種別の値を修正:

```tsx
{ value: "house", label: "戸建て" },
{ value: "condo", label: "マンション" },  // mansion → condo
{ value: "land", label: "土地" },
{ value: "apartment", label: "アパート" },
```

### オプション2: バックエンドを修正
`server/assessment-aggregated.ts` の `mapPropertyType` 関数に `mansion` を追加:

```typescript
const typeMap: Record<string, string> = {
  "land": "土地",
  "house": "一戸建て",
  "condo": "マンション",
  "mansion": "マンション",  // 追加
  "apartment": "マンション",
};
```

---

## 次のステップ

1. ✅ 問題の根本原因を特定
2. ⏳ フロントエンドの物件種別の値を修正
3. ⏳ サーバーを再起動
4. ⏳ ブラウザで再テスト

---

**ステータス**: 修正準備完了
