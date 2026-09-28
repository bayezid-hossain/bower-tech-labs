# Motion, Paged Carousels, Stacking Projects — Design Spec

Date: 2026-09-29
Status: Approved by user (brainstorming), pending spec review
Parent spec: `2026-09-28-bower-landing-design.md` (design-is-law rules still apply to resting states)

## Goal

Three user-requested enhancements to the built landing page:

1. Text and element animations modeled on trexalab.com, built with Framer Motion.
2. Paged Testimonials and Pricing carousels (fixed cards per page, disabled arrows at the ends, page dots).
3. The Our Projects cards stack on scroll, with clickable 01–04 tabs that show a chosen card and highlight the active one.

**Resting-state rule:** after every animation completes, and at scroll position 0, the page must look exactly as it does today. Under `prefers-reduced-motion`, everything renders in its final state immediately.

## 1. Animations (Framer Motion)

Library: `motion` (import from `motion/react`). Only client leaf components import it; sections stay server components.

### Reference (measured on trexalab.com, 2026-09-29)

| Effect | Behavior |
|---|---|
| Text reveal | Text split into words (`display:inline-block`). Each word goes from opacity 0 → 1 and translateY 10px → 0. Stagger 0.05s per word. Spring `{ type: "spring", bounce: 0, duration: 1.2 }`. Triggers once, when the element enters the viewport. |
| Block fade-up | Opacity 0 → 1, translateY 20px → 0, spring `{ bounce: 0, duration: 1.6 }`. Triggers once in view. |
| Hero entrance | Plays on load (not in-view). Staggered delays 0s / 0.9s / 1.3s (badge+headline / sub / buttons). The headline and sub use the text reveal. |
| Button roll | Label split into letters, with a duplicate stacked one line below. On hover every letter translates −100% of its line height (1.2em), per-letter stagger ≈0.015s, duration ≈0.25s ease-out. Reverses on hover-out. |

### Components (`src/components/motion/`)

- **`AnimatedText`**
  - Props: `text: string`, `as?` (h1/h2/h3/p/span, default span), `className?`, `delay?`, `trigger?: "inView" | "mount"` (default inView).
  - Renders the real text for assistive tech (`aria-label` on the element, word spans `aria-hidden`).
  - Keeps `\n` line breaks with the same semantics as `LineBreaks` (desktop-only by default, `breakOn="always"` supported).
  - Integrates with `SectionHeading`: the title and a string subtitle render through `AnimatedText`.
- **`FadeIn`**
  - Replaces `Reveal`, with the same props (`as`, `delay`, `className`, `children`) plus `trigger?: "inView" | "mount"`, `y?` (default 20).
  - Every `Reveal` usage migrates, and `Reveal.tsx` is deleted.
- **`RollingText`**
  - Props: `text: string`, `className?`.
  - Used inside `Button` for string children (Button keeps its API). The letters inherit font, size and tracking. The layout box equals the static label, so there is no size change.
- **Viewport rule:**
  - "In view" uses `whileInView` with `viewport={{ once: true, amount: 0.3 }}`.
  - Elements already in the viewport at load animate immediately.
  - SSR renders the initial hidden state only for elements that will animate. Hero and above-the-fold content use `trigger="mount"`, so LCP isn't delayed by scroll.
- **Reduced motion:** a `MotionConfig reducedMotion="user"` provider in the layout, plus components that check `useReducedMotion()` and render final styles with no split animation.

## 2. Paged Carousels

### Behavior

| Carousel | Desktop (≥1024) per page | Mobile per page | Pages (desktop / mobile) |
|---|---|---|---|
| Pricing (5 cards) | 3 | 1 | 2 (cards 1–3, 4–5) / 5 |
| Testimonials (4 cards) | 2 | 1 | 2 (1–2, 3–4) / 4 |

- All cards on a page are equal width. A short last page keeps its cards left-aligned, and the missing slot is empty: a trailing spacer makes the page scroll to its exact start.
- The track is native horizontal scroll with snap at page starts. Swipe works on mobile.
- Arrows move one page. Prev is disabled on the first page and Next on the last. The disabled style is `opacity-40` and `cursor-not-allowed`, and the button has the `disabled` attribute.
- **Page dots:** one per page, navy when active, `bg-placeholder` otherwise. Each dot is a button (`aria-label="Go to page N"`, `aria-current` on the active one).
  - Placement: pricing dots are centred between the cards and the arrows; testimonial dots sit under the cards (left on desktop, centred above the arrows on mobile).
- The current page is derived from `scrollLeft`, and the arrow and dot state updates on scroll and resize.
- **No edge-bleed:** the `lg:mr-[calc(50%-50vw)]` wrappers are removed.
- Widths at 1440:
  - Pricing: 3 × 384 + 2 × 24 = 1200 (content width).
  - Testimonials: track x 660 → 1356 (2 × 336 + 24). The track overhangs the content column by 36px on the right at ≥1280 (`xl:-mr-9`).
  - Testimonials, 1024–1279: the left column is 400px (`lg:grid-cols-[400px_1fr] xl:grid-cols-[540px_1fr]`).

### Content changes

- `src/content/pricing.ts`: replace card 4 and add card 5 (typos corrected per copy policy).
  - **Mobile App:** tag "1-25 Pages", package "Launch Package – Design Only", price "$3050", features = the Website Design list.
  - **Branding Design:** tag "25+ Pages", package "Logo + Branding Guidelines", price "$2050". Features:
    - "2/3 logo concepts with refinements"
    - "Social Media Kit (posts, stories, covers)"
    - "Stationery Kit (letterhead, business cards)"
    - "Comprehensive Brand Guidelines."
    - "Figma Style Guide"
    - "Up to 5 revisions across full design."
    - "All source files (AI, PSD, PNG, etc.)"
- `src/content/testimonials.ts`: add a 4th entry with the same placeholder name, role and quote, using avatar-1 (the user replaces it later).

### Units

- `src/lib/carousel.ts` (pure, unit-tested):
  - `pageCount(itemCount, perPage)`
  - `pageFromScroll(scrollLeft, pageWidth)`
  - `pageScrollLeft(page, pageWidth)`
  - `spacerCount(itemCount, perPage)`
  - The old `getStepTarget` is removed.
- `src/hooks/usePagedCarousel.ts`:
  - `{ trackRef, page, pages, canPrev, canNext, prev, next, goTo }`.
  - `perPage` is read from a CSS custom property on the track (`--per-page`, set by responsive classes), so breakpoints stay in CSS.
- `src/components/patterns/Carousel.tsx`: `CarouselTrack` (sets item width via `--per-page`, renders spacers), `CarouselControls` (with a disabled state), and a new `CarouselDots`.
- `IconButton`: `disabled:opacity-40 disabled:cursor-not-allowed`.

## 3. Our Projects — Stacking Cards + Clickable Tabs

### Stacking

- Each project `<li>` is `position: sticky` with the same `top` offset (desktop 40px, mobile 16px). Later cards scroll up over earlier ones.
- Card bodies are opaque; the tab row is transparent except the tab. The tabs are staggered 80px, so every stacked tab stays visible, matching the user's reference image.
- Scrolling up un-stacks naturally. No JS is needed for the stacking itself.
- **Short-viewport fallback:** stacking only applies when the card fits the viewport: `[@media(min-height:720px)]` on desktop, `[@media(min-height:760px)]` on mobile. Otherwise it's a normal list.
- At scroll 0 and in full-page screenshots the layout is unchanged.

### Tabs

- Each tab becomes a `<button>` (`aria-label="Show project 0N"`, `aria-current="true"` when active).
- **Click:** smooth-scroll the window so card N is the top of the stack, i.e. to the scroll position where `li[N]` just reaches its sticky top. The target is computed from the list's document offset plus N × the stacking step (pure helper `stackScrollTarget(listTop, index, stepHeights, stickyTop)`, unit-tested). Reduced motion uses an instant scroll.
- **Active card:** the highest-index card whose sticky state is reached (`scrollY + stickyTop >= its natural top`), computed on scroll with rAF throttling. Before the list, card 01 is active.
- **Styles:**
  - Active tab: current navy gradient with white text, as in the design.
  - Inactive tabs: `bg-placeholder` with `text-navy`, going navy on hover.
  - Transition 200ms.
  - **Resting frame exception:** at scroll 0 card 01 is active, so tabs 02–04 show the inactive style. The design shows all tabs navy; the user accepted this in exchange for the distinct active state.
- A client component `ProjectStack` owns the active state and click handling. `ProjectCard` gets `active`, `onSelect` and `tabRef`-friendly props, and stays otherwise presentational.

## Verification

- `npm test`: carousel page math, stack scroll target math.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Playwright (throwaway) at 375, 1440 and 1920:
  - Word spans animate to opacity 1.
  - Button roll translates on hover.
  - Pricing shows 3 then 2, and testimonials 2 then 2.
  - Arrows disable at the ends and the dots stay in sync.
  - Clicking tab 03 makes card 03 topmost and tab 03 active.
- `npm run test:visual` (reduced motion): desktop height stays 11246 and bands stay within about 1 point of the previous run. The expected differences are the pricing and testimonial content changes and the inactive tab colours.
- Update `CLAUDE.md` Motion and Structure sections and the parent spec's Motion section.

## Out of Scope

Magnetic hover, page-transition effects, and animating the curved galleries (they already move).
