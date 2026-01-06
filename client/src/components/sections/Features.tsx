import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2 } from "lucide-react";

const successStories = [
  {
    id: 1,
    category: "相続・財産分与",
    title: "相続の複雑な手続きをワンストップで解決",
    client: "S・A様（50代）",
    description:
      "相続の折、不動産の売買だけでなく、遺産分割協議から相続財産評価の分析、相続登記のことまで、複雑な相続問題をスピーディーに整理していただき、家族間のトラブルを未然に防ぐことができました。本当にありがとうございました。",
    result: "ワンストップサービスにより、複雑な相続問題が一気に解決。家族の絆を守ることができました",
    image: "/success-story-1.png",
    rating: 5,
  },
  {
    id: 2,
    category: "不動産売買・資産整理・不動産活用",
    title: "放置していた実家を年間200万円の収入源に",
    client: "T・A様（60代）",
    description:
      "放置状態になっていた実家を売却するか悩んでいた際、あらゆるデータを調べていただいた上で、第3の選択肢を勧めてくださいました。「一部を売却、一部を活用可能な資産として残す」という戦略により、先祖代々の土地を守りながら、売却益を活用して新たな収益物件を構築。私たちのこれからの生活のこと含めて、最適な提案をしていただけたこと、今でも深く感謝しております。",
    result: "空き家状態のご実家をご資金をかけずに先祖代々の土地を守ることと年間200万円の収益化に成功",
    image: "/success-story-2.png",
    rating: 5,
  },
  {
    id: 3,
    category: "老後資金・介護",
    title: "老後資金計画で安心を手に入れた",
    client: "K・M様（65代）",
    description:
      "不動産と金融商品を組み合わせた総合的な老後資金計画。複数の専門家のアドバイスで、より確実で安心な計画が実現しました。",
    result: "老後資金の不安が解消、人生設計が明確に",
    image: "/success-story-3.png",
    rating: 5,
  },
  {
    id: 4,
    category: "負動産処分",
    title: "負動産の処分で新しい人生へ",
    client: "Y・S様（70代）",
    description:
      "先立たれた主人に任せっきりで、ほとんど関与してこなかった不動産をどうすれば良いか悩んでた際に、不動産の売買だけでなく税務申告の事、相続や遺言の事まで何かあれば、いつも親身に相談に乗って頂けて本当に頼りにさせて頂いてます。",
    result: "3ヶ月で処分完了、精神的な負担が軽減",
    image: "/success-story-4-new.png",
    rating: 5,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b border-primary/30">
            Why Choose Us
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            なぜHYコンサルティングが<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              選ばれているのか？
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            複雑な悩みも、プロのネットワークと幅広い知識で、<br />
            あなたに最適な解決策をワンストップで実現します。
          </p>
        </motion.div>

        {/* Network Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <img
            src="/network-illustration.png"
            alt="HY Consulting Professional Network"
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Success Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              実際の成功事例
            </span>
          </h3>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            複雑な悩みも、プロのネットワークと幅広い知識を活用して<br />
            成功事例に導いたケースをご紹介します。
          </p>
        </motion.div>

        {/* Success Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-slate-200 overflow-hidden group">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative h-48 lg:h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {story.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3">
                      {story.title}
                    </h3>

                    {/* Client */}
                    <p className="text-sm text-slate-600 mb-4">{story.client}</p>

                    {/* Description */}
                    <p className="text-slate-700 leading-relaxed mb-6">
                      {story.description}
                    </p>

                    {/* Result Highlight */}
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-semibold text-primary">
                          {story.result}
                        </p>
                      </div>
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
