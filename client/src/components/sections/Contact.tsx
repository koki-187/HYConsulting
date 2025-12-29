import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
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
    <section id="contact" className="section-padding bg-navy-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 skew-x-12 transform origin-top-right" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-bold tracking-wider uppercase text-sm">Contact Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              ビジネスの成長について<br />
              お気軽にご相談ください
            </h2>
            <p className="text-gray-300 mb-10 leading-relaxed">
              現状の課題や目標について、まずはお話をお聞かせください。<br />
              初回相談は無料です。
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">お電話でのお問い合わせ</p>
                  <p className="text-xl font-bold">03-1234-5678</p>
                  <p className="text-xs text-gray-500">平日 9:00〜18:00</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">メールでのお問い合わせ</p>
                  <p className="text-xl font-bold">info@hy-consulting.jp</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">所在地</p>
                  <p className="text-lg">〒100-0005<br />東京都千代田区丸の内1-1-1</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white text-foreground border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">お問い合わせフォーム</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">姓</Label>
                      <Input id="lastName" placeholder="山田" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">名</Label>
                      <Input id="firstName" placeholder="太郎" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">会社名</Label>
                    <Input id="company" placeholder="株式会社〇〇" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input id="email" type="email" placeholder="taro.yamada@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">お問い合わせ内容</Label>
                    <Textarea 
                      id="message" 
                      placeholder="ご相談内容をご記入ください" 
                      className="min-h-[120px]"
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "送信中..." : "送信する"}
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
