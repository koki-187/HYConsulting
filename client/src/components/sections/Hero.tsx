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
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-orange-50/50 to-white">
      {/* Background decoration - Warm and gentle */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-orange-100/30 blur-3xl rounded-bl-full opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-yellow-100/40 blur-3xl rounded-tr-full opacity-60" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-orange-700">初回相談無料キャンペーン実施中</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-slate-800 font-heading tracking-tight">
              老後資金・介護・相続<br />
              <span className="text-orange-600">安心の未来</span>をつくる<br />
              終活・資産整理サポート
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              「老後の資金が心配」「実家の処分どうしよう」「相続対策を始めたい」<br />
              そんなお悩みを、不動産と終活のプロがワンストップで解決します。<br />
              あなたとご家族の笑顔のために、最適なプランをご提案します。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all bg-orange-600 hover:bg-orange-700 text-white group"
                onClick={scrollToContact}
              >
                無料相談を予約する
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-lg border-2 border-orange-100 hover:bg-orange-50 text-slate-700"
                onClick={scrollToServices}
              >
                サービス詳細を見る
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <span>相続・空き家対策のプロ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <span>介護施設探しのサポート</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <span>地域密着の信頼</span>
              </div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-[600px] lg:max-w-none"
          >
            <div className="relative aspect-[4/3] w-full">
              {/* Main Illustration - Senior Couple */}
              <img 
                src="/images/hero_senior_couple.png" 
                alt="笑顔で手をつないで歩くシニア夫婦" 
                className="w-full h-full object-contain drop-shadow-xl z-10 relative rounded-2xl"
              />
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-orange-100 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">ゆとりある生活</p>
                    <p className="text-base font-bold text-slate-800">老後資金の確保</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-8 bg-white p-4 rounded-xl shadow-lg border border-orange-100 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">実家の悩み解決</p>
                    <p className="text-base font-bold text-slate-800">空き家・不動産売却</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 right-12 bg-white p-4 rounded-xl shadow-lg border border-orange-100 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">円満な相続</p>
                    <p className="text-base font-bold text-slate-800">生前整理サポート</p>
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
