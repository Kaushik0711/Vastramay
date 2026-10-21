# 02 — Design System

## 1. Design principles

1. **Flat and editorial:** typography, image selection and layout create visual quality—not shadows or rounded cards.
2. **Consistent:** reuse tokens and shared components.
3. **Product-first:** images, variant availability, price and purchase actions remain clear.
4. **Responsive by design:** do not treat mobile as a compressed desktop layout.
5. **Motion with purpose:** use animation to communicate hierarchy, feedback or transitions.
6. **Authentic:** use real, licensed fashion photography and accurate product data.

## 2. Color tokens

| Token | Value | Intended role |
|---|---|---|
| `--color-white` | `#FFFFFF` | Main page background and light surfaces |
| `--color-black` | `#101010` | Main text, dark editorial sections, footer |
| `--color-purple` | `#6D28D9` | Primary CTA, active state, links and selected controls |
| `--color-border` | `#D9D9D9` | Thin dividers and form borders |
| `--color-muted-text` | Black with controlled opacity or a tested neutral | Secondary copy |

The 60/30/10 ratio is a visual guideline, not a hard per-component calculation. Maintain adequate contrast. Purple should be an accent, not the background of every section.

## 3. Typography

- Display/hero: EB Garamond.
- UI/body/labels/buttons: Sora.
- Use a limited set of font weights to avoid unnecessary font downloads.
- Suggested desktop hero size: 56–72px.
- Suggested mobile hero size: 36–44px.
- Body text: approximately 15–16px.
- Product title: approximately 15–16px.
- Price: approximately 14–16px.
- Buttons and labels: approximately 13–14px.
- Tune line height and font size against actual content and viewport rather than blindly applying these values.

Load Google Fonts with `preconnect` and only the weights actually used. Provide sensible fallback fonts.

## 4. Geometry and borders

| Element | Rule |
|---|---|
| Buttons | `0px` radius |
| Inputs/selects | `0px` radius |
| Product images/cards | `0px` radius |
| Dropdowns | `0px` radius |
| Modal/dialog | `0–2px` radius |
| Standard borders | `1px`, subtle neutral |
| Shadows | Avoid by default; use only when needed to separate a floating overlay |

Do not wrap every product card in a bordered or shadowed box. Product photography and typography should define the card.

## 5. Spacing

Use a 4px/8px rhythm. Common values: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

Suggested use:
- Icon/text: 8px
- Form field spacing: 16px
- Product grid gap: 16–24px desktop, 12px mobile
- Section heading to content: 24–32px
- Major section separation: 64–96px desktop; reduce intentionally on mobile
- Page gutter: 20px mobile, 32–48px desktop
- Max content width: approximately 1280px

## 6. Layout and images

- Desktop content grid: 12 columns where useful, with consistent gutters.
- Default clothing image ratio: 3:4 unless actual assets require another intentional ratio.
- Use `object-fit` and `object-position` based on the product image, not one universal crop that cuts off clothing.
- Avoid accidental image stretching.
- Keep product information aligned across a row.
- Hero may use an asymmetric editorial composition.
- Do not force every section into the same layout.

## 7. Buttons

- Primary: purple background, white text.
- Secondary: white background, black outline/text.
- Tertiary: text link with an optional arrow/underline.
- Default height approximately 48px; compact height approximately 40px.
- Provide hover, active, focus-visible, disabled and loading states.
- Use clear verbs such as “Add to Bag”, “View Collection” and “Continue to Payment”.

## 8. Component conventions

Create reusable components for:
- Button/IconButton
- Input/Textarea/Select
- Checkbox/Radio
- Breadcrumb
- PriceDisplay
- QuantitySelector
- ProductCard/ProductGrid
- ProductGallery
- Badge
- Modal/Drawer
- EmptyState/ErrorState/LoadingIndicator/Skeleton
- FormField/ValidationMessage

All components should use shared tokens and accessible semantics. Do not create duplicate components with slightly different styles for the same purpose.

## 9. Responsive breakpoints

Use the existing Tailwind breakpoints unless a measured design need requires otherwise. Test at 320, 360, 375, 390, 430, 768, 1024, 1280 and 1440px where possible. Check for horizontal overflow, clipped text, unusable controls, bad image crops and overlays that cannot be dismissed.

## 10. Motion visual rules

- Keep motion off the critical path to purchase.
- Prefer opacity and transform.
- Avoid excessive bounce, zoom, parallax and simultaneous staggered effects.
- Respect `prefers-reduced-motion`.
- Preserve visible content if JavaScript or animation initialization fails.
