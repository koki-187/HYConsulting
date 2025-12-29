import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const achievements = [
  {
    category: "製造業",
    title: "生産プロセス改革によるコスト削減",
    result: "製造コスト 20%削減",
    image: "/images/case_before_after_16x9.png"
  },
  {
    category: "小売業",
    title: "店舗DX推進とEC連携強化",
    result: "売上高 150%達成",
    image: "/images/valuation_4x3.png"
  },
  {
    category: "サービス業",
    title: "人事評価制度の刷新と定着化",
    result: "離職率 10%改善",
    image: "/images/experts_network_1x1.png"
  }
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-blue-50 rounded-full"
          >
            Case Studies
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 font-heading"
          >
            確かな実績と<br className="hidden sm:block" />
            <span className="text-primary relative inline-block">
              具体的な成果
              <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-200/50 -z-10 rounded-sm" />
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            多くの企業様の課題解決と成長をご支援させていただいております。
            業界・規模を問わず、確実な成果を創出します。
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="h-full border-none shadow-soft hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-[2rem] flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {item.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">成果</p>
                        <p className="text-2xl font-bold text-primary">{item.result}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
