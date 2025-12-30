import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, HeartHandshake, Home, PiggyBank } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
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
              <span className="text-sm font-bold text-primary tracking-wider">初回相談無料キャンペーン実施中</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-slate-900 font-heading tracking-tight">
              老後資金・介護・相続<br />
              <span className="text-primary">安心の未来</span>をつくる<br />
              終活・資産整理サポート
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              「老後の資金が心配」「実家の処分どうしよう」「相続対策を始めたい」<br />
              そんなお悩みを、不動産と終活のプロがワンストップで解決します。<br />
              あなたとご家族の笑顔のために、最適なプランをご提案します。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-sm shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-white group font-bold tracking-wide"
                onClick={scrollToContact}
              >
                無料相談を予約する
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-7 rounded-sm border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                onClick={scrollToServices}
              >
                サービス詳細を見る
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>相続・空き家対策のプロ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>介護施設探しのサポート</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>地域密着の信頼</span>
              </div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
            <div className="relative aspect-[4/3] w-full pl-4 pb-4">
              {/* Decorative Frame */}
              <div className="absolute top-0 right-0 w-full h-full border-2 border-primary/20 translate-x-4 -translate-y-4 z-0" />
              
              {/* Main Illustration - Senior Couple */}
              <img 
                src="/images/hero_senior_couple.png" 
                alt="笑顔で手をつないで歩くシニア夫婦" 
                className="w-full h-full object-contain drop-shadow-2xl z-10 relative bg-white"
              />
              
              {/* Floating Elements - Clean & Sharp */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 bg-white p-5 shadow-xl border-l-4 border-primary z-20 hidden sm:block min-w-[180px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-primary">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Asset</p>
                    <p className="text-base font-bold text-slate-900">老後資金の確保</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-12 bg-white p-5 shadow-xl border-l-4 border-primary z-20 hidden sm:block min-w-[180px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-primary">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Real Estate</p>
                    <p className="text-base font-bold text-slate-900">空き家・売却</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-8 right-12 bg-white p-5 shadow-xl border-l-4 border-primary z-20 hidden sm:block min-w-[180px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-primary">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Support</p>
                    <p className="text-base font-bold text-slate-900">生前整理サポート</p>
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
