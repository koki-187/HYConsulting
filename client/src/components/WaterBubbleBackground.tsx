/**
 * Water Bubble Background Component
 * 
 * Full-screen fixed background with animated blue water bubbles
 * Based on reference site: https://hyconsulting.jp/
 * 
 * Key specifications from reference:
 * - Color: Blue gradient (#005BAC primary blue)
 * - Opacity: Very low (8% - 18%)
 * - Blur: Strong effect (90px - 100px)
 * - Initial position: Off-screen bottom (-10% to -15%)
 * - Animation: Bottom to top, 15s - 28s duration
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Large Bubbles (120px - 180px) - Very subtle with strong blur */}
      <div 
        className="absolute rounded-full bg-blue-500/8 animate-bubble-slow"
        style={{
          width: '160px',
          height: '160px',
          left: '10%',
          bottom: '-10%',
          filter: 'blur(95px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-400/10 animate-bubble-medium"
        style={{
          width: '180px',
          height: '180px',
          left: '70%',
          bottom: '-12%',
          filter: 'blur(100px)',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-600/9 animate-bubble-slow"
        style={{
          width: '140px',
          height: '140px',
          left: '45%',
          bottom: '-15%',
          filter: 'blur(92px)',
          animationDelay: '4s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-300/12 animate-bubble-medium"
        style={{
          width: '120px',
          height: '120px',
          left: '85%',
          bottom: '-11%',
          filter: 'blur(90px)',
          animationDelay: '1s'
        }}
      />

      {/* Medium Bubbles (70px - 100px) */}
      <div 
        className="absolute rounded-full bg-blue-500/14 animate-bubble-fast"
        style={{
          width: '90px',
          height: '90px',
          left: '20%',
          bottom: '-13%',
          filter: 'blur(94px)',
          animationDelay: '3s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-400/15 animate-bubble-medium"
        style={{
          width: '100px',
          height: '100px',
          left: '60%',
          bottom: '-14%',
          filter: 'blur(96px)',
          animationDelay: '0.5s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-600/13 animate-bubble-slow"
        style={{
          width: '80px',
          height: '80px',
          left: '35%',
          bottom: '-10%',
          filter: 'blur(93px)',
          animationDelay: '2.5s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-300/16 animate-bubble-fast"
        style={{
          width: '95px',
          height: '95px',
          left: '75%',
          bottom: '-12%',
          filter: 'blur(97px)',
          animationDelay: '1.5s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-500/11 animate-bubble-medium"
        style={{
          width: '70px',
          height: '70px',
          left: '50%',
          bottom: '-11%',
          filter: 'blur(91px)',
          animationDelay: '3.5s'
        }}
      />

      {/* Small Bubbles (35px - 55px) */}
      <div 
        className="absolute rounded-full bg-blue-600/17 animate-bubble-fast"
        style={{
          width: '50px',
          height: '50px',
          left: '15%',
          bottom: '-14%',
          filter: 'blur(98px)',
          animationDelay: '0.8s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-500/18 animate-bubble-medium"
        style={{
          width: '55px',
          height: '55px',
          left: '65%',
          bottom: '-13%',
          filter: 'blur(99px)',
          animationDelay: '2.2s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-400/16 animate-bubble-slow"
        style={{
          width: '45px',
          height: '45px',
          left: '90%',
          bottom: '-15%',
          filter: 'blur(95px)',
          animationDelay: '1.8s'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-300/15 animate-bubble-fast"
        style={{
          width: '40px',
          height: '40px',
          left: '25%',
          bottom: '-12%',
          filter: 'blur(92px)',
          animationDelay: '3.2s'
        }}
      />
    </div>
  );
}
