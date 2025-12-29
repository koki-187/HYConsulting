import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Home, LineChart } from "lucide-react";

export default function Assessment() {
  return (
    <section id="assessment" className="py-20 lg:py-32 bg-blue-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-900 uppercase bg-yellow-400 rounded-full">
              Free Assessment
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-heading leading-tight">
              あなたの不動産の<br />
              <span className="text-yellow-400">適正価値</span>を知りませんか？
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              「いくらで売れるか知りたい」「活用方法に迷っている」<br />
              そんなお悩みをお持ちの方は、まずは無料査定をご利用ください。<br />
              地域の相場や市場動向を踏まえ、適正な価格を算出します。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                無料査定を依頼する
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Cards Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="grid gap-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">簡易机上査定</h3>
                    <p className="text-blue-100 text-sm">
                      周辺の成約事例や公示地価などのデータに基づき、概算価格をスピーディーに算出します。
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">訪問実査定</h3>
                    <p className="text-blue-100 text-sm">
                      現地を実際に確認し、建物の状態や周辺環境などを詳細に調査。より正確な査定価格をご提示します。
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">売却・活用プラン提案</h3>
                    <p className="text-blue-100 text-sm">
                      査定結果をもとに、売却だけでなく賃貸やリノベーションなど、お客様に最適なプランをご提案します。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
