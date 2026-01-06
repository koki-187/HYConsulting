# Reference Site Water Bubble Analysis

**Reference Site:** https://hyconsulting.jp/  
**Analysis Date:** 2026-01-06  
**Purpose:** Match water bubble effect exactly

---

## Visual Analysis from Screenshots

### Hero Section (Top of Page)
**Observed Water Bubbles:**
1. **Left side (upper left):** 
   - Large blue-green gradient bubble
   - Position: Upper left corner, partially visible
   - Opacity: ~20-30% (semi-transparent)
   - Blur: Strong (40-60px estimated)
   - Color: Blue-green gradient (#4ade80 to #3b82f6)

2. **Left side (middle left):**
   - Medium blue bubble
   - Position: Middle left area
   - Opacity: ~25-35%
   - Blur: Strong (40-50px)
   - Color: Blue (#3b82f6)

3. **Right side (upper right):**
   - Large solid blue bubble
   - Position: Upper right corner
   - Opacity: ~40-50% (more opaque than others)
   - Blur: Moderate (30-40px)
   - Color: Solid blue (#2563eb)

### ABOUT Section
**Observed Water Bubbles:**
- Multiple light blue bubbles around the network diagram
- Positioned to create depth behind the circular network graphic
- Very subtle, almost imperceptible
- Opacity: ~10-15%
- Blur: Very strong (50-70px)

### Key Differences from Current Implementation

| Aspect | Reference Site | Current Implementation |
|--------|----------------|------------------------|
| **Positioning** | Specific positions (not random) | Random bottom positions |
| **Color Variety** | Blue-green gradient + solid blue | Only blue gradients |
| **Opacity Range** | 10-50% (wider range) | 15-25% (narrow range) |
| **Blur Range** | 30-70px (varies more) | 30-50px (consistent) |
| **Bubble Count** | ~3-5 visible at once | 13 bubbles (too many) |
| **Animation** | Subtle, slow movement | Bottom-to-top float |
| **Distribution** | Concentrated in corners | Spread across bottom |

---

## Specific Bubble Specifications

### Bubble 1 (Upper Left - Blue-Green)
```tsx
{
  width: '280px',
  height: '280px',
  left: '-5%',
  top: '10%',
  background: 'linear-gradient(135deg, #4ade80, #3b82f6)',
  opacity: 0.25,
  filter: 'blur(55px)',
  animation: 'bubble-float-slow 35s ease-in-out infinite'
}
```

### Bubble 2 (Middle Left - Blue)
```tsx
{
  width: '220px',
  height: '220px',
  left: '5%',
  top: '40%',
  background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
  opacity: 0.30,
  filter: 'blur(45px)',
  animation: 'bubble-float-medium 28s ease-in-out infinite'
}
```

### Bubble 3 (Upper Right - Solid Blue)
```tsx
{
  width: '300px',
  height: '300px',
  right: '-8%',
  top: '8%',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  opacity: 0.45,
  filter: 'blur(40px)',
  animation: 'bubble-float-slow 32s ease-in-out infinite'
}
```

### Bubble 4 (Bottom Left - Subtle)
```tsx
{
  width: '200px',
  height: '200px',
  left: '10%',
  bottom: '15%',
  background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
  opacity: 0.18,
  filter: 'blur(50px)',
  animation: 'bubble-float-fast 22s ease-in-out infinite'
}
```

### Bubble 5 (Bottom Right - Subtle)
```tsx
{
  width: '180px',
  height: '180px',
  right: '12%',
  bottom: '20%',
  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  opacity: 0.20,
  filter: 'blur(48px)',
  animation: 'bubble-float-medium 25s ease-in-out infinite'
}
```

---

## Animation Behavior

**Reference Site Animation:**
- **Movement:** Subtle vertical and horizontal drift (not strictly bottom-to-top)
- **Speed:** Very slow (30-40 second cycles)
- **Pattern:** Gentle oscillation, not linear movement
- **Easing:** ease-in-out for smooth transitions

**Recommended Keyframes:**
```css
@keyframes bubble-float-slow {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.25;
  }
  25% { 
    transform: translate(15px, -20px) scale(1.05); 
    opacity: 0.30;
  }
  50% { 
    transform: translate(-10px, -35px) scale(1.1); 
    opacity: 0.28;
  }
  75% { 
    transform: translate(20px, -15px) scale(1.05); 
    opacity: 0.32;
  }
}

@keyframes bubble-float-medium {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.30;
  }
  33% { 
    transform: translate(-12px, -25px) scale(1.08); 
    opacity: 0.35;
  }
  66% { 
    transform: translate(18px, -40px) scale(1.12); 
    opacity: 0.32;
  }
}

@keyframes bubble-float-fast {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.18;
  }
  50% { 
    transform: translate(-15px, -30px) scale(1.15); 
    opacity: 0.22;
  }
}
```

---

## Implementation Recommendations

### Changes Needed:
1. **Reduce bubble count:** 13 → 5 bubbles
2. **Change positioning:** Bottom-only → Strategic corner/edge placement
3. **Add color variety:** Add blue-green gradient bubbles
4. **Widen opacity range:** 15-25% → 10-50%
5. **Adjust animation:** Bottom-to-top → Subtle drift/oscillation
6. **Increase blur variance:** 30-50px → 30-70px
7. **Slow down animation:** 18-28s → 22-35s

### Priority:
1. **HIGH:** Reduce bubble count and reposition
2. **HIGH:** Add blue-green gradient color
3. **MEDIUM:** Adjust animation to subtle drift
4. **MEDIUM:** Widen opacity range
5. **LOW:** Fine-tune blur amounts

---

## Next Steps

1. Update `WaterBubbleBackground.tsx` with 5 strategically positioned bubbles
2. Add blue-green gradient color variant
3. Adjust animation keyframes for subtle drift
4. Test in development environment
5. Compare side-by-side with reference site
6. Deploy to production

---

**Status:** Analysis Complete  
**Next Phase:** Implementation
