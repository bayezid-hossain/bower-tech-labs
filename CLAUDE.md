# Bower Tech Labs — Landing Page

Marketing landing page for Bower Tech Labs, built from a Figma export.
Full spec: `docs/superpowers/specs/2026-09-28-bower-landing-design.md`.

## Rule #1: The Design Is Law

- Match `assets/Final Design.png` (desktop 1440) and `assets/Frame 2147241977.png` (mobile 375) exactly.
- **No improvisation.** Do not add, remove, restyle, reorder, or "improve" anything: sections, spacing, colors, copy, icons.
- Measure from `assets/Frame 2147241938.png` (2× desktop). Do not eyeball.
- Copy follows the design, **with the design's typos corrected by the user** (2026-09-28, commit 62e54f2: "How We Work", "Launch Package", "Exceptionally", "e.g., Google", footer "Services" column, etc.). `src/content/` is the source of truth — never revert it to the design's misspellings.
- Only allowed additions: generated images in empty (light-blue) image slots, and subtle motion whose resting state equals the design.
- If the design is ambiguous, ask the user. Don't guess.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Inter via `next/font/google`
- Playwright for visual verification
- No backend. The contact form is client-side only.
- Python 3 + Pillow for `scripts/` (asset extraction, visual diff)

## Commands

```bash
npm run dev           # local dev server
npm run build         # production build (must pass)
npm run lint          # lint (must pass)
npm run test          # vitest unit tests
npm run test:visual   # screenshots at 1440 + 375, diffs vs design PNGs -> tests/visual/output/
npm run assets        # re-extract brand assets from the design
```

## Structure

```
src/app/                 layout, page (composes sections), globals.css
src/components/ui/       primitives: Button, IconButton, Badge, Container, SectionHeading, Card, Avatar, form/*
src/components/motion/   MotionProvider, FadeIn, AnimatedText, RollingText, Marquee, DraggableMarquee
src/components/patterns/ reusable composites: CurvedGallery, Carousel, PlayReel, ServiceCard, ProjectCard, ProjectStack, StepCard, TestimonialCard, PricingCard, TeamMember, LogoLockup, WhatsAppButton
src/components/layout/   Navbar, Footer
src/components/sections/ page sections (thin: read content, lay out patterns)
src/content/             ALL copy + data (typed)
src/hooks/  src/lib/  src/types/
public/brand/ public/images/ public/logos/
tests/visual/
```

### Component Rules

- `ui/` = content-agnostic primitives with variants. `patterns/` = composites that take props. `sections/` = thin page composition.
- No copy hardcoded in components. It lives in `src/content/`.
- No ad-hoc hex values in JSX. Colors, shadows, gradients and animations are tokens in the Tailwind v4 `@theme` block in `src/app/globals.css`.
- Use `cn()` (`src/lib/cn.ts`) for class merging.
- Components must be reusable: typed props, sensible defaults, `className` passthrough.

## Assets

| File | Use |
|---|---|
| `assets/Final Design.png` | Desktop source of truth |
| `assets/Frame 2147241938.png` | Desktop @2×, for measuring |
| `assets/Frame 2147241977.png` | Mobile source of truth |
| `assets/Frame 2147241907.png` | Footer full size |
| `assets/Frame 2147241930.png` | Logo lockup |
| `assets/Group 1413375668*.png` | Logo mark variants |
| `assets/image 639.png` | Hero glass logo |

Never modify `assets/`. Copy files into `public/` with kebab-case names.

## Motion

Framer Motion (motion/react), trexalab.com-style: word-by-word text reveal (AnimatedText), spring fade-ups (FadeIn), letter-roll button hover (RollingText, CSS). Also the logo marquee, draggable auto-scrolling curved galleries, paged carousels (dots + disabled ends), and sticky stacking project cards with clickable tabs. All user-requested additions beyond the static design. Reduced motion shows final states immediately. The resting state must equal the design (exception: inactive project tabs are light blue).

## Verification Before "Done"

1. `npm run build` and `npm run lint` pass.
2. `npm run test:visual`: compare each section against the design at 1440 and 375.
3. Report remaining diffs honestly. Acceptable diffs: generated images, font anti-aliasing.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
