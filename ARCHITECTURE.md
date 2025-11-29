# Visual Architecture & Component Map

## Application Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     QR Menu Pro - PWA                          │
│                   (Next.js 14 Frontend)                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   ROOT LAYOUT                            │ │
│  │                   (layout.tsx)                           │ │
│  │  • Metadata & SEO                                        │ │
│  │  • Global CSS                                           │ │
│  │  • Service Worker Registration                          │ │
│  └────────────────────┬─────────────────────────────────────┘ │
│                       │                                        │
│       ┌───────────────┴────────────────┬──────────────────┐   │
│       │                                │                  │   │
│  ┌────▼───────────────┐  ┌────────────▼──────┐  ┌────────▼────┐
│  │   PAGES            │  │  COMPONENTS      │  │  UTILITIES  │
│  ├────────────────────┤  ├──────────────────┤  ├─────────────┤
│  │ • page.tsx (/)     │  │ Navigation       │  │ API Calls   │
│  │ • pricing/         │  │ Footer           │  │ Validation  │
│  │ • features/        │  │ FeaturesGrid     │  │ Hooks       │
│  │ • faq/             │  │ FAQAccordion     │  │             │
│  │ • contact/         │  │ Forms            │  │             │
│  │ • login/           │  │                  │  │             │
│  │ • signup/          │  │                  │  │             │
│  └────────────────────┘  └──────────────────┘  └─────────────┘
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              STYLING LAYER                               │ │
│  │  • TailwindCSS (utilities)                              │ │
│  │  • Global CSS (globals.css)                             │ │
│  │  • Custom components (card, btn-primary, etc.)          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           ANIMATION & INTERACTION                        │ │
│  │  • Framer Motion (scroll, hover, click)                 │ │
│  │  • React Hooks (useState, useEffect)                    │ │
│  │  • Event handlers (forms, navigation)                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              PWA LAYER                                   │ │
│  │  • Service Worker (sw.js)                              │ │
│  │  • Manifest (manifest.json)                             │ │
│  │  • Offline Support                                      │ │
│  │  • Push Notifications Ready                             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Backend API   │ (Future)
                    │  (Node/Python) │
                    └────────────────┘
```

## Component Hierarchy

```
RootLayout
├── Metadata & SEO
├── Global CSS
├── PWA Scripts
└── 
    └── Navigation
        ├── Logo
        ├── Desktop Menu (links)
        ├── CTA Buttons
        └── Mobile Menu (hamburger)
    
    └── Page Routes
        ├── Home (/)
        │   ├── Hero Section
        │   │   ├── Headline
        │   │   ├── Subtext
        │   │   ├── CTAs
        │   │   └── QR Mockup (animated)
        │   ├── Trust Badges
        │   ├── FeaturesGrid
        │   │   └── 6x Feature Cards
        │   ├── How It Works
        │   │   └── 3-Step Flow
        │   ├── Benefits Grid
        │   │   └── 6x Benefit Cards
        │   ├── Pricing Preview
        │   │   └── 3x Plan Cards
        │   └── CTA Section
        │
        ├── Features (/features)
        │   ├── Header
        │   ├── Features Grid
        │   │   └── 10x Feature Cards
        │   ├── Feature Showcase
        │   │   └── 3x Showcase Sections
        │   ├── Integration Partners
        │   │   └── 8x Partner Logos
        │   ├── Comparison Table
        │   └── CTA
        │
        ├── Pricing (/pricing)
        │   ├── Header
        │   ├── Monthly/Yearly Toggle
        │   ├── Pricing Cards
        │   │   ├── Starter Card
        │   │   ├── Growth Card (popular)
        │   │   └── Pro Card
        │   ├── Feature Table
        │   ├── Pricing FAQs
        │   │   └── 6x FAQ Items
        │   └── CTA
        │
        ├── FAQ (/faq)
        │   ├── Header
        │   ├── Category Filter
        │   │   └── 5x Category Buttons
        │   ├── FAQAccordion
        │   │   └── 15x FAQ Items
        │   └── Contact CTA
        │
        ├── Contact (/contact)
        │   ├── Contact Form
        │   │   ├── Name Input
        │   │   ├── Email Input
        │   │   ├── Phone Input
        │   │   ├── Subject Select
        │   │   └── Message Textarea
        │   ├── Contact Info
        │   │   ├── Email Section
        │   │   ├── Phone Section
        │   │   └── Address Section
        │   ├── WhatsApp CTA
        │   ├── Response Times
        │   └── CTA
        │
        ├── Login (/login)
        │   ├── Logo
        │   ├── Form Card
        │   │   ├── Email Input
        │   │   ├── Password Input
        │   │   ├── Remember Me
        │   │   ├── Forgot Password Link
        │   │   └── Submit Button
        │   ├── Social Login
        │   ├── Sign Up Link
        │   └── Demo Credentials
        │
        └── Signup (/signup)
            ├── Logo
            ├── Progress Indicator
            ├── Step 1
            │   ├── Restaurant Name
            │   ├── Owner Name
            │   └── City
            ├── Step 2
            │   ├── Email
            │   ├── Phone
            │   ├── Password
            │   └── Confirm Password
            ├── Step 3
            │   ├── Summary
            │   ├── Terms Agreement
            │   └── Create Account Button
            └── Login Link
    
    └── Footer
        ├── Company Links
        ├── Support Links
        ├── Legal Links
        ├── CTA Section
        ├── Copyright
        └── Social Links
```

## Data Flow

```
User Action
    ↓
Event Handler (onClick, onSubmit)
    ↓
State Update (useState)
    ↓
Component Re-render
    ↓
Animation Trigger (Framer Motion)
    ↓
DOM Update
    ↓
Visual Feedback to User

---

API Integration (Future):

User Action
    ↓
API Call (fetch/axios)
    ↓
Loading State (setIsLoading)
    ↓
API Response/Error
    ↓
Update State (setData/setError)
    ↓
Component Re-render
    ↓
Display Results
```

## File Organization

```
src/
├── app/
│   ├── (root pages)
│   │   └── page.tsx ..................... 500 lines (Home)
│   ├── contact/
│   │   └── page.tsx ..................... 200 lines
│   ├── faq/
│   │   └── page.tsx ..................... 50 lines
│   ├── features/
│   │   └── page.tsx ..................... 350 lines
│   ├── login/
│   │   └── page.tsx ..................... 150 lines
│   ├── pricing/
│   │   └── page.tsx ..................... 200 lines
│   ├── signup/
│   │   └── page.tsx ..................... 300 lines
│   ├── layout.tsx ....................... 60 lines
│   └── globals.css ...................... 60 lines
│
└── components/
    ├── Navigation.tsx ................... 100 lines
    ├── Footer.tsx ....................... 80 lines
    ├── FeaturesGrid.tsx ................. 80 lines
    ├── FAQAccordion.tsx ................. 200 lines
    └── ServiceWorkerRegister.tsx ........ 15 lines

Total Production Code: ~2,600 lines of React/TypeScript
```

## Styling Architecture

```
TailwindCSS Utility-First
    ↓
├── Global Base Styles (globals.css)
│   ├── Font imports
│   ├── Tailwind directives (@tailwind)
│   ├── Reset styles
│   └── Global element styles
│
├── Component Styles
│   ├── Inline Tailwind classes
│   ├── TailwindCSS utility composition
│   └── Dynamic classes (conditional)
│
├── Design Tokens (tailwind.config.js)
│   ├── Colors (primary, secondary)
│   ├── Typography (fonts, sizes)
│   ├── Spacing (gaps, padding)
│   ├── Borders (radius, shadows)
│   └── Animations (keyframes)
│
└── Theme Consistency
    ├── Card component pattern
    ├── Button variants
    ├── Responsive breakpoints
    └── Dark mode ready
```

## State Management

```
Current: React Hooks
├── useState for local state
├── useEffect for side effects
├── useCallback for performance
└── useContext ready (for future global state)

Future: Redux/Zustand
├── App State Store
├── Authentication State
├── Menu State
├── Order State
└── UI State (modals, notifications)

API Integration Ready:
├── Fetch with retry logic
├── Error handling
├── Loading states
├── Response caching
└── Authentication tokens
```

## Responsive Design Breakpoints

```
Mobile First Approach:

Default (Mobile)
320px - 479px
├── Single column layout
├── Hamburger menu
├── Large touch targets
└── Full width

Tablet
640px - 1023px
├── Two column layout
├── Expanded menu
└── Medium spacing

Desktop
1024px - 1919px
├── Three column layout
├── Full navigation
└── Optimal spacing

Large Desktop
1920px+
├── Max-width container
├── Generous spacing
└── Multi-column grids
```

## Deployment Architecture

```
                          ┌──────────────┐
                          │   GitHub     │
                          │  Repository  │
                          └──────┬───────┘
                                 │ push
                                 ↓
                    ┌────────────────────────┐
                    │   Deployment Options   │
                    ├────────────────────────┤
                    │ Vercel (Recommended)   │ ✅
                    │ AWS Amplify            │ ✅
                    │ Railway.app            │ ✅
                    │ EC2 + Docker           │ ✅
                    └────────────────┬───────┘
                                     │
                          ┌──────────▼──────────┐
                          │  Production Build   │
                          ├────────────────────┤
                          │ • Next.js Build    │
                          │ • Optimization     │
                          │ • Asset Bundling   │
                          └──────────┬─────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  Live Application   │
                          ├────────────────────┤
                          │ • HTTPS            │
                          │ • CDN Cached       │
                          │ • PWA Enabled      │
                          │ • Analytics        │
                          └────────────────────┘
```

## Performance Optimization Layer

```
┌─────────────────────────────────────────┐
│     Browser Cache & Service Worker      │
│  (First Load from Network)              │
└─────────┬───────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│         Subsequent Loads                │
│  (From Cache with Network Fallback)    │
└─────────┬───────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│     Next.js Optimizations              │
│  • Code Splitting                      │
│  • Image Optimization                  │
│  • CSS Minification                    │
│  • JS Minification                     │
└─────────┬───────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│     CDN Distribution (Vercel Edge)     │
│  • Global Distribution                │
│  • Cache Management                   │
│  • Compression                        │
└─────────────────────────────────────────┘
```

## User Journey Map

```
┌─────────────┐
│  Visit Site │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│  Home Page       │
│  • Hero Section  │
│  • Features      │
│  • Pricing       │
└──────┬───────────┘
       │
       ├─→ Explore Features
       │        ↓
       │   Features Page
       │
       ├─→ Check Pricing
       │        ↓
       │   Pricing Page
       │
       └─→ Sign Up
                ↓
           Signup Flow (3 steps)
                ↓
           Create Account
                ↓
           Dashboard (future)
```

## Security Layer

```
┌─────────────────────────────────────┐
│    Client-Side Security             │
├─────────────────────────────────────┤
│ • No sensitive data in code        │
│ • Environment variables            │
│ • HTTPS only                       │
│ • Input validation                 │
│ • XSS protection (React escaping)  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Network Security                  │
├─────────────────────────────────────┤
│ • TLS/SSL encryption               │
│ • Security headers                 │
│ • CORS configuration               │
│ • Rate limiting                    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Backend Security (Future)         │
├─────────────────────────────────────┤
│ • JWT authentication               │
│ • Password hashing                 │
│ • Database encryption              │
│ • API rate limiting                │
└─────────────────────────────────────┘
```

---

## Quick Reference

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code quality check
npm run type-check   # TypeScript check
```

### Key Directories
- `src/app/` - Page routes
- `src/components/` - Reusable components
- `public/` - Static assets & PWA files
- `docs/` - Documentation

### Key Technologies
- Next.js 14+ (React framework)
- TypeScript (type safety)
- TailwindCSS (styling)
- Framer Motion (animations)
- Lucide React (icons)

---

This architecture is **scalable, maintainable, and production-ready**. 🚀
