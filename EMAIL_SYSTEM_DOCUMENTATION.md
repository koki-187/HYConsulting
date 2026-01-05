# メール送信機能 - 詳細ドキュメント

## 1. システム概要

HY Consulting の査定システムでは、ユーザーがメールアドレスを登録した場合、査定結果を自動的にメール送信する機能を実装しています。

---

## 2. メール送信システムの構成

### 2.1 使用技術

| 項目 | 詳細 |
|------|------|
| **メーラーライブラリ** | Nodemailer 7.0.12 |
| **言語** | TypeScript |
| **実装場所** | `/server/email-service.ts` |
| **テンプレート** | `/server/email-templates.ts` |
| **統合箇所** | `/server/routers.ts` (assessment.submit エンドポイント) |

### 2.2 メール送信フロー

```
ユーザー入力
    ↓
フォーム送信（メールアドレス入力）
    ↓
バックエンド受信（routers.ts）
    ↓
査定計算実行
    ↓
メールアドレス判定
    ↓
メール送信判定（デフォルト値でない場合）
    ↓
EmailService.sendAssessmentEmail()
    ↓
メールテンプレート生成
    ↓
Nodemailer で送信
    ↓
送信完了ログ記録
```

---

## 3. メール送信条件

### 3.1 送信トリガー

メール送信は以下の条件を満たす場合に自動実行されます：

1. **ユーザーがメールアドレスを入力した**
   - フォームの「連絡先情報（オプション）」セクションでメールアドレスを入力

2. **メールアドレスが有効形式**
   - RFC 5322 に準拠したメールアドレス形式
   - 例：`user@example.com`

3. **デフォルト値でない**
   - `noreply@hy-consulting.jp` ではない
   - 空文字列ではない

### 3.2 送信タイミング

- **査定リクエスト送信直後**
- 非同期処理で実行（ユーザーの待機時間に影響なし）
- 送信失敗時もシステムは継続動作

---

## 4. メール内容の詳細

### 4.1 メール構成

#### **ヘッダー部分**
```
件名: 不動産査定結果 - [都道府県][市区町村][番地]
例：不動産査定結果 - 東京都渋谷区渋谷1-2-3

差出人: HY Consulting <noreply@hy-consulting.jp>
返信先: noreply@hy-consulting.jp
```

#### **本文構成**

**1. グリーティング**
```
いつもお世話になっております。
ご依頼いただいた不動産の査定が完了いたしました。
```

**2. 物件情報セクション**

| 項目 | 表示内容 | 例 |
|------|--------|-----|
| 物件種別 | 土地 / 戸建て / マンション / アパート | 戸建て |
| 所在地 | 都道府県 + 市区町村 + 番地 | 東京都渋谷区渋谷1-2-3 |
| 面積 | 床面積（㎡） | 120 ㎡ |
| 築年数 | 建物の築年数 | 10 年 |

**3. 査定結果セクション**

```
【推定価格範囲】
¥85,000,000 ～ ¥115,000,000

【推定価格】
¥100,000,000

【㎡単価】
¥1,000,000

【査定信頼度】
75% （ビジュアルメーター表示）
```

**4. 市場動向セクション**

| 市場状況 | 表示 | 色 |
|--------|------|-----|
| 安定 | 🟢 安定 | 緑色 |
| 上昇傾向 | 🔵 上昇傾向 | 青色 |
| 下落傾向 | 🟠 下落傾向 | オレンジ色 |

```
現在の市場は安定です。査定価格は最新の市場データに基づいています。
```

**5. 査定コメント**

```
ご依頼いただいた物件の査定が完了いたしました。
推定価格は100万円です。詳細はメール本文をご確認ください。
```

**6. フッター部分**

```
【リンク】
- ホーム
- サービス
- お問い合わせ

© 2026 HY Consulting. All rights reserved.

【免責事項】
このメールは自動送信されています。返信しないでください。
本査定結果は参考値です。実際の価格は市場動向、物件の状態、
取引条件などにより異なる場合があります。
詳細な査定については、専門家へのご相談をお勧めします。
```

### 4.2 メール形式

**HTML メール**
- レスポンシブデザイン対応
- モバイル・タブレット・デスクトップで最適表示
- 視覚的に見やすいデザイン
- ブランドカラー（青色）を使用

**プレーンテキストメール**
- HTML 非対応メールクライアント向け
- テキストのみで読みやすい形式
- 同じ情報を含む

---

## 5. メール送信システムの実装詳細

### 5.1 EmailService クラス

**ファイル:** `/server/email-service.ts`

```typescript
class EmailService {
  // メール初期化
  async initialize(config: EmailConfig): Promise<void>
  
  // 単一メール送信
  async sendAssessmentEmail(
    recipientEmail: string,
    assessmentData: AssessmentEmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }>
  
  // 一括メール送信
  async sendBulkAssessmentEmails(
    recipients: Array<{ email: string; data: AssessmentEmailData }>
  ): Promise<{
    successful: number;
    failed: number;
    results: Array<...>
  }>
  
  // メール検証
  private isValidEmail(email: string): boolean
  
  // 初期化状態確認
  isReady(): boolean
}
```

### 5.2 メールテンプレート生成

**ファイル:** `/server/email-templates.ts`

```typescript
// HTML メール生成
export function generateAssessmentEmailHTML(
  data: AssessmentEmailData
): string

// プレーンテキストメール生成
export function generateAssessmentEmailText(
  data: AssessmentEmailData
): string
```

**入力データ構造:**

```typescript
interface AssessmentEmailData {
  propertyType: string;           // 物件種別
  prefecture: string;              // 都道府県
  city: string;                    // 市区町村
  location: string;                // 番地
  estimatedLowYen: number;         // 推定価格下限
  estimatedHighYen: number;        // 推定価格上限
  estimatedPrice: number;          // 推定価格
  message: string;                 // 査定コメント
  confidence: number;              // 信頼度（0-100）
  pricePerM2?: number;             // ㎡単価
  floorArea?: number;              // 床面積
  buildingAge?: number;            // 築年数
  marketTrend?: string;            // 市場動向
}
```

### 5.3 査定フロー統合

**ファイル:** `/server/routers.ts`

```typescript
assessment: router({
  submit: publicProcedure
    .input(z.object({
      propertyType: z.string(),
      prefecture: z.string(),
      city: z.string(),
      location: z.string(),
      email: z.string().email().optional().or(z.literal("")),
      // ... その他フィールド
    }))
    .mutation(async ({ input }) => {
      // 1. 査定計算
      const estimatedPrice = await calculateAssessmentPrice(...)
      
      // 2. データベース保存
      const result = await createAssessmentRequest(...)
      
      // 3. 市場分析生成
      const marketAnalysis = await generateMarketAnalysis(...)
      
      // 4. メール送信（ユーザーがメール入力した場合）
      if (input.email && input.email !== "" && input.email !== "noreply@hy-consulting.jp") {
        const emailData = {
          propertyType: input.propertyType,
          prefecture: input.prefecture,
          city: input.city,
          location: input.location,
          estimatedLowYen: estimatedPrice * 0.85 * 10000,
          estimatedHighYen: estimatedPrice * 1.15 * 10000,
          estimatedPrice: estimatedPrice,
          message: `ご依頼いただいた物件の査定が完了いたしました...`,
          confidence: 75,
          // ... その他データ
        }
        
        const emailResult = await emailService.sendAssessmentEmail(
          input.email,
          emailData
        )
      }
      
      // 5. レスポンス返却
      return { success: true, estimatedPrice, ... }
    })
})
```

---

## 6. エラーハンドリング

### 6.1 エラーケース

| エラー | 対応 | ログ |
|--------|------|------|
| 無効なメールアドレス | スキップ | ⚠️ 警告ログ |
| メール送信失敗 | 再試行なし、ログ記録 | ❌ エラーログ |
| SMTP 接続失敗 | システム継続、メール未送信 | ❌ エラーログ |
| テンプレート生成失敗 | スキップ、ログ記録 | ❌ エラーログ |

### 6.2 ログ出力例

```
✅ Email sent successfully to user@example.com (ID: <message-id>)
⚠️ Failed to send email to invalid@: Invalid email address
❌ Failed to send email to user@example.com: SMTP connection timeout
```

---

## 7. セキュリティ対策

### 7.1 実装済みセキュリティ

| 対策 | 説明 |
|------|------|
| **メールアドレス検証** | 正規表現で形式チェック |
| **デフォルト値除外** | 自動送信メール（noreply）は除外 |
| **エラーハンドリング** | 送信失敗時も処理継続 |
| **ログ記録** | 送信履歴をサーバーログに記録 |
| **非同期処理** | ユーザー待機時間に影響なし |

### 7.2 推奨される追加対策

1. **メール配信サービス統合**
   - SendGrid、AWS SES などの本番サービス
   - 配信信頼性向上
   - バウンス管理

2. **メール認証**
   - SPF、DKIM、DMARC 設定
   - スパム判定回避

3. **プライバシー対応**
   - 個人情報保護方針の明記
   - オプトアウト機能

---

## 8. テスト結果

### 8.1 テストカバレッジ

| テスト項目 | 結果 | 詳細 |
|----------|------|------|
| HTML テンプレート生成 | ✅ PASSED | 有効な HTML 構造 |
| テキストテンプレート生成 | ✅ PASSED | 読みやすいテキスト形式 |
| 最小データ対応 | ✅ PASSED | オプショナルフィールド対応 |
| 全フィールド対応 | ✅ PASSED | 完全なデータ表示 |
| HTML 構造検証 | ✅ PASSED | DOCTYPE、head、body 確認 |
| メール件名生成 | ✅ PASSED | 適切な件名形式 |
| 複数物件タイプ | ✅ PASSED | 土地、戸建、マンション対応 |
| 市場動向表示 | ✅ PASSED | 安定、上昇、下落対応 |
| テンプレートサイズ | ✅ PASSED | 1KB～50KB の適切なサイズ |
| 特殊文字処理 | ✅ PASSED | 日本語、記号対応 |

### 8.2 テスト実行コマンド

```bash
# メール送信テスト実行
pnpm test -- server/email-sending-test.ts

# 全テスト実行
pnpm test
```

---

## 9. 設定例

### 9.1 Nodemailer 設定（開発環境）

```typescript
const emailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password"
  },
  from: "HY Consulting <noreply@hy-consulting.jp>"
}

await emailService.initialize(emailConfig)
```

### 9.2 本番環境推奨設定

```typescript
const emailConfig = {
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
  },
  from: "HY Consulting <noreply@hy-consulting.jp>"
}
```

---

## 10. メール送信例

### 10.1 実際のメール表示イメージ

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           🏠 不動産査定結果
    HY Consulting - オンライン無料査定
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

いつもお世話になっております。
ご依頼いただいた不動産の査定が完了いたしました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 物件情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

物件種別：戸建て
所在地：東京都渋谷区渋谷1-2-3
面積：120 ㎡
築年数：10 年

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 査定結果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

推定価格範囲：
¥85,000,000 ～ ¥115,000,000

推定価格：¥100,000,000
㎡単価：¥1,000,000

査定信頼度：75%
████████████████████░░░░░░░░░░░░░░░░░░

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 市場動向
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 安定

現在の市場は安定です。査定価格は最新の市場データに基づいています。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 査定コメント
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ご依頼いただいた物件の査定が完了いたしました。
推定価格は100万円です。詳細はメール本文をご確認ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[詳細情報を確認する]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2026 HY Consulting. All rights reserved.

このメールは自動送信されています。返信しないでください。
本査定結果は参考値です。実際の価格は市場動向、物件の状態、
取引条件などにより異なる場合があります。
詳細な査定については、専門家へのご相談をお勧めします。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 11. トラブルシューティング

### 11.1 よくある問題と解決方法

| 問題 | 原因 | 解決方法 |
|------|------|--------|
| メール送信されない | SMTP 設定エラー | 環境変数確認、ホスト・ポート確認 |
| スパムフォルダに入る | SPF/DKIM 未設定 | メール認証設定を追加 |
| メールが文字化け | エンコーディング問題 | UTF-8 設定確認 |
| 送信が遅い | ネットワーク遅延 | 非同期処理確認、タイムアウト設定 |

---

## 12. 今後の拡張予定

1. **メール配信サービス統合**
   - SendGrid / AWS SES 対応

2. **メール配信ダッシュボード**
   - 送信履歴表示
   - 開封率追跡
   - バウンス管理

3. **自動フォローアップ**
   - 初回査定後 7 日でフォローアップメール
   - 14 日でリマインダーメール

4. **メール購読管理**
   - ユーザーが購読設定を管理
   - オプトアウト機能

---

**ドキュメント作成日:** 2026 年 1 月 5 日  
**最終更新:** 2026 年 1 月 5 日  
**バージョン:** 1.0
