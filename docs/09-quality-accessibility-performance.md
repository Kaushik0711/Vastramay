# 09 — Quality, Accessibility and Performance

## 1. Responsive test widths

Test as available:
- 320px
- 360px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

Look for horizontal overflow, clipped text, broken image crops, overlapping navigation, off-screen drawers, tiny buttons and oversized whitespace.

## 2. Functional checklist

### Navigation
- All header/footer links.
- Browser Back/Forward.
- Search submission and empty results.
- Mobile drawer open/close and focus behaviour.

### Catalogue
- Correct product routes.
- Sorting/filter combinations.
- Variant and stock states.
- Image fallback.
- Empty collection/search.

### Cart
- Add/remove/update.
- Variant-specific lines.
- Refresh persistence.
- Guest-to-account merge rules.
- Stock and price revalidation.

### Checkout/orders
- Validation errors.
- Shipping method availability.
- Payment pending/success/failure.
- Retry and duplicate submission.
- Secure order lookup.
- Correct order state transitions.

### Account/admin
- Sign in/out and password recovery.
- Customer data isolation.
- Authorization on admin APIs.
- Address and order management.

## 3. Accessibility

- Semantic landmarks and heading hierarchy.
- Labels for all inputs.
- Useful validation messages.
- Visible `focus-visible` styles.
- Keyboard-accessible menus, dialogs and galleries.
- Correct focus management and restoration.
- Escape behaviour where appropriate.
- Meaningful image alt text.
- Adequate color contrast.
- Touch targets appropriate for mobile.
- No essential hover-only information.
- Respect reduced-motion preferences.

## 4. Performance

- Lazy-load below-the-fold images.
- Avoid layout shift with image dimensions/aspect ratios.
- Optimize large image assets and use efficient formats.
- Load only necessary font weights.
- Code-split large route-level features where useful.
- Avoid unnecessary React re-renders.
- Avoid excessive scroll handlers and simultaneous animation libraries.
- Clean up observers, listeners and timelines.
- Keep checkout fast and motion restrained.

## 5. Testing approach

Use existing project tooling where available. Possible layers:
- Unit tests for pure price/variant/filter helpers.
- Component tests for forms and state.
- Integration tests for cart and checkout transitions.
- End-to-end tests for a complete sandbox purchase.
- Manual browser testing for visual design and responsive layout.

Do not report tests as passing unless they were run and passed. Track blockers explicitly.
