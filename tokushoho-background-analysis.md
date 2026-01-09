# 特定商取引法ページ背景デザイン分析

## 公式HP（hyconsulting.jp）の背景デザイン

### 確認結果
- 公式HPのトップページは**シンプルな白背景**
- 装飾的なグラデーションや円形のblur要素は**見当たらない**
- 非常にクリーンでミニマルなデザイン

### 現在のLPの特定商取引法ページ（Tokushoho.tsx）
```tsx
<div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
<div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
<div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-50/40 rounded-full blur-2xl" />
```

### 修正方針
公式HPと同じデザインにするため、**装飾的な背景要素をすべて削除**し、シンプルな白背景にする。
