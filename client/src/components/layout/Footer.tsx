import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <img 
                src="/images/hy_consulting_logo_recreated.png" 
                alt="HY Consulting" 
                className="h-12 w-auto brightness-0 invert"
              />
            </a>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
              人とまちと社会の未来をつなぐ不動産コンサルティング。<br/>
              不動産を通じて『人生設計』と『社会課題の解決』を支援するプロフェッショナルチームです。
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-200">Menu</h4>
            <ul className="space-y-4">
              <li><a href="#services" className="text-slate-400 hover:text-primary transition-colors">サービス</a></li>
              <li><a href="#features" className="text-slate-400 hover:text-primary transition-colors">選ばれる理由</a></li>
              <li><a href="#achievements" className="text-slate-400 hover:text-primary transition-colors">実績</a></li>
              <li><a href="#testimonials" className="text-slate-400 hover:text-primary transition-colors">お客様の声</a></li>
              <li><a href="#faq" className="text-slate-400 hover:text-primary transition-colors">よくある質問</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-200">Contact</h4>
            <ul className="space-y-4 text-slate-400">
              <li>株式会社HY</li>
              <li>〒244-0803<br />神奈川県横浜市戸塚区平戸町717-5</li>
              <li>info@hy-consulting.jp</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HY Consulting, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-white transition-colors">特定商取引法に基づく表記</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
