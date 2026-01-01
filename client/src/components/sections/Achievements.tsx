import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const achievements = [
  {
    category: "不動産事業支援",
    title: "高齢者施設斡旋業のご支援",
    result: "資金計画・相続対策",
    description: "介護施設入居前後の資金計画や相続の不安に対し、不動産の有効活用を通じて安心できる老後の暮らしを支援します。",
    image: "/images/elderly_support.png"
  },
  {
    category: "不動産購入・売却",
    title: "５年売れなかった土地をアイデアで即売却",
    result: "早期売却達成",
    description: "他の不動産会社にて５年売れなかった空き家を、独自のアイデアとネットワークで即座に売却へと導きました。",
    image: "/images/land_sale.png"
  },
  {
    category: "空き家活用",
    title: "相続した空き家の有効活用",
    result: "収益化実現",
    description: "放置されていた空き家をリノベーションし、地域のコミュニティスペースとして再生。収益化と地域貢献を両立。",
    image: "/images/experts_network_1x1.png"
  }
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration - Professional */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b-2 border-primary"
          >
            Case Studies
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-heading"
          >
            確かな実績と<br className="hidden sm:block" />
            <span className="text-primary relative inline-block">
              具体的な解決事例
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed font-sans"
          >
            個人のお客様から法人様まで、様々な課題を解決に導いた実績がございます。<br className="hidden lg:block" />
            その一部をご紹介します。
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
              <Card className="h-full border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-sm flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-sm shadow-sm border border-slate-100">
                    {item.category}
                  </div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 font-sans">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">成果</p>
                        <p className="text-lg font-bold text-primary font-heading">{item.result}</p>
                      </div>
                      <div className="w-8 h-8 rounded-sm bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
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
