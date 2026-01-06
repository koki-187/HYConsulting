/**
 * Water Bubble Background Component
 * 
 * Implementation based on detailed instructions document
 * Reference site: https://hyconsulting.jp/
 * 
 * Specifications:
 * - 5 bubbles with specific positions, sizes, colors
 * - Radial gradients with transparency
 * - Vertical floating animation (ease-in-out, infinite, alternate)
 * - Strong blur effects (40-70px)
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Bubble 1: 左上の大きな水玉 - 薄い青色 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          top: '50px',
          left: '-100px',
          background: 'radial-gradient(circle at 40% 40%, rgba(91, 168, 214, 0.6), rgba(91, 168, 214, 0.2))',
          filter: 'blur(60px)',
          opacity: 0.8,
          animation: 'hy-float-1 10s ease-in-out infinite alternate'
        }}
      />
      
      {/* Bubble 2: 中央上部の小さな水玉 - 濃い青色 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '120px',
          height: '120px',
          top: '100px',
          left: '45%',
          background: 'radial-gradient(circle at 35% 35%, rgba(45, 127, 184, 0.7), rgba(45, 127, 184, 0.3))',
          filter: 'blur(40px)',
          opacity: 0.8,
          animation: 'hy-float-2 8s ease-in-out infinite alternate',
          animationDelay: '2s'
        }}
      />
      
      {/* Bubble 3: 右上の大きな水玉 - 濃い青色 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '350px',
          height: '350px',
          top: '0px',
          right: '5%',
          background: 'radial-gradient(circle at 40% 40%, rgba(29, 90, 154, 0.7), rgba(29, 90, 154, 0.3))',
          filter: 'blur(70px)',
          opacity: 0.8,
          animation: 'hy-float-3 12s ease-in-out infinite alternate',
          animationDelay: '4s'
        }}
      />
      
      {/* Bubble 4: 中央下部の水玉 - 中間の青色 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          top: '550px',
          left: '40%',
          background: 'radial-gradient(circle at 35% 35%, rgba(74, 159, 212, 0.6), rgba(74, 159, 212, 0.3))',
          filter: 'blur(50px)',
          opacity: 0.8,
          animation: 'hy-float-4 9s ease-in-out infinite alternate',
          animationDelay: '1s'
        }}
      />
      
      {/* Bubble 5: 右下の水玉 - 薄い青色 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '150px',
          height: '150px',
          top: '600px',
          right: '15%',
          background: 'radial-gradient(circle at 35% 35%, rgba(107, 181, 224, 0.6), rgba(107, 181, 224, 0.2))',
          filter: 'blur(45px)',
          opacity: 0.8,
          animation: 'hy-float-5 11s ease-in-out infinite alternate',
          animationDelay: '3s'
        }}
      />
    </div>
  );
}
