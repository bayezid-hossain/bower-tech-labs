# Motion, Paged Carousels, Stacking Projects — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add trexalab-style text and fade animations (Framer Motion), paged Testimonials and Pricing carousels with page dots, and stacking Our Projects cards with clickable tabs.

**Architecture:**
- Motion lives in small client leaf components in `src/components/motion/` (`AnimatedText`, `FadeIn`, plus a CSS-only `RollingText`). Sections stay server components.
- Carousel and stack behavior live in pure, unit-tested helpers in `src/lib/`, driven by thin hooks and client components.
- Layout breakpoints stay in CSS (custom properties), not JS.

**Tech Stack:** Next.js 16 (App Router) + React 19, Tailwind v4, `motion` (Framer Motion, `motion/react`), Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-29-motion-carousels-stacking-design.md`. **Rules:** `CLAUDE.md`. The resting state must equal the design, and reduced motion means final state immediately.

**Motion rules (design-taste-frontend skill, applied within this plan):**
- Motion only in `"use client"` leaves.
- Animate only transform and opacity.
- Springs, not linear easing.
- Mandatory reduced-motion fallback.
- `staggerChildren` parent and children in the same client tree.
- No `addEventListener("scroll")`: use Motion `useScroll` + `useMotionValueEvent`, and set React state only on discrete changes.
- Strict effect cleanup.
- Tactile press feedback (`active:scale-[0.98]`) on buttons, arrow buttons, dots and tabs.

Deliberately NOT applied, per the user ("stick to original plans"):
- The em-dash copy ban (copy is fixed by the design and the user's edits).
- The one-marquee limit (the galleries are user-requested).
- Shrink/dim on stacked cards.

**Plan-time decision (spec update in Task 10):** page dots render **between the prev/next arrows** (`‹ • • ›`) in every carousel, not under the cards. This keeps section heights, and therefore the desktop design match, unchanged.

---

## File map

```
src/components/motion/MotionProvider.tsx   new  MotionConfig reducedMotion="user"
src/components/motion/FadeIn.tsx           new  replaces Reveal (spring fade-up)
src/components/motion/AnimatedText.tsx     new  word-by-word reveal
src/components/motion/RollingText.tsx      new  CSS letter-roll hover (group-hover)
src/components/motion/Reveal.tsx           delete
src/components/ui/SectionHeading.tsx       title/subtitle via AnimatedText/FadeIn
src/components/ui/Button.tsx               `group` + RollingText for string labels
src/components/ui/IconButton.tsx           visible disabled state
src/lib/carousel.ts (+ .test.ts)           page math (replaces getStepTarget)
src/hooks/usePagedCarousel.ts              new (replaces useCarousel.ts)
src/hooks/useCarousel.ts                   delete
src/components/patterns/Carousel.tsx       CarouselTrack (perPage, spacers), CarouselControls (+dots)
src/lib/project-stack.ts (+ .test.ts)      new stack math
src/components/patterns/ProjectStack.tsx   new client list: sticky stacking, active tab, click-to-card
src/components/patterns/ProjectCard.tsx    tab → button with active/inactive styles
src/app/globals.css                        .carousel-track/.carousel-item, .project-stack-item
src/app/layout.tsx                         wrap in MotionProvider
src/components/sections/*.tsx              migrate Reveal → FadeIn/AnimatedText; carousels; ProjectStack
src/content/pricing.ts, testimonials.ts    new cards
```

All commit messages end with a blank line followed by `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

### Task 1: Install Framer Motion and add the provider

**Files:**
- Modify: `package.json` (dependency)
- Create: `src/components/motion/MotionProvider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install**

Run: `npm i motion`
Expected: `motion` is added to `dependencies`, with no ERESOLVE error.

- [ ] **Step 2: Create `src/components/motion/MotionProvider.tsx`**

```tsx
"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honors the OS "reduce motion" setting for every Framer Motion animation on the page. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

- [ ] **Step 3: Wrap the body content in `src/app/layout.tsx`**

Add the import `import { MotionProvider } from "@/components/motion/MotionProvider";` and change the body line to:

```tsx
      <body className="bg-page font-sans text-ink antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
```

- [ ] **Step 4: Verify and commit**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass.

```bash
git add package.json package-lock.json src/components/motion/MotionProvider.tsx src/app/layout.tsx
git commit -m "feat: add framer motion with reduced-motion provider"
```

---

### Task 2: `FadeIn` and `AnimatedText` components

**Files:**
- Create: `src/components/motion/FadeIn.tsx`, `src/components/motion/AnimatedText.tsx`

- [ ] **Step 1: Create `src/components/motion/FadeIn.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const tags = { div: motion.div, p: motion.p, li: motion.li, span: motion.span } as const;

type FadeInProps = {
  as?: keyof typeof tags;
  /** Seconds. */
  delay?: number;
  /** Starting offset in px (trexalab uses 10–20). */
  y?: number;
  /** "mount" plays on load (above-the-fold); "inView" plays once when scrolled into view. */
  trigger?: "inView" | "mount";
  className?: string;
  children: ReactNode;
};

/** Spring fade-up (trexalab.com style: opacity 0→1, y→0, spring bounce 0, 1.6s). Resting state = final layout. */
export function FadeIn({ as = "div", delay = 0, y = 20, trigger = "inView", className, children }: FadeInProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  const shown = { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 1.6, delay } };
  const play = trigger === "mount" ? { animate: shown } : { whileInView: shown, viewport: { once: true, amount: 0.2 } };
  return (
    <Tag className={className} initial={reduce ? false : { opacity: 0, y }} {...play}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Create `src/components/motion/AnimatedText.tsx`**

```tsx
"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Fragment } from "react";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span } as const;

const word: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 1.2 } },
};

type AnimatedTextProps = {
  text: string;
  as?: keyof typeof tags;
  id?: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  trigger?: "inView" | "mount";
  /** Same semantics as LineBreaks: "\n" breaks only at lg+ by default. */
  breakOn?: "lg" | "always";
};

/**
 * Word-by-word reveal (trexalab.com style): each word fades 0→1 and rises 10px→0, 50ms apart.
 * Screen readers get the full sentence from an sr-only copy; the animated words are aria-hidden.
 */
export function AnimatedText({ text, as = "span", id, className, delay = 0, trigger = "inView", breakOn = "lg" }: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: delay } } };
  const play = trigger === "mount" ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, amount: 0.3 } };

  return (
    <Tag id={id} className={className} variants={container} initial={reduce ? false : "hidden"} {...play}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && (
            <>
              {" "}
              <br aria-hidden="true" className={breakOn === "lg" ? "hidden lg:inline" : undefined} />
            </>
          )}
          {line
            .split(" ")
            .filter(Boolean)
            .map((w, wi, words) => (
              <Fragment key={wi}>
                <motion.span aria-hidden="true" className="inline-block" variants={word}>
                  {w}
                </motion.span>
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            ))}
        </Fragment>
      ))}
    </Tag>
  );
}
```

- [ ] **Step 3: Verify and commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean. If `motion` typings reject the spread `play` object, type it explicitly: `const play: { animate?: string; whileInView?: string; viewport?: { once: boolean; amount: number } } = …`. Apply the same approach in FadeIn with target objects.

```bash
git add src/components/motion/FadeIn.tsx src/components/motion/AnimatedText.tsx
git commit -m "feat: add FadeIn and AnimatedText motion components"
```

---

### Task 3: Animate headings and migrate every `Reveal` usage

**Files:**
- Modify: `src/components/ui/SectionHeading.tsx`, and in `src/components/sections/`: `Hero.tsx`, `About.tsx`, `Services.tsx`, `Process.tsx`, `RecentWorks.tsx`, `Contact.tsx`, `Projects.tsx`, `Testimonials.tsx`, `Pricing.tsx`
- Delete: `src/components/motion/Reveal.tsx`

Headings animate themselves now, so the `Reveal` wrappers around `SectionHeading` are removed rather than converted. Reveal `delay` was in ms; FadeIn `delay` is in seconds.

- [ ] **Step 1: Replace `src/components/ui/SectionHeading.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";

type SectionHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  titleId?: string;
  titleBreakOn?: "lg" | "always";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeading({
  title,
  subtitle,
  titleId,
  titleBreakOn = "lg",
  align = "left",
  as = "h2",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  const subtitleClasses = cn(
    "mt-[17px] text-[15.5px] leading-5 tracking-[-0.045em] text-body lg:mt-[22px] lg:text-[17px] lg:leading-6 lg:tracking-[-0.035em]",
    subtitleClassName,
  );
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <AnimatedText
        as={as}
        id={titleId}
        text={title}
        breakOn={titleBreakOn}
        className={cn("text-[32px] font-semibold leading-[1.15] tracking-[-0.04em] text-ink lg:text-[48px]", titleClassName)}
      />
      {typeof subtitle === "string" ? (
        <AnimatedText as="p" text={subtitle} delay={0.1} className={subtitleClasses} />
      ) : subtitle ? (
        <FadeIn as="p" y={10} delay={0.1} className={subtitleClasses}>
          {subtitle}
        </FadeIn>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/components/sections/Hero.tsx`**

The hero plays on load with trexalab's stagger: badge and headline at 0s, subtitle at 0.9s, buttons at 1.3s.

```tsx
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";
import { CurvedGallery } from "@/components/patterns/CurvedGallery";
import { WhatsAppButton } from "@/components/patterns/WhatsAppButton";
import { hero } from "@/content/hero";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <Container className="relative pt-4 lg:pt-[124px]">
        <Image
          src="/brand/hero-glass.png"
          alt=""
          width={481}
          height={492}
          preload
          className="pointer-events-none absolute top-14 right-5 hidden lg:block"
        />
        <div className="relative max-w-[640px] md:mx-auto md:text-center lg:mx-0 lg:text-left">
          <FadeIn trigger="mount" y={10}>
            <Badge className="tracking-[-0.045em] lg:pr-[15px] lg:tracking-[0.015em]">{hero.status}</Badge>
          </FadeIn>
          <AnimatedText
            as="h1"
            id="hero-title"
            trigger="mount"
            text={hero.title}
            className="mt-[25px] max-w-[320px] text-[40px] font-semibold leading-10 tracking-[-0.04em] text-ink md:max-w-none lg:mt-10 lg:max-w-none lg:text-[56px] lg:leading-[60px] lg:tracking-[-0.04em]"
          />
          <AnimatedText
            as="p"
            trigger="mount"
            delay={0.9}
            text={hero.description}
            className="mt-[23px] text-[16px] leading-5 tracking-[-0.058em] text-body lg:mt-[25px] lg:text-[17px] lg:leading-6 lg:tracking-[-0.03em]"
          />
          <FadeIn trigger="mount" delay={1.3} className="mt-10 flex flex-col gap-4 md:flex-row md:justify-center lg:mt-[39px] lg:justify-start lg:gap-4">
            <Button href={hero.primaryCta.href} size="lg" className="h-12 w-full text-[15px] md:w-auto lg:h-14 lg:pt-1 lg:text-[17px]">
              {hero.primaryCta.label}
            </Button>
            <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} className="h-12 w-full text-[15px] md:w-auto lg:h-14 lg:pt-1 lg:text-[17px]" />
          </FadeIn>
        </div>
      </Container>
      <CurvedGallery images={hero.gallery} label={hero.galleryLabel} priority className="mt-[52px] lg:mt-[67px]" />
    </section>
  );
}
```

Before replacing, diff this against the current file (`git diff` after writing). Every className must be byte-identical to the current file apart from the removed `Reveal` wrapper. If the current file differs from what's shown (someone tuned it since the plan was written), keep the current classNames.

- [ ] **Step 3: Replace `src/components/sections/About.tsx`**

The rest of the sentence starts after the lead's words have begun (lead word count × 0.05s).

```tsx
import { Container } from "@/components/ui/Container";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";
import { PlayReel } from "@/components/patterns/PlayReel";
import { about } from "@/content/about";

const leadDelay = about.lead.split(" ").length * 0.05;

export function About() {
  return (
    <section id="about" aria-label="About" className="pt-[51px] lg:pt-[133px]">
      <Container>
        <p className="mx-auto max-w-[1092px] text-center text-[28px] leading-8 tracking-[-0.05em] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.04em]">
          <AnimatedText text={about.lead} className="font-semibold text-ink" />
          {"  "}
          <AnimatedText text={about.rest} delay={leadDelay} className="font-light text-body" />
        </p>
        <FadeIn className="mt-[31px] lg:mt-[56px]">
          <PlayReel alt={about.reelAlt} className="max-w-[325px] lg:max-w-[612px]" />
        </FadeIn>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: `Services.tsx`, `Process.tsx`, `RecentWorks.tsx`**

In each file:
1. Change the import `import { Reveal } from "@/components/motion/Reveal";` to `import { FadeIn } from "@/components/motion/FadeIn";`.
2. Delete the `<Reveal>` and `</Reveal>` lines that wrap `<SectionHeading … />`, keeping the SectionHeading element itself.
3. Replace `<Reveal delay={(i % 2) * 100} className="h-full">` with `<FadeIn delay={(i % 2) * 0.1} className="h-full">`, and its closing `</Reveal>` with `</FadeIn>`.

RecentWorks has no remaining FadeIn after step 2, so drop its import entirely. Resulting Services list item:

```tsx
            <li key={service.title}>
              <FadeIn delay={(i % 2) * 0.1} className="h-full">
                <ServiceCard service={service} className="h-full" />
              </FadeIn>
            </li>
```

- [ ] **Step 5: `Contact.tsx`**

Replace the import as above. Replace the left-column `<Reveal> … </Reveal>` with a plain `<div>` in which only the bullets and team row fade in, and convert the form wrapper:

```tsx
        <div>
          <SectionHeading
            titleId="contact-title"
            title={contactSection.title}
            titleBreakOn="always"
            subtitle={contactSection.subtitle}
            titleClassName="text-navy-ink lg:leading-[56px]"
            subtitleClassName="max-w-[440px] text-base lg:mt-6 lg:text-[17px] lg:leading-6 lg:tracking-[-0.03em]"
          />
          <FadeIn>
            <BulletList items={contactSection.bullets} className="mt-6 gap-3 lg:mt-[33px]" itemClassName="text-[15px] leading-6 text-body lg:tracking-[-0.035em]" />
            <div className="mt-10 flex gap-11 lg:mt-[55px]">
              {team.map((member) => (
                <TeamMember key={member.name} member={member} />
              ))}
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <ContactForm
            fields={contactForm.fields}
            submitLabel={contactForm.submitLabel}
            altPrompt={contactForm.altPrompt}
            altCta={contactForm.altCta}
            altHref={site.bookCallUrl}
            successMessage={contactForm.successMessage}
          />
        </FadeIn>
```

As in Step 2, keep the current classNames if they differ from those shown.

- [ ] **Step 6: `Projects.tsx`, `Testimonials.tsx`, `Pricing.tsx` (temporary migration; these are rewritten in Tasks 7 and 9)**

Run:
```bash
sed -i 's#@/components/motion/Reveal#@/components/motion/FadeIn#; s#\bReveal\b#FadeIn#g' src/components/sections/Projects.tsx src/components/sections/Testimonials.tsx src/components/sections/Pricing.tsx
```

- [ ] **Step 7: Delete Reveal and verify nothing references it**

```bash
git rm src/components/motion/Reveal.tsx
grep -rn "Reveal" src || echo "no Reveal references"
```
Expected: `no Reveal references`.

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add -A src
git commit -m "feat: word-by-word heading reveal and spring fade-ins (replaces Reveal)"
```

---

### Task 4: Button letter-roll hover

**Files:**
- Create: `src/components/motion/RollingText.tsx`
- Modify: `src/components/ui/Button.tsx`

- [ ] **Step 1: Create `src/components/motion/RollingText.tsx`**

This is CSS only, needs no client JS, and relies on a `group` class on the hovered ancestor. The global reduced-motion rule makes the roll instant, which looks identical.

```tsx
import { cn } from "@/lib/cn";

type RollingTextProps = { text: string; className?: string };

/**
 * Letter-roll hover (trexalab.com style): each letter slides up one line to reveal an identical copy,
 * 15ms apart, 250ms ease-out. Requires a `group` ancestor (Button provides it).
 */
export function RollingText({ text, className }: RollingTextProps) {
  return (
    <span className={cn("relative inline-flex overflow-hidden leading-[1.2]", className)}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => {
        const glyph = ch === " " ? " " : ch;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block transition-transform duration-250 ease-out group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {glyph}
            <span className="absolute top-full left-0">{glyph}</span>
          </span>
        );
      })}
    </span>
  );
}
```

- [ ] **Step 2: Update `src/components/ui/Button.tsx`**

Add `import { RollingText } from "@/components/motion/RollingText";`. In `buttonClasses`, change the first base string to start with `group `:

```ts
    "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.04em] active:scale-[0.98]",
```

Then change `content`:

```tsx
  const content = (
    <>
      {icon}
      {typeof children === "string" ? <RollingText text={children} /> : children}
    </>
  );
```

- [ ] **Step 3: Verify and commit**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: pass.

```bash
git add src/components/motion/RollingText.tsx src/components/ui/Button.tsx
git commit -m "feat: letter-roll hover on button labels"
```

---

### Task 5: Carousel page math (TDD)

**Files:**
- Modify: `src/lib/carousel.ts`, `src/lib/carousel.test.ts` (full replacement; `getStepTarget` is removed)

- [ ] **Step 1: Replace `src/lib/carousel.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { pageCount, pageFromScroll, pageScrollLeft, spacerCount } from "./carousel";

describe("pageCount", () => {
  it("rounds partial pages up", () => {
    expect(pageCount(5, 3)).toBe(2);
    expect(pageCount(4, 2)).toBe(2);
    expect(pageCount(5, 1)).toBe(5);
  });
  it("never returns fewer than one page", () => {
    expect(pageCount(0, 3)).toBe(1);
    expect(pageCount(4, 0)).toBe(1);
  });
});

describe("spacerCount", () => {
  it("fills the last page's empty slots", () => {
    expect(spacerCount(5, 3)).toBe(1);
    expect(spacerCount(7, 3)).toBe(2);
  });
  it("is zero when pages divide evenly or perPage is 1", () => {
    expect(spacerCount(4, 2)).toBe(0);
    expect(spacerCount(5, 1)).toBe(0);
  });
});

// Pricing at 1440: 3 cards per page, 384px + 24px gap -> page width 1224.
describe("pageFromScroll", () => {
  it("maps scroll positions to the nearest page", () => {
    expect(pageFromScroll(0, 1224, 2)).toBe(0);
    expect(pageFromScroll(1224, 1224, 2)).toBe(1);
    expect(pageFromScroll(700, 1224, 2)).toBe(1);
    expect(pageFromScroll(500, 1224, 2)).toBe(0);
  });
  it("clamps to the valid range", () => {
    expect(pageFromScroll(5000, 1224, 2)).toBe(1);
    expect(pageFromScroll(-10, 1224, 2)).toBe(0);
  });
  it("handles an unmeasured track", () => {
    expect(pageFromScroll(300, 0, 2)).toBe(0);
  });
});

describe("pageScrollLeft", () => {
  it("returns the page's start offset", () => {
    expect(pageScrollLeft(1, 1224)).toBe(1224);
    expect(pageScrollLeft(0, 1224)).toBe(0);
  });
  it("never goes negative", () => {
    expect(pageScrollLeft(-1, 1224)).toBe(0);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run src/lib/carousel.test.ts`
Expected: FAIL (`pageCount` is not exported).

- [ ] **Step 3: Replace `src/lib/carousel.ts`**

```ts
/** Page math for paged carousels: `perPage` equal-width items per page, pages start every perPage items. */

export function pageCount(itemCount: number, perPage: number): number {
  if (perPage <= 0) return 1;
  return Math.max(1, Math.ceil(itemCount / perPage));
}

/** Empty slots appended so a short last page can scroll to its own start. */
export function spacerCount(itemCount: number, perPage: number): number {
  if (perPage <= 1) return 0;
  const remainder = itemCount % perPage;
  return remainder === 0 ? 0 : perPage - remainder;
}

export function pageFromScroll(scrollLeft: number, pageWidth: number, pages: number): number {
  if (pageWidth <= 0) return 0;
  return Math.min(pages - 1, Math.max(0, Math.round(scrollLeft / pageWidth)));
}

export function pageScrollLeft(page: number, pageWidth: number): number {
  return Math.max(0, page) * pageWidth;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/carousel.test.ts`
Expected: all pass. Typecheck will now fail in `useCarousel.ts`; that's expected and fixed in Task 6, so don't commit yet.

---

### Task 6: Paged carousel hook, track/controls, disabled arrows

**Files:**
- Create: `src/hooks/usePagedCarousel.ts`
- Delete: `src/hooks/useCarousel.ts`
- Replace: `src/components/patterns/Carousel.tsx`
- Modify: `src/components/ui/IconButton.tsx`, `src/app/globals.css`

- [ ] **Step 1: Add carousel CSS to the end of `src/app/globals.css`**

```css
/* Paged carousels: items per page come from --per-page-base / --per-page-lg (set inline by CarouselTrack).
   1.5rem matches the track's gap-6. */
.carousel-track {
  --per-page: var(--per-page-base, 1);
}
@media (width >= 64rem) {
  .carousel-track {
    --per-page: var(--per-page-lg, var(--per-page-base, 1));
  }
}
.carousel-item {
  flex: none;
  width: calc((100% - (var(--per-page) - 1) * 1.5rem) / var(--per-page));
  scroll-snap-align: start;
}
```

- [ ] **Step 2: Create `src/hooks/usePagedCarousel.ts`**

```ts
"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { pageCount, pageFromScroll, pageScrollLeft } from "@/lib/carousel";

/**
 * Paged scroll-snap carousel. Items per page is read from the track's CSS `--per-page`
 * (responsive, see .carousel-track in globals.css), so breakpoints stay in CSS.
 */
export function usePagedCarousel(itemCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ page: 0, pages: 1 });

  const metrics = useCallback(() => {
    const el = trackRef.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return null;
    const styles = getComputedStyle(el);
    const perPage = parseInt(styles.getPropertyValue("--per-page"), 10) || 1;
    const gap = parseFloat(styles.columnGap) || 0;
    return { el, pages: pageCount(itemCount, perPage), pageWidth: perPage * (item.offsetWidth + gap) };
  }, [itemCount]);

  const update = useCallback(() => {
    const m = metrics();
    if (!m) return;
    const page = pageFromScroll(m.el.scrollLeft, m.pageWidth, m.pages);
    setState((s) => (s.page === page && s.pages === m.pages ? s : { page, pages: m.pages }));
  }, [metrics]);

  // Scroll tracking via Motion (no raw scroll listeners); state only changes when the page does.
  const { scrollX } = useScroll({ container: trackRef });
  useMotionValueEvent(scrollX, "change", update);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [update]);

  const goTo = useCallback(
    (page: number) => {
      const m = metrics();
      if (!m) return;
      const target = Math.min(m.pages - 1, Math.max(0, page));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      m.el.scrollTo({ left: pageScrollLeft(target, m.pageWidth), behavior: reduce ? "auto" : "smooth" });
    },
    [metrics],
  );

  const { page, pages } = state;
  return {
    trackRef,
    page,
    pages,
    canPrev: page > 0,
    canNext: page < pages - 1,
    prev: () => goTo(page - 1),
    next: () => goTo(page + 1),
    goTo,
  };
}
```

- [ ] **Step 3: Delete the old hook**

Run: `git rm src/hooks/useCarousel.ts`

- [ ] **Step 4: Replace `src/components/patterns/Carousel.tsx`**

```tsx
"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";
import { spacerCount } from "@/lib/carousel";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowIcon } from "@/components/ui/icons";

type PerPage = { base: number; lg: number };

type CarouselTrackProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  label: string;
  itemCount: number;
  perPage: PerPage;
  className?: string;
  /** Items must use className="carousel-item". */
  children: ReactNode;
};

export function CarouselTrack({ trackRef, label, itemCount, perPage, className, children }: CarouselTrackProps) {
  const style = { "--per-page-base": perPage.base, "--per-page-lg": perPage.lg } as CSSProperties;
  return (
    <div
      ref={trackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      style={style}
      className={cn("carousel-track flex min-w-0 snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-none", className)}
    >
      {children}
      {Array.from({ length: spacerCount(itemCount, perPage.base) }, (_, i) => (
        <div key={`base-${i}`} aria-hidden="true" className="carousel-item lg:hidden" />
      ))}
      {Array.from({ length: spacerCount(itemCount, perPage.lg) }, (_, i) => (
        <div key={`lg-${i}`} aria-hidden="true" className="carousel-item hidden lg:block" />
      ))}
    </div>
  );
}

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  page: number;
  pages: number;
  className?: string;
};

/** ‹ • • › — arrows disable at the ends; dots show and jump to pages (the "more items" tip). */
export function CarouselControls({ onPrev, onNext, onGoTo, canPrev, canNext, page, pages, className }: CarouselControlsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <IconButton label="Previous" onClick={onPrev} disabled={!canPrev}>
        <ArrowIcon direction="left" />
      </IconButton>
      {pages > 1 && (
        <div role="group" aria-label="Pages" className="flex items-center">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => onGoTo(i)}
              className="group/dot p-1.5 transition-transform active:scale-[0.9] focus-visible:outline-2 focus-visible:outline-navy"
            >
              <span
                className={cn(
                  "block size-2 rounded-full transition-colors duration-200",
                  i === page ? "bg-navy" : "bg-placeholder group-hover/dot:bg-navy/50",
                )}
              />
            </button>
          ))}
        </div>
      )}
      <IconButton label="Next" onClick={onNext} disabled={!canNext}>
        <ArrowIcon />
      </IconButton>
    </div>
  );
}
```

- [ ] **Step 5: Visible disabled state in `src/components/ui/IconButton.tsx`**

Replace the doc comment and the second class string:

```tsx
/** 40px outlined circle. Disabled: dimmed and not clickable (carousel ends). */
```
```tsx
        "transition-[transform,opacity] duration-150 enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: errors only in `src/components/sections/Testimonials.tsx` and `Pricing.tsx` (they still use the old API). They're fixed in Task 7; commit Tasks 5 through 7 together at the end of Task 7.

---

### Task 7: Content, plus the paged Testimonials and Pricing sections

**Files:**
- Modify: `src/content/pricing.ts`, `src/content/testimonials.ts`
- Replace: `src/components/sections/Testimonials.tsx`, `src/components/sections/Pricing.tsx`

- [ ] **Step 1: `src/content/pricing.ts`**

Replace the last array entry (`{ title: "Mobile App Design", … }`) with these two entries:

```ts
  { title: "Mobile App", tag: "1-25 Pages", packageName: "Launch Package – Design Only", price: "$3050", features: designFeatures },
  {
    title: "Branding Design",
    tag: "25+ Pages",
    packageName: "Logo + Branding Guidelines",
    price: "$2050",
    features: [
      "2/3 logo concepts with refinements",
      "Social Media Kit (posts, stories, covers)",
      "Stationery Kit (letterhead, business cards)",
      "Comprehensive Brand Guidelines.",
      "Figma Style Guide",
      "Up to 5 revisions across full design.",
      "All source files (AI, PSD, PNG, etc.)",
    ],
  },
```

- [ ] **Step 2: `src/content/testimonials.ts`**

Append a 4th entry to the array (a placeholder for the user to replace):

```ts
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-1.png", alt: "Keefe Dashiell" } },
```

- [ ] **Step 3: Replace `src/components/sections/Testimonials.tsx`**

Two per page from lg. At xl the track overhangs 36px so cards are 336px at 1440 (x 660–1356). The left column is 400px at lg and 540px at xl. There's no edge-bleed.

```tsx
"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { TestimonialCard } from "@/components/patterns/TestimonialCard";
import { testimonials, testimonialsSection } from "@/content/testimonials";
import { usePagedCarousel } from "@/hooks/usePagedCarousel";

export function Testimonials() {
  const carousel = usePagedCarousel(testimonials.length);
  const controls = {
    onPrev: carousel.prev,
    onNext: carousel.next,
    onGoTo: carousel.goTo,
    canPrev: carousel.canPrev,
    canNext: carousel.canNext,
    page: carousel.page,
    pages: carousel.pages,
  };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="pt-20 lg:pt-[113px]">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-0 xl:grid-cols-[540px_1fr]">
          <div className="flex flex-col lg:justify-between">
            <SectionHeading titleId="testimonials-title" title={testimonialsSection.title} subtitle={testimonialsSection.subtitle} />
            <CarouselControls {...controls} className="hidden lg:flex" />
          </div>
          <CarouselTrack
            trackRef={carousel.trackRef}
            label="Testimonials"
            itemCount={testimonials.length}
            perPage={{ base: 1, lg: 2 }}
            className="xl:-mr-9"
          >
            {testimonials.map((testimonial, i) => (
              <div key={i} className="carousel-item">
                <TestimonialCard testimonial={testimonial} className="h-full" />
              </div>
            ))}
          </CarouselTrack>
          <CarouselControls {...controls} className="justify-center lg:hidden" />
        </div>
      </Container>
    </section>
  );
}
```

As in Task 3, keep any section spacing classes (like `pt-*`) from the current file if they differ.

- [ ] **Step 4: Replace `src/components/sections/Pricing.tsx`**

```tsx
"use client";

import { Container } from "@/components/ui/Container";
import { LineBreaks } from "@/components/ui/LineBreaks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { PricingCard } from "@/components/patterns/PricingCard";
import { pricingPlans, pricingSection } from "@/content/pricing";
import { usePagedCarousel } from "@/hooks/usePagedCarousel";

export function Pricing() {
  const carousel = usePagedCarousel(pricingPlans.length);
  const { before, emphasis, after } = pricingSection.subtitle;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="pt-20 lg:pt-[199px]">
      <Container>
        <SectionHeading
          titleId="pricing-title"
          align="center"
          title={pricingSection.title}
          subtitle={
            <>
              {before}
              <span className="font-medium">{emphasis}</span>
              <LineBreaks text={after} />
            </>
          }
          subtitleClassName="lg:text-[17px]"
        />
        <CarouselTrack
          trackRef={carousel.trackRef}
          label="Pricing plans"
          itemCount={pricingPlans.length}
          perPage={{ base: 1, lg: 3 }}
          className="mt-8 lg:mt-12"
        >
          {pricingPlans.map((plan, i) => (
            <div key={i} className="carousel-item">
              <PricingCard plan={plan} className="h-full" />
            </div>
          ))}
        </CarouselTrack>
        <CarouselControls
          onPrev={carousel.prev}
          onNext={carousel.next}
          onGoTo={carousel.goTo}
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          page={carousel.page}
          pages={carousel.pages}
          className="mt-6 justify-center"
        />
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: all pass (the carousel tests from Task 5 included).

- [ ] **Step 6: Commit Tasks 5–7**

```bash
git add -A src
git commit -m "feat: paged testimonials (2/page) and pricing (3/page) with page dots and disabled ends"
```

---

### Task 8: Project stack math (TDD)

**Files:**
- Create: `src/lib/project-stack.ts`, `src/lib/project-stack.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/project-stack.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { activeStackIndex, stackOffsets, stackScrollTarget } from "./project-stack";

// Four cards 600px tall with a 24px gap; the list starts at y=4000; cards stick at top 40px.
const offsets = stackOffsets([600, 600, 600, 600], 24);

describe("stackOffsets", () => {
  it("returns each card's natural offset within the list", () => {
    expect(offsets).toEqual([0, 624, 1248, 1872]);
  });
  it("handles an empty list", () => {
    expect(stackOffsets([], 24)).toEqual([]);
  });
});

describe("activeStackIndex", () => {
  it("is the first card before the list is reached", () => {
    expect(activeStackIndex(0, 4000, offsets, 40)).toBe(0);
  });
  it("is the last card whose sticky point has been reached", () => {
    expect(activeStackIndex(4000 + 624 - 40, 4000, offsets, 40)).toBe(1);
    expect(activeStackIndex(4000 + 1300, 4000, offsets, 40)).toBe(2);
    expect(activeStackIndex(99999, 4000, offsets, 40)).toBe(3);
  });
  it("tolerates a 1px rounding shortfall", () => {
    expect(activeStackIndex(4000 + 624 - 40 - 0.6, 4000, offsets, 40)).toBe(1);
  });
});

describe("stackScrollTarget", () => {
  it("scrolls so the card sits exactly at its sticky top", () => {
    expect(stackScrollTarget(4000, offsets, 2, 40)).toBe(4000 + 1248 - 40);
  });
  it("never scrolls above the page top", () => {
    expect(stackScrollTarget(10, offsets, 0, 40)).toBe(0);
  });
  it("treats an unknown index as the first card", () => {
    expect(stackScrollTarget(4000, offsets, 9, 40)).toBe(4000 - 40);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run src/lib/project-stack.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/project-stack.ts`**

```ts
/** Geometry for the sticky stacking project list. All values are in px, document coordinates. */

/** Natural offset of each card inside the list (cards stacked vertically with `gap`). */
export function stackOffsets(heights: number[], gap: number): number[] {
  const offsets: number[] = [];
  let y = 0;
  for (const h of heights) {
    offsets.push(y);
    y += h + gap;
  }
  return offsets;
}

/** Index of the card currently on top of the stack: the last one whose sticky point has been reached. */
export function activeStackIndex(scrollY: number, listTop: number, offsets: number[], stickyTop: number): number {
  let active = 0;
  offsets.forEach((offset, i) => {
    if (scrollY + stickyTop >= listTop + offset - 1) active = i;
  });
  return active;
}

/** Window scroll position that puts card `index` exactly at its sticky top (on top of the stack). */
export function stackScrollTarget(listTop: number, offsets: number[], index: number, stickyTop: number): number {
  return Math.max(0, listTop + (offsets[index] ?? 0) - stickyTop);
}
```

- [ ] **Step 4: Run tests and commit**

Run: `npx vitest run src/lib/project-stack.test.ts`
Expected: all pass.

```bash
git add src/lib/project-stack.ts src/lib/project-stack.test.ts
git commit -m "feat: project stack geometry helpers (tested)"
```

---

### Task 9: Stacking project cards with clickable tabs

**Files:**
- Modify: `src/app/globals.css`, `src/components/patterns/ProjectCard.tsx`, `src/components/sections/Projects.tsx`
- Create: `src/components/patterns/ProjectStack.tsx`

- [ ] **Step 1: Sticky rules at the end of `src/app/globals.css`**

Stacking only applies where a whole card fits the viewport.

```css
/* Our Projects: cards pin and stack; each tab stays visible (tabs are staggered 80px). */
@media (min-height: 760px) {
  .project-stack-item {
    position: sticky;
    top: 1rem;
  }
}
@media (width >= 64rem) and (min-height: 720px) {
  .project-stack-item {
    position: sticky;
    top: 2.5rem;
  }
}
```

- [ ] **Step 2: Tab becomes a button in `src/components/patterns/ProjectCard.tsx`**

Change the props type and signature:

```tsx
type ProjectCardProps = {
  project: Project;
  index: number;
  /** This card is on top of the stack (its tab gets the solid navy style). */
  active?: boolean;
  onSelect?: () => void;
  className?: string;
};

export function ProjectCard({ project, index, active = true, onSelect, className }: ProjectCardProps) {
```

Replace the tab row (the `<div className="flex justify-end" …>` block and its `<span>`) with the following. The transparent tab row must not swallow clicks meant for tabs of cards stacked beneath it.

```tsx
      <div className="pointer-events-none flex justify-end" style={{ paddingRight: index * 80 }}>
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Show project ${project.number}`}
          aria-current={active ? "true" : undefined}
          className={cn(
            "pointer-events-auto flex size-14 items-center justify-center rounded-tr-[4px] text-2xl transition-[color,background-color,transform] duration-200 active:scale-[0.98] [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]",
            "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white",
            active ? "bg-navy-gradient text-white" : "bg-placeholder text-navy hover:bg-navy hover:text-white",
          )}
        >
          {project.number}
        </button>
      </div>
```

- [ ] **Step 3: Create `src/components/patterns/ProjectStack.tsx`**

```tsx
"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { activeStackIndex, stackOffsets, stackScrollTarget } from "@/lib/project-stack";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import type { Project } from "@/types/content";

type ProjectStackProps = { projects: Project[]; className?: string };

/** Sticky stacking project list; tabs bring any card back to the top of the stack. */
export function ProjectStack({ projects, className }: ProjectStackProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const geometry = useCallback(() => {
    const list = listRef.current;
    if (!list || list.children.length === 0) return null;
    const items = Array.from(list.children) as HTMLElement[];
    const top = parseFloat(getComputedStyle(items[0]).top);
    return {
      listTop: list.getBoundingClientRect().top + window.scrollY,
      offsets: stackOffsets(
        items.map((el) => el.offsetHeight),
        parseFloat(getComputedStyle(list).rowGap) || 0,
      ),
      // "auto" when stacking is off (short viewports) -> scroll to the card's top.
      stickyTop: Number.isFinite(top) ? top : 0,
    };
  }, []);

  const update = useCallback(() => {
    const g = geometry();
    if (!g) return;
    const next = activeStackIndex(window.scrollY, g.listTop, g.offsets, g.stickyTop);
    setActive((current) => (current === next ? current : next));
  }, [geometry]);

  // Page scroll via Motion's useScroll (no raw scroll listeners); state changes only when the top card does.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const select = useCallback(
    (index: number) => {
      const g = geometry();
      if (!g) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: stackScrollTarget(g.listTop, g.offsets, index, g.stickyTop), behavior: reduce ? "auto" : "smooth" });
    },
    [geometry],
  );

  return (
    <ol ref={listRef} className={cn("flex flex-col gap-6", className)}>
      {projects.map((project, i) => (
        <li key={project.number} className="project-stack-item">
          <FadeIn>
            <ProjectCard project={project} index={i} active={i === active} onSelect={() => select(i)} />
          </FadeIn>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Replace `src/components/sections/Projects.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectStack } from "@/components/patterns/ProjectStack";
import { projects, projectsSection } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 lg:pt-[159px]">
      <Container>
        <SectionHeading
          titleId="projects-title"
          align="center"
          title={projectsSection.title}
          subtitle={projectsSection.subtitle}
          subtitleClassName="mt-[10px] lg:mt-[22px]"
        />
        <ProjectStack projects={projects} className="mt-[39px] lg:mt-[47px]" />
      </Container>
    </section>
  );
}
```

Keep the current classNames if they differ from those shown.

- [ ] **Step 5: Verify and commit**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: all pass.

```bash
git add -A src
git commit -m "feat: stacking project cards with clickable, highlighted tabs"
```

---

### Task 10: Behavior verification, visual check, docs

**Files:**
- Modify: `CLAUDE.md`, `docs/superpowers/specs/2026-09-29-motion-carousels-stacking-design.md`, `docs/superpowers/specs/2026-09-28-bower-landing-design.md`

- [ ] **Step 1: Behavior checks on a production build**

Run `npm run build`, then `npx next start -p 3330` in the background. Write a throwaway `./.verify.mjs` in the repo root (so `@playwright/test` resolves), run it, then delete it; don't commit it. It must check:
1. Load at 1440 **without** reduced motion, scroll to Services, and wait 2.5s. Every `h2 span[aria-hidden="true"]` in `#services` has computed opacity 1, and one sampled 100ms after scrolling had opacity < 1.
2. Hover the hero "Request a Quote" button. After 400ms the first letter span's transform has a negative Y translation.
3. At 1440, 1920 and 2560, check pricing:
   - Visible `#pricing .carousel-item` count within the track rect is 3.
   - Previous is disabled.
   - Clicking Next shows cards "Mobile App" and "Branding Design", and Next is then disabled.
   - The second dot has `aria-current="true"`.
4. The same at 1440 and 1920 for testimonials: 2 visible, 2 pages.
5. At 375, pricing shows 5 dots and testimonials 4. Clicking the last dot disables Next.
6. At 1440 × 900, click the "Show project 03" button. After 1.2s, the element at the viewport point (720, 300) is inside project card 03's article, and that button has `aria-current="true"` while "Show project 01" doesn't.

Print one PASS or FAIL line per check. Kill the server afterward. All checks must PASS; if one fails, fix it and re-run.

- [ ] **Step 2: Visual regression (reduced motion, so final states)**

Run: `npm run test:visual`. If `CLAUDE.md` is modified afterward and the diff is only the Next.js agent-rules block, run `git checkout -- CLAUDE.md`.
Expected: desktop height is 11246. Bands match the previous run within about 1 point, except the expected differences: pricing and testimonial content and controls, and the inactive tab colors in the projects band. Report the numbers.

- [ ] **Step 3: Update docs**

- `CLAUDE.md`:
  - In the Structure `motion/` line, replace `Reveal, Marquee, DraggableMarquee` with `MotionProvider, FadeIn, AnimatedText, RollingText, Marquee, DraggableMarquee`.
  - In the `patterns/` line, add `ProjectStack`.
  - Replace the Motion paragraph with: `Framer Motion (motion/react), trexalab.com-style: word-by-word text reveal (AnimatedText), spring fade-ups (FadeIn), letter-roll button hover (RollingText, CSS). Also the logo marquee, draggable auto-scrolling curved galleries, paged carousels (dots + disabled ends), and sticky stacking project cards with clickable tabs. All user-requested additions beyond the static design. Reduced motion shows final states immediately. The resting state must equal the design (exception: inactive project tabs are light blue).`
- In `docs/superpowers/specs/2026-09-29-motion-carousels-stacking-design.md`, in the Page dots bullet, replace the placement sentence with: `Placement: between the prev/next arrows (‹ • • ›) in every carousel, so section heights are unchanged.`
- In `docs/superpowers/specs/2026-09-28-bower-landing-design.md`, in the Motion section, add a line: `See 2026-09-29-motion-carousels-stacking-design.md for Framer Motion text/fade animations, paged carousels and stacking projects.`

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md docs
git commit -m "docs: record motion, paged carousels and project stacking"
```

---

## Self-review notes (plan author)

- **Spec coverage:**

  | Spec item | Task |
  |---|---|
  | Text reveal | 2, 3 |
  | Block fade-up | 2, 3 |
  | Hero stagger | 3 |
  | Button roll | 4 |
  | Reduced motion | 1, 2 (`useReducedMotion`, `MotionConfig`), 4 (global CSS) |
  | Carousels (math, hook, track, controls, dots, disabled) | 5, 6 |
  | Content | 7 |
  | Widths | 6 (CSS), 7 (grid/overhang) |
  | Stacking | 9 (CSS) |
  | Tabs (click, active, styles, a11y) | 8, 9 |
  | Verification | 10 |
  | Docs | 10 |
- **Types:** `usePagedCarousel` returns `{trackRef, page, pages, canPrev, canNext, prev, next, goTo}`, which Task 7 consumes via `CarouselControls` props (`onPrev, onNext, onGoTo, canPrev, canNext, page, pages`). `ProjectCard` gains `active`/`onSelect`, used by `ProjectStack`.
