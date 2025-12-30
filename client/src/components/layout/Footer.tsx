import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <Link href="/">
              <a className="block mb-6">
                <img src="/images/logo_new.svg" alt="HY Consulting" className="h-10 w-auto brightness-0 invert" />
              </a>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
              不動産と終活のプロフェッショナルとして、<br />
              お客様の未来を支える最適なソリューションを<br />
              提供いたします。
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 font-heading border-b border-slate-800 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/">
                  <a className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-primary transition-colors" />
                    ホーム
                  </a>
                </Link>
              </li>
              <li>
                <a href="#services" className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-primary transition-colors" />
                  サービス
                </a>
              </li>
              <li>
                <a href="#assessment" className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-primary transition-colors" />
                  不動産査定
                </a>
              </li>
              <li>
                <a href="#features" className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-primary transition-colors" />
                  強み・特徴
                </a>
              </li>
              <li>
                <a href="#achievements" className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-primary transition-colors" />
                  実績紹介
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 font-heading border-b border-slate-800 pb-2 inline-block">Services</h3>
            <ul className="space-y-4">
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                老後資金・介護・相続支援
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                不動産売買・活用コンサルティング
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                空き家・負動産対策
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                不動産査定（簡易・訪問・買取）
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 font-heading border-b border-slate-800 pb-2 inline-block">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  〒244-0003<br />
                  神奈川県横浜市戸塚区戸塚町
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:045-123-4567" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">
                  045-123-4567
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@hy-consulting.jp" className="text-slate-400 hover:text-white transition-colors text-sm">
                  info@hy-consulting.jp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs font-sans">
            &copy; {new Date().getFullYear()} HY Consulting. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">プライバシーポリシー</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">特定商取引法に基づく表記</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">サイトマップ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
