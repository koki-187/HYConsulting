import { motion } from 'framer-motion';
import { Shield, Clock } from 'lucide-react';
import AssessmentForm from './AssessmentForm';

export default function Assessment() {
  return (
    <section id="assessment" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase border-b-2 border-blue-600 pb-1">
              Real Estate Assessment
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-10 font-heading"
          >
            無料不動産査定
          </motion.h2>
          
          {/* 拡大版バッジ + 強化スプリングアニメーション */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mb-12">
            {/* 匿名・無料 Badge - さらに拡大 + 強化スプリング */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 10 }}
              className="inline-flex items-center gap-4 px-9 py-5 rounded-3xl bg-white border-2 border-pink-400 shadow-2xl hover:shadow-3xl transition-all animate-pulse"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-500 shadow-xl">
                <Shield className="w-10 h-10 text-white" fill="white" strokeWidth={0} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-pink-700 font-bold text-xl tracking-wide">
                  匿名・無料
                </span>
                <span className="text-pink-400 text-[11px] font-medium uppercase tracking-wider">
                  Anonymous & Free
                </span>
              </div>
            </motion.div>

            {/* 最短60秒 Badge - 拡大 + 強化スプリング */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 10 }}
              className="inline-flex items-center gap-4 px-9 py-5 rounded-3xl bg-white border-2 border-blue-400 shadow-2xl hover:shadow-3xl transition-all animate-pulse"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 shadow-xl">
                <Clock className="w-10 h-10 text-white" fill="white" strokeWidth={0} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-blue-700 font-bold text-xl tracking-wide">
                  最短60秒で入力完了
                </span>
                <span className="text-blue-400 text-[11px] font-medium tracking-wider">
                  その場で結果表示
                </span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Assessment Form Section - Prominently Displayed */}
        <div className="mb-20">
          <AssessmentForm />
        </div>




      </div>
    </section>
  );
}
