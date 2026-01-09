import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Tokushoho() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      
      {/* Background Decorative SVG Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top Left - Rotated Square */}
        <img 
          src="/images/tokushoho-svg-1.svg" 
          alt="" 
          className="absolute -top-20 -left-20 w-64 h-64 opacity-30"
        />
        
        {/* Top Right - Circle */}
        <img 
          src="/images/tokushoho-svg-2.svg" 
          alt="" 
          className="absolute top-32 -right-16 w-56 h-56 opacity-25"
        />
        
        {/* Bottom Left - Large Rounded Square */}
        <img 
          src="/images/tokushoho-svg-3.svg" 
          alt="" 
          className="absolute -bottom-32 -left-32 w-96 h-96 opacity-20"
        />
        
        {/* Bottom Right - Rotated Square (duplicate for balance) */}
        <img 
          src="/images/tokushoho-svg-1.svg" 
          alt="" 
          className="absolute bottom-20 -right-20 w-72 h-72 opacity-15 rotate-45"
        />
        
        {/* Middle Right - Circle (duplicate for depth) */}
        <img 
          src="/images/tokushoho-svg-2.svg" 
          alt="" 
          className="absolute top-1/2 -right-24 w-64 h-64 opacity-20 transform -translate-y-1/2"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3 group bg-transparent">
                <img 
                  src="https://private-us-east-1.manuscdn.com/users/310519663091040948/uploads/EvoszQPn6sM5lVEeWfNc4H_na1fn_dW5uYW1lZA.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vdXNlcnMvMzEwNTE5NjYzMDkxMDQwOTQ4L3VwbG9hZHMvRXZvc3pRUG42c001bFZFZVdmTmM0SF9uYTFmbl9kVzV1WVcxbFpBLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=m4E5vBMGFdEIkvk~6jS37NhCS0HxM4OwAo5jYTIEdBAli-7~zu83hd2FRVWg6ORraShhJAQZz3o6hp5I0aIS59R622mCr7vniVyrR6Ebc~YfXAkpscxIuJwzREa-7lg7JqIr76V9kDbsn0WvGLZbEscAqOE78pvb970KVqQnmwKT1M0pZ5C9fz5xKgnfDbm6sCyyn2zLEMj8UPLH~4dq5xSP87ZJl4DkgshqNAHATrZ6ICWuekGc8U5oIdP68HBy9tmf8MipnARQCr3bcxPBhR-ipJBqCcdp~9U0UvfwvWSUfwPIxLa5d5nq7ckpM0mO1ay0-z6zKNHBFDFIyjfmYw__" 
                  alt="HY Consulting" 
                  className="h-8 lg:h-10 w-auto object-contain"
                />
              </a>
            </Link>
            <Link href="/">
              <a className="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                ホームに戻る
              </a>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - matching official HP style */}
      <section className="pt-32 pb-16 relative z-10" style={{backgroundColor: '#ffffff'}}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-slate-500 text-sm uppercase tracking-widest mb-4" style={{fontSize: '20px', fontWeight: '700'}}>LEGAL NOTICE</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">特定商取引法に基づく表記</h1>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Link href="/">
              <a className="hover:text-accent transition-colors">HOME</a>
            </Link>
            <span>/</span>
            <span>Legal Notice</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="py-16 lg:py-24 relative z-10" style={{backgroundColor: '#ffffff'}}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 lg:p-12 border border-slate-100">
            
            {/* Introduction */}
            <p className="text-slate-600 leading-relaxed mb-12">
              株式会社HY（以下「当社」といいます。）は、特定商取引法に基づき、以下のとおり表記いたします。
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold w-1/3 align-top">販売業者</th>
                    <td className="py-4 px-4 text-slate-600">株式会社HY</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">代表責任者</th>
                    <td className="py-4 px-4 text-slate-600">田澤英大</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">所在地</th>
                    <td className="py-4 px-4 text-slate-600">
                      〒244-0803<br />
                      神奈川県横浜市戸塚区平戸町717-5
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">電話番号</th>
                    <td className="py-4 px-4 text-slate-600">
                      お問い合わせはメールにて承っております。<br />
                      <span className="text-sm text-slate-500">※電話でのお問い合わせをご希望の場合は、メールにてご連絡ください。折り返しお電話いたします。</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">メールアドレス</th>
                    <td className="py-4 px-4 text-slate-600">
                      <a href="mailto:info@hyconsulting.jp" className="text-accent hover:underline">
                        info@hyconsulting.jp
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">サービス名</th>
                    <td className="py-4 px-4 text-slate-600">HY Consulting 不動産・相続・終活コンサルティングサービス</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">サービス内容</th>
                    <td className="py-4 px-4 text-slate-600">
                      <ul className="list-disc list-inside space-y-1">
                        <li>不動産売却・買取コンサルティング</li>
                        <li>相続対策・相続手続きサポート</li>
                        <li>終活支援サービス</li>
                        <li>空き家・空き地活用相談</li>
                        <li>その他不動産に関するコンサルティング</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">サービス価格</th>
                    <td className="py-4 px-4 text-slate-600">
                      初回相談：無料<br />
                      各種コンサルティング料金：個別にお見積りいたします。<br />
                      <span className="text-sm text-slate-500">※詳細はお問い合わせください。</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">お支払い方法</th>
                    <td className="py-4 px-4 text-slate-600">
                      銀行振込<br />
                      <span className="text-sm text-slate-500">※お支払い方法の詳細は、契約時にご案内いたします。</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">お支払い時期</th>
                    <td className="py-4 px-4 text-slate-600">
                      サービス内容により異なります。<br />
                      <span className="text-sm text-slate-500">※詳細は契約時にご説明いたします。</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">サービス提供時期</th>
                    <td className="py-4 px-4 text-slate-600">
                      お申し込み後、ご相談の上決定いたします。<br />
                      <span className="text-sm text-slate-500">※サービス内容により異なります。</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">キャンセル・返金について</th>
                    <td className="py-4 px-4 text-slate-600">
                      サービス開始前のキャンセルについては、全額返金いたします。<br />
                      サービス開始後のキャンセルについては、提供済みサービス分を差し引いた金額を返金いたします。<br />
                      <span className="text-sm text-slate-500">※詳細は契約時にご説明いたします。</span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 text-left bg-slate-50 text-slate-700 font-semibold align-top">その他費用</th>
                    <td className="py-4 px-4 text-slate-600">
                      サービス料金以外に発生する費用はありません。<br />
                      <span className="text-sm text-slate-500">※ただし、登記費用、税金、各種手数料等の実費は別途お客様のご負担となります。</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-500 text-sm text-right">以上</p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer - matching official HP style with transparent logo */}
      <footer className="bg-white/80 backdrop-blur-sm py-12 border-t border-slate-100 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          {/* ロゴ - 透明背景のロゴを使用 */}
          <div className="flex items-center justify-center mb-6 bg-transparent">
            <img 
              src="https://private-us-east-1.manuscdn.com/users/310519663091040948/uploads/EvoszQPn6sM5lVEeWfNc4H_na1fn_dW5uYW1lZA.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vdXNlcnMvMzEwNTE5NjYzMDkxMDQwOTQ4L3VwbG9hZHMvRXZvc3pRUG42c001bFZFZVdmTmM0SF9uYTFmbl9kVzV1WVcxbFpBLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=m4E5vBMGFdEIkvk~6jS37NhCS0HxM4OwAo5jYTIEdBAli-7~zu83hd2FRVWg6ORraShhJAQZz3o6hp5I0aIS59R622mCr7vniVyrR6Ebc~YfXAkpscxIuJwzREa-7lg7JqIr76V9kDbsn0WvGLZbEscAqOE78pvb970KVqQnmwKT1M0pZ5C9fz5xKgnfDbm6sCyyn2zLEMj8UPLH~4dq5xSP87ZJl4DkgshqNAHATrZ6ICWuekGc8U5oIdP68HBy9tmf8MipnARQCr3bcxPBhR-ipJBqCcdp~9U0UvfwvWSUfwPIxLa5d5nq7ckpM0mO1ay0-z6zKNHBFDFIyjfmYw__" 
              alt="HY Consulting" 
              className="h-12 w-auto object-contain" style={{width: '189px', height: '148px'}}
            />
          </div>
          {/* ナビゲーションリンク */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <Link href="/">
              <a className="text-slate-600 hover:text-accent transition-colors">ホーム</a>
            </Link>
            <a 
              href="https://hyconsulting.jp/company" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-accent transition-colors"
            >
              会社情報
            </a>
            <a 
              href="https://hyconsulting.jp/privacypolicy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-accent transition-colors"
            >
              プライバシーポリシー
            </a>
            <a 
              href="https://hyconsulting.jp/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-accent transition-colors"
            >
              お問い合わせ
            </a>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} HY Consulting, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
