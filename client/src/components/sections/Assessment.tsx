import { motion } from 'framer-motion';
import { Shield, Clock } from 'lucide-react';
import AssessmentForm from './AssessmentForm';

export default function Assessment() {
  return (
    <section id="assessment" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background decorative elements - matching official HP style */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft pastel blue circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-50/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
        
        {/* Large "HY" watermark */}
        <span 
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] sm:text-[25rem] lg:text-[30rem] font-bold leading-none"
          style={{
            color: 'rgba(168, 212, 230, 0.06)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          HY
        </span>
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
          
          {/* バッジ - 添付画像1のバランスに合わせたデザイン */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12">
            {/* 匿名・無料 Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 10 }}
              whileHover={{ scale: 1.08, y: -4, rotate: 1 }}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-pink-400 shadow-lg hover:shadow-xl transition-all duration-300" style={{width: '289px'}}
            >
              <motion.div 
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Shield className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-pink-600 font-bold text-lg tracking-wide" style={{fontSize: '22px'}}>
                  匿名・無料
                </span>
                <span className="text-pink-400 text-[10px] font-medium uppercase tracking-wider">
                  ANONYMOUS & FREE
                </span>
              </div>
            </motion.div>

            {/* 最短60秒 Badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 10 }}
              whileHover={{ scale: 1.08, y: -4, rotate: -1 }}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div 
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-md"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Clock className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-blue-600 font-bold text-lg tracking-wide" style={{fontSize: '20px'}}>
                  最短60秒で入力完了
                </span>
                <span className="text-blue-400 text-[10px] font-medium tracking-wider">
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
