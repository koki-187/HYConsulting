import { motion } from "framer-motion";
import { Calculator, Home, FileSearch, Shield, Sparkles } from "lucide-react";
import AssessmentForm from "./AssessmentForm";

const steps = [
  {
    icon: Home,
    title: "訪問査定（正確な価格を知る）",
    description: "現地を実際に訪問し、建物の状態や周辺環境を詳細に調査。より正確な査定価格をご提示します。"
  },
  {
    icon: FileSearch,
    title: "最適なプランのご提案",
    description: "訪問査定の結果をもとに、お客様のご希望に合わせて「仲介売却」か「買取」か、最適なプランをご提案します。"
  }
];

export default function Assessment() {
  return (
    <section id="assessment" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b-2 border-primary"
          >
            Real Estate Assessment
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-heading relative inline-block"
          >
            {/* Premium Badge - Glassmorphism Design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3
              }}
              className="absolute -top-20 sm:-top-24 md:-top-28 lg:-top-16 left-1/2 -translate-x-1/2 group z-10"
            >
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-rose-500/30 to-pink-500/30 rounded-3xl blur-xl animate-pulse"></div>
              
              {/* Main badge container */}
              <div className="relative bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Content */}
                <div className="relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                  {/* Icon with animation */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </motion.div>
                  
                  {/* Text */}
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-xl sm:text-2xl tracking-wider drop-shadow-lg" style={{ letterSpacing: '0.15em' }}>
                      匿名・無料
                    </span>
                    <span className="text-white/90 text-[10px] sm:text-xs font-medium tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
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
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 drop-shadow-lg" fill="currentColor" />
                  </motion.div>
                </div>
                
                {/* Bottom border accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
              
              {/* Triangle pointer with gradient */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-pink-600 drop-shadow-lg"></div>
              </div>
            </motion.div>
            <span className="mt-16 sm:mt-20 md:mt-24 lg:mt-12 block">無料不動産査定</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            たった３つの物件情報を入力するだけで瞬時に概算価格を算出。
            <br className="block my-2" />
            国土交通省のデータベースと連動し膨大な取引事例と公的データから概算価格を導き出します。
            <br className="block my-3" />
            <span className="block text-sm sm:text-base font-semibold text-slate-700 my-2">あなたの不動産、今いくら？</span>
            <span className="block text-sm sm:text-base font-semibold text-slate-700 my-2">かんたん無料！概算価格査定</span>
            <br className="block my-2" />
            <span className="block text-xs sm:text-sm text-slate-500 my-1">※詳細情報を入力する程、査定結果の精度があがります。</span>
            <span className="block text-xs sm:text-sm text-slate-500 my-1">※入力完了後、その場で結果が表示されます。</span>
          </motion.p>
        </div>

        {/* Assessment Form Section - Prominently Displayed */}
        <div className="mb-20">
          <AssessmentForm />
        </div>


      </div>
    </section>
  );
}
