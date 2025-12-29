import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQS = [
  {
    question: "相談は無料ですか？",
    answer: "はい、初回のご相談は無料です。現状の課題やご要望をお伺いし、最適な支援内容をご提案させていただきます。"
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
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-wider uppercase text-sm"
          >
            FAQ
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4"
          >
            よくある質問
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-lg font-bold text-primary hover:text-accent py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
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
