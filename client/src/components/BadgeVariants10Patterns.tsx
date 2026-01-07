import { Shield, Clock } from "lucide-react";

export function BadgeVariants10Patterns() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-900">
          バッジリデザイン - 10パターン比較
        </h1>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          「匿名・無料」と「最短60秒で入力完了」のバッジデザインを10パターンで比較します。
          インパクトとメリットの強調を重視したデザインです。
        </p>

        <div className="space-y-16">
          {/* パターン1: 3D立体デザイン */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン1: 3D立体デザイン（シャドウ強調）
            </h2>
            <p className="text-slate-600 mb-6">
              深いシャドウとレイヤー効果で立体感を演出し、インパクトを強調
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-pink-500 to-pink-700 text-white px-8 py-4 rounded-2xl shadow-2xl transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 drop-shadow-lg" />
                    <div>
                      <div className="font-bold text-lg drop-shadow-md">匿名・無料</div>
                      <div className="text-sm opacity-90">ANONYMOUS & FREE</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-2xl transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 drop-shadow-lg" />
                    <div>
                      <div className="font-bold text-lg drop-shadow-md">最短60秒で入力完了</div>
                      <div className="text-sm opacity-90">その場で結果表示</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン2: ネオンライト風デザイン */}
          <div className="bg-slate-900 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">
              パターン2: ネオンライト風デザイン（発光効果）
            </h2>
            <p className="text-slate-300 mb-6">
              ネオンサインのような発光効果でモダンな印象を与える
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-pink-600 text-white px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.8)] hover:shadow-[0_0_50px_rgba(236,72,153,1)] transition-shadow duration-300 animate-pulse">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div>
                    <div className="font-bold text-lg">匿名・無料</div>
                    <div className="text-sm opacity-90">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.8)] hover:shadow-[0_0_50px_rgba(37,99,235,1)] transition-shadow duration-300 animate-pulse">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <div>
                    <div className="font-bold text-lg">最短60秒で入力完了</div>
                    <div className="text-sm opacity-90">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン3: グラスモーフィズム強化 */}
          <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン3: グラスモーフィズム強化（透明感+ぼかし）
            </h2>
            <p className="text-slate-700 mb-6">
              透明感とぼかしを最大限に活用した洗練されたデザイン
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-pink-500/30 backdrop-blur-xl text-white px-8 py-4 rounded-2xl border-2 border-white/40 shadow-xl hover:bg-pink-500/40 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 drop-shadow-lg" />
                  <div>
                    <div className="font-bold text-lg drop-shadow-md">匿名・無料</div>
                    <div className="text-sm opacity-90">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/30 backdrop-blur-xl text-white px-8 py-4 rounded-2xl border-2 border-white/40 shadow-xl hover:bg-blue-500/40 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 drop-shadow-lg" />
                  <div>
                    <div className="font-bold text-lg drop-shadow-md">最短60秒で入力完了</div>
                    <div className="text-sm opacity-90">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン4: アニメーション強調 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン4: アニメーション強調（パルス効果）
            </h2>
            <p className="text-slate-600 mb-6">
              動的なアニメーションでユーザーの注目を引く
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-white px-8 py-4 rounded-2xl shadow-xl hover:scale-110 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 animate-bounce" />
                  <div>
                    <div className="font-bold text-lg">匿名・無料</div>
                    <div className="text-sm opacity-90">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-white px-8 py-4 rounded-2xl shadow-xl hover:scale-110 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 animate-bounce" />
                  <div>
                    <div className="font-bold text-lg">最短60秒で入力完了</div>
                    <div className="text-sm opacity-90">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン5: グラデーション+アイコン大型化 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン5: グラデーション+アイコン大型化
            </h2>
            <p className="text-slate-600 mb-6">
              鮮やかなグラデーションと大きなアイコンで視覚的階層を強調
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 text-white px-8 py-6 rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <Shield className="w-12 h-12 drop-shadow-lg" />
                  <div>
                    <div className="font-bold text-xl drop-shadow-md">匿名・無料</div>
                    <div className="text-base opacity-90">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <Clock className="w-12 h-12 drop-shadow-lg" />
                  <div>
                    <div className="font-bold text-xl drop-shadow-md">最短60秒で入力完了</div>
                    <div className="text-base opacity-90">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン6: カード型デザイン */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン6: カード型デザイン（影+境界線）
            </h2>
            <p className="text-slate-600 mb-6">
              カードのような明確な影と境界線で分離感を演出
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-pink-50 border-4 border-pink-500 text-pink-700 px-8 py-6 rounded-3xl shadow-2xl hover:shadow-pink-500/30 transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-lg">匿名・無料</div>
                    <div className="text-sm opacity-80">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-4 border-blue-500 text-blue-700 px-8 py-6 rounded-3xl shadow-2xl hover:shadow-blue-500/30 transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-lg">最短60秒で入力完了</div>
                    <div className="text-sm opacity-80">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン7: バッジ型デザイン */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン7: バッジ型デザイン（リボン風）
            </h2>
            <p className="text-slate-600 mb-6">
              クラシックなバッジ・リボンデザインで信頼感を演出
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="relative">
                <div className="bg-pink-600 text-white px-8 py-6 rounded-full border-4 border-yellow-400 shadow-2xl hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8" />
                    <div>
                      <div className="font-bold text-lg">匿名・無料</div>
                      <div className="text-sm opacity-90">ANONYMOUS & FREE</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  NEW
                </div>
              </div>

              <div className="relative">
                <div className="bg-blue-600 text-white px-8 py-6 rounded-full border-4 border-yellow-400 shadow-2xl hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8" />
                    <div>
                      <div className="font-bold text-lg">最短60秒で入力完了</div>
                      <div className="text-sm opacity-90">その場で結果表示</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  FAST
                </div>
              </div>
            </div>
          </div>

          {/* パターン8: ミニマル+太字強調 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン8: ミニマル+太字強調
            </h2>
            <p className="text-slate-600 mb-6">
              シンプルで読みやすいデザイン、テキストを最大限に強調
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-pink-500 text-white px-10 py-6 rounded-xl shadow-lg hover:bg-pink-600 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  <div>
                    <div className="font-black text-2xl">匿名・無料</div>
                    <div className="text-xs opacity-80 font-medium">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500 text-white px-10 py-6 rounded-xl shadow-lg hover:bg-blue-600 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <div>
                    <div className="font-black text-2xl">最短60秒で入力完了</div>
                    <div className="text-xs opacity-80 font-medium">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン9: カラフル+イラスト追加 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              パターン9: カラフル+イラスト追加
            </h2>
            <p className="text-slate-600 mb-6">
              親しみやすいビジュアルで、イラストやアイコンを多用
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-6 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-bold text-xl">匿名・無料</div>
                    <div className="text-sm opacity-90 flex items-center gap-1">
                      <span>✨</span>
                      <span>ANONYMOUS & FREE</span>
                      <span>✨</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-6 rounded-3xl shadow-2xl hover:shadow-cyan-500/50 transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-bold text-xl">最短60秒で入力完了</div>
                    <div className="text-sm opacity-90 flex items-center gap-1">
                      <span>⚡</span>
                      <span>その場で結果表示</span>
                      <span>⚡</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* パターン10: ダークモード対応デザイン */}
          <div className="bg-slate-900 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">
              パターン10: ダークモード対応デザイン
            </h2>
            <p className="text-slate-300 mb-6">
              暗い背景でも目立つデザイン、夜間の視認性を重視
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="bg-pink-900 text-pink-100 px-8 py-6 rounded-2xl border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                  <div>
                    <div className="font-bold text-lg">匿名・無料</div>
                    <div className="text-sm opacity-80">ANONYMOUS & FREE</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 text-blue-100 px-8 py-6 rounded-2xl border-2 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_rgba(37,99,235,0.8)] transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                  <div>
                    <div className="font-bold text-lg">最短60秒で入力完了</div>
                    <div className="text-sm opacity-80">その場で結果表示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 推奨パターンのサマリー */}
        <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">推奨パターン</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-pink-400">最もインパクトが強い</h3>
              <ul className="space-y-2 text-sm">
                <li>🥇 パターン2: ネオンライト風</li>
                <li>🥈 パターン1: 3D立体</li>
                <li>🥉 パターン4: アニメーション強調</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-blue-400">最もメリットを強調</h3>
              <ul className="space-y-2 text-sm">
                <li>🥇 パターン5: グラデーション+アイコン大型化</li>
                <li>🥈 パターン8: ミニマル+太字強調</li>
                <li>🥉 パターン6: カード型</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-green-400">バランスが良い</h3>
              <ul className="space-y-2 text-sm">
                <li>🥇 パターン3: グラスモーフィズム強化</li>
                <li>🥈 パターン7: バッジ型</li>
                <li>🥉 パターン9: カラフル+イラスト</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
