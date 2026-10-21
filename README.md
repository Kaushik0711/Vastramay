# Vastramay — Luxury Indian Menswear & Ceremonial Fashion

A high-performance, fully responsive luxury menswear and ceremonial fashion e-commerce storefront architected with React 19, TypeScript, Vite, Tailwind CSS 3.4.17, SCSS, Zustand 5, and Motion.

---

## Documentation Index

Comprehensive project documentation is maintained in the [`docs/`](docs/) directory:

| Document | Description |
| :--- | :--- |
| [`docs/README.md`](docs/README.md) | Documentation suite overview and guide |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | **Decision Log & Technical Verification State** (Implemented vs. Planned) |
| [`docs/01-project-overview.md`](docs/01-project-overview.md) | Executive scope, design philosophy, and core objectives |
| [`docs/02-design-system.md`](docs/02-design-system.md) | Palette tokens, typography standards, spacing, and zero-radius geometry |
| [`docs/03-information-architecture.md`](docs/03-information-architecture.md) | Complete sitemap, customer routes, and administration pathways |
| [`docs/04-customer-journey.md`](docs/04-customer-journey.md) | User flows from catalog browsing to cart, checkout, and order tracking |
| [`docs/05-technical-architecture.md`](docs/05-technical-architecture.md) | Architecture specifications, state separation, and integration boundaries |
| [`docs/06-animations-and-interactions.md`](docs/06-animations-and-interactions.md) | Motion guidelines, viewport reveals, and smooth scroll standards |
| [`docs/07-data-model-and-backend.md`](docs/07-data-model-and-backend.md) | Domain entity schemas, order models, and Supabase SQL migrations |
| [`docs/08-roadmap-and-phases.md`](docs/08-roadmap-and-phases.md) | 12-phase development roadmap and acceptance milestones |
| [`docs/09-quality-accessibility-performance.md`](docs/09-quality-accessibility-performance.md) | Accessibility standards, WCAG compliance, and performance metrics |
| [`docs/10-environment-deployment-security.md`](docs/10-environment-deployment-security.md) | Environment configuration, security practices, and deployment guides |
| [`docs/11-content-assets-and-brand.md`](docs/11-content-assets-and-brand.md) | Editorial photography, tone of voice, and brand guidelines |
| [`docs/12-antigravity-working-guide.md`](docs/12-antigravity-working-guide.md) | AI-assisted development guidelines and maintenance principles |

---

## Table of Contents

1. [Executive Summary & Brand Identity](#1-executive-summary--brand-identity)
2. [Tech Stack & Dependency Rationale](#2-tech-stack--dependency-rationale)
3. [Folder Structure & Component Sitemap](#3-folder-structure--component-sitemap)
4. [Development Workflow & Commands](#4-development-workflow--commands)
5. [Design Tokens & Styling Architecture](#5-design-tokens--styling-architecture)
6. [Motion & Interaction System](#6-motion--interaction-system)
7. [State Management & Data Layer](#7-state-management--data-layer)
8. [Payment & Backend Integration Boundaries](#8-payment--backend-integration-boundaries)
9. [Authentication & Security](#9-authentication--security)
10. [Quality Assurance & Verification Matrix](#10-quality-assurance--verification-matrix)
11. [Deployment & Known Limitations](#11-deployment--known-limitations)

---

## 1. Executive Summary & Brand Identity

**Vastramay** is a contemporary Indian luxury menswear atelier celebrating royal mulberry raw silks, Varanasi kadwa brocades, and structured Chanderi tailoring.

- **Visual Direction:** Flat, razor-sharp architectural geometry inspired by high-end international couture lookbooks.
- **Palette (60/30/10 Rule):**
  - **Dominant Base (60%):** White (`#FFFFFF`) — pure, disciplined negative space.
  - **Editorial Structure (30%):** Black (`#101010`) — stark typography, razor borders, deep manifesto contrasts.
  - **Atelier Accent (10%):** Royal Plum Purple (`#6D28D9`) — purposeful primary actions, active indicators, focus rings, and cursor states.
- **Typography:**
  - **Headings & Display:** *EB Garamond* (historical Indian court elegance).
  - **Interface & Body:** *Sora* (clean, legible geometric sans-serif).
- **Geometry:** Strict **0px border radius** across all buttons, cards, images, inputs, and drawers (modals at most 2px `rounded-sm`).
- **Currency:** Indian Rupees (INR — `₹`), managed in authoritative integer paise internally.
- **Git Branch:** Verified on branch `Vastramay`.

---

## 2. Tech Stack & Dependency Rationale

| Dependency | Version | License | Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **React** | `^19.3.1` | MIT | Component model with `useActionState`, `useId`, and StrictMode stability. |
| **TypeScript** | `~6.0.3` | Apache 2.0 | Full end-to-end type safety across customer, cart, and order domains. |
| **Vite** | `^8.3.4` | MIT | Sub-second HMR and Rollup-powered code-splitting (all chunks < 500 kB). |
| **Tailwind CSS** | `3.4.17` | MIT | Fast utility composition and locked design token enforcement. |
| **Sass (SCSS)** | `^1.89.2` | MIT | Custom animations, scrollbar tokens, and complex pseudo-elements. |
| **Motion** | `^14.5.0` | MIT | Hardware-accelerated viewport reveals, springs, and route transitions. |
| **Lenis** | `^1.3.27` | MIT | Controlled smooth scrolling; disabled on mobile/touch to protect native momentum. |
| **Swiper** | `^14.3.0` | MIT | Permissive MIT touch carousel for Section 5B 3D Coverflow showcase. |
| **Zustand** | `^5.0.6` | MIT | Multi-store state architecture (`cart`, `wishlist`, `orders`, `auth`) with persistence. |
| **Lucide React** | `^0.525.0` | ISC | Lightweight, scalable vector icons aligned with the 0px geometric aesthetic. |
| **Vitest** | `^5.0.5` | MIT | Blazing fast native unit testing with ESM support. |
| **Oxlint** | `^1.88.0` | MIT | High-performance Rust-based linter ensuring 0 warnings across 120 files. |

---

## 3. Folder Structure & Component Sitemap

```text
/
├── docs/                   # Complete architectural documentation suite (01–12, DECISIONS.md)
├── public/                 # Static public files (robots.txt, sitemap.xml, favicon)
├── supabase/
│   └── migrations/         # PostgreSQL DDL migrations for orders, customers, and RLS policies
├── src/
│   ├── assets/             # Brand logos and iconography
│   ├── components/
│   │   ├── cart/           # CartDrawer, CartLineItem, CouponInput
│   │   ├── catalog/        # FilterDrawer, SortDropdown, ActiveFilters
│   │   ├── common/         # CustomCursor, ScrollProgress, SmoothScroll, EditorialTextReveal, PageFallback, SEO
│   │   ├── layout/         # RootLayout, Header, Footer, AnnouncementBar, MobileNavDrawer, SearchOverlay
│   │   ├── product/        # ProductCard, ProductGallery, ProductLightbox, Featured3DSlider, SizeGuideModal
│   │   └── ui/             # 19 atomic components (Button, Modal, SideDrawer, Input, Badge, etc.)
│   ├── config/             # Brand identity, navigation hierarchy, currency settings (brand.ts, tokens.ts)
│   ├── data/               # Static products, categories, collections, and FAQ datasets
│   ├── hooks/              # Custom React hooks (useDebounce, useMediaQuery)
│   ├── pages/
│   │   ├── account/        # Customer dashboard, login, register, orders, addresses, settings
│   │   ├── admin/          # Staff portal: dashboard, products, categories, inventory, orders, settings
│   │   ├── HomePage.tsx    # Editorial landing page with hero, Coverflow slider, and manifesto
│   │   ├── ShopPage.tsx    # 2D flat catalogue with filters, sorting, and pagination
│   │   ├── ProductPage.tsx # PDP with multi-image gallery, variant selectors, and size guide
│   │   ├── CartPage.tsx    # Full shopping bag with promo codes and free shipping calculator
│   │   ├── CheckoutPage.tsx# Stepwise checkout (Information -> Shipping -> Payment)
│   │   ├── OrderSuccessPage.tsx / PaymentFailedPage.tsx / TrackOrderPage.tsx
│   │   └── AboutPage.tsx, ContactPage.tsx, FaqPage.tsx, SizeGuidePage.tsx, PolicyPage.tsx
│   ├── services/           # Payment simulation, search, coupon, and newsletter services
│   ├── stores/             # Zustand stores (cartStore, wishlistStore, orderStore, authStore, checkoutStore)
│   ├── styles/             # _tokens.scss, _base.scss, _animations.scss, global.scss
│   ├── types/              # Strict interfaces (product, cart, customer, order)
│   ├── __tests__/          # Vitest unit test suites (cartStore, orderLifecycle, searchAndCatalog)
│   ├── router.tsx          # Declarative lazy-loaded route configuration
│   ├── index.css           # Tailwind base, components, and utilities
│   └── main.tsx            # Application entry mount point
├── package.json
└── README.md
```

---

## 4. Development Workflow & Commands

### Prerequisites
- Node.js `^18.0.0` or `^20.0.0`
- npm `^9.0.0` or `^10.0.0`

### Daily Commands

```bash
# 1. Start local development server (with HMR)
npm run dev

# 2. Run unit & integration test suites
npm test

# 3. Run high-performance linter (0 errors, 0 warnings enforced)
npm run lint

# 4. Run TypeScript strict type-checking
npm run type-check

# 5. Build optimized production bundle
npm run build

# 6. Preview the production build locally
npm run preview
```

### Git Branch Policy
All active work is developed and committed on branch `Vastramay`.

---

## 5. Design Tokens & Styling Architecture

- **Locked Color Tokens:** Defined in `src/config/tokens.ts` and `src/styles/_tokens.scss`, synchronized with `tailwind.config.ts`.
- **Strict Separation Rule:** Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) live exclusively in `src/index.css`.
- **SCSS Partial Ordering:** `src/styles/global.scss` imports `@use 'tokens';`, `@use 'base';`, and `@use 'animations';`.
- **Custom Scrollbar:** Standards-compliant `scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);` with `@supports not (scrollbar-color: auto)` WebKit fallback in `_base.scss`.
- **Hover Micro-Interactions:** Class `.hover-editorial-underline` provides an expandable 1px purple rule on hover.

---

## 6. Motion & Interaction System

1. **Custom Desktop Cursor (`CustomCursor.tsx`):**
   - Active only on fine-pointer devices (`@media (pointer: fine)`).
   - Shows contextual labels: `VIEW` over product cards and `DRAG` over the Coverflow runway slider.
   - Automatically hides when hovering inputs, textareas, selects, or checkout fields.
2. **Accessible Editorial Text Reveal (`EditorialTextReveal.tsx`):**
   - Staggered word animation with `[0.16, 1, 0.3, 1]` luxury cubic ease.
   - Semantic DOM text preserved via `aria-label` with `aria-hidden="true"` on internal split spans.
3. **Reading Progress Indicator (`ScrollProgress.tsx`):**
   - Uses native `@supports (animation-timeline: scroll())` on the compositor thread with Motion fallback.
4. **Controlled Parallax:**
   - Clamped, hardware-accelerated image parallax (`-6%` to `+6%`) in Hero and Manifesto sections.
5. **Coverflow Slider (`Featured3DSlider.tsx`):**
   - Responsive Swiper 3D carousel with keyboard navigation, touch swipe, and 2D mobile fallback.
6. **Smooth Scrolling (`SmoothScroll.tsx`):**
   - Lenis integration with automatic bypass for touch devices and `prefers-reduced-motion`.
7. **In-House Accessible Lightbox (`ProductLightbox.tsx`):**
   - Zero-dependency modal photo viewer with keyboard escaping (`Escape`), pinch-to-zoom indicators, and thumbnail switching.

---

## 7. State Management & Data Layer

Shared state is architected with Zustand 5 with client persistence:

- **`useCartStore` (`vastramay-cart`):** Variant-specific cart items, quantity adjustments capped by real available stock, promo code validation, and delivery threshold calculations.
- **`useWishlistStore` (`vastramay-wishlist`):** Customer saved items persisted across sessions.
- **`useCatalogStore` (`vastramay-catalog-state`):** In-memory catalog state with dynamic filtering, multi-attribute sorting, and staff product additions/deletions.
- **`useCheckoutStore` (`vastramay-checkout-session`):** Guest/customer delivery addresses, shipping method choices, payment selections, and UUID idempotency keys.
- **`useOrderStore` (`vastramay-orders`):** Order history and lifecycle status tracking.
- **`useAuthStore` (`vastramay-auth-session`):** Customer profile management, saved address book, and admin role authorization.

---

## 8. Payment & Backend Integration Boundaries

> [!IMPORTANT]
> To ensure architectural honesty, planned cloud integrations are distinguished from verified local development adapters:

1. **Payment Processing:**
   - **Current Implementation:** High-fidelity sandbox simulator (`paymentService.ts`). Supports Cards, UPI (VPA), NetBanking, and COD. Generates realistic latency and mock identifiers (`pay_rzp_mock_*`).
   - **Production Requirement (Planned):** Requires live Razorpay merchant credentials (`VITE_RAZORPAY_KEY_ID`), official Razorpay Checkout SDK, and a server-side webhook endpoint (`/api/webhooks/payment`) with HMAC-SHA256 signature verification.
2. **Database & Storage:**
   - **Current Implementation:** Synchronous local persistence via `localStorage` development adapters.
   - **Production Requirement (Planned):** Provisioned PostgreSQL database via Supabase using the migrations in `supabase/migrations/`.
3. **Logistics & Delivery Tracking:**
   - **Current Implementation:** Deterministic shipping rules (free standard delivery over ₹2,999; ₹250 flat fee; ₹350 express) with simulated progression in `TrackOrderPage.tsx`.
   - **Production Requirement (Planned):** Carrier API webhooks (Delhivery / Blue Dart) for real Air Waybill (AWB) generation.

---

## 9. Authentication & Security

- **Demo Credentials:**
  - **Customer:** `aditya@vastramay.in` / `password123`
  - **Atelier Director (Admin):** `admin@vastramay.in` / `admin123`
- **Guest Checkout:** Supported without forced registration. Guest orders are protected by high-entropy UUID access tokens.
- **Order Tracking Protection:** Secure lookup requires both the Order Number and matching phone/email digits.
- **Admin Access Guard:** Protected routes under `/admin` check for `role === 'admin'` and redirect unauthorized requests to `/account/login?redirect=/admin`.

---

## 10. Quality Assurance & Verification Matrix

### Automated Test Suite (Vitest)
```text
 ✓ src/__tests__/orderLifecycle.test.ts (4 tests)
 ✓ src/__tests__/cartStore.test.ts (6 tests)
 ✓ src/__tests__/searchAndCatalog.test.ts (4 tests)

 Test Files  3 passed (3)
      Tests  14 passed (14)
   Duration  319ms
```

- **Linter:** `oxlint` reports **0 warnings and 0 errors** across 120 files.
- **Type Checker:** `tsc -b --noEmit` exits with **0 errors**.
- **Production Build:** `tsc -b && vite build` completes in **< 1s** with all Rollup chunks split below 500 kB.

---

## 11. Deployment & Known Limitations

### Deployment Requirements
- Compatible with Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
- Single-page application rewrites must route all non-static paths to `/index.html`.
- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) and Unsplash images (`images.unsplash.com`) permitted in Content Security Policy (CSP).

### Outstanding Production Tasks
- [ ] Connect live Razorpay merchant gateway and configure backend webhook signatures.
- [ ] Connect provisioned Supabase cloud database instance.
- [ ] Connect domestic courier APIs (Delhivery, Blue Dart) for live tracking.
- [ ] Replace Unsplash placeholder photography with proprietary brand campaign lookbook assets.
- [ ] Finalize corporate legal entity details (CIN, GSTIN) and legal policy review.

---

*Architected and developed with zero-radius precision for Vastramay Atelier.*
