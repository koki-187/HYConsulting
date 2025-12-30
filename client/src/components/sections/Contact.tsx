import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/95 z-10" />
        <img 
          src="/images/hero_city_16x9.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-white/80 uppercase border-b border-white/30">
              Contact Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 font-heading leading-tight">
              無料相談・お問い合わせ
            </h2>
            <p className="text-slate-300 mb-12 leading-relaxed font-sans">
              不動産、相続、終活に関するご相談は、お電話またはフォームよりお気軽にお問い合わせください。<br />
              専門スタッフが丁寧に対応させていただきます。
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-bold uppercase tracking-wider">お電話でのお問い合わせ</p>
                  <a href="tel:045-123-4567" className="text-2xl lg:text-3xl font-bold hover:text-primary-foreground transition-colors font-heading tracking-wide">
                    045-123-4567
                  </a>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    受付時間 9:00〜18:00（水曜定休）
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-bold uppercase tracking-wider">所在地</p>
                  <p className="text-lg font-medium">
                    〒244-0003<br />
                    神奈川県横浜市戸塚区戸塚町
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-bold uppercase tracking-wider">メールでのお問い合わせ</p>
                  <p className="text-lg font-medium">info@hy-consulting.jp</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-white p-8 lg:p-10 rounded-sm shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6 font-heading border-b border-slate-100 pb-4">
                お問い合わせフォーム
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">お名前 <span className="text-red-500">*</span></label>
                    <Input placeholder="山田 太郎" className="bg-slate-50 border-slate-200 focus:border-primary rounded-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">フリガナ <span className="text-red-500">*</span></label>
                    <Input placeholder="ヤマダ タロウ" className="bg-slate-50 border-slate-200 focus:border-primary rounded-sm" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">メールアドレス <span className="text-red-500">*</span></label>
                  <Input type="email" placeholder="example@email.com" className="bg-slate-50 border-slate-200 focus:border-primary rounded-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">電話番号</label>
                  <Input type="tel" placeholder="090-1234-5678" className="bg-slate-50 border-slate-200 focus:border-primary rounded-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ご相談内容 <span className="text-red-500">*</span></label>
                  <Textarea placeholder="ご相談内容をご記入ください" className="min-h-[150px] bg-slate-50 border-slate-200 focus:border-primary rounded-sm resize-none" />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-sm text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  送信する
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
