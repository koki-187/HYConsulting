"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    company: "株式会社A社",
    position: "代表取締役",
    name: "山田 太郎 様",
    content: "HYコンサルティング様の支援により、長年の課題だった組織のサイロ化が解消されました。社員の意識が変わり、業績も右肩上がりです。",
    image: "/images/worry_1x1.png"
  },
  {
    company: "B株式会社",
    position: "経営企画部長",
    name: "鈴木 一郎 様",
    content: "DX推進において、単なるツール導入ではなく、業務プロセス全体を見直す提案をいただき、本質的な生産性向上につながりました。",
    image: "/images/service_house_1x1.png"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-blue-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-80" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-white rounded-full shadow-sm"
          >
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 font-heading"
          >
            お客様の<span className="text-primary">声</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            実際に支援させていただいた企業様からのメッセージをご紹介します。
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="h-full border-none shadow-soft hover:shadow-xl transition-all duration-300 bg-white rounded-[2rem] relative overflow-visible group">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <Quote className="w-6 h-6 text-white fill-current" />
                </div>
                <CardContent className="pt-12 pb-8 px-8 lg:px-10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    "{item.content}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{item.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{item.company} {item.position}</p>
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
