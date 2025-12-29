import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Home, Users, Building2, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "不動産購入・売却・活用支援",
    description: "自宅の購入や売却、不動産投資等の資産形成、相続対策等、ライフイベントに対して最適な方策を考察し実行まで支援します。",
    color: "bg-blue-50 text-primary",
    image: "/images/service_house_1x1.png"
  },
  {
    icon: HeartHandshake,
    title: "老後資金・介護・相続の終活支援",
    description: "老後ライフプランの作成、老後資金の準備、介護生活サポート、想いと財産を円満に託すための相続対策など、終活に関するお悩みに対応します。",
    color: "bg-yellow-50 text-yellow-600",
    image: "/images/worry_1x1.png"
  },
  {
    icon: Building2,
    title: "０円物件・負動産の処分活用支援",
    description: "売れない、貸せない空き家や遊休地の処分にお悩みの方へ。利活用、引き取り、管理、名義変更など、専門チームがワンストップで対応します。",
    color: "bg-slate-100 text-slate-600",
    image: "/images/case_before_after_16x9.png"
  },
  {
    icon: Users,
    title: "不動産パーソン育成採用支援",
    description: "不動産業界に特化した人材育成・採用支援を行います。顧客課題や地域社会問題に対して行動できる人材を育成します。",
    color: "bg-green-50 text-green-600",
    image: "/images/experts_network_1x1.png"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration - Simplified */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-slate-50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-blue-50 rounded-full"
          >
            Our Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 font-heading"
          >
            個人から法人まで<br className="hidden sm:block" />
            <span className="text-primary relative inline-block">
              幅広い課題に対応
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/50 -z-10 rounded-sm" />
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            不動産を通じて『人生設計』と『社会課題の解決』を支援します。<br className="hidden lg:block" />
            住まい・資産形成・空き家問題・相続・人材・法人支援まで、ワンストップで対応します。
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="h-full border-none shadow-soft hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-xl flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardHeader className="pt-6 pb-2 px-6">
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors leading-snug min-h-[3.5rem]">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-6 pb-6 flex-grow flex flex-col justify-between">
                  <CardDescription className="text-sm text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </CardDescription>
                  
                  <div className="flex items-center text-primary font-bold text-sm group/link cursor-pointer mt-auto">
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
