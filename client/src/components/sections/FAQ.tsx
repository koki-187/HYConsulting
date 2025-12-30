import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "相談は無料ですか？",
    answer: "はい、初回のご相談は無料です。お客様の状況をお伺いし、最適な解決策をご提案させていただきます。まずはお気軽にお問い合わせください。"
  },
  {
    question: "遠方にある実家の相談も可能ですか？",
    answer: "はい、可能です。全国のネットワークを活用し、遠方の不動産に関するご相談も承っております。オンラインでのご相談も対応可能です。"
  },
  {
    question: "まだ相続が発生していませんが、相談できますか？",
    answer: "もちろんです。相続発生前の「生前対策」こそ重要です。早めにご相談いただくことで、より多くの選択肢から最適な対策をご提案できます。"
  },
  {
    question: "空き家の管理だけでもお願いできますか？",
    answer: "はい、承っております。定期的な巡回や清掃など、お客様のご要望に合わせた管理プランをご提案いたします。"
  },
  {
    question: "不動産の売却だけでなく、活用方法も提案してもらえますか？",
    answer: "はい。売却、賃貸、リフォーム、駐車場経営など、物件の特性や市場動向を分析し、最もメリットのある活用方法をご提案します。"
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b-2 border-primary"
          >
            FAQ
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-heading"
          >
            よくあるご質問
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-sans"
          >
            お客様から寄せられるご質問をまとめました。
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 lg:p-10"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-slate-100 rounded-sm px-4 data-[state=open]:bg-slate-50 data-[state=open]:border-slate-200 transition-colors duration-300">
                <AccordionTrigger className="text-left text-base lg:text-lg font-bold text-slate-800 hover:text-primary py-6 font-heading">
                  <span className="flex gap-4">
                    <span className="text-primary font-sans">Q.</span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6 pl-8 font-sans text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
