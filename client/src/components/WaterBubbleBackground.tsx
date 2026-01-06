/**
 * Water Bubble Background Component
 * 
 * Final version matching reference site: https://hyconsulting.jp/
 * - Color: Blue gradient (matching reference)
 * - Opacity: 15-25% (subtle, as per reference)
 * - Blur: 30-50px (strong blur effect)
 * - Animation: Bottom-to-top float (18-28s cycles)
 * - Position: bottom: -10% to -15% (starting off-screen)
 * - z-index: 1 (behind content, above white background)
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Large Bubbles - 4 bubbles */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '220px',
          height: '220px',
          left: '5%',
          bottom: '-10%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          opacity: 0.25,
          filter: 'blur(45px)',
          animation: 'bubble-float-slow 28s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '250px',
          height: '250px',
          right: '8%',
          bottom: '-12%',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          opacity: 0.22,
          filter: 'blur(50px)',
          animation: 'bubble-float-medium 22s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          left: '70%',
          bottom: '-11%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          opacity: 0.24,
          filter: 'blur(42px)',
          animation: 'bubble-float-slow 28s ease-in-out infinite',
          animationDelay: '4s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '230px',
          height: '230px',
          right: '35%',
          bottom: '-13%',
          background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
          opacity: 0.23,
          filter: 'blur(48px)',
          animation: 'bubble-float-medium 22s ease-in-out infinite',
          animationDelay: '1s'
        }}
      />
      
      {/* Medium Bubbles - 5 bubbles */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '140px',
          height: '140px',
          left: '25%',
          bottom: '-11%',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          opacity: 0.20,
          filter: 'blur(35px)',
          animation: 'bubble-float-fast 18s ease-in-out infinite',
          animationDelay: '1s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '160px',
          height: '160px',
          right: '20%',
          bottom: '-13%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          opacity: 0.21,
          filter: 'blur(38px)',
          animation: 'bubble-float-slow 28s ease-in-out infinite',
          animationDelay: '3s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '130px',
          height: '130px',
          left: '50%',
          bottom: '-14%',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          opacity: 0.19,
          filter: 'blur(32px)',
          animation: 'bubble-float-medium 22s ease-in-out infinite',
          animationDelay: '0.5s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '150px',
          height: '150px',
          left: '85%',
          bottom: '-10%',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          opacity: 0.18,
          filter: 'blur(30px)',
          animation: 'bubble-float-fast 18s ease-in-out infinite',
          animationDelay: '2.5s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '145px',
          height: '145px',
          right: '50%',
          bottom: '-12%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          opacity: 0.20,
          filter: 'blur(36px)',
          animation: 'bubble-float-medium 22s ease-in-out infinite',
          animationDelay: '5s'
        }}
      />
      
      {/* Small Bubbles - 4 bubbles */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '90px',
          height: '90px',
          left: '15%',
          bottom: '-15%',
          background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
          opacity: 0.15,
          filter: 'blur(28px)',
          animation: 'bubble-float-fast 18s ease-in-out infinite',
          animationDelay: '2.5s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '100px',
          height: '100px',
          right: '12%',
          bottom: '-10%',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          opacity: 0.17,
          filter: 'blur(30px)',
          animation: 'bubble-float-medium 22s ease-in-out infinite',
          animationDelay: '1.5s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '85px',
          height: '85px',
          left: '60%',
          bottom: '-12%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          opacity: 0.16,
          filter: 'blur(32px)',
          animation: 'bubble-float-slow 28s ease-in-out infinite',
          animationDelay: '3.5s'
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: '110px',
          height: '110px',
          right: '45%',
          bottom: '-8%',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          opacity: 0.18,
          filter: 'blur(34px)',
          animation: 'bubble-float-fast 18s ease-in-out infinite',
          animationDelay: '4s'
        }}
      />
    </div>
  );
}
