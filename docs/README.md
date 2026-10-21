# Vastramay — Project Documentation

> Documentation pack for the Vastramay premium clothing e-commerce website. Place this `docs/` directory in the root of the Vastramay repository.

## Project identity

- **Website / project name:** Vastramay
- **Git branch name:** `main`
- **Product type:** Premium clothing e-commerce storefront
- **Visual direction:** Modern, youthful, editorial fashion; flat UI with precise geometry
- **Colors:** White `#FFFFFF`, black `#101010`, purple `#6D28D9`
- **Typography:** EB Garamond for display headings; Sora for UI/body
- **Corner style:** Predominantly square (`0px` radius); dialogs may use up to `2px`
- **Primary market/currency assumption:** India / INR, subject to business confirmation

## Documentation index

| File | Purpose |
|---|---|
| `01-project-overview.md` | Scope, goals, principles and current decisions |
| `02-design-system.md` | Palette, typography, spacing, components and responsive rules |
| `03-information-architecture.md` | Pages, routes and navigation |
| `04-customer-journey.md` | Shopping flow, cart, checkout and order states |
| `05-technical-architecture.md` | Stack, folders, state, data and integration boundaries |
| `06-animations-and-interactions.md` | Motion strategy and third-party libraries |
| `07-data-model-and-backend.md` | Proposed entities, backend responsibilities and security |
| `08-roadmap-and-phases.md` | Implementation roadmap and acceptance criteria |
| `09-quality-accessibility-performance.md` | QA, accessibility, responsiveness and performance |
| `10-environment-deployment-security.md` | Environment variables, deployment and security |
| `11-content-assets-and-brand.md` | Product photography, copy and content rules |
| `12-antigravity-working-guide.md` | How to use phase prompts safely and consistently |
| `DECISIONS.md` | Decision log and open questions |

## Important accuracy note

These documents consolidate the requirements and decisions discussed during planning. They are **not a repository audit**. Actual files, package versions, completed features, backend integrations, payment status and deployment setup must be verified against the Vastramay codebase. Treat proposed structures and integrations as plans until verified.

## Planned stack

- React + TypeScript + Vite
- Tailwind CSS 3.4.x
- Sass/SCSS for authored component styles and complex effects
- React Router
- Lucide React icons
- Zustand for shared client state when appropriate
- Motion for React for common UI motion
- GSAP + ScrollTrigger only for advanced scroll timelines
- Swiper for featured product sliders
- Fancybox only if the selected licence is appropriate for commercial use
- Optional Lenis only if smooth scrolling proves useful
- Backend/payment provider to be confirmed and implemented securely

**Compatibility note:** This project intentionally plans Tailwind CSS 3.4.x alongside Sass. Do not silently upgrade to Tailwind CSS v4 without revisiting the styling architecture.

## Where to start

1. Read `01-project-overview.md` and `02-design-system.md`.
2. Inspect the actual repository and compare it with `05-technical-architecture.md`.
3. Track implementation against `08-roadmap-and-phases.md`.
4. Update `DECISIONS.md` whenever a major product, technical or brand decision changes.
5. Never claim production payment, inventory, shipping or authentication works until it has been tested with the actual configured services.
