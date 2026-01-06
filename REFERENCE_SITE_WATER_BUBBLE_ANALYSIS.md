# Reference Site Water Bubble Animation Analysis

## Source: https://hyconsulting.jp/

### Visual Characteristics (from video frame analysis)

**Water Bubble Properties:**
1. **Color**: Blue gradient (青色のグラデーション)
   - Light blue: `#5BA3D0` ~ `#7AB8E0`
   - Medium blue: `#3D8BC0` ~ `#4A9DD0`
   - Dark blue: `#2A6FA0` ~ `#3580B0`

2. **Size**: 3 size variations
   - Large: 150px ~ 200px diameter
   - Medium: 80px ~ 120px diameter
   - Small: 40px ~ 60px diameter

3. **Opacity**: Very low (非常に薄い)
   - Large bubbles: 8% ~ 12% opacity
   - Medium bubbles: 10% ~ 15% opacity
   - Small bubbles: 12% ~ 18% opacity

4. **Blur Effect**: Strong blur (強いぼかし)
   - Large bubbles: `blur(80px)` ~ `blur(100px)`
   - Medium bubbles: `blur(60px)` ~ `blur(80px)`
   - Small bubbles: `blur(40px)` ~ `blur(60px)`

5. **Position**: Full-screen fixed background
   - `position: fixed`
   - `top: 0`, `left: 0`, `right: 0`, `bottom: 0`
   - `z-index: 0` (behind all content)

6. **Animation**: Slow upward float (ゆっくり上昇)
   - Direction: Bottom to top (下から上へ)
   - Duration: 20s ~ 30s per cycle
   - Easing: `ease-in-out`
   - Infinite loop with staggered delays

7. **Distribution**: 15-20 bubbles scattered across full viewport
   - Left side: 30% ~ 40% of bubbles
   - Center: 20% ~ 30% of bubbles
   - Right side: 30% ~ 40% of bubbles
   - Vertical distribution: Even spacing from bottom to top

**Key Implementation Points:**
- Bubbles are NOT inside Hero section image
- Bubbles are BEHIND all page content (z-index: 0)
- Bubbles cover ENTIRE viewport (100vw x 100vh)
- Bubbles use CSS gradients for realistic sphere effect
- Animation is continuous and smooth

**Difference from Current Implementation:**
- Current: White bubbles inside Hero section image (z-index: 2)
- Correct: Blue bubbles behind all content as fixed background (z-index: 0)
