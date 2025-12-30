import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Home, Building2, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: HeartHandshake,
    title: "老後資金・介護・相続の終活支援",
    description: "老後ライフプランの作成、老後資金の準備、介護生活サポート、想いと財産を円満に託すための相続対策など、終活に関するお悩みに対応します。",
    color: "bg-slate-100 text-primary",
    image: "/images/hero_senior_couple.png"
  },
  {
    icon: Home,
    title: "不動産購入・売却・活用支援",
    description: "自宅の購入や売却、不動産投資等の資産形成、相続対策等、ライフイベントに対して最適な方策を考察し実行まで支援します。",
    color: "bg-slate-100 text-primary",
    image: "/images/service_consultation.png"
  },
  {
    icon: Building2,
    title: "０円物件・負動産の処分活用支援",
    description: "売れない、貸せない空き家や遊休地の処分にお悩みの方へ。利活用、引き取り、管理、名義変更など、専門チームがワンストップで対応します。",
    color: "bg-slate-100 text-primary",
    image: "/images/service_renovation.png"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration - Professional */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b-2 border-primary"
          >
            Our Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 font-heading"
          >
            あなたとご家族の<br className="hidden sm:block" />
            <span className="text-primary relative inline-block">
              未来を支える3つの柱
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed font-sans"
          >
            不動産と終活のプロフェッショナルが、<br className="hidden lg:block" />
            老後の安心、資産の活用、負動産の解決までワンストップでサポートします。
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="h-full border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-sm flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardHeader className="pt-8 pb-4 px-8">
                  <div className={`w-12 h-12 rounded-sm ${service.color} flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-snug min-h-[3.5rem] font-heading">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 pb-8 flex-grow flex flex-col justify-between">
                  <CardDescription className="text-base text-slate-600 leading-relaxed mb-6 font-sans">
                    {service.description}
                  </CardDescription>
                  
                  <div className="flex items-center text-primary font-bold text-sm group/link cursor-pointer mt-auto border-b border-transparent hover:border-primary w-fit pb-0.5 transition-all">
                    詳しく見る
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
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
