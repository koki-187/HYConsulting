import { motion } from 'framer-motion';
import BadgeVariants from '../components/sections/BadgeVariants';

export default function BadgeComparison() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 font-heading">
            バッジデザイン候補
          </h1>
          <p className="text-lg text-slate-600 font-sans">
            3つのデザインパターンからお選びください
          </p>
        </motion.div>

        {/* Pattern 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 p-8 bg-white rounded-2xl shadow-lg border border-slate-200"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              パターン1: モダンフラットデザイン
            </h2>
            <p className="text-slate-600">
              シンプルで洗練された印象。読みやすさと上品さを重視。
            </p>
          </div>
          <div className="flex justify-center">
            <BadgeVariants variant="pattern1" />
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                ✓ 視認性: 高
              </span>
              <span className="flex items-center gap-1">
                ✓ 洗練度: 高
              </span>
              <span className="flex items-center gap-1">
                ✓ インパクト: 中
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pattern 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 p-8 bg-white rounded-2xl shadow-lg border border-slate-200"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              パターン2: グラデーション強調デザイン
            </h2>
            <p className="text-slate-600">
              視覚的インパクト重視。鮮やかなグラデーションと光沢効果で目を引く。
            </p>
          </div>
          <div className="flex justify-center">
            <BadgeVariants variant="pattern2" />
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                ✓ 視認性: 高
              </span>
              <span className="flex items-center gap-1">
                ✓ 洗練度: 中
              </span>
              <span className="flex items-center gap-1">
                ✓ インパクト: 最高
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pattern 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 p-8 bg-white rounded-2xl shadow-lg border border-slate-200"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              パターン3: アイコン強調デザイン
            </h2>
            <p className="text-slate-600">
              情報伝達を最優先。大きなアイコンで直感的に理解しやすい。
            </p>
          </div>
          <div className="flex justify-center">
            <BadgeVariants variant="pattern3" />
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                ✓ 視認性: 最高
              </span>
              <span className="flex items-center gap-1">
                ✓ 洗練度: 中
              </span>
              <span className="flex items-center gap-1">
                ✓ インパクト: 高
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-500 text-sm"
        >
          <p>
            ※ 各デザインはレスポンシブ対応済みです。モバイル・タブレット・デスクトップで最適化されます。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
