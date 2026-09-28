# Bower Tech Labs Landing Page — Design Spec

Date: 2026-09-28
Status: Approved (brainstorming), pending spec review

## Goal

Build the Bower Tech Labs marketing landing page as a pixel-faithful implementation of
`assets/Final Design.png` (desktop, 1440 wide) and `assets/Frame 2147241977.png` (mobile, 375 wide).
**No improvisation.** Layout, spacing, sizes, colors, copy, and section order come from the design.
Components must be modular and reusable for future pages.

## Decisions

| Topic | Decision |
|---|---|
| Stack | Next.js (App Router) + TypeScript + Tailwind CSS |
| Font | Inter via `next/font/google`, tight negative tracking on headings |
| Empty image slots | AI-generated images (Krea) at each slot's exact aspect ratio |
| Behavior | Functional + subtle motion (see Motion) |
| Backend | None. Contact form validates client-side only |
| Copy | From the design, typos corrected by the user (see Copy Policy) |
| Verification | Playwright screenshot diff against design PNGs at 1440 and 375 |
| Mobile content | Same content as desktop, with mobile layout. The mobile frame's content mistakes (2 identical services, "How We Works" above the projects, "exceptionally") are ignored. The mobile-only `#EEFAFF` Process band is kept |
| Pricing card 4 | "Mobile App Design", "1-5 Pages", "Lunch Package- Design Only", "$1550", same features as card 1 |
| Pixel-exact image assets | Logo lockups, hero glass, the whole Play Reel dial, footer wordmark, client logos, WhatsApp icon, and avatars are cropped from the transparent 2× export |

## Source Assets

| File | Use |
|---|---|
| `assets/Final Design.png` (1440×11246) | Desktop source of truth |
| `assets/Frame 2147241938.png` (2880×22492) | Same desktop at 2×, used for measuring |
| `assets/Frame 2147241977.png` (375×11751) | Mobile source of truth |
| `assets/Frame 2147241907.png` (1440×705) | Footer at full size |
| `assets/Frame 2147241930.png` (202×32) | Logo lockup (mark + wordmark) |
| `assets/Group 1413375668*.png` (25–40px) | Logo mark variants (favicon, footer) |
| `assets/image 639.png` (481×496) | Hero glass logo render |

Asset files get copied into `public/` with kebab-case names. Originals in `assets/` stay untouched.

## Folder Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, <body> bg
    page.tsx              # composes sections in design order
    globals.css           # Tailwind layers, CSS vars
  components/
    ui/                   # design-system primitives, no business content
      Button.tsx          # variants: primary (navy pill), secondary (white pill), sizes
      IconButton.tsx      # circular outlined arrow button
      Badge.tsx           # status pill ("Available for Work"), tag chip ("1-5 Pages")
      Container.tsx       # 1200px content width, 120px desktop gutters
      SectionHeading.tsx  # title + subtitle, align left/center
      Card.tsx            # white rounded surface
      Avatar.tsx
      form/
        Field.tsx         # label + optional hint + underline input
        Input.tsx
        Select.tsx
        Textarea.tsx
    motion/
      Reveal.tsx          # fade/slide-up on scroll wrapper
      Marquee.tsx         # infinite horizontal scroll
    patterns/             # reusable composites built from ui/
      CurvedGallery.tsx   # 4-panel concave-curve image strip
      Carousel.tsx        # horizontal track + prev/next controls
      PlayReel.tsx        # tick-ring dial + video card + "Play"/"Reel"
      ServiceCard.tsx
      ProjectCard.tsx     # numbered tab + text column + image
      StepCard.tsx
      TestimonialCard.tsx
      PricingCard.tsx
      TeamMember.tsx
      LogoLockup.tsx
      WhatsAppButton.tsx
    layout/
      Navbar.tsx
      Footer.tsx
    sections/             # page sections; take data via props
      Hero.tsx
      ClientLogos.tsx
      About.tsx
      Services.tsx
      Projects.tsx
      Process.tsx
      RecentWorks.tsx
      Testimonials.tsx
      Pricing.tsx
      Contact.tsx
  content/                # all copy + data, typed
    site.ts               # brand, email, whatsapp, socials
    navigation.ts
    services.ts
    projects.ts
    process.ts
    testimonials.ts
    pricing.ts
    contact.ts            # form options, bullets, team
    footer.ts
  hooks/
    useCarousel.ts
  lib/
    cn.ts                 # clsx + tailwind-merge
  types/
    content.ts
public/
  brand/                  # logo lockup, marks, hero glass
  images/                 # generated placeholders, per section subfolders
  logos/                  # client logos for marquee
tests/
  visual/
    capture.spec.ts       # Playwright screenshots at 1440 and 375
    diff.ts               # overlay/diff against design PNGs
docs/superpowers/specs/
```

Rules:
- `ui/` primitives know nothing about Bower content.
- `patterns/` combine primitives and take data via props.
- `sections/` are thin: they read from `content/` and lay out patterns.
- Copy lives only in `content/`, never hardcoded in components.
- Design tokens live in the Tailwind v4 `@theme` block in `src/app/globals.css`, never as ad-hoc hex values in JSX.

## Design Tokens

Tokens are sampled from the PNGs with a color picker during implementation. The values below are approximate and must be replaced with the sampled ones.

- `bg` ≈ `#F5FAFE` (page background)
- `surface` = `#FFFFFF` (cards)
- `navy` ≈ `#0A3A55` (primary buttons, number tabs, wordmark)
- `ink` ≈ `#0B1F2A` (headings)
- `body` ≈ `#4A5563` (paragraphs)
- `muted` ≈ `#6B7A8C` ("About Bower Tech", "2025")
- `accent` ≈ `#1F6FEB` ("STEP 01" labels)
- `placeholder` ≈ `#C0DCE9` (empty image slots; the fallback while images load)
- `ghost` ≈ `#D5DCE6` ("Play"/"Reel" text)
- `success` ≈ `#4CAF50` (availability dot)
- Radii, spacing, and type scale are measured from the 2× PNG and put in the Tailwind theme.

## Sections (design order)

1. **Navbar**: logo lockup; links Services, About us, Process, Testimonials, Pricing, FAQ, Contact us; "Become a Client" navy pill. Mobile: logo + CTA only (no hamburger, matching the mobile frame).
2. **Hero**: "Available for Work" pill, H1 "Product Design That Ships in Days, Not Months.", sub copy, "Request a Quote" + "Quick Chat- WhatsApp". Glass render on the right. Mobile: stacked, full-width buttons.
3. **Hero CurvedGallery**: 4 panels, concave top and bottom edges, thin white gutters.
4. **ClientLogos**: logoipsum marquee with faded edges.
5. **About**: centered statement. Bold ink for "Bower Tech Labs is a lean design studio that builds digital products for", light body for the rest.
6. **PlayReel**: tick-mark ring, black rounded video card, ghost "Play" / "Reel".
7. **Services**: "What We Do, Full Stop" plus sub, then a 2×2 ServiceCard grid (UI/UX Design, Logo & Branding, Web Development, UI/UX Redesign), then a centered "Start a Project". Mobile: 1 column.
8. **Projects**: centered "Our Projects" plus sub, then 4 ProjectCards. Each has a navy number tab (01–04); the tab's x-offset steps left per card as in the design. Card 4 uses the "2025" label and a wider text inset, as the design shows.
9. **Process**: "How We Works" plus sub, then 2×2 StepCards (STEP 01–04).
10. **RecentWorks**: centered heading plus sub, then CurvedGallery.
11. **Testimonials**: left column has "What we do expectionally" + sub + prev/next IconButtons. Right side has a TestimonialCard carousel bleeding past the right edge.
12. **Pricing**: centered heading plus sub (bold "Book a free 15-minute call."), then a PricingCard carousel (4 cards, 3 visible plus a partial one) and centered prev/next.
13. **Contact**: left column has "Tell Us About Your Project", sub, 3 bullets, 2 TeamMembers (Shoron Hasan uses a gray placeholder block as designed; Ssm Siam uses a photo). Right column is the form card: Full Name*, Company Name (Optional), Email Address*, What's App Number (Optional), Service Required*, Project Budget*, Project Details*, the "Request a Quote" full-width button, "Not Interested to submit the form?" and "Book a Direct call with Sales".
14. **Footer**: logo, blurb, "Email us :", email pill + WhatsApp pill, copyright; link columns Socials (services list), Quick Links, Socials (networks); divider; giant "Bower Tech Labs" wordmark spanning the container.

Mobile layouts follow `Frame 2147241977.png` section by section.

## Images

- Generated with Krea at each slot's exact aspect ratio. Style: clean, modern UI/UX and branding mockups on soft light-blue-neutral tones that suit the palette.
- Slots: hero gallery (4), services (4), projects (4), recent works gallery (4), PlayReel video card thumbnail.
- Testimonial avatars and the Ssm Siam photo are cropped from the 2× design PNG.
- Client logos are cropped from the design PNG as transparent PNGs.
- All images go through `next/image`, with the `placeholder` color as the background while loading.

## Motion

Motion is additive only. The resting state must equal the design.
- `Reveal`: opacity 0→1, translateY 16px→0, 500ms ease-out, once per element, triggered by IntersectionObserver.
- Buttons and cards: hover lift of 2px plus a slightly stronger shadow, 150ms.
- Marquee: continuous linear scroll, paused on hover.
- Curved galleries (user request, 2026-09-28): auto-scroll right-to-left (~40px/s), draggable left/right with snap to the nearest panel on release, arrow-key stepping, paused on hover/keyboard focus. Resting frame (offset 0) equals the design.
- Carousels: smooth scroll-snap slide on arrow click. Arrows disable at the ends.
- `prefers-reduced-motion`: all motion disabled.
- Implemented with CSS and a small hook. No animation library unless one is needed.
- See 2026-09-29-motion-carousels-stacking-design.md for Framer Motion text/fade animations, paged carousels and stacking projects.

## Contact Form Behavior

- Client-side validation of the required fields and email format. Errors appear as small text under a field without shifting the layout noticeably.
- Submit shows an inline success state. There is no network call.
- Select options: services come from the footer services list. Budget ranges come from `content/contact.ts`.

## Copy Policy

Copy is verbatim, including the design's typos: "How We Works", "Lunch Package", "Trexa Lab crafts…", "Eg. Goggle", "expectionally", "Micro-Interations", "(Website+ Mobile App+ Dashboard", and the duplicate "Socials" footer heading. None get fixed unless the user asks.

**Update 2026-09-28:** the user corrected these typos in commit 62e54f2. `src/content/` is now the source of truth for copy.

## Verification

- `npm run test:visual` builds the page, screenshots it at 1440 and 375 (full page), and writes side-by-side and diff PNGs to `tests/visual/output/`.
- Iterate section by section until the diffs show only the expected differences: generated images, font anti-aliasing, and motion.
- `npm run lint` and `npm run build` must pass.

## Out of Scope

- Backend or email sending for the form
- CMS
- Additional pages
- FAQ section (it is linked in the nav but absent from the design; the link anchors to nothing)
- Dark mode
