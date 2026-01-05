"use client";

import { motion } from "framer-motion";
import { Users, Globe, Lightbulb, CheckCircle2 } from "lucide-react";

const features = [
  {
    title: "ワンストップ対応",
    description: "複雑な問題も、一つの窓口で解決。法律、税金、登記、不動産、介護施設のご紹介、遺品整理など、多岐にわたるご事情に対応できるよう、各分野の専門家と連携し、あなたのための総合サポートを実現します。",
    icon: Users,
    benefits: ["弁護士・税理士・司法書士と連携", "ワンストップで全て解決", "時間と手間を大幅削減"]
  },
  {
    title: "全国対応のネットワーク",
    description: "日本全国の士業、各分野の専門家とのネットワークを持ち、どこにお住まいでも最適なサポートを実現。地域の特性を理解した専門家が、あなたのご事情に最適な提案をさせていただきます。",
    icon: Globe,
    benefits: ["全国対応で地域密着", "地元の専門家と連携", "どこでも同じ品質のサービス"]
  },
  {
    title: "幅広い専門知識",
    description: "不動産だけでなく、相続、介護、空き家問題など、関連する分野の知識も豊富。複雑に絡み合う法律や権利、手続きを整理し、多角的な視点からアドバイスを提供。豊富な経験から導かれるリスクと可能性を予期しながらサポートします。",
    icon: Lightbulb,
    benefits: ["多角的な視点からのアドバイス", "複雑な問題を整理", "将来のリスク・可能性を予測"]
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b border-primary/30">
            Why Choose Us
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            なぜHYコンサルティングが<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              選ばれているのか？
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            複雑な悩みも、プロのネットワークと幅広い知識で、<br />
            あなたに最適な解決策をワンストップで実現します。
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/network-illustration.png"
                alt="HY Consulting Professional Network"
                className="w-full h-auto object-cover"
              />
              {/* Overlay Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 bg-white p-5 rounded-lg shadow-xl border-l-4 border-primary max-w-[220px] hidden md:block z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">専門家ネットワーク</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  全国の士業・専門家と<br />
                  連携してサポート
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-6 border-2 border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    {/* Title with Icon */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {feature.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-slate-700 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-sm text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 text-lg mb-6">
            複雑な問題も、プロのネットワークで解決します。<br />
            まずはお気軽にご相談ください。
          </p>
          <button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
            無料相談を申し込む
          </button>
        </motion.div>
      </div>
    </section>
  );
}
