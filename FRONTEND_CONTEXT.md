# C-OASIS Frontend Context (AI Transfer File)

## PROJECT
C-OASIS: Elite university freelance developer marketplace
Stack: Next.js 16 App Router, React 18, TS, TailwindCSS, Framer Motion, Lucide

## ROUTES
```
/ → Landing (Bento Hero)
/browse → Marketplace (Filters+Grid)
/auth/login → Login (Split-screen)
/auth/register → Register (Split-screen, Buyer/Seller toggle, OTP)
/gig/[id] → Gig Details
/dashboard/buyer → Buyer Portal
/dashboard/seller → Seller Portal
/admin → Admin Panel
```

## LAYOUT
`Navbar → Main(min-h-screen) → Footer`

## FOLDERS
```
app/ → Next.js routing
components/ui/ → Button, Toast, StarRating
components/layout/ → Navbar, Footer
components/gig/ → GigCard, FilterSidebar
lib/ → useTheme, useSimpleAuth
types/ → TS interfaces (Gig, User, etc.)
public/ → hero-dark.png, hero-light.png
```

## DESIGN SYSTEM — "Blue Aurora Editorial Bento"

### COLORS
```
--bg: #F8FAFC (ghost-gray, NO pure white)
--surface: #FFFFFF
--glass: rgba(255,255,255,0.6)
--ink: #0F172A
--ink-soft: #334155
--muted: #64748B
--line: rgba(15,23,42,0.08)
--royal-blue: #2563EB
--cyan: #06B6D4
--glow: massive blurred blue/cyan edge orbs
```

### TYPOGRAPHY
- Display: Inter/Satoshi, tight tracking, editorial
- Body: Inter
- Hero: 72-96px desktop, 44px mobile, lh 0.95-1.05
- Metrics: floating oversized numbers, NO boxes

### SPACING
- Extreme whitespace, editorial breathing room
- Large section padding, floating compositions

### RADIUS
sm:12px md:18px lg:28px xl:36px pill:999px
Images: 32px+ rounded

### SHADOWS
Very soft, large blur, low opacity
Example: 0 20px 60px rgba(15,23,42,0.08)

### GLASS SYSTEM
.glass / .glass-light / .glass-dark / .glass-panel
All: backdrop-blur(20-30px), translucent fills, minimal borders

### ANIMATION
- Framer Motion, ease: cubic-bezier(0.16,1,0.3,1)
- Stagger reveals, parallax, fade-up, floating hover
- .scroll-reveal-child for async staggered reveals
- Hover: cards→y:-6, buttons→scale:1.02

## COMPONENTS

### Buttons
- Fully rounded pills, deep ink primary, white text
- Variants: primary/secondary/outline/ghost/glass

### Cards
- Glass OR ultra-clean white
- Layered depth, asymmetrical sizing, floating shadows
- GigCard: hover y:-6, glass overlays, cinematic imagery

### Navbar
- Fixed glass, transparent→blurred on scroll
- Mobile: fullscreen overlay with blur backdrop
- Shrinks h-14→h-12 on scroll

### Footer
- Minimal architecture-style, clean columns

## STATE
- useState/useEffect for local state
- useTheme: localStorage + system pref sync (system/light/dark)
- useSimpleAuth: JWT cookie check → user object
- URL params for browse filters

## API (DO NOT MODIFY)
- REST /api/* endpoints
- Auth: /api/auth/login, register, send-otp, logout, me, google
- Gigs: /api/gigs?limit&sort&category&search&techStack&budgetMin&budgetMax

## THEME
- CSS variables on :root, toggled via .dark class
- useTheme hook manages system/light/dark cycling
- Transitions: 0.8s cubic-bezier for theme toggle

## KNOWN BUGS
- /browse: "No results" showing with no filters (API/fetch issue)

## CONSTRAINTS
- NO backend changes
- NO API modifications
- NO Prisma/auth/database changes
- ONLY UI/frontend layer
- Preserve responsiveness
- 'use client' only when needed

---

## AI_INSTRUCTIONS

### CONTINUE PROJECT WITH:
- Target: Awwwards × Linear × Framer × architecture studio
- Every component must feel premium/editorial
- Use existing design tokens, don't invent new systems
- Return minimal diffs when possible
- Keep code production-quality

### STYLE RULES:
- NO pure white backgrounds
- NO generic gradients/harsh borders/square elements
- NO clutter/generic startup UI
- Pill buttons everywhere
- 32px+ radius on images
- Floating metrics (no boxes)
- Asymmetrical bento grids (not uniform)

### ANIMATION PHILOSOPHY:
- Slow, premium, cinematic
- Purposeful motion only
- Staggered reveals
- Smooth parallax
- Framer Motion preferred

### DO NOT CHANGE:
- Backend logic
- API routes
- Auth flow
- Database schema
- Component prop interfaces (only styling)
