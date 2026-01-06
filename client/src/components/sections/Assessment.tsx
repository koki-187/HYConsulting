import { motion } from "framer-motion";
import { Calculator, Home, FileSearch } from "lucide-react";
import AssessmentForm from "./AssessmentForm";

const steps = [
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
            <span className="text-red-600 font-extrabold">「匿名・無料」</span>無料不動産査定
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-sans" style={{width: '770px'}}
          >
            たった３つの物件情報を入力するだけで瞬時に概算価格を算出。<br className="hidden lg:block" />
            国土交通省のデータベースと連動し膚大な取引事例と公的データから概算価格を導き出します。<br className="hidden lg:block" />
            <br className="hidden lg:block" />
            <span className="text-base font-semibold text-slate-700">あなたの不動産、今いくら？</span><br className="hidden lg:block" />
            <br className="hidden lg:block" />
            <span className="text-base font-semibold text-slate-700">かんたん無料！概算価格査定</span><br className="hidden lg:block" />
            <span className="text-sm text-slate-500">※詳細情報を入力する程、査定結果の精度があがります。</span><br className="hidden lg:block" />
            <span className="text-sm text-slate-500">※入力完了後、その場で結果が表示されます。</span>
          </motion.p>
        </div>

        {/* Assessment Form Section - Prominently Displayed */}
        <div className="mb-20">
          <AssessmentForm />
        </div>


      </div>
    </section>
  );
}
