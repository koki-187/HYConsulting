import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Home, Building2, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "不動産購入・売却・活用支援",
    description: "「どこに相談したらいいかわからない」「日本全国・複数の不動産でも窓口を一本化したい」「売る、買うだけでなく、法律や税金も含めて総合的にアドバイス欲しい」—そんなご希望のある方は丸っとHY Consultingにお任せください。",
    details: [
      "買う、売るなどの意思決定に至るまでのプロセスを大切に",
      "ご事情・ライフプランを起点とした包括的な選択肢をご提案",
      "税理士、弁護士、司法書士、FP等の専門家ネットワークを駆使",
      "あなただけのワンチームをアレンジしワンストップでご支援"
    ],
    color: "bg-blue-100 text-primary",
    image: "/images/hero_city_16x9.png",
    highlight: "初回相談は無料ですのでお気軽にお問合せください。"
  },
  {
    icon: HeartHandshake,
    title: "老後資金・介護・相続の終活支援",
    description: "「老後資金はいくら必要なのか試算して欲しい」「不動産や金融商品など自分に合った資産運用方法を知りたい」「介護サービスや老人ホーム等の高齢者施設を探している」「相続に向けた財産の整理、今からできる節税方法を知りたい」—そんなご希望のある方はHY Consultingにお任せください。",
    details: [
      "シニア世代の様々なお悩みにワンストップで解決できるプラットフォーム",
      "税理士、司法書士などの士業と連携し、老人ホーム等の高齢者施設のご紹介",
      "遺品整理や墓じまいまで日本全国のパートナーをアサイン",
      "豊富な経験と実績から導かれる将来のリスクや可能性を予期しながらサポート"
    ],
    color: "bg-amber-100 text-primary",
    image: "/images/hero_senior_couple.png",
    highlight: "初回相談は無料ですのでお気軽にお問合せください。"
  },
  {
    icon: Building2,
    title: "０円物件・負動産の処分活用支援",
    description: "「どこの不動産会社も取り扱ってもらえない」「売ることも、貸すことも、引き取ってもらうこともできない」「所有者が行方不明で手が付けられない」「山、畑、田など、住宅でない不動産はどうしたらいいのか」—そんなお悩みのある方はHY Consultingにお任せください。",
    details: [
      "売れる貸せる不動産だけでなく、どこの不動産会社も取り扱ってくれない不動産の利活用や処分",
      "空き家や遊休地の利活用、地方移住者の支援、住宅確保要配慮者への住宅の提供",
      "社会や行政が求めている用途への利活用を模索",
      "限りある資源を日本の社会の中で有効に循環させられるよう社会貢献にもチャレンジ"
    ],
    color: "bg-green-100 text-primary",
    image: "/images/service_renovation.png",
    highlight: "「どうせ無理だ」と諦める前にまずは相談してみてください。"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-white relative overflow-hidden">
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
              <Card className="h-full border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-lg flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardHeader className="pt-6 sm:pt-8 pb-4 px-6 sm:px-8">
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
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
                    <ul className="space-y-2 mb-6">
                      {service.details.map((detail, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-primary italic border-t border-slate-100 pt-4">
                      {service.highlight}
                    </p>
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
