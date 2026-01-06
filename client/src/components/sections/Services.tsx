import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Home, Building2, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: HeartHandshake,
    title: "老後資金・介護・相続の終活支援",
    description: "「老後資金はいくら必要なのか試算して欲しい」\n「不動産や金融商品など自分に合った資産運用方法を知りたい」\n「相続に向けた財産の整理、今からできる節税方法を知りたい」\n「介護サービスや老人ホーム等の高齢者施設を探している」",
    details: [
      "ファイナンシャルプランナーによる老後ライフプラン・キャッシュフロー表の作成",
      "IFAによる資産運用アドバイス",
      "税理士による相続税、贈与税、所得税等の税務相談",
      "司法書士による遺言書作成、信託、相続登記の代行",
      "8000カ所を超える老人ホーム等高齢者施設の紹介と入居斜旋",
      "貴重品買取、銀行口座整理、不用品処分等のサポート"
    ],
    color: "bg-amber-100 text-primary",
    image: "/images/hero_senior_couple.png"
  },
  {
    icon: Home,
    title: "不動産購入・売却・活用支援",
    description: "「売った方が良いのか、貸した方が良いのかアドバイス欲しい」\n「不動産だけでなく法律や税金も含めて総合的にサポートして欲しい」\n「残置物処分、測量、解体、リフォームなどもワンストップで相談したい」\n「まずは情報収集したいだけなので営業しないで欲しい」\n「日本全国にある複数の不動産を一つの窓口に任せたい」",
    details: [
      "不動産コンサルタントによる総合的な相談、選択肢の提示、意思決定のサポート",
      "宅地建物取引士による物件調査、価格査定書作成、売却計画の立案",
      "ファイナンシャルプランナーによる資金計画作成、融資相談",
      "AIを活用した物件情報収集と紹介、検討サポート",
      "税理士による税金シュミレーション作成、税務サポート",
      "弁護士による権利関係等の紛争相談"
    ],
    color: "bg-blue-100 text-primary",
    image: "/images/services_consulting.png"
  },
  {
    icon: Building2,
    title: "０円物件・負動産の処分活用支援",
    description: "「売ることも、貸すことも、引き取ってもらうこともできない」\n「どこの不動産会社も取り扱ってもらえない」\n「山、畑、田など、住宅でない不動産はどうしたらいいのか」\n「所有者が行方不明で手が付けられない」",
    details: [
      "不動産コンサルタントによる最適用途の検討、利活用の可能性模索",
      "自治体の空き家支援、地方移住者支援、解体補助金の活用",
      "住宅セーフティネット制度 住宅確保配慮者への住宅の提供",
      "農地法関連の相談、転用手続きのサポート",
      "司法書士による行方不明の所有者の捕索、財産管理人の申し立て"
    ],
    color: "bg-green-100 text-primary",
    image: "/images/service_renovation.png"
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
                  <CardDescription className="text-base text-slate-600 leading-relaxed mb-6 font-sans whitespace-pre-line">
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
