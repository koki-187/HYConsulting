import { Link } from "wouter";
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white text-slate-900 pt-20 pb-10 border-t-4 border-accent">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/">
              <a className="flex items-center gap-3 mb-6 w-fit group">
                <img 
                  src="/images/logo_hy_consulting.png" 
                  alt="HY Consulting" 
                  className="h-8 w-auto object-contain"
                />
              </a>
            </Link>
            <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-md font-sans">
              <span className="font-bold text-slate-900 block mb-2">人生100年時代のパートナー</span>
              不動産・相続・終活のプロフェッショナルとして、<br />
              お客様の人生に寄り添い、最適な解決策をご提案します。<br />
              横浜・湘南エリアを中心に、地域密着でサポートいたします。
            </p>
            <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <span className="text-base font-sans text-slate-700">
                  〒244-0003<br />
                  神奈川県横浜市戸塚区戸塚町4711-1<br />
                  オセアン矢沢ビル304
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-xl font-sans font-bold tracking-wide text-slate-900">045-869-6377</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-base font-sans text-slate-700">info@hyconsulting.jp</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-accent" />
              コンテンツ
            </h3>
            <ul className="space-y-4">
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
                    className="text-slate-600 hover:text-accent transition-colors text-base flex items-center gap-2 group font-sans"
                  >
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full group-hover:bg-accent transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links / Social */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2 text-lg">
              <ExternalLink className="w-5 h-5 text-accent" />
              関連リンク
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://hyconsulting.jp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-accent transition-colors text-base flex items-center gap-2 font-sans"
                >
                  公式サイト
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-accent transition-colors text-base flex items-center gap-2 font-sans"
                >
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-600 hover:text-accent transition-colors text-base flex items-center gap-2 font-sans"
                >
                  特定商取引法に基づく表記
                </a>
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
