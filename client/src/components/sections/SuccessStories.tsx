"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const stories = [
  {
    title: "相続の複雑な手続きをワンストップで解決",
    category: "相続・財産分与",
    client: "S・A 様（50代）",
    description: "相続の折、不動産の売買だけでなく、遺産分割協議から相続財産評価の分析、相続登記のことまで。複雑な相続問題をスピーディーに整理していただき、家族間のトラブルを未然に防ぐことができました。本当にありがとうございました。",
    result: "ワンストップサービスにより、複雑な相続問題が一気に解決。家族の絆を守ることができました",
    rating: 5
  },
  {
    title: "放置していた実家を年間200万円の収入源に",
    category: "不動産売買・資産整理・不動産活用",
    client: "T・A 様（60代）",
    description: "放置状態になっていた実家を売却するか悩んでいた際、あらゆるデータを調べていただいた上で、第3の選択肢を勧めてくださいました。'一部を売却、一部を活用可能な資産として残す'という戦略により、先祖代々の土地を守りながら、売却益を活用して新たな収益物件を構築。私たちのこれからの生活のことも含めて、最適な提案をしていただけたこと、今でも深く感謝しております。",
    result: "空き家状態のご実家を資金をかけずに先祖代々の土地を守ることと年間200万円の収益化に成功",
    rating: 5
  },
  {
    title: "老後資金計画で安心を手に入れた",
    category: "老後資金・介護",
    description: "不動産と金融商品を組み合わせた総合的な老後資金計画。複数の専門家のアドバイスで、より確実で安心な計画が実現しました。",
    result: "老後資金の不安が解消、人生設計が明確に",
    rating: 5
  },
  {
    title: "負動産の処分で新しい人生へ",
    category: "負動産処分",
    description: "売却困難な物件の処分方法を、複数の選択肢から提案してもらいました。最適な方法で、新しい人生のスタートを切ることができました。",
    result: "3ヶ月で処分完了、精神的な負担が軽減",
    rating: 5
  }
];

export default function SuccessStories() {
  return (
    <section id="success-stories" className="py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b border-primary/30">
            Success Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            お客様の成功事例
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            HY Consulting のサポートで、多くのお客様が<br />
            人生の課題を解決し、新しい選択肢を手に入れています。
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-2 border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all p-6 lg:p-8 relative overflow-hidden group">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Category Badge */}
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
                  {story.category}
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {story.title}
                </h3>

                {/* Client Name */}
                {story.client && (
                  <p className="text-sm font-semibold text-slate-600 mb-3">
                    {story.client}
                  </p>
                )}

                {/* Description */}
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {story.description}
                </p>

                {/* Result */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm font-semibold text-primary">
                    ✓ {story.result}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 text-lg mb-6">
            あなたの課題も、プロのサポートで解決できます。<br />
            まずはお気軽にご相談ください。
          </p>
          <a
            href="https://hyconsulting.jp/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            無料相談を申し込む
          </a>
        </motion.div>
      </div>
    </section>
  );
}
