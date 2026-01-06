/**
 * Water Bubble Background Component
 * 
 * CORRECTED Implementation based on actual reference site analysis
 * Reference site: https://hyconsulting.jp/
 * 
 * KEY CORRECTIONS from Session 43:
 * - Blur: 40-70px → 10-20px (CLEAR outlines)
 * - Opacity: 0.8 → 0.2-0.3 (SUBTLE effect)
 * - Gradient: Simplified for natural look
 * - Sizes: 100-250px (varied for depth)
 * - Coverage: Full page (not just top)
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Bubble 1: 左上の大きな水玉 - 濃い青色 - CLEAR OUTLINE */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '250px',
          height: '250px',
          top: '80px',
          left: '-50px',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.55), rgba(74, 144, 200, 0.25))',
          filter: 'blur(15px)',
          opacity: 0.5,
          animation: 'hy-float-1 12s ease-in-out infinite alternate'
        }}
      />
      
      {/* Bubble 2: 中央上部の小さな水玉 - 中間青色 - CLEAR OUTLINE */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '100px',
          height: '100px',
          top: '120px',
          left: '45%',
          background: 'radial-gradient(circle at 50% 50%, rgba(91, 160, 213, 0.5), rgba(91, 160, 213, 0.22))',
          filter: 'blur(10px)',
          opacity: 0.45,
          animation: 'hy-float-2 9s ease-in-out infinite alternate',
          animationDelay: '2s'
        }}
      />
      
      {/* Bubble 3: 右上の大きな水玉 - 濃い青色 - CLEAR OUTLINE */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          top: '60px',
          right: '8%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.6), rgba(61, 133, 198, 0.28))',
          filter: 'blur(20px)',
          opacity: 0.55,
          animation: 'hy-float-3 15s ease-in-out infinite alternate',
          animationDelay: '4s'
        }}
      />
      
      {/* Bubble 4: 中央下部の水玉 - 中間青色 - CLEAR OUTLINE */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '150px',
          height: '150px',
          top: '500px',
          left: '35%',
          background: 'radial-gradient(circle at 50% 50%, rgba(91, 168, 214, 0.52), rgba(91, 168, 214, 0.24))',
          filter: 'blur(15px)',
          opacity: 0.48,
          animation: 'hy-float-4 11s ease-in-out infinite alternate',
          animationDelay: '1s'
        }}
      />
      
      {/* Bubble 5: 右下の水玉 - 薄い青色 - CLEAR OUTLINE */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '120px',
          height: '120px',
          top: '550px',
          right: '18%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.48), rgba(107, 168, 216, 0.2))',
          filter: 'blur(12px)',
          opacity: 0.42,
          animation: 'hy-float-5 13s ease-in-out infinite alternate',
          animationDelay: '3s'
        }}
      />
      
      {/* Additional Bubble 6: 中央左の水玉 - 追加で奥行き強化 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          top: '300px',
          left: '10%',
          background: 'radial-gradient(circle at 50% 50%, rgba(80, 150, 210, 0.5), rgba(80, 150, 210, 0.22))',
          filter: 'blur(18px)',
          opacity: 0.46,
          animation: 'hy-float-6 14s ease-in-out infinite alternate',
          animationDelay: '5s'
        }}
      />
      
      {/* Additional Bubble 7: 右中央の水玉 - 追加で奥行き強化 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '130px',
          height: '130px',
          top: '350px',
          right: '12%',
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 155, 215, 0.54), rgba(95, 155, 215, 0.26))',
          filter: 'blur(14px)',
          opacity: 0.5,
          animation: 'hy-float-7 10s ease-in-out infinite alternate',
          animationDelay: '6s'
        }}
      />
    </div>
  );
}
