import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    title: "実践的な戦略立案",
    description: "机上の空論ではなく、現場で実行可能な具体的かつ実践的な戦略を立案します。クライアントの企業文化やリソースを深く理解した上で、成果に直結するプランを提示します。"
  },
  {
    title: "伴走型支援スタイル",
    description: "提案して終わりではなく、実行フェーズまで徹底的に伴走します。現場に入り込み、社員の皆様と共に汗をかきながら、変革を推進します。"
  },
  {
    title: "豊富な業界知見",
    description: "製造、小売、IT、サービスなど、多岐にわたる業界でのコンサルティング実績があります。業界特有の課題やトレンドを踏まえた、最適なソリューションを提供します。"
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
                className="w-full h-auto object-contain drop-shadow-2xl z-10 relative"
              />
              
              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 rounded-full blur-3xl -z-10" />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-blue-50 max-w-[220px] hidden md:block z-20"
              >
                <div className="flex items-baseline gap-1 mb-1">
                  <p className="text-4xl font-bold text-primary">98</p>
                  <p className="text-xl font-bold text-primary">%</p>
                </div>
                <p className="text-sm text-slate-600 font-medium">クライアント満足度</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[98%]" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-blue-100 rounded-full"
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
                選ばれる3つの理由
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </motion.h2>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
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
