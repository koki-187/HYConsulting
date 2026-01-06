/**
 * Water Bubble Background Component
 * 
 * Matching reference site: https://hyconsulting.jp/
 * 
 * Key specifications based on visual analysis:
 * - Total bubbles: 5 (not 13)
 * - Positioning: Strategic corners and edges (not random bottom)
 * - Colors: Blue-green gradient + blue variants
 * - Opacity: 10-50% (wider range)
 * - Blur: 30-70px (more variance)
 * - Animation: Subtle drift/oscillation (not bottom-to-top)
 * - Speed: 22-35s cycles (slower)
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Bubble 1: Upper Left - Blue-Green Gradient (most visible) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '280px',
          height: '280px',
          left: '-5%',
          top: '10%',
          background: 'linear-gradient(135deg, #4ade80, #3b82f6)',
          opacity: 0.25,
          filter: 'blur(55px)',
          animation: 'bubble-drift-slow 35s ease-in-out infinite'
        }}
      />
      
      {/* Bubble 2: Middle Left - Blue */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '220px',
          height: '220px',
          left: '5%',
          top: '40%',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          opacity: 0.30,
          filter: 'blur(45px)',
          animation: 'bubble-drift-medium 28s ease-in-out infinite',
          animationDelay: '3s'
        }}
      />
      
      {/* Bubble 3: Upper Right - Solid Blue (most opaque) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '300px',
          height: '300px',
          right: '-8%',
          top: '8%',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          opacity: 0.45,
          filter: 'blur(40px)',
          animation: 'bubble-drift-slow 32s ease-in-out infinite',
          animationDelay: '5s'
        }}
      />
      
      {/* Bubble 4: Bottom Left - Subtle */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          left: '10%',
          bottom: '15%',
          background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
          opacity: 0.18,
          filter: 'blur(50px)',
          animation: 'bubble-drift-fast 22s ease-in-out infinite',
          animationDelay: '7s'
        }}
      />
      
      {/* Bubble 5: Bottom Right - Subtle */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          right: '12%',
          bottom: '20%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          opacity: 0.20,
          filter: 'blur(48px)',
          animation: 'bubble-drift-medium 25s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
    </div>
  );
}
