import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Home, Building2, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: HeartHandshake,
    title: "老後資金・介護・相続の終活支援",
    description: "老後の生活設計から資金計画、介護施設の選定、そして円満な相続までをトータルサポートします。専門家（税理士・司法書士・FP）と連携し、複雑な手続きや将来の不安を解消。ご家族の想いを大切にしながら、安心できる未来を設計します。",
    details: [
      "老後ライフプランの作成・資金シミュレーション",
      "有料老人ホーム・高齢者住宅の紹介・入居支援",
      "遺言書作成・家族信託・生前贈与のサポート",
      "遺品整理・死後事務委任契約の締結"
    ],
    color: "bg-slate-100 text-primary",
    image: "/images/hero_senior_couple.png"
  },
  {
    icon: Home,
    title: "不動産購入・売却・活用支援",
    description: "お客様のライフステージに合わせた最適な不動産戦略をご提案します。自宅の売却・住み替えはもちろん、収益物件の購入や遊休地の有効活用まで幅広く対応。市場分析に基づいた適正価格での取引を実現し、資産価値の最大化を目指します。",
    details: [
      "居住用不動産の売却・購入・住み替え支援",
      "収益不動産（アパート・マンション）の運用提案",
      "相続不動産の売却・権利調整・登記手続き",
      "リフォーム・リノベーションによる価値向上"
    ],
    color: "bg-slate-100 text-primary",
    image: "/images/service_consultation.png"
  },
  {
    icon: Building2,
    title: "０円物件・負動産の処分活用支援",
    description: "「売れない」「貸せない」「管理できない」といった、いわゆる“負動産”の問題を解決します。他社で断られた物件でも、独自のネットワークとノウハウで引き取りや活用方法をご提案。固定資産税や管理責任の負担から解放されるようサポートします。",
    details: [
      "長期間売れていない空き家・空き地の処分相談",
      "再建築不可物件・市街化調整区域の活用提案",
      "遠隔地の管理不全空き家の巡回・管理代行",
      "近隣トラブルや権利関係が複雑な物件の整理"
    ],
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
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 font-heading"
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
                
                <CardHeader className="pt-6 sm:pt-8 pb-4 px-6 sm:px-8">
                  <div className={`w-12 h-12 rounded-sm ${service.color} flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-snug min-h-[3rem] sm:min-h-[3.5rem] font-heading">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8 flex-grow flex flex-col">
                  <CardDescription className="text-base text-slate-600 leading-relaxed mb-6 font-sans">
                    {service.description}
                  </CardDescription>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-primary mb-3">主な支援内容</h4>
                    <ul className="space-y-2">
                      {service.details.map((detail, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
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
