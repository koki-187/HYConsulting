import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2 } from "lucide-react";

const successStories = [
  {
    id: 1,
    category: "相続・相続登記・不動産売買",
    title: "相続の複雑な手続きをワンストップで解決",
    client: "S・A様（60代）",
    description:
      "親が亡くなり相続が発生し初めて相続人が8名もいる事を知りました。実家を売却したかったのですが、どうしたらよいか分からずHY Consulting様に相談しました。\n\nまず司法書士の先生を紹介いただき、相続人全員の名前・住所・連絡先をお調べしていただきました。しかし相続人とは一度も話した事もなく連絡することも億劫でしたが、HY Consultingさんが各相続人の窓口と各専門家の中心となっていただき、約3か月で実家の売却現金化まで進めていただきました。\n\n各相続人ひとりひとりに対して売却価格の合意を取っていただいたり、お手続きもストレス無いように配慮いただいたお陰で円満に相続手続きを完了することができました。私たちの困っている事をすぐにご理解いただき適した専門家を手配いただいたりと、何から何まで迅速に対応いただき心から感謝しております。",
    result: "ワンストップサービスにより、複雑な相続問題が一気に解決、ストレスなく円満に相続手続きを完了させることができました",
    image: "/success-story-1.png",
    rating: 5,
  },
  {
    id: 2,
    category: "相続対策・不動産売買・不動産活用",
    title: "相続税が払えない、財産を分割するお金がなく争続に発展",
    client: "T・A様（60代）",
    description:
      "父親が亡くなり一次相続が発生しました。実家は都内で100坪の敷地があり相続税の負担が心配で税理士に相談したところ、HY Consulting様とのご縁をいただきました。\n\nまずは税理士と司法書士の先生が相続財産の棚卸をしていただきました。現金が無く、自宅100坪のみが相続財産で相続税が掛かってしまう事が分かりました。相続税の納税資金が無い事も不安のひとつでしたが、それ以上に相続財産の分割でひとつの不動産をどう分けるのか母親と妹と揉めてしまい争続に発展してしまいました。まさか我が家が争続に発展するとは少しも想像していませんでした。\n\nそんな状況の中、HY Consulting様が中心となり、税理士、土地家屋調査士、建築会社のお力を拝借しながら、庭先一部売却と自宅建て替えの提案をいただきました。\n\n相続税納税資金、財産分割のための現金が捻出でき、且つ、将来の二次相続対策にも繋がる三方良しのご提案でした。母親が満足する建物が建築でき、土地の価値を下げない敷地分割プランの検証は本当に骨の折れる作業だったかと思いますが、全員が納得するまでじっくりとお付き合いいただいた事に大変感謝しております。足掛け3年の壮大な家族内プロジェクトでしたが、最後まで丁寧にサポートいただき本当に有難うございました。",
    result: "緊急度高いお金と相続の問題を不動産を活用することで円満に解決、さらに将来の二次相続対策まで同時に実行、足掛け3年のプロジェクトを完遂。",
    image: "/success-story-2.png",
    rating: 5,
  },
  {
    id: 3,
    category: "老後資金・老人ホーム・不動産売買",
    title: "老後資金計画から老人ホーム入居と自宅の売却までワンストップで解決",
    client: "S・K様（80代）",
    description:
      "老人ホームへの入居を検討し老人ホーム紹介所に相談に行ったところ、入居時と入居後の資金計画とライフプラン作成のため、HY Consulting様をご紹介いただきました。\n\nまず私たちがいくら年金をもらえて老後資金にいくら必要で老人ホーム入居にどれくらいの予算を割いても良いのか、ファイナンシャルプランナーの先生が資金計画を作成していただきました。また、入居後は自宅を売却して老後資金にしたいと考えていましたので、同時に自宅の査定もお願いしました。\n\nお金の不安があり老人ホームへの入居が決心できておりませんでしたが、将来のお金の見通しがついた事で安心して入居を決断することができました。\n\n無料でここまで丁寧に資金計画をご提案いただき有難うございました。自宅の売却はまだ先ですが、売却する際はまたお世話になります。",
    result: "老後資金の不安が解消し老人ホーム入居の決心を後押し、安心と安らぎを手に入れる。",
    image: "/success-story-3.png",
    rating: 5,
  },
  {
    id: 4,
    category: "負動産処分",
    title: "不動産会社20社から断られた農地を2年掛けて処分し新しい人生へ",
    client: "Y・T様（50代）",
    description:
      "先祖代々農家で郊外にある広大な農地を相続しました。現金もなく相続税は何とか払えましたが、農業を継ぐ考えもないので、私の代で農地を処分しようと決意し不動産会社に相談していました。しかし、大手から地元の不動産会社まで20社以上に相談しましたが、どこの不動産会社も取扱いできませんとの回答でした。途方に暮れインターネットで相談できる会社を探していたところHY Consulting様にどうせダメだろうと半分諦めた気持ちで問い合わせしました。\n\nまず不動産コンサルタントの先生が2か月ほど時間をかけて農地を調査してくださいました。結果、確かに今のままでは売却は困難との回答でした。しかし、このような手順を踏めば売却できる可能性はあるという事で、解決策を提示いただいた点が他の不動産会社と違う対応でした。\n\n広大な土地の測量、道路やインフラの整備費用、造成費等、膨大な費用が必要で、それらを調査を進めないと、何も進められないとの事でした。ただ、この調査には相当な時間と費用が掛かるため、不動産コンサルティング契約を締結した上で、調査を進めていただきました。\n\n依頼してから2年強が経ちますが、無事に農地全ての処分が完了し安堵しております。色々な不動産会社に相談してきましたが、柔軟な発想で解決策をお示しいただけたのはHY Consultig様だけでした。日本全国不動産の処分で困っている方が多くいらっしゃると思いますので、これからもその方々のお力になってあげてください。",
    result: "普通の不動産会社が取扱いできない農地も2年掛けて処分に成功、負動産を生前処分できた事で相続問題も解消。",
    image: "/success-story-4-new.png",
    rating: 5,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Large "H" watermark - matching official HP About section */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <span 
          className="absolute -left-20 top-1/4 text-[30rem] sm:text-[40rem] lg:text-[50rem] font-bold leading-none"
          style={{
            color: 'rgba(168, 212, 230, 0.08)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          H
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
