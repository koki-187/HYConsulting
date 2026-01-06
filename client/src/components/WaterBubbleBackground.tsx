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
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Large Bubbles - 150px ~ 200px */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-blue-500/8"
        style={{
          width: '180px',
          height: '180px',
          left: '5%',
          bottom: '-10%',
          filter: 'blur(90px)',
          animation: 'bubble-float-slow 25s ease-in-out infinite',
          animationDelay: '0s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-300/12 to-blue-400/10"
        style={{
          width: '200px',
          height: '200px',
          left: '75%',
          bottom: '-15%',
          filter: 'blur(100px)',
          animation: 'bubble-float-slow 28s ease-in-out infinite',
          animationDelay: '3s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/8"
        style={{
          width: '160px',
          height: '160px',
          left: '45%',
          bottom: '-8%',
          filter: 'blur(85px)',
          animation: 'bubble-float-slow 26s ease-in-out infinite',
          animationDelay: '6s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-500/9 to-blue-600/7"
        style={{
          width: '170px',
          height: '170px',
          left: '88%',
          bottom: '-12%',
          filter: 'blur(95px)',
          animation: 'bubble-float-slow 27s ease-in-out infinite',
          animationDelay: '9s'
        }}
      />

      {/* Medium Bubbles - 80px ~ 120px */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-400/12 to-blue-500/10"
        style={{
          width: '110px',
          height: '110px',
          left: '15%',
          bottom: '-5%',
          filter: 'blur(70px)',
          animation: 'bubble-float-medium 22s ease-in-out infinite',
          animationDelay: '1s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-cyan-300/14 to-blue-400/12"
        style={{
          width: '100px',
          height: '100px',
          left: '55%',
          bottom: '-3%',
          filter: 'blur(65px)',
          animation: 'bubble-float-medium 20s ease-in-out infinite',
          animationDelay: '4s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-300/13 to-cyan-400/11"
        style={{
          width: '95px',
          height: '95px',
          left: '30%',
          bottom: '-4%',
          filter: 'blur(68px)',
          animation: 'bubble-float-medium 21s ease-in-out infinite',
          animationDelay: '7s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-400/11 to-blue-500/9"
        style={{
          width: '105px',
          height: '105px',
          left: '68%',
          bottom: '-6%',
          filter: 'blur(72px)',
          animation: 'bubble-float-medium 23s ease-in-out infinite',
          animationDelay: '10s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-cyan-400/12 to-blue-400/10"
        style={{
          width: '90px',
          height: '90px',
          left: '92%',
          bottom: '-2%',
          filter: 'blur(63px)',
          animation: 'bubble-float-medium 19s ease-in-out infinite',
          animationDelay: '13s'
        }}
      />

      {/* Small Bubbles - 40px ~ 60px */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-400/15 to-blue-500/13"
        style={{
          width: '55px',
          height: '55px',
          left: '10%',
          bottom: '0%',
          filter: 'blur(50px)',
          animation: 'bubble-float-fast 18s ease-in-out infinite',
          animationDelay: '0s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-cyan-300/16 to-blue-400/14"
        style={{
          width: '50px',
          height: '50px',
          left: '25%',
          bottom: '2%',
          filter: 'blur(48px)',
          animation: 'bubble-float-fast 17s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-300/17 to-cyan-400/15"
        style={{
          width: '60px',
          height: '60px',
          left: '40%',
          bottom: '1%',
          filter: 'blur(52px)',
          animation: 'bubble-float-fast 19s ease-in-out infinite',
          animationDelay: '5s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-400/14 to-blue-500/12"
        style={{
          width: '48px',
          height: '48px',
          left: '58%',
          bottom: '3%',
          filter: 'blur(46px)',
          animation: 'bubble-float-fast 16s ease-in-out infinite',
          animationDelay: '8s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-cyan-400/16 to-blue-400/14"
        style={{
          width: '52px',
          height: '52px',
          left: '72%',
          bottom: '0%',
          filter: 'blur(49px)',
          animation: 'bubble-float-fast 17.5s ease-in-out infinite',
          animationDelay: '11s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-500/15 to-blue-600/13"
        style={{
          width: '58px',
          height: '58px',
          left: '85%',
          bottom: '2%',
          filter: 'blur(51px)',
          animation: 'bubble-float-fast 18.5s ease-in-out infinite',
          animationDelay: '14s'
        }}
      />
      <div 
        className="absolute rounded-full bg-gradient-to-br from-blue-300/18 to-cyan-300/16"
        style={{
          width: '45px',
          height: '45px',
          left: '95%',
          bottom: '1%',
          filter: 'blur(44px)',
          animation: 'bubble-float-fast 15.5s ease-in-out infinite',
          animationDelay: '17s'
        }}
      />
    </div>
  );
}
