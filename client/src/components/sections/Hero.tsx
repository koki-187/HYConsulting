import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, Home, PiggyBank } from "lucide-react";

export default function Hero() {
  const scrollToAssessment = () => {
    const element = document.querySelector("#assessment");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-blue-100/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container mx-auto px-4">
        {/* Main Content - Centered Layout */}
        <div className="flex flex-col items-center justify-center gap-12 lg:gap-16">
          
          {/* Text Content - Centered */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-4xl z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 text-slate-900 font-heading tracking-tight">
              悩む、考える、<br />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">以前に。</span>
            </h1>
            
            <div className="mb-8 sm:mb-10">
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 mb-4 leading-relaxed">
                初めに大事な事は、
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 leading-relaxed">
                <span className="text-primary font-bold">ご自身の状況を把握する事</span>です。
              </p>
            </div>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-10 sm:mb-12 leading-relaxed max-w-2xl font-sans">
              不動産の価値を知ることから、<br className="hidden sm:block" />
              老後・相続・資産活用の最適な選択肢が見えてきます。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white group font-bold tracking-wide"
                onClick={scrollToAssessment}
              >
                まずは無料査定から
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 rounded-full border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-all"
                onClick={() => window.open('https://hyconsulting.jp/contact', '_blank')}
              >
                ご相談はこちら
              </Button>
            </div>
          </motion.div>

          {/* Image Content - Centered Below Text */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl group">
              {/* Background Image - Sea Town Illustration */}
              <img 
                src="/images/hero_city_16x9.png" 
                alt="海に囲まれた街の風景" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Glassmorphism Panel Overlay - Bottom Center */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 bg-gradient-to-t from-black/40 to-transparent">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-full bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl p-6 lg:p-8 shadow-2xl"
                >
                  <div className="flex justify-around items-center gap-4 lg:gap-8">
                    {/* Item 1: Asset */}
                    <div className="flex flex-col items-center text-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/40 rounded-full flex items-center justify-center text-white shrink-0 backdrop-blur">
                        <PiggyBank className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-bold uppercase tracking-wider mb-1">Asset</p>
                        <p className="text-sm lg:text-base font-bold text-white leading-tight">老後資金</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-12 bg-white/30" />

                    {/* Item 2: Real Estate */}
                    <div className="flex flex-col items-center text-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/40 rounded-full flex items-center justify-center text-white shrink-0 backdrop-blur">
                        <Home className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-bold uppercase tracking-wider mb-1">Real Estate</p>
                        <p className="text-sm lg:text-base font-bold text-white leading-tight">空き家・売却</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-12 bg-white/30" />

                    {/* Item 3: Support */}
                    <div className="flex flex-col items-center text-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-colors">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/40 rounded-full flex items-center justify-center text-white shrink-0 backdrop-blur">
                        <HeartHandshake className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white font-bold uppercase tracking-wider mb-1">Support</p>
                        <p className="text-sm lg:text-base font-bold text-white leading-tight">生前整理</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
