import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
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
    <section id="features" className="section-padding bg-white relative">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/lp/hero_handshake_4x5.png" 
                alt="Consulting Partnership" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl max-w-[200px] hidden md:block">
              <p className="text-4xl font-bold text-accent mb-1">98<span className="text-xl">%</span></p>
              <p className="text-sm text-gray-600 font-medium">クライアント満足度</p>
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold tracking-wider uppercase text-sm"
            >
              Why Choose Us
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-8"
            >
              HYコンサルティングが<br />選ばれる3つの理由
            </motion.h2>

            <div className="space-y-8">
              {FEATURES.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
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
