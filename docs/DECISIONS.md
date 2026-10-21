# Vastramay — Decision Log & Technical Verification State

This document records confirmed architectural decisions, verified implementations, active development adapters, and outstanding production requirements for the **Vastramay** luxury e-commerce platform.

---

## 1. Confirmed & Implemented Decisions (Verified in Codebase)

The following decisions and technical components are fully implemented, verified via strict TypeScript compilation, Oxlint rules, and automated Vitest test suites:

| Category | Decision / Feature | Verification Source | Status |
| :--- | :--- | :--- | :--- |
| **Project Identity** | Project name: **Vastramay**<br>Domain: `vastramay.in`<br>Requested Git branch: `Vastramay` | `package.json`, `index.html`, `src/config/brand.ts`, `git branch` | **Verified & Active** (`Vastramay` branch) |
| **Framework & Build** | React 19 (`^19.3.1`) + TypeScript (`~6.0.3`) + Vite (`^8.3.4`) | `package.json`, `vite.config.ts`, `tsconfig.json` | **Verified & Active** |
| **Styling Architecture** | Tailwind CSS 3.4.17 + Sass (SCSS `^1.89.2`)<br>Tailwind directives isolated to `src/index.css`<br>SCSS partials (`_tokens.scss`, `_base.scss`, `_animations.scss`) imported in `src/styles/global.scss` | `tailwind.config.ts`, `src/styles/` | **Verified & Active** |
| **Color System** | 60/30/10 locked luxury palette:<br>• White (`#FFFFFF`) — base negative space<br>• Black (`#101010`) — typography, structural borders<br>• Royal Plum Purple (`#6D28D9`) — focus rings, active accents | `src/config/tokens.ts`, `src/styles/_tokens.scss`, `tailwind.config.ts` | **Verified & Active** |
| **Typography** | • Headings: *EB Garamond* (Google Fonts)<br>• Interface/Body: *Sora* (Google Fonts) | `index.html`, `tailwind.config.ts` | **Verified & Active** |
| **Geometry** | Strict **0px border-radius** across buttons, product cards, drawers, and form controls (modals maximum 2px) | Global styles, component definitions | **Verified & Active** |
| **Routing** | React Router 7 (`react-router-dom` `^7.6.3`) with declarative lazy-loaded routes and error boundaries | `src/router.tsx` | **Verified & Active** |
| **State Management** | Zustand 5 (`zustand` `^5.0.6`) multi-store modular architecture with localStorage persistence: | `src/stores/` | **Verified & Active** |
| ↳ *Cart Store* | `useCartStore` (`vastramay-cart`): variant-specific line items, stock validation, promo code discounts, free delivery threshold calculation, drawer toggles | `src/stores/cartStore.ts`, `src/__tests__/cartStore.test.ts` | **Verified & Tested** (6/6 tests pass) |
| ↳ *Wishlist Store* | `useWishlistStore` (`vastramay-wishlist`): persistent saved item IDs | `src/stores/wishlistStore.ts` | **Verified & Active** |
| ↳ *Catalog Store* | `useCatalogStore` (`vastramay-catalog-state`): in-memory catalog, category filtering, multi-criteria sorting, admin mutation | `src/stores/catalogStore.ts`, `src/__tests__/searchAndCatalog.test.ts` | **Verified & Tested** (4/4 tests pass) |
| ↳ *Checkout Store* | `useCheckoutStore` (`vastramay-checkout-session`): address steps, delivery method, payment choice, idempotency keys | `src/stores/checkoutStore.ts` | **Verified & Active** |
| ↳ *Order Store* | `useOrderStore` (`vastramay-orders`): order creation, lifecycle state tracking, timeline checkpoints | `src/stores/orderStore.ts`, `src/__tests__/orderLifecycle.test.ts` | **Verified & Tested** (4/4 tests pass) |
| ↳ *Auth Store* | `useAuthStore` (`vastramay-auth-session`): role-based authentication (`customer` vs `admin`), address book, guest merge | `src/stores/authStore.ts` | **Verified & Active** |
| **Motion System** | • `motion` (`^14.5.0`): viewport reveals, drawer sliders, modals, button transitions<br>• `lenis` (`^1.3.27`): smooth scrolling (disabled on touch/reduced-motion)<br>• `swiper` (`^14.3.0`): 3D Coverflow runway slider<br>• Custom Lightbox (`ProductLightbox.tsx`): accessible full-screen photo zoom without commercial license constraints | `src/components/common/`, `src/components/product/` | **Verified & Active** |
| **Quality Verification** | • Vitest test runner (14 unit/integration tests passing)<br>• Oxlint (0 errors, 0 warnings across 120 files)<br>• TypeScript compiler (`tsc -b --noEmit` cleanly passing) | `package.json`, `oxlint.json`, `src/__tests__/` | **Verified & Clean** |

---

## 2. Verified Development Integrations & Adapters

To enable seamless client testing and full UX workflows without requiring external production cloud credentials during development, the following robust adapters are verified:

1. **Payment Processing (Sandbox Mode):**
   - **Status:** Functional client simulation via `src/services/paymentService.ts`.
   - **Behavior:** Operates in `sandbox` mode by default. Generates realistic latency (800ms) and mock transaction references (`pay_rzp_mock_*`). Supports UPI, Cards, NetBanking, and Cash on Delivery.
   - **Boundary:** Real payment capture, HMAC-SHA256 signature validation, and server-to-server webhooks require live merchant keys and a secure backend service.

2. **Backend & Database (Local State Adapter):**
   - **Status:** Synchronous reactive persistence via Zustand `persist` middleware in `localStorage`.
   - **Behavior:** Stores orders, customer sessions, cart lines, addresses, and catalog overrides locally.
   - **Boundary:** Production SQL migration files are prepared in `supabase/migrations/` for cloud deployment, but no active live Supabase network connection is hard-coded or required for local operation.

3. **Logistics & Order Tracking:**
   - **Status:** Deterministic rate calculation and simulated tracking engine in `src/pages/TrackOrderPage.tsx`.
   - **Behavior:** Free standard shipping on orders ≥ ₹2,999; ₹250 flat standard fee otherwise; ₹350 express fee. Demonstrates full carrier timeline (Order Placed -> Tailored -> Packed -> Handed Over -> In Transit -> Out for Delivery -> Delivered).
   - **Boundary:** Carrier webhooks (Delhivery / Blue Dart APIs) and automated real Air Waybill (AWB) generation are planned for live operations.

4. **Newsletter Subscription:**
   - **Status:** Verified regex validation and localStorage subscriber deduplication in `src/services/newsletterService.ts`.
   - **Boundary:** Production email marketing platform integration (Klaviyo / Mailchimp / SendGrid) remains planned.

---

## 3. Planned Features (Awaiting Production Infrastructure)

The following features are designed in architecture documentation (`docs/05-technical-architecture.md`, `docs/08-roadmap-and-phases.md`) but are **not yet implemented in code**, as they depend on external infrastructure, production merchant credentials, and commercial legal filings:

- [ ] **Live Razorpay Merchant Gateway:** Integration of official Razorpay Checkout SDK with live `RAZORPAY_KEY_ID` and server-side secret validation.
- [ ] **Server-Side Webhook Handler (`/api/webhooks/payment`):** Node/Edge serverless endpoint to receive Razorpay payment capture events, verify cryptographic signatures, and adjust inventory idempotently.
- [ ] **Production Supabase Cloud Instance:** Connecting `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to a provisioned PostgreSQL instance with Row Level Security (RLS) active.
- [ ] **Carrier Logistics APIs:** Direct integration with Delhivery / Blue Dart / Shiprocket APIs for dynamic pin code serviceability checking, real-time rate queries, and automated label generation.
- [ ] **Transactional Email Dispatch:** Automated order confirmation, shipping update, and password reset emails via transactional email services (Resend, AWS SES, or SendGrid).
- [ ] **Production Domain & CDN:** DNS configuration for `vastramay.in` with edge caching and SSL certificates.
- [ ] **GSAP + ScrollTrigger / GSAP SplitText:** Optional advanced editorial animations listed in early architecture exploration; currently substituted by performant, license-free `motion` and custom CSS reveals.

---

## 4. Outstanding Business & Operational Decisions

The following business items require confirmation by brand leadership prior to live commercial launch:

1. **Brand Identity & Imagery:**
   - Supply official vector brand wordmark and favicon assets.
   - Replace Unsplash editorial placeholder photography with proprietary brand campaign lookbook assets.
2. **Corporate & Legal Entity Details:**
   - Provide registered Corporate Identification Number (CIN), registered office address, and Goods & Services Tax Identification Number (GSTIN) for tax invoices.
   - Submit drafted store policies (`/shipping`, `/returns`, `/policies/terms`, `/policies/privacy`, `/policies/cancellation`) for formal Indian commercial legal review (Consumer Protection E-Commerce Rules 2020).
3. **Payment Provider Account:**
   - Complete KYC and merchant agreement with Razorpay, Cashfree, or Stripe India.
4. **Logistics Partner Contract:**
   - Finalize domestic courier SLA agreements with Blue Dart / Delhivery.
5. **Hosting & Deployment Target:**
   - Select cloud hosting platform (Vercel, Netlify, or AWS CloudFront/S3) and set production environment variables.

---

## 5. Architectural Change Log

| Date | Author / Milestone | Summary of Decisions & Updates |
| :--- | :--- | :--- |
| **2026-10-20** | Initial Planning Pack | Created initial documentation framework in `docs/` (01 through 12). |
| **2026-10-21** | Phase 1–12 Implementation Pass | Implemented complete 12-phase frontend application (catalog, PDP, cart, multi-step checkout, accounts, admin console, brand pages, motion system, and automated test suite). |
| **2026-10-21** | Documentation Integration & Re-Branding | • Initialized Git repository on requested branch `Vastramay`.<br>• Audited all 14 markdown files in `docs/`.<br>• Replaced residual Rose Orchid brand strings across `src/`, `public/`, and configurations with **Vastramay**.<br>• Updated `docs/DECISIONS.md` to establish clear boundaries between verified code and planned production integrations.<br>• Updated root `README.md` with links to documentation and development workflows. |
