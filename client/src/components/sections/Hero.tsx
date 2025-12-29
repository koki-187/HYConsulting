import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/30 blur-3xl rounded-bl-full opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-yellow-50/40 blur-3xl rounded-tr-full opacity-60" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">初回相談無料キャンペーン実施中</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-slate-800 font-heading">
              ビジネスの<span className="text-primary">未来</span>を、<br />
              <span className="relative inline-block">
                共に描く
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              パートナー
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              HYコンサルティングは、あなたの会社の「強み」を見つけ出し、
              持続可能な成長へと導く伴走型パートナーです。
              複雑な課題も、親身な対話と確かな戦略で解決します。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-white group"
                onClick={scrollToContact}
              >
                無料相談を予約する
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 hover:bg-slate-50 text-slate-700"
                onClick={scrollToServices}
              >
                サービス資料を見る
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>累計支援 500社以上</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>顧客満足度 98%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>最短1ヶ月で成果</span>
              </div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
            <div className="relative aspect-[4/3] w-full">
              {/* Main Illustration */}
              <img 
                src="/images/hero_city_16x9.png" 
                alt="未来の街並みとビジネスの成長" 
                className="w-full h-full object-contain drop-shadow-2xl z-10 relative hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-blue-50 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">UP</div>
                  <div>
                    <p className="text-xs text-slate-400">売上成長率</p>
                    <p className="text-lg font-bold text-slate-800">+150%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-blue-50 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">★</div>
                  <div>
                    <p className="text-xs text-slate-400">顧客評価</p>
                    <p className="text-lg font-bold text-slate-800">4.9/5.0</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
