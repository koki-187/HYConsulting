/**
 * Water Bubble Background Component
 * 
 * Session 44 COMPLETE REDESIGN based on reference site analysis
 * Reference site: https://hyconsulting.jp/ (pasted_file_DvQnaL_image.png)
 * 
 * KEY SPECIFICATIONS:
 * - Placement: Hero section ONLY (NOT full page)
 * - Outline: CLEAR circular shapes (blur 5-8px, opacity 0.5-0.75)
 * - Depth: 3-layer system (large/medium/small bubbles)
 * - Animation: Varied speeds (slow 25-35s, medium 15-22s, fast 8-14s)
 * - Color: Visible blue gradient (#4A90C8 to #6BA8D8)
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* ===== LAYER 1: BACKGROUND (Large bubbles, slow animation) ===== */}
      
      {/* Bubble 1: 左上の大きな水玉 - 背景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '300px',
          height: '300px',
          top: '50px',
          left: '-80px',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.65), rgba(74, 144, 200, 0.3))',
          filter: 'blur(8px)',
          opacity: 0.5,
          animation: 'hy-float-slow-1 30s ease-in-out infinite alternate'
        }}
      />
      
      {/* Bubble 2: 右上の大きな水玉 - 背景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '280px',
          height: '280px',
          top: '20px',
          right: '5%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.7), rgba(61, 133, 198, 0.35))',
          filter: 'blur(8px)',
          opacity: 0.5,
          animation: 'hy-float-slow-2 28s ease-in-out infinite alternate',
          animationDelay: '4s'
        }}
      />
      
      {/* Bubble 3: 中央下部の大きな水玉 - 背景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '320px',
          height: '320px',
          top: '450px',
          left: '30%',
          background: 'radial-gradient(circle at 50% 50%, rgba(80, 150, 210, 0.6), rgba(80, 150, 210, 0.28))',
          filter: 'blur(8px)',
          opacity: 0.5,
          animation: 'hy-float-slow-3 32s ease-in-out infinite alternate',
          animationDelay: '8s'
        }}
      />
      
      {/* ===== LAYER 2: MIDDLE (Medium bubbles, medium animation) ===== */}
      
      {/* Bubble 4: 中央上部の中サイズ水玉 - 中間層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '150px',
          height: '150px',
          top: '100px',
          left: '40%',
          background: 'radial-gradient(circle at 50% 50%, rgba(91, 160, 213, 0.72), rgba(91, 160, 213, 0.38))',
          filter: 'blur(6px)',
          opacity: 0.65,
          animation: 'hy-float-medium-1 18s ease-in-out infinite alternate',
          animationDelay: '2s'
        }}
      />
      
      {/* Bubble 5: 左中央の中サイズ水玉 - 中間層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '140px',
          height: '140px',
          top: '280px',
          left: '15%',
          background: 'radial-gradient(circle at 50% 50%, rgba(91, 168, 214, 0.68), rgba(91, 168, 214, 0.35))',
          filter: 'blur(6px)',
          opacity: 0.65,
          animation: 'hy-float-medium-2 20s ease-in-out infinite alternate',
          animationDelay: '6s'
        }}
      />
      
      {/* Bubble 6: 右中央の中サイズ水玉 - 中間層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '160px',
          height: '160px',
          top: '350px',
          right: '12%',
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 155, 215, 0.7), rgba(95, 155, 215, 0.36))',
          filter: 'blur(6px)',
          opacity: 0.65,
          animation: 'hy-float-medium-3 17s ease-in-out infinite alternate',
          animationDelay: '10s'
        }}
      />
      
      {/* ===== LAYER 3: FOREGROUND (Small bubbles, fast animation) ===== */}
      
      {/* Bubble 7: 左上の小さな水玉 - 前景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '80px',
          height: '80px',
          top: '150px',
          left: '25%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.75), rgba(107, 168, 216, 0.42))',
          filter: 'blur(5px)',
          opacity: 0.75,
          animation: 'hy-float-fast-1 10s ease-in-out infinite alternate',
          animationDelay: '1s'
        }}
      />
      
      {/* Bubble 8: 中央の小さな水玉 - 前景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '70px',
          height: '70px',
          top: '220px',
          left: '55%',
          background: 'radial-gradient(circle at 50% 50%, rgba(106, 181, 224, 0.73), rgba(106, 181, 224, 0.4))',
          filter: 'blur(5px)',
          opacity: 0.75,
          animation: 'hy-float-fast-2 12s ease-in-out infinite alternate',
          animationDelay: '3s'
        }}
      />
      
      {/* Bubble 9: 右下の小さな水玉 - 前景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '90px',
          height: '90px',
          top: '520px',
          right: '20%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 181, 224, 0.72), rgba(107, 181, 224, 0.38))',
          filter: 'blur(5px)',
          opacity: 0.75,
          animation: 'hy-float-fast-3 11s ease-in-out infinite alternate',
          animationDelay: '5s'
        }}
      />
      
      {/* Bubble 10: 左下の小さな水玉 - 前景層 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '75px',
          height: '75px',
          top: '480px',
          left: '18%',
          background: 'radial-gradient(circle at 50% 50%, rgba(95, 175, 220, 0.74), rgba(95, 175, 220, 0.41))',
          filter: 'blur(5px)',
          opacity: 0.75,
          animation: 'hy-float-fast-4 9s ease-in-out infinite alternate',
          animationDelay: '7s'
        }}
      />
    </div>
  );
}
