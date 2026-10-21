# 06 — Animations and Third-Party Components

## 1. Motion philosophy

The website remains flat. Motion adds feedback and editorial character; it does not introduce visual clutter. The homepage can be expressive, product pages interactive, and checkout restrained and fast.

## 2. Recommended responsibilities

| Need | Candidate | Notes |
|---|---|---|
| Buttons, modal, drawer, dropdown | Motion for React | General-purpose interaction motion |
| Route transitions | Motion + router integration | Preserve Back/Forward and scroll behaviour |
| Simple viewport reveal | Motion | Use `whileInView` or equivalent |
| Complex pinned scroll timelines | GSAP + ScrollTrigger | Add only when necessary |
| Advanced text splitting | GSAP SplitText or accessible custom reveal | Verify licence and text accessibility |
| Featured Coverflow slider | Swiper | Restrict 3D effect to curated feature area |
| Product image lightbox | Fancybox or suitable alternative | Verify current commercial licence |
| Smooth scrolling | Optional Lenis | Use only after testing native scrolling |
| Navigation/footer inspiration | Navbar Gallery / Footer Design | Inspiration galleries, not assumed component packages |
| Ready-made animated components | Skiper UI / Scrolltide | Check actual source access, dependencies and licence |

## 3. Suggested effects

- Desktop-only contextual cursor ring/dot in selected hero/product areas.
- Alternate product image on hover where a valid alternate image exists.
- Hero heading line reveal.
- Small viewport-triggered section reveal.
- Product-card stagger with short delays.
- A restrained purple scroll-progress indicator.
- Limited hero/editorial parallax.
- Featured-product Coverflow/Creative carousel.
- Product image viewer with keyboard and touch support.
- Modal and drawer fade/short-slide transitions.
- Short page transitions that do not delay navigation.

## 4. Avoid

- Custom cursor on touch devices or inside text fields.
- Typewriter animation on every heading.
- 3D effects on the main product catalogue.
- Heavy parallax on every image.
- Long pinned sections that interfere with scrolling.
- Multiple libraries animating the same DOM element.
- Hiding essential content until an animation runs.
- Hiding the native scrollbar.
- Scroll hijacking.
- Fake motion that makes product selection or checkout slower.

## 5. Interaction requirements

### Modal and drawer
- Escape closes where appropriate.
- Correct focus management and focus restoration.
- Background scroll locking.
- Click outside closes only when appropriate and safe.
- No interaction with obscured background content.
- Reduced-motion behaviour.

### Dropdown and select
- Keyboard navigation.
- Visible focus.
- Correct expanded/selected state.
- Mobile-friendly touch targets.
- Do not implement a custom select without a clear accessibility benefit.

### Product gallery
- Previous/next navigation.
- Image count and useful thumbnails.
- Keyboard and touch support.
- Escape closes.
- Correct image alt text.
- Correct cleanup on route changes/unmount.

## 6. Performance and accessibility

- Respect `prefers-reduced-motion`.
- Prefer opacity/transform where practical.
- Avoid layout thrashing and excessive scroll listeners.
- Clean up GSAP timelines, ScrollTriggers, observers and listeners.
- Test on mobile and slower devices.
- Keep content readable when animation is disabled.
- Check licensing and bundle impact before adding packages.
