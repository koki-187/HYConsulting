import { Link } from "wouter";
import { Mail, ExternalLink, CheckCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-slate-50 text-slate-900 py-16 border-t border-slate-200" style={{backgroundColor: '#ffffff'}}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Grid - 3 columns */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mb-12">
          {/* Company Info - Left */}
          <div className="space-y-6">
            <Link href="/">
              <a className="flex items-center gap-3 w-fit group hover:opacity-80 transition-opacity bg-transparent">
                <img 
                  src="https://private-us-east-1.manuscdn.com/users/310519663091040948/uploads/EvoszQPn6sM5lVEeWfNc4H_na1fn_dW5uYW1lZA.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vdXNlcnMvMzEwNTE5NjYzMDkxMDQwOTQ4L3VwbG9hZHMvRXZvc3pRUG42c001bFZFZVdmTmM0SF9uYTFmbl9kVzV1WVcxbFpBLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=m4E5vBMGFdEIkvk~6jS37NhCS0HxM4OwAo5jYTIEdBAli-7~zu83hd2FRVWg6ORraShhJAQZz3o6hp5I0aIS59R622mCr7vniVyrR6Ebc~YfXAkpscxIuJwzREa-7lg7JqIr76V9kDbsn0WvGLZbEscAqOE78pvb970KVqQnmwKT1M0pZ5C9fz5xKgnfDbm6sCyyn2zLEMj8UPLH~4dq5xSP87ZJl4DkgshqNAHATrZ6ICWuekGc8U5oIdP68HBy9tmf8MipnARQCr3bcxPBhR-ipJBqCcdp~9U0UvfwvWSUfwPIxLa5d5nq7ckpM0mO1ay0-z6zKNHBFDFIyjfmYw__" 
                  alt="HY Consulting" 
                  className="h-8 lg:h-10 w-auto object-contain"
                />
              </a>
            </Link>
            
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">人生100年時代のパートナー</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                不動産・相続・終活のプロフェッショナルとして、お客様の人生に寄り添い、最適な解決策をご提案します。全国対応でサポートいたします。
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-slate-700">お問い合わせ</h4>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">info@hyconsulting.jp</span>
              </div>
              <div className="pt-2">
                <a 
                  href="https://hyconsulting.jp/contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  お問い合わせフォーム
                </a>
              </div>
            </div>
          </div>

          {/* Contents Links - Center */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              コンテンツ
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "ホーム", href: "/" },
                { label: "サービス一覧", href: "#services" },
                { label: "無料不動産査定", href: "#assessment" },
                { label: "選ばれる理由", href: "#features" },
                { label: "解決事例・実績", href: "#features" },
                { label: "よくあるご質問", href: "#faq" },
                { label: "お問い合わせ", href: "https://hyconsulting.jp/contact", external: true },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                      {link.label}
                    </a>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-slate-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* External Links - Right */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary" />
              関連リンク
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="https://hyconsulting.jp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                  公式サイト
                </a>
              </li>
              <li>
                <a 
                  href="https://hyconsulting.jp/privacypolicy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <Link href="/tokushoho">
                  <a className="text-slate-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    特定商取引法に基づく表記
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} HY Consulting Co., Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
