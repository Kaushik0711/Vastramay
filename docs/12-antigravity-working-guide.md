# 12 — Antigravity Working Guide

## 1. Before starting

1. Open the Vastramay repository root.
2. Inspect the existing code and Git status.
3. Confirm the active branch and package manager.
4. Read this `docs/` directory.
5. Compare planned architecture with actual implementation.
6. Do not overwrite working code merely to match an example structure.

## 2. Prompting workflow

Use the implementation roadmap in `08-roadmap-and-phases.md` one phase at a time.

For each phase:
1. Give Antigravity the complete phase prompt.
2. Ask it to inspect existing files before editing.
3. Let it implement only the phase scope.
4. Review the diff.
5. Run the app and relevant tests/build.
6. Inspect the browser at desktop and mobile sizes.
7. Fix problems before proceeding.
8. Update documentation with what was actually completed.

Do not send all phases as one giant instruction. Avoid a separate master prompt that must be manually prepended to every phase; the individual phase prompts should include their own essential constraints.

## 3. Guardrails for every phase

- Project name: Vastramay.
- Preserve React + TypeScript + Vite.
- Preserve Tailwind CSS 3.4.x + SCSS unless a deliberate migration is approved.
- Use white #FFFFFF, black #101010 and purple #6D28D9.
- Use EB Garamond + Sora.
- Maintain flat, sharp-corner fashion design.
- Inspect existing components before creating new ones.
- Avoid fake data presented as live data.
- Never claim payment success without server verification.
- Respect third-party licensing.
- Support reduced motion and mobile touch interactions.
- Run build/tests and report actual outcomes.

## 4. Third-party component sources

- Skiper UI: https://www.skiper-ui.com/
- Scrolltide: https://www.scrolltide.co/
- Navbar Gallery: https://www.navbar.gallery/
- Footer Design: https://www.footer.design/
- Motion: https://motion.dev/
- GSAP: https://gsap.com/
- Swiper: https://swiperjs.com/
- Fancyapps/Fancybox: https://fancyapps.com/fancybox/integration/react/
- Lenis: https://lenis.dev/

Treat Navbar Gallery and Footer Design primarily as inspiration/reference galleries. Before adopting any ready-made component, verify source availability, framework compatibility, dependencies, maintenance, accessibility, licence and commercial-use rights. Some collections/components may be paid.

## 5. How to report a phase

Ask Antigravity to return:
- Files created/modified
- Features implemented
- Dependencies added/removed and why
- Commands run
- Build/lint/test results
- Browser/responsive checks performed
- Known bugs and remaining blockers
- Documentation updated

Do not accept “everything is complete” without test evidence.

## 6. Recovery strategy

If a phase breaks the project:
1. Stop before starting another phase.
2. Inspect the exact errors and Git diff.
3. Revert only unintended changes.
4. Fix configuration or component conflicts.
5. Re-run the failing check.
6. Record the resolution in project documentation if it affects architecture.

## 7. Final launch gate

Before launch, verify the complete purchase flow with the configured payment sandbox, authentication, inventory, shipping, notifications and order tracking. Review policies and business information. Confirm licences and production credentials. A visually complete frontend alone is not a live e-commerce store.
