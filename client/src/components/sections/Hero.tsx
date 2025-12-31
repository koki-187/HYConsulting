import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, HeartHandshake, Home, PiggyBank } from "lucide-react";

export default function Hero() {
  const scrollToAssessment = () => {
    const element = document.querySelector("#assessment");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background decoration - Professional & Sharp */}
      <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-slate-50 skew-x-12 translate-x-1/4" />
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-gradient-to-b from-slate-50/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border-l-4 border-primary bg-slate-50 mb-8">
              <span className="text-sm font-bold text-primary tracking-wider">HPをご覧の方へ：そのお悩み、ここで解決します</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-slate-900 font-heading tracking-tight">
              老後・相続・不動産<br />
              <span className="text-primary">窓口ひとつで解決。</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans font-bold">
              複数の業者への連絡は不要です。<br />
              査定から対策まで、プロがワンストップで対応します。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-sm shadow-lg hover:shadow-xl transition-all bg-secondary hover:bg-secondary/90 text-white group font-bold tracking-wide"
                onClick={scrollToAssessment}
              >
                まずは無料査定から
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-sm border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                ご相談はこちら
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>たらい回しなし</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>最短即日対応</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>秘密厳守</span>
              </div>
            </div>
          </motion.div>

          {/* Image Content with Glassmorphism Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-2xl">
              {/* Background Image - Sea Town Illustration */}
              <img 
                src="/images/hero_senior_couple.png" 
                alt="海に囲まれた街の風景" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Glassmorphism Panel Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-full max-w-md bg-white/20 backdrop-blur-md border border-white/40 rounded-xl p-8 shadow-lg"
                >
                  <div className="grid gap-6">
                    {/* Item 1: Asset */}
                    <div className="flex items-center gap-4 bg-white/60 p-4 rounded-lg border border-white/50 shadow-sm hover:bg-white/80 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <PiggyBank className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Asset</p>
                        <p className="text-lg font-bold text-slate-900">老後資金の確保</p>
                      </div>
                    </div>

                    {/* Item 2: Real Estate */}
                    <div className="flex items-center gap-4 bg-white/60 p-4 rounded-lg border border-white/50 shadow-sm hover:bg-white/80 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <Home className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Real Estate</p>
                        <p className="text-lg font-bold text-slate-900">空き家・売却</p>
                      </div>
                    </div>

                    {/* Item 3: Support */}
                    <div className="flex items-center gap-4 bg-white/60 p-4 rounded-lg border border-white/50 shadow-sm hover:bg-white/80 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <HeartHandshake className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Support</p>
                        <p className="text-lg font-bold text-slate-900">生前整理サポート</p>
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
