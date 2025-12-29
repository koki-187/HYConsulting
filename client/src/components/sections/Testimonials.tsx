import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    company: "株式会社A社",
    position: "代表取締役",
    name: "山田 太郎 様",
    content: "HYコンサルティング様の支援により、長年の課題だった組織のサイロ化が解消されました。社員の意識が変わり、業績も右肩上がりです。",
    image: "/images/lp/worry_1x1.png"
  },
  {
    company: "B株式会社",
    position: "経営企画部長",
    name: "鈴木 一郎 様",
    content: "DX推進において、単なるツール導入ではなく、業務プロセス全体を見直す提案をいただき、本質的な生産性向上につながりました。",
    image: "/images/lp/service_house_1x1.png"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-wider uppercase text-sm"
          >
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4"
          >
            お客様の声
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="h-full border-none shadow-lg bg-white relative overflow-visible">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white fill-current" />
                </div>
                <CardContent className="pt-12 pb-8 px-8">
                  <p className="text-gray-600 leading-relaxed mb-6 italic">
                    "{item.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.company} {item.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
