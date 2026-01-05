import { motion } from "framer-motion";
import { Users, Building, FileText } from "lucide-react";

const features = [
  {
    title: "ワンストップ対応",
    description: "シニア層の様々なお悩みに対応できるよう、法律=弁護士、税金=税理士、登記関連=司法書士、不動産=宅地建物取引士、さらにはシニア層のニーズに特化した高齢者施設のご紹介、遺品整理や墓じまいなど、HYコンサルティングがワンストップでサービスが提供できます。",
    icon: Users
  },
  {
    title: "地域密着のネットワーク",
    description: "日本全国の士業、各分野の専門家とのネットワークを持ち、ユーザー様のご事情に対応ができるように体制を整えています。横浜・戸塚エリアを中心に、地域に根差した活動を展開し、最適な提案を行います。",
    icon: Building
  },
  {
    title: "幅広い専門知識",
    description: "不動産だけでなく、相続、介護、空き家問題など、関連する分野の知識も豊富。複雑に絡み合う法律や権利、手続きを整理し、多角的な視点からアドバイスを提供します。豊富な経験と実績から導かれる将来のリスクや可能性を予期しながらサポート。",
    icon: FileText
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-slate-900 relative overflow-hidden text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/features_experts_bg.png" 
          alt="専門家ネットワーク" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-slate-900/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative order-2 lg:order-1"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl border border-slate-700">
              {/* Main Illustration */}
              <img 
                src="/images/features_experts_bg.png" 
                alt="Consulting Partnership" 
                className="w-full h-auto object-cover grayscale-[30%]"
              />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-6 right-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary max-w-[240px] hidden md:block z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-primary rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">専門家ネットワーク</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  弁護士・税理士・司法書士など<br/>各分野のプロと連携
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-white/80 uppercase border-b border-white/30"
            >
              Why Choose Us
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-10 font-heading leading-tight"
            >
              なぜHYコンサルティングが<br />
              <span className="text-white relative inline-block">
                選ばれているのか？
              </span>
            </motion.h2>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex gap-6 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-heading">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm lg:text-base font-sans">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
