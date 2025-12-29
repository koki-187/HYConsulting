import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  {
    category: "製造業",
    title: "生産プロセス改革によるコスト削減",
    result: "製造コスト 20%削減",
    image: "/images/lp/case_before_after_16x9.png"
  },
  {
    category: "小売業",
    title: "店舗DX推進とEC連携強化",
    result: "売上高 150%達成",
    image: "/images/lp/valuation_4x3.png"
  },
  {
    category: "サービス業",
    title: "人事評価制度の刷新と定着化",
    result: "離職率 10%改善",
    image: "/images/lp/experts_network_1x1.png"
  }
];

export default function Achievements() {
  return (
    <section id="achievements" className="section-padding bg-navy-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/lp/hero_city_16x9.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/80 to-navy-900/90" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-wider uppercase text-sm"
          >
            Case Studies
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            支援実績
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300"
          >
            多くの企業様の課題解決と成長をご支援させていただいております。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACHIEVEMENTS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-colors duration-300 group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400 mb-1">成果</p>
                    <p className="text-2xl font-bold text-gold-400">{item.result}</p>
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
