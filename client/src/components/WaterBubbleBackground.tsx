/**
 * Water Bubble Background Component
 * 
 * Based on reference site: https://hyconsulting.jp/
 * 
 * Specifications from reference site analysis:
 * - Size: Large (200-250px), Medium (120-150px), Small (80-100px)
 * - Blur: Strong effect (30px - 50px)
 * - Opacity: Very low (15% - 25%)
 * - Color: Blue gradient (blue-400, blue-500, blue-600)
 * - Initial position: Off-screen bottom (-10% to -15%)
 * - Animation: Bottom-to-top float (20s - 30s duration)
 * - Depth: Multiple layers for depth effect
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Large Bubbles */}
      <div 
        className="absolute rounded-full bg-blue-500/20 animate-bubble-slow"
        style={{
          width: '220px',
          height: '220px',
          left: '5%',
          bottom: '-10%',
          filter: 'blur(40px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-600/18 animate-bubble-medium"
        style={{
          width: '250px',
          height: '250px',
          right: '8%',
          bottom: '-12%',
          filter: 'blur(45px)',
          animationDelay: '2s'
        }}
      />
      
      {/* Medium Bubbles */}
      <div 
        className="absolute rounded-full bg-blue-400/22 animate-bubble-fast"
        style={{
          width: '140px',
          height: '140px',
          left: '25%',
          bottom: '-11%',
          filter: 'blur(35px)',
          animationDelay: '1s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-500/25 animate-bubble-slow"
        style={{
          width: '160px',
          height: '160px',
          right: '20%',
          bottom: '-13%',
          filter: 'blur(38px)',
          animationDelay: '3s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-600/20 animate-bubble-medium"
        style={{
          width: '130px',
          height: '130px',
          left: '50%',
          bottom: '-14%',
          filter: 'blur(36px)',
          animationDelay: '0.5s'
        }}
      />
      
      {/* Small Bubbles */}
      <div 
        className="absolute rounded-full bg-blue-400/18 animate-bubble-fast"
        style={{
          width: '90px',
          height: '90px',
          left: '15%',
          bottom: '-15%',
          filter: 'blur(30px)',
          animationDelay: '2.5s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-500/15 animate-bubble-medium"
        style={{
          width: '100px',
          height: '100px',
          right: '12%',
          bottom: '-10%',
          filter: 'blur(32px)',
          animationDelay: '1.5s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-600/17 animate-bubble-slow"
        style={{
          width: '85px',
          height: '85px',
          left: '70%',
          bottom: '-12%',
          filter: 'blur(33px)',
          animationDelay: '3.5s'
        }}
      />
    </div>
  );
}
