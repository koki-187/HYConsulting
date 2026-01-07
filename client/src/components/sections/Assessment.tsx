import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
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
        <div className="text-center mb-16">
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
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-heading"
          >
            無料不動産査定
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            {/* Glassmorphism badges - 匿名・無料 and 最短60秒 */}
            <span className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg font-semibold text-slate-700 my-4">
              {/* Glassmorphism Badge - 匿名・無料 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.4
                }}
                className="relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg group"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(244, 63, 94, 0.25), rgba(220, 38, 38, 0.3))',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                {/* Shield icon */}
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 drop-shadow" fill="currentColor" />
                
                {/* Text content */}
                <div className="flex flex-col leading-tight">
                  <span className="text-pink-700 font-extrabold text-sm sm:text-base tracking-wide drop-shadow" style={{ letterSpacing: '0.1em' }}>
                    匿名・無料
                  </span>
                  <span className="text-pink-600/80 text-[8px] sm:text-[9px] font-medium tracking-wider uppercase" style={{ letterSpacing: '0.15em' }}>
                    Anonymous & Free
                  </span>
                </div>
                
                {/* Sparkle icon */}
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500 drop-shadow" fill="currentColor" />
                </motion.div>
                
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 2
                  }}
                />
              </motion.div>
              
              {/* 最短60秒で入力完了・その場で結果表示 Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.5
                }}
                className="relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg group"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.25), rgba(29, 78, 216, 0.3))',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                {/* Clock icon */}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                
                {/* Text content */}
                <div className="flex flex-col leading-tight">
                  <span className="text-blue-700 font-extrabold text-sm sm:text-base tracking-wide drop-shadow" style={{ letterSpacing: '0.05em' }}>
                    最短60秒で入力完了
                  </span>
                  <span className="text-blue-600/80 text-[8px] sm:text-[9px] font-medium tracking-wider" style={{ letterSpacing: '0.1em' }}>
                    その場で結果表示
                  </span>
                </div>
                
                {/* Sparkle icon */}
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500 drop-shadow" fill="currentColor" />
                </motion.div>
                
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 2,
                    delay: 0.5
                  }}
                />
              </motion.div>
            </span>
          </motion.p>
        </div>

        {/* Assessment Form Section - Prominently Displayed */}
        <div className="mb-20">
          <AssessmentForm />
        </div>



        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            あなたの不動産、<span className="text-blue-600">今いくら？</span>即時査定
          </h3>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            物件情報を入力するだけで、膨大な取引事例と公的データを照合。<br />
            <span className="font-semibold text-blue-600">概算価格を瞬時に算出</span>します。
          </p>
          
          {/* Info Box */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-slate-900 mb-2">不動産価格を知りたい方はまずは即時査定</h4>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* 匿名・無料 Badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(244, 63, 94, 0.25), rgba(220, 38, 38, 0.3))',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    <Shield className="w-4 h-4 text-pink-600" fill="currentColor" />
                    <span className="text-pink-700 font-bold text-xs tracking-wide">匿名・無料</span>
                  </div>
                  
                  {/* 最短60秒 Badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.25), rgba(29, 78, 216, 0.3))',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-700 font-bold text-xs tracking-wide">最短60秒で入力完了・その場で結果表示</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
