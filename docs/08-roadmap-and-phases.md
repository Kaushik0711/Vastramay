# 08 — Implementation Roadmap

## Phase 1 — Inspect and establish foundation
- Inspect existing repository before modifying it.
- Verify package manager, dependencies, scripts and routes.
- Confirm React, TypeScript, Vite, Tailwind 3.4.x and Sass compatibility.
- Configure aliases, lint, test and build commands.
- Create/verify typed domain models and route skeleton.
- Add `.env.example` without secrets.
- Update README.

**Acceptance:** Existing features preserved, app runs, production build passes, no unverified claims.

## Phase 2 — Design system
- Lock Vastramay name and brand tokens.
- Set up EB Garamond and Sora.
- Define spacing, typography, borders and responsive rules.
- Create accessible shared controls, feedback states, modal and drawer primitives.

**Acceptance:** Components look consistent across routes and work by keyboard/touch.

## Phase 3 — Global shell
- Announcement bar, header, desktop navigation, mobile drawer, search entry point, account/wishlist/cart actions and footer.
- Use Navbar Gallery and Footer Design for inspiration only.
- Ensure every link has a valid destination.

**Acceptance:** Navigation works on desktop/mobile; no dead controls.

## Phase 4 — Homepage
- Hero, benefits strip, New Arrivals, categories, editorial campaign, curated products, brand story, newsletter and footer.
- Align messaging with the actual catalogue.
- Use valid imagery and distinct section purposes.

**Acceptance:** Responsive layout, correct product links, no missing image regressions.

## Phase 5 — Catalogue and search
- Shop, collections, filters, sorting, query URL state and empty/error states.
- Product cards and image consistency.

**Acceptance:** Filters/sorting work with actual data and URLs behave correctly.

## Phase 6 — Product details and wishlist
- Gallery, variants, size guide, quantity, stock state, add-to-bag and wishlist.
- Optional licensed Fancybox and featured Swiper carousel.

**Acceptance:** Variant selection is validated; unavailable options cannot be purchased.

## Phase 7 — Cart
- Cart page and mini-cart.
- Quantity/remove/update.
- Guest persistence and optional authenticated merge.
- Correct totals display and stock-change messaging.

**Acceptance:** Cart survives refresh and correctly handles variants and empty states.

## Phase 8 — Checkout, payments and orders
- Information, shipping and payment steps.
- Server-side pricing/stock validation.
- Payment adapter, verification, webhooks, idempotency and order lifecycle.
- Confirmation and secure tracking.

**Acceptance:** Sandbox payment paths, failure/retry, duplicate submission and order authorization tested.

## Phase 9 — Account and admin
- Auth, account, order history, addresses and wishlist sync.
- Protected admin for products, stock, orders and configuration.

**Acceptance:** Backend authorization tested; customers cannot access other users' data or admin actions.

## Phase 10 — Brand/support/SEO
- About, Contact, FAQ, Size Guide, Shipping, Returns, legal policies and 404.
- Metadata and search engine configuration.

**Acceptance:** All links work; legal/business-specific placeholders are confirmed before launch.

## Phase 11 — Advanced motion
- Motion interactions, limited GSAP scroll scenes, text reveals, optional cursor, featured Swiper and lightbox.
- Optional Lenis only after evaluation.

**Acceptance:** Reduced-motion support, responsive behaviour and no conflicts between animation engines.

## Phase 12 — Final QA and launch readiness
- Test all routes and states at representative widths.
- Accessibility, performance, security and broken-link checks.
- Build, lint and tests.
- Update documentation and deployment steps.

**Acceptance:** Verified report separates completed functionality from outstanding credentials, licences, content and service integrations.

## Working rule between phases

After each phase:
1. Inspect actual code changes.
2. Run the app and relevant checks.
3. Fix errors before starting the next phase.
4. Update docs to reflect actual implementation.
5. Do not install a package or rewrite architecture without checking the existing code first.
