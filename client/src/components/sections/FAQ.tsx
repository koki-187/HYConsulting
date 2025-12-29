import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "相談は無料ですか？",
    answer: "はい、初回のご相談は無料です。現状の課題やご要望をお伺いし、最適な支援内容をご提案させていただきます。まずはお気軽にお問い合わせください。"
  },
  {
    question: "どのような業種の企業が対象ですか？",
    answer: "製造業、小売業、サービス業、IT企業など、幅広い業種の企業様をご支援しております。規模もスタートアップから大企業まで対応可能です。"
  },
  {
    question: "契約期間はどのくらいですか？",
    answer: "プロジェクトの内容によりますが、通常は3ヶ月〜1年程度の契約となることが多いです。スポットでのコンサルティングも可能ですので、ご相談ください。"
  },
  {
    question: "地方の企業でも対応可能ですか？",
    answer: "はい、全国対応可能です。オンライン会議ツールを活用した支援を中心に、必要に応じて訪問も行います。"
  },
  {
    question: "コンサルタントの指名はできますか？",
    answer: "はい、可能です。ご相談内容に合わせて最適なコンサルタントをご提案させていただきますが、ご希望があればお申し付けください。"
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/50 blur-3xl rounded-bl-full opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-yellow-50/50 blur-3xl rounded-tr-full opacity-60" />

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16 lg:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-blue-100 rounded-full"
          >
            FAQ
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 font-heading"
          >
            よくある<span className="text-primary">ご質問</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            お客様から寄せられるご質問をまとめました。<br className="hidden sm:block" />
            その他ご不明な点がございましたら、お気軽にお問い合わせください。
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] shadow-soft p-6 md:p-10 border border-slate-100"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-slate-100 rounded-xl px-4 data-[state=open]:bg-blue-50/30 data-[state=open]:border-blue-100 transition-all duration-300">
                <AccordionTrigger className="text-left text-lg font-bold text-slate-800 hover:text-primary py-6 [&[data-state=open]]:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6 pl-12 text-base">
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
