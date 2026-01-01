import { motion } from "framer-motion";
import { Calculator, Home, FileSearch } from "lucide-react";
import AssessmentForm from "./AssessmentForm";

const steps = [
  {
    icon: Calculator,
    title: "簡易査定（まずは相場を知る）",
    description: "物件情報と周辺相場データをもとに、概算価格をスピーディーに算出します。まずは相場を知りたい方におすすめです。"
  },
  {
    icon: Home,
    title: "訪問査定（正確な価格を知る）",
    description: "現地を実際に訪問し、建物の状態や周辺環境を詳細に調査。より正確な査定価格をご提示します。"
  },
  {
    icon: FileSearch,
    title: "最適なプランのご提案",
    description: "訪問査定の結果をもとに、お客様のご希望に合わせて「仲介売却」か「買取」か、最適なプランをご提案します。"
  }
];

export default function Assessment() {
  return (
    <section id="assessment" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b-2 border-primary"
          >
            Real Estate Assessment
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-heading"
          >
            無料不動産査定
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-sans"
          >
            国土交通省のデータベースと連動し、適正な価格を即座に算出。<br className="hidden lg:block" />
            お客様のニーズに合わせて、3つの査定方法をご用意しております。
          </motion.p>
        </div>

        {/* Assessment Form Section - Prominently Displayed */}
        <div className="mb-20">
          <AssessmentForm />
        </div>

        {/* Assessment Types Explanation */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 font-heading">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed font-sans text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
