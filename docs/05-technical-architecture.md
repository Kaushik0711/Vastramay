# 05 — Technical Architecture

## 1. Planned stack

- React
- TypeScript
- Vite
- Tailwind CSS 3.4.x
- Sass/SCSS
- React Router
- Lucide React
- Zustand where shared client state is useful
- Motion for React
- GSAP + ScrollTrigger for selected advanced scenes
- Swiper for featured sliders
- Fancybox only after licensing review
- Optional Lenis after performance and accessibility evaluation

Inspect the repository before installing dependencies. Do not assume every planned library is already installed.

## 2. Tailwind + SCSS convention

This project plans Tailwind 3.4.x alongside Sass. Keep Tailwind directives in the main CSS entry file. Keep custom SCSS in `.scss` files. Do not place Tailwind directives inside SCSS files. Avoid a silent migration to Tailwind v4 because its integration model differs.

Use Tailwind for standard layout, spacing and responsive utilities. Use SCSS for authored component-specific rules, complex selectors and keyframes where useful. Avoid styling the same property in conflicting ways through both systems.

## 3. Suggested feature-based structure

This is a target structure, not a claim about the current repository. Adapt it to existing conventions:

```text
vastramay/
├── public/
├── src/
│   ├── app/
│   │   ├── router/
│   │   └── providers/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── product/
│   │   └── feedback/
│   ├── features/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── account/
│   │   └── admin/
│   ├── pages/
│   ├── hooks/
│   ├── stores/
│   ├── services/
│   ├── types/
│   ├── data/
│   ├── styles/
│   └── utils/
├── docs/
├── .env.example
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── README.md
```

Do not move files solely to match this diagram if that risks breaking existing imports. Update this documentation after inspecting the actual structure.

## 4. Responsibilities

- **Pages:** route-level composition.
- **Components:** reusable UI and interaction primitives.
- **Features:** domain-specific flows such as cart or checkout.
- **Stores:** shared client state, not authoritative financial state.
- **Services:** API/backend integrations.
- **Types:** shared TypeScript contracts.
- **Data:** demo fixtures or static configuration, clearly separated from live data.
- **Styles:** global tokens, resets and SCSS modules.
- **Utils:** pure helpers such as currency formatting and safe calculations.

## 5. State boundaries

Client state may contain:
- UI drawer/modal state
- Current filter/sort selection
- Guest cart and wishlist
- Non-sensitive form progress

Backend-owned state must include:
- Authoritative product price
- Inventory
- Discounts and eligibility
- Orders
- Payment state
- Customer private data
- Admin authorization
- Shipping/tracking records

Do not store card data, payment secrets or service-role keys in localStorage.

## 6. Coding standards

- Strict TypeScript; avoid `any` unless justified.
- Reusable, typed components.
- No giant monolithic page components.
- Avoid duplicated business logic between frontend and backend.
- Use semantic HTML.
- Handle loading/error states explicitly.
- Clean up event listeners, observers and animation instances.
- Use stable keys in lists.
- Keep product and order identifiers distinct.
- Run lint, tests and production build after each phase.
