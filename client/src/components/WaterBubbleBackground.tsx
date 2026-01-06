/**
 * Water Bubble Background Component
 * 
 * Session 45 COMPLETE RECREATION based on reference site deep analysis
 * Reference site: https://hyconsulting.jp/ (pasted_file_xkjxQR_image.png)
 * 
 * CRITICAL SPECIFICATIONS (EXACT MATCH):
 * - Count: 18 bubbles (NOT 10) - matches reference site density
 * - Outline: TWO DISTINCT TYPES
 *   * Type A: CLEAR outlines (blur 2-4px, opacity 0.70-0.85) - foreground focal points
 *   * Type B: BLURRED atmospheric (blur 20-25px, opacity 0.30-0.38) - background depth
 * - Size Range: 50-400px (NOT 70-320px) - massive variation for depth
 * - Blur Range: 2-25px (NOT 5-8px) - 10x variation for true depth perception
 * - Animation: 9-40s (slow, gentle floating) - matches reference site movement
 * 
 * LAYER SYSTEM:
 * - Background (6 bubbles): 320-400px, blur 20-25px, opacity 0.30-0.38, animation 35-40s
 * - Middle (6 bubbles): 160-250px, blur 11-15px, opacity 0.48-0.58, animation 19-24s
 * - Foreground (6 bubbles): 50-110px, blur 2-4px, opacity 0.70-0.85, animation 9-14s
 * 
 * USER FEEDBACK ADDRESSED:
 * - ❌ Previous: Only 10 bubbles → ✅ Now: 18 bubbles
 * - ❌ Previous: Uniform blur (5-8px) → ✅ Now: Dramatic variation (2-25px)
 * - ❌ Previous: No clear outlines → ✅ Now: Sharp 2-4px blur for foreground
 * - ❌ Previous: Weak depth → ✅ Now: Strong atmospheric depth with 20-25px blur
 */

export default function WaterBubbleBackground() {
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* ============================================ */}
      {/* BACKGROUND LAYER (6 bubbles) - "Atmospheric Depth" */}
      {/* Extra large, heavily blurred, very subtle */}
      {/* Creates atmospheric background depth */}
      {/* ============================================ */}
      
      {/* Bubble 1: 380px, blur 24px, opacity 0.35 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '380px',
          height: '380px',
          top: '8%',
          left: '8%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.35), rgba(74, 144, 200, 0.18))',
          filter: 'blur(24px)',
          opacity: 0.35,
          animation: 'hy-float-bg-1 38s ease-in-out infinite alternate',
          animationDelay: '0s'
        }}
      />
      
      {/* Bubble 2: 350px, blur 22px, opacity 0.32 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '350px',
          height: '350px',
          top: '8%',
          left: '75%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.32), rgba(61, 133, 198, 0.16))',
          filter: 'blur(22px)',
          opacity: 0.32,
          animation: 'hy-float-bg-2 35s ease-in-out infinite alternate',
          animationDelay: '5s'
        }}
      />
      
      {/* Bubble 3: 400px, blur 25px, opacity 0.30 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          top: '65%',
          left: '45%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.30), rgba(107, 168, 216, 0.15))',
          filter: 'blur(25px)',
          opacity: 0.30,
          animation: 'hy-float-bg-3 40s ease-in-out infinite alternate',
          animationDelay: '10s'
        }}
      />
      
      {/* Bubble 4: 320px, blur 20px, opacity 0.38 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '320px',
          height: '320px',
          top: '55%',
          left: '88%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.38), rgba(74, 144, 200, 0.19))',
          filter: 'blur(20px)',
          opacity: 0.38,
          animation: 'hy-float-bg-4 36s ease-in-out infinite alternate',
          animationDelay: '3s'
        }}
      />
      
      {/* Bubble 5: 360px, blur 23px, opacity 0.33 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '360px',
          height: '360px',
          top: '75%',
          left: '22%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.33), rgba(61, 133, 198, 0.17))',
          filter: 'blur(23px)',
          opacity: 0.33,
          animation: 'hy-float-bg-5 37s ease-in-out infinite alternate',
          animationDelay: '8s'
        }}
      />
      
      {/* Bubble 6: 340px, blur 21px, opacity 0.36 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '340px',
          height: '340px',
          top: '25%',
          left: '62%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.36), rgba(107, 168, 216, 0.18))',
          filter: 'blur(21px)',
          opacity: 0.36,
          animation: 'hy-float-bg-6 39s ease-in-out infinite alternate',
          animationDelay: '12s'
        }}
      />
      
      {/* ============================================ */}
      {/* MIDDLE LAYER (6 bubbles) - "Transitional Depth" */}
      {/* Medium to large, moderately blurred */}
      {/* Bridges foreground and background */}
      {/* ============================================ */}
      
      {/* Bubble 7: 220px, blur 14px, opacity 0.50 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '220px',
          height: '220px',
          top: '35%',
          left: '15%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.50), rgba(74, 144, 200, 0.25))',
          filter: 'blur(14px)',
          opacity: 0.50,
          animation: 'hy-float-mid-1 22s ease-in-out infinite alternate',
          animationDelay: '2s'
        }}
      />
      
      {/* Bubble 8: 180px, blur 12px, opacity 0.55 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '180px',
          height: '180px',
          top: '45%',
          left: '68%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.55), rgba(61, 133, 198, 0.28))',
          filter: 'blur(12px)',
          opacity: 0.55,
          animation: 'hy-float-mid-2 20s ease-in-out infinite alternate',
          animationDelay: '6s'
        }}
      />
      
      {/* Bubble 9: 250px, blur 15px, opacity 0.48 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '250px',
          height: '250px',
          top: '18%',
          left: '38%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.48), rgba(107, 168, 216, 0.24))',
          filter: 'blur(15px)',
          opacity: 0.48,
          animation: 'hy-float-mid-3 24s ease-in-out infinite alternate',
          animationDelay: '9s'
        }}
      />
      
      {/* Bubble 10: 200px, blur 13px, opacity 0.52 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '200px',
          height: '200px',
          top: '72%',
          left: '82%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.52), rgba(74, 144, 200, 0.26))',
          filter: 'blur(13px)',
          opacity: 0.52,
          animation: 'hy-float-mid-4 21s ease-in-out infinite alternate',
          animationDelay: '4s'
        }}
      />
      
      {/* Bubble 11: 160px, blur 11px, opacity 0.58 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '160px',
          height: '160px',
          top: '58%',
          left: '28%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.58), rgba(61, 133, 198, 0.29))',
          filter: 'blur(11px)',
          opacity: 0.58,
          animation: 'hy-float-mid-5 19s ease-in-out infinite alternate',
          animationDelay: '7s'
        }}
      />
      
      {/* Bubble 12: 240px, blur 14px, opacity 0.50 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '240px',
          height: '240px',
          top: '82%',
          left: '52%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.50), rgba(107, 168, 216, 0.25))',
          filter: 'blur(14px)',
          opacity: 0.50,
          animation: 'hy-float-mid-6 23s ease-in-out infinite alternate',
          animationDelay: '11s'
        }}
      />
      
      {/* ============================================ */}
      {/* FOREGROUND LAYER (6 bubbles) - "Sharp Focus" */}
      {/* Small, CLEAR OUTLINES (minimal blur 2-4px) */}
      {/* Highly visible, creates focal points */}
      {/* These are the "はっきりとした水玉" user mentioned */}
      {/* ============================================ */}
      
      {/* Bubble 13: 90px, blur 3px, opacity 0.75 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '90px',
          height: '90px',
          top: '22%',
          left: '12%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.75), rgba(74, 144, 200, 0.45))',
          filter: 'blur(3px)',
          opacity: 0.75,
          animation: 'hy-float-fg-1 12s ease-in-out infinite alternate',
          animationDelay: '1s'
        }}
      />
      
      {/* Bubble 14: 70px, blur 2px, opacity 0.80 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '70px',
          height: '70px',
          top: '42%',
          left: '42%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.80), rgba(61, 133, 198, 0.50))',
          filter: 'blur(2px)',
          opacity: 0.80,
          animation: 'hy-float-fg-2 10s ease-in-out infinite alternate',
          animationDelay: '3s'
        }}
      />
      
      {/* Bubble 15: 110px, blur 4px, opacity 0.70 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '110px',
          height: '110px',
          top: '15%',
          left: '78%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.70), rgba(107, 168, 216, 0.42))',
          filter: 'blur(4px)',
          opacity: 0.70,
          animation: 'hy-float-fg-3 14s ease-in-out infinite alternate',
          animationDelay: '5s'
        }}
      />
      
      {/* Bubble 16: 50px, blur 2px, opacity 0.85 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '50px',
          height: '50px',
          top: '68%',
          left: '35%',
          background: 'radial-gradient(circle at 50% 50%, rgba(74, 144, 200, 0.85), rgba(74, 144, 200, 0.55))',
          filter: 'blur(2px)',
          opacity: 0.85,
          animation: 'hy-float-fg-4 9s ease-in-out infinite alternate',
          animationDelay: '2s'
        }}
      />
      
      {/* Bubble 17: 85px, blur 3px, opacity 0.75 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '85px',
          height: '85px',
          top: '62%',
          left: '65%',
          background: 'radial-gradient(circle at 50% 50%, rgba(61, 133, 198, 0.75), rgba(61, 133, 198, 0.45))',
          filter: 'blur(3px)',
          opacity: 0.75,
          animation: 'hy-float-fg-5 11s ease-in-out infinite alternate',
          animationDelay: '4s'
        }}
      />
      
      {/* Bubble 18: 60px, blur 2px, opacity 0.80 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '60px',
          height: '60px',
          top: '38%',
          left: '92%',
          background: 'radial-gradient(circle at 50% 50%, rgba(107, 168, 216, 0.80), rgba(107, 168, 216, 0.50))',
          filter: 'blur(2px)',
          opacity: 0.80,
          animation: 'hy-float-fg-6 10s ease-in-out infinite alternate',
          animationDelay: '6s'
        }}
      />
    </div>
  );
}
