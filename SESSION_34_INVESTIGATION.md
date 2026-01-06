# Session 34 Investigation - Water Bubble Animation Not Displaying

## 問題報告
ユーザーから「水玉が反映されていない為、確認が出来ません」との報告を受けた。

## 調査結果

### 1. Hero.tsx コード確認 (Line 84-99)
**結果**: ✅ 水玉アニメーションコードは正しく実装されている

```tsx
{/* Animated Water Bubbles Background */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* Large bubbles - light */}
  <div className="absolute w-32 h-32 rounded-full bg-blue-400/10 blur-2xl animate-bubble-slow" style={{ left: '10%', bottom: '-10%', animationDelay: '0s' }} />
  <div className="absolute w-40 h-40 rounded-full bg-blue-300/15 blur-3xl animate-bubble-slow" style={{ left: '70%', bottom: '-15%', animationDelay: '2s' }} />
  
  {/* Medium bubbles - moderate */}
  <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl animate-bubble-medium" style={{ left: '30%', bottom: '-8%', animationDelay: '1s' }} />
  <div className="absolute w-20 h-20 rounded-full bg-blue-400/25 blur-xl animate-bubble-medium" style={{ left: '85%', bottom: '-6%', animationDelay: '3s' }} />
  <div className="absolute w-28 h-28 rounded-full bg-blue-300/15 blur-2xl animate-bubble-medium" style={{ left: '50%', bottom: '-10%', animationDelay: '4s' }} />
  
  {/* Small bubbles - darker */}
  <div className="absolute w-16 h-16 rounded-full bg-blue-600/30 blur-lg animate-bubble-fast" style={{ left: '20%', bottom: '-5%', animationDelay: '0.5s' }} />
  <div className="absolute w-12 h-12 rounded-full bg-blue-500/35 blur-lg animate-bubble-fast" style={{ left: '60%', bottom: '-4%', animationDelay: '2.5s' }} />
  <div className="absolute w-14 h-14 rounded-full bg-blue-600/25 blur-md animate-bubble-fast" style={{ left: '90%', bottom: '-5%', animationDelay: '1.5s' }} />
</div>
```

**実装内容:**
- 8個の水玉を配置
- 大・中・小サイズのバリエーション
- 濃い・薄い透明度のバリエーション（10% ~ 35%）
- ピンぼけ効果（blur-md ~ blur-3xl）
- アニメーションクラス（animate-bubble-slow、animate-bubble-medium、animate-bubble-fast）
- アニメーション遅延（0s ~ 4s）

### 2. index.css CSS Keyframes 確認 (Line 192-254)
**結果**: ✅ CSS keyframes は正しく実装されている

```css
/* Water Bubble Animations */
@keyframes bubble-rise-slow {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
}

@keyframes bubble-rise-medium {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
}

@keyframes bubble-rise-fast {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(1); opacity: 0; }
}

.animate-bubble-slow {
  animation: bubble-rise-slow 20s ease-in-out infinite;
}

.animate-bubble-medium {
  animation: bubble-rise-medium 15s ease-in-out infinite;
}

.animate-bubble-fast {
  animation: bubble-rise-fast 12s ease-in-out infinite;
}
```

**実装内容:**
- 3種類のアニメーション速度（slow: 20秒、medium: 15秒、fast: 12秒）
- 下から上への移動（translateY: 0 → -100vh ~ -120vh）
- スケール変化（1.0 → 1.0 ~ 1.2）
- 不透明度の変化（0 → 1 → 0）
- infinite ループ

### 3. ブラウザテスト結果
**結果**: ❌ 水玉が視覚的に確認できない

**スクリーンショット分析:**
- Hero セクションは正しく表示されている
- ガラスモーフィズムパネルは正しく表示されている
- 背景の海の街イラストは正しく表示されている
- **水玉アニメーションが視覚的に確認できない**

## 原因分析

### 考えられる原因

#### 1. **初期位置の問題** (最も可能性が高い)
水玉の初期位置が `bottom: -10%` などの負の値に設定されているため、画面外（下方向）に配置されている。アニメーションが開始されるまで（または開始直後）は画面外にあり、視覚的に確認できない可能性が高い。

**証拠:**
- `bottom: '-10%'`、`bottom: '-15%'`、`bottom: '-8%'` などの負の値
- アニメーション開始時の opacity が 0 で、10% ~ 20% の時点で opacity: 1 になる
- つまり、アニメーション開始から 2秒 ~ 4秒後に初めて視認可能になる

#### 2. **透明度が低すぎる**
水玉の透明度が 10% ~ 35% と非常に低いため、背景の白い部分や明るい部分では視認できない可能性がある。

**証拠:**
- `bg-blue-400/10` (10% 不透明度)
- `bg-blue-300/15` (15% 不透明度)
- 背景画像の空の部分（白い雲）と重なると見えにくい

#### 3. **ぼかし効果が強すぎる**
`blur-2xl`、`blur-3xl` などの強いぼかし効果により、水玉がほとんど見えない可能性がある。

**証拠:**
- `blur-2xl` (40px blur)
- `blur-3xl` (64px blur)
- 小さいサイズ（12px ~ 40px）にこれだけ強いぼかしをかけると、ほぼ透明になる

#### 4. **z-index の問題**
水玉の div が他の要素の後ろに隠れている可能性がある。

**証拠:**
- 水玉の div には z-index が指定されていない
- ガラスモーフィズムパネルが `absolute` で配置されている
- 画像が `absolute` で配置されている

#### 5. **アニメーション遅延の問題**
アニメーション遅延（0s ~ 4s）により、ページ読み込み直後は一部の水玉しか動いていない可能性がある。

**証拠:**
- `animationDelay: '0s'` ~ `animationDelay: '4s'`
- ユーザーがページを開いてすぐにスクリーンショットを撮った場合、アニメーションが開始していない水玉がある

## 修正方針

### 優先度1: 初期位置の修正
水玉の初期位置を画面内（`bottom: 0` または `bottom: 10%`）に変更し、すぐに視認できるようにする。

### 優先度2: 透明度の向上
水玉の透明度を 30% ~ 60% に引き上げ、視認性を向上させる。

### 優先度3: ぼかし効果の調整
ぼかし効果を `blur-sm` ~ `blur-lg` に弱め、水玉の輪郭を明確にする。

### 優先度4: z-index の明示的指定
水玉の div に `z-index: 1` を指定し、背景画像の上に表示されるようにする。

### 優先度5: アニメーション遅延の短縮
アニメーション遅延を 0s ~ 2s に短縮し、ページ読み込み直後から動きが見えるようにする。

## 次のアクション
1. 初期位置を `bottom: 0` または `bottom: 10%` に変更
2. 透明度を `bg-blue-400/40` ~ `bg-blue-600/60` に変更
3. ぼかし効果を `blur-sm` ~ `blur-lg` に変更
4. z-index を明示的に指定
5. アニメーション遅延を短縮
6. ブラウザで再テスト

## 調査日時
- 2026-01-06 (GMT+9)
- Session 34
