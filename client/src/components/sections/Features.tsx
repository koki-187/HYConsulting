import { motion } from "framer-motion";
import { CheckCircle2, Users, Building, FileText } from "lucide-react";

const features = [
  {
    title: "ワンストップ対応",
    description: "税理士、弁護士、司法書士、FP等、各分野の専門家と連携。窓口を一本化し、複雑な課題もスムーズに解決へと導きます。",
    icon: Users
  },
  {
    title: "地域密着のネットワーク",
    description: "横浜・戸塚エリアを中心に、地域に根差した活動を展開。地元の不動産事情に精通し、最適な提案を行います。",
    icon: Building
  },
  {
    title: "幅広い専門知識",
    description: "不動産だけでなく、相続、介護、空き家問題など、関連する分野の知識も豊富。多角的な視点からアドバイスを提供します。",
    icon: FileText
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main Illustration */}
              <img 
                src="/images/hero_handshake_4x5.png" 
                alt="Consulting Partnership" 
                className="w-full h-auto object-contain drop-shadow-xl z-10 relative"
              />
              
              {/* Decorative Elements - Simplified */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/60 rounded-full blur-3xl -z-10" />
              
              {/* Floating Badge - Professional Look */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 max-w-[240px] hidden md:block z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">専門家ネットワーク</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
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
              className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-blue-50 rounded-full"
            >
              Why Choose Us
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-slate-800 mb-8 font-heading leading-tight"
            >
              HYコンサルティングが<br />
              <span className="text-primary relative inline-block">
                選ばれる理由
                <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-100/50 -z-10 rounded-sm" />
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
                  className="flex gap-5 bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:border-blue-100"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
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
