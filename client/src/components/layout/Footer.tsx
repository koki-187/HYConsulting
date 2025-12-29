import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white border-t border-white/10 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <img 
                src="/images/logos/HY_Consulting_Logo_Horizontal.png" 
                alt="HY Consulting" 
                className="h-10 w-auto brightness-0 invert"
              />
            </a>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              HYコンサルティングは、企業の持続的な成長を支援する戦略的パートナーです。
              経営戦略から現場の実行支援まで、一貫したサービスを提供します。
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Menu</h4>
            <ul className="space-y-4">
              <li><a href="#services" className="text-gray-400 hover:text-accent transition-colors">サービス</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-accent transition-colors">強み・特徴</a></li>
              <li><a href="#achievements" className="text-gray-400 hover:text-accent transition-colors">実績</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-accent transition-colors">お客様の声</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-accent transition-colors">よくある質問</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li>〒100-0005<br />東京都千代田区丸の内1-1-1</li>
              <li>03-1234-5678</li>
              <li>info@hy-consulting.jp</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HY Consulting. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-white transition-colors">特定商取引法に基づく表記</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
