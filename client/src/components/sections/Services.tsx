import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Lightbulb, Users } from "lucide-react";

const services = [
  {
    icon: Lightbulb,
    title: "経営戦略コンサルティング",
    description: "現状分析からビジョン策定、実行計画まで。経営者の想いを形にし、持続可能な成長戦略を共に描きます。",
    color: "bg-yellow-100 text-yellow-600",
    image: "/images/service_house_1x1.png"
  },
  {
    icon: BarChart3,
    title: "DX・業務改革支援",
    description: "デジタル技術を活用した業務効率化と新たな価値創造。現場に定着する実践的なDXを推進します。",
    color: "bg-blue-100 text-blue-600",
    image: "/images/worry_1x1.png"
  },
  {
    icon: Users,
    title: "組織開発・人材育成",
    description: "自律的に考え行動する組織づくり。リーダーシップ開発やチームビルディングを通じて組織力を最大化します。",
    color: "bg-green-100 text-green-600",
    image: "/images/experts_network_1x1.png"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-50 rounded-full blur-3xl" />
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
            お客様の課題に合わせた<br className="hidden sm:block" />
            <span className="text-primary relative inline-block">
              最適なソリューション
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
            企業の成長フェーズや課題に合わせて、3つの領域から最適な支援プランをご提案します。
            単なるアドバイスに留まらず、現場に入り込み、実行まで伴走します。
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="h-full border-none shadow-soft hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-[2rem]">
                <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardHeader className="pt-8 pb-4 px-8">
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <CardDescription className="text-base text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </CardDescription>
                  
                  <div className="flex items-center text-primary font-bold text-sm group/link cursor-pointer">
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
