# 01 — Project Overview

## 1. Purpose

Vastramay is planned as a polished, fully responsive premium clothing e-commerce website. The experience should feel art-directed and fashion-led, not like a generic AI-generated storefront. The website needs to support product discovery, product details, variants, cart, checkout, payment, order confirmation and tracking, alongside customer account and brand/support pages.

## 2. Business and brand goals

- Present clothing and collections with a consistent visual identity.
- Make product photography, price, size and availability easy to understand.
- Provide a clear route from discovery to checkout.
- Support guest checkout as well as customer accounts.
- Use secure server-side order and payment verification.
- Keep the codebase maintainable so the owner can update products, categories, content and visual tokens.
- Deliver a fully responsive desktop, tablet and mobile experience.

## 3. Brand identity

- **Name:** Vastramay
- **Style:** Modern, youthful, premium editorial fashion
- **Palette:** White `#FFFFFF`, black `#101010`, purple `#6D28D9`
- **Fonts:** EB Garamond + Sora
- **Shape language:** Flat surfaces, sharp edges, thin borders, minimal shadow
- **Motion:** Intentional and restrained; richer on campaign/editorial content, minimal during shopping and checkout

The earlier planning used “Rose Orchid” as a working design name. Vastramay is now the project/website name. Remove or replace any stale Rose Orchid text, metadata, assets and configuration unless explicitly retained as a collection or internal design reference.

## 4. Scope

### Customer storefront
- Home
- Shop and collection listing
- Search
- Product detail and image gallery
- Wishlist
- Cart and mini-cart
- Checkout information, delivery and payment
- Order confirmation and tracking
- Sign-in, registration, password recovery
- Account, order history and saved addresses
- About, Contact, FAQ, Size Guide, Shipping, Returns and legal policies
- Not Found and useful empty/error states

### Management
- Protected admin area
- Product, variant and inventory management
- Collection/category management
- Order and fulfillment management
- Customer support workflows
- Discounts if required
- Homepage content and store configuration

### Integrations to confirm
- Backend/database
- Authentication provider
- Payment gateway
- Shipping provider
- Email/transactional notifications
- Image storage/CDN
- Analytics and consent requirements

## 5. Non-goals

- Do not add decorative animation to every component.
- Do not fake product reviews, inventory counts, discounts or sales rankings.
- Do not create fake payment success.
- Do not use AI-generated imagery as if it were authentic product photography.
- Do not add business claims, sustainability certifications or brand history without owner-provided facts.

## 6. Success criteria

- Clear, consistent brand identity across every route.
- Responsive layout without horizontal overflow.
- All navigation and shopping actions work.
- Cart and variant logic is correct.
- Checkout recalculates totals and validates stock server-side.
- Payment state is verified by the backend/provider.
- Customer data and admin actions are properly protected.
- Loading, empty, error and success states are designed.
- Production build, linting and tests pass.
- Documentation matches the actual implementation after each phase.
