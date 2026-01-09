import { Link } from "wouter";
import { Mail, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white text-slate-900 pt-24 pb-12 border-t-4 border-accent">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid lg:grid-cols-4 gap-16 mb-20">
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <Link href="/">
                <a className="flex items-center gap-3 mb-8 w-fit group hover:opacity-80 transition-opacity">
                  <img 
                    src="/images/logo_hy_consulting.png" 
                    alt="HY Consulting" 
                    className="h-10 w-auto object-contain"
                  />
                </a>
              </Link>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">人生100年時代のパートナー</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                  不動産・相続・終活のプロフェッショナルとして、お客様の人生に寄り添い、最適な解決策をご提案します。全国対応でサポートいたします。
                </p>
              </div>
            </div>
            
            {/* Contact Info - Inquiry Only */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">お問い合わせ</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">メール</p>
                    <p className="text-sm text-slate-700">info@hyconsulting.jp</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href="https://hyconsulting.jp/contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    お問い合わせフォーム
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - Improved */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              コンテンツ
            </h3>
            <ul className="space-y-3">
              {[
                { label: "ホーム", href: "/" },
                { label: "サービス一覧", href: "#services" },
                { label: "無料不動産査定", href: "#assessment" },
                { label: "選ばれる理由", href: "#features" },
                { label: "解決事例・実績", href: "#achievements" },
                { label: "よくあるご質問", href: "#faq" },
                { label: "お問い合わせ", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-slate-600 hover:text-accent transition-colors text-sm flex items-center gap-2 group font-sans"
                  >
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full group-hover:bg-accent transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links - Improved */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-accent" />
              関連リンク
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://hyconsulting.jp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-accent transition-colors text-sm flex items-center gap-2 font-sans group"
                >
                  <span className="w-1.5 h-1.5 bg-accent/50 rounded-full group-hover:bg-accent transition-colors" />
                  公式サイト
                </a>
              </li>
              <li>
                <a 
                  href="https://hyconsulting.jp/privacypolicy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-accent transition-colors text-sm flex items-center gap-2 font-sans group"
                >
                  <span className="w-1.5 h-1.5 bg-accent/50 rounded-full group-hover:bg-accent transition-colors" />
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <Link href="/tokushoho">
                  <a className="text-slate-600 hover:text-accent transition-colors text-sm flex items-center gap-2 font-sans group">
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full group-hover:bg-accent transition-colors" />
                    特定商取引法に基づく表記
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center">
          <p className="text-slate-500 text-sm font-sans tracking-wider">
            &copy; {currentYear} HY Consulting Co., Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
