import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("お問い合わせを受け付けました。担当者よりご連絡いたします。");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-blue-50/50 -z-10" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-primary uppercase bg-blue-100 rounded-full">
              Contact Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 font-heading leading-tight">
              ビジネスの成長について<br />
              お気軽に<span className="text-primary relative inline-block">
                ご相談ください
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              現状の課題や目標について、まずはお話をお聞かせください。<br />
              初回相談は無料です。無理な営業は一切いたしません。
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Phone className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1 font-medium">お電話でのお問い合わせ</p>
                  <p className="text-2xl font-bold text-slate-800 font-heading">03-1234-5678</p>
                  <p className="text-xs text-slate-400 mt-1">平日 9:00〜18:00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Mail className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1 font-medium">メールでのお問い合わせ</p>
                  <p className="text-xl font-bold text-slate-800">info@hy-consulting.jp</p>
                  <p className="text-xs text-slate-400 mt-1">24時間受付中</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <MapPin className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1 font-medium">所在地</p>
                  <p className="text-lg text-slate-800">〒100-0005<br />東京都千代田区丸の内1-1-1</p>
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
          >
            <Card className="bg-white border-none shadow-xl rounded-[2rem] overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-yellow-300" />
              <CardHeader className="pt-8 px-8 md:px-10">
                <CardTitle className="text-2xl font-bold text-slate-800">お問い合わせフォーム</CardTitle>
              </CardHeader>
              <CardContent className="p-8 md:p-10 pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-600">姓 <span className="text-red-500">*</span></Label>
                      <Input id="lastName" placeholder="山田" required className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-600">名 <span className="text-red-500">*</span></Label>
                      <Input id="firstName" placeholder="太郎" required className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-slate-600">会社名</Label>
                    <Input id="company" placeholder="株式会社〇〇" className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-600">メールアドレス <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" placeholder="taro.yamada@example.com" required className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-600">お問い合わせ内容 <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="message" 
                      placeholder="ご相談内容をご記入ください" 
                      className="min-h-[150px] rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50 resize-none p-4"
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "送信中..."
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        送信する
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
