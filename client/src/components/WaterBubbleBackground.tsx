/**
 * Water Bubble Background Component
 * 
 * Full-screen fixed background with animated blue water bubbles
 * Based on reference site: https://hyconsulting.jp/
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Large Bubbles - Highly visible with moderate blur */}
      <div 
        className="absolute rounded-full bg-blue-400/30 animate-bubble-slow"
        style={{
          width: '120px',
          height: '120px',
          left: '8%',
          bottom: '10%',
          filter: 'blur(30px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-300/35 animate-bubble-medium"
        style={{
          width: '140px',
          height: '140px',
          left: '75%',
          bottom: '15%',
          filter: 'blur(35px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-cyan-400/25 animate-bubble-slow"
        style={{
          width: '100px',
          height: '100px',
          left: '45%',
          bottom: '20%',
          filter: 'blur(25px)'
        }}
      />

      {/* Medium Bubbles */}
      <div 
        className="absolute rounded-full bg-blue-500/30 animate-bubble-fast"
        style={{
          width: '80px',
          height: '80px',
          left: '20%',
          bottom: '25%',
          filter: 'blur(20px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-400/35 animate-bubble-medium"
        style={{
          width: '90px',
          height: '90px',
          left: '60%',
          bottom: '30%',
          filter: 'blur(22px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-cyan-300/28 animate-bubble-slow"
        style={{
          width: '75px',
          height: '75px',
          left: '85%',
          bottom: '18%',
          filter: 'blur(18px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-300/32 animate-bubble-fast"
        style={{
          width: '85px',
          height: '85px',
          left: '35%',
          bottom: '12%',
          filter: 'blur(20px)'
        }}
      />

      {/* Small Bubbles */}
      <div 
        className="absolute rounded-full bg-blue-600/40 animate-bubble-fast"
        style={{
          width: '50px',
          height: '50px',
          left: '15%',
          bottom: '35%',
          filter: 'blur(15px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-500/38 animate-bubble-medium"
        style={{
          width: '55px',
          height: '55px',
          left: '50%',
          bottom: '40%',
          filter: 'blur(16px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-cyan-500/35 animate-bubble-slow"
        style={{
          width: '45px',
          height: '45px',
          left: '70%',
          bottom: '28%',
          filter: 'blur(14px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-400/42 animate-bubble-fast"
        style={{
          width: '60px',
          height: '60px',
          left: '90%',
          bottom: '22%',
          filter: 'blur(17px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-blue-300/36 animate-bubble-medium"
        style={{
          width: '52px',
          height: '52px',
          left: '25%',
          bottom: '45%',
          filter: 'blur(15px)'
        }}
      />
      <div 
        className="absolute rounded-full bg-cyan-400/33 animate-bubble-slow"
        style={{
          width: '48px',
          height: '48px',
          left: '65%',
          bottom: '38%',
          filter: 'blur(14px)'
        }}
      />
    </div>
  );
}
