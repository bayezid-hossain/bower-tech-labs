# Bower Tech Labs Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Bower Tech Labs landing page as a pixel-faithful, modular Next.js implementation of `assets/Final Design.png` (desktop 1440) and `assets/Frame 2147241977.png` (mobile 375).

**Architecture:** Next.js App Router, one page composed of thin section components. Sections read typed copy from `src/content/` and lay out reusable `patterns/`, which are built from content-agnostic `ui/` primitives. Design tokens live in the Tailwind v4 `@theme` block. Pixel-exact brand assets are cropped from the transparent 2× design export by a script. Empty image slots get AI-generated images. Fidelity is verified with Playwright screenshots diffed against the design PNGs.

**Tech Stack:** Next.js (latest, App Router, TypeScript), Tailwind CSS v4, `clsx` + `tailwind-merge`, Vitest (logic unit tests), Playwright (visual capture), Python 3 + Pillow (asset extraction, visual diff), Krea MCP (image generation).

**Spec:** `docs/superpowers/specs/2026-09-28-bower-landing-design.md`. **Rules:** `CLAUDE.md`. The design is law: no improvisation.

---

## Decisions made after the spec (binding)

1. **Mobile content = desktop content.** The mobile frame has Figma mistakes: 2 identical service cards, a "How We Works" heading above the projects, and "exceptionally" spelled correctly. Mobile uses the same content as desktop, with mobile layout and sizing. The mobile-only `#EEFAFF` background band on the Process section **is** kept.
2. **4th pricing card:** "Mobile App Design", tag "1-5 Pages", "Lunch Package- Design Only", "$1550", same 7 features as card 1.
3. **Tailwind v4:** tokens go in `src/app/globals.css` `@theme`, not in `tailwind.config.ts`. CLAUDE.md and the spec get updated in Task 1.
4. **Extracted-as-image elements** (exact pixels from the 2× export): nav/footer logo lockups, hero glass render, the whole Play Reel dial (tick ring, "Play"/"Reel" ghost text, video card), the giant footer wordmark, client logos, WhatsApp icon, testimonial avatars 1–2, and the Ssm Siam photo.
5. **Generated images:** 4 hero gallery panels, 4 service images, 4 project images, 4 recent-works panels, and testimonial avatar 3 (it is cut off in the design).
6. **Unknown links:** WhatsApp URL `https://wa.me/`, "Book a Direct call with Sales" → `#contact`, social links → `#`. All live in `src/content/site.ts` and `src/content/footer.ts` so they're easy to replace.
7. **Carousel arrows never dim.** The design shows both arrows fully enabled, so at the ends they become no-ops with `disabled` set and no visual change.

## Reference measurements (desktop 1x, from `Final Design.png`)

Use these during implementation and tuning. y values are page-absolute.

| Element | Measurement |
|---|---|
| Content column | x 120 → 1320 (1200 wide). Mobile gutters 20px |
| Nav | logo 120,30 (201×32); links 15px, span x 467–974 (centered on page), gap 20; CTA 1172–1320 × 24–68 (148×44, flat `#003853`) |
| Hero pill | 120–305 × 216–248, white, green dot 16px at x134, text 15px `#425761` |
| Hero H1 | 60px / 60px lh, semibold, ink; cap tops 297 & 357; line 2 width 614px |
| Hero sub | 17px / 24px, body; first cap 438; line 1 width 543px |
| Hero buttons | y 520–576. Quote 120–324 (204×56). WhatsApp 340–583 (243×56) |
| Hero glass | 839–1320 × 148–640 |
| Hero gallery | top edge 643 (edges) / 710 (center); bottom 1255 (edges) / 1190 (center); panels 536 wide inner + 4px white borders, 16px `#F4F7FB` gutter; gutter centers x 159.5, 719.5, 1279.5 |
| Client logos | y 1321–1353, logos 32px tall, 48px gaps, visible band x 215–1230 |
| About text | 40px / 48 lh; cap tops 1495, 1543, 1591; line widths 938, 1089, 994 |
| Play reel crop | 408–1020 × 1686–2138 |
| "What We Do, Full Stop" | 48px semibold, cap top 2304, width 441 |
| Services sub | 16px / 24, cap top 2376 |
| Service cards | x 120–710 / 730–1320, y 2466–2975 and 2995–3503; padding 16; image 558×364 r16; card r24; title cap 2876 (width of "UI/UX Design" = 154); sub cap 2915 |
| Start a Project | 628–812 × 3535–3591 |
| "Our Projects" | cap top 3760, width 246 |
| Project tab 01 | 1264–1320 × 3923–3979; tabs step 80px left per card (02 right edge 1240, 03 1160, 04 1080) |
| Project card 1 | 120–1320 × 3979–4530, p24; image 746–1296 × 4003–4506 r16; eyebrow cap 4005; title 34px lh 40 cap 4262 (line-1 width 370); body 15/24 cap 4357; button 144–321 × 4462–4506 |
| Project card 4 | card 5875–6427; text inset x 168; eyebrow "2025" cap ~5933; navy button |
| "How We Works" | cap 6617, width 300 |
| Step cards | x 210–708 / 732–1230, y 6778–7038 and 7063–7322; "STEP 01" cap 6807 `#1E66D6`; title cap 6876 ("Send Us the Idea" width 195); body 15/24 cap 6925 |
| "Our Recent Works" | cap 7532, width 363; gallery top edge 7647 |
| Testimonials | heading cap ~8382 (48px, 2 lines); cards x 660 w336 gap 24, y 8372–8712; avatar 56 at 684,8396; arrows 120–160 & 176–216 × 8672–8712 |
| Pricing | title cap 8921 width 697; cards x 120 w384 gap 24, y 9084–9480; chip 395–480 × 9107–9143; divider y 9167; arrows 672–712 & 728–768 × 9504–9544 |
| Contact | heading 48px lh 58 navy-ink, first cap ~9752; form card 660–1320 × 9744–10440 p32; fields in 2 cols 282 wide gap 32; button 692–1288 × 10291–10343; team photos 100×100 r20 at y 10136 (x 120 & 264) |
| Footer | logo 120,10621 (231×40); cols x 731 / 992 / 1172; heading cap 10625; links 16px pitch 36; pills y 10809–10853 (email 120–317, WA 333–533); divider y 10976; wordmark 133.5–1313 × 11038–11178; page end 11246 |

Colors (sampled): page `#F6FCFF`, page-alt (mobile process band) `#EEFAFF`, navy `#003853`, ink `#001B25`, body `#425761`, muted `#6B7FA3`, accent `#1E66D6`, placeholder `#C0DCEB`, gutter `#F4F7FB`, line `#E6EAEA`, hint `#7B8A91`, label `#0F1C3F`, link `#39537A`, whatsapp-text `#0C2756`, navy-ink `#003148`, role `#003D5B`, name `#03292C`, caption `#567072`, avatar-empty `#D9D9D9`, success `#4CAF50`, navy button gradient `#0C4468 → #003853 → #053D5C`, deep button gradient `#102B41 → #081E2B → #0A2131`.

## File map

```
scripts/extract-assets.py        crops brand assets from 2x export, writes placeholder images
scripts/fit-image.py             cover-crops a generated image to exact slot size
scripts/visual_diff.py           side-by-side + diff slices vs design PNGs
src/app/{layout.tsx,page.tsx,globals.css}
src/lib/cn.ts                    class merge helper
src/lib/carousel.ts (+ .test.ts) pure carousel state helper
src/lib/validation/contact.ts (+ .test.ts)
src/hooks/useCarousel.ts
src/types/content.ts
src/content/{site,navigation,hero,clients,about,services,projects,process,recent-works,testimonials,pricing,contact,footer}.ts
src/components/ui/{Button,IconButton,icons,Badge,Container,SectionHeading,LineBreaks,Card,Avatar,BulletList}.tsx
src/components/ui/form/{Field,Input,Select,Textarea}.tsx
src/components/motion/{Reveal,Marquee}.tsx
src/components/patterns/{LogoLockup,WhatsAppButton,CurvedGallery,PlayReel,ServiceCard,ProjectCard,StepCard,TestimonialCard,PricingCard,TeamMember,Carousel,ContactForm}.tsx
src/components/layout/{Navbar,Footer}.tsx
src/components/sections/{Hero,ClientLogos,About,Services,Projects,Process,RecentWorks,Testimonials,Pricing,Contact}.tsx
tests/visual/capture.spec.ts
playwright.config.ts, vitest.config.ts
public/brand/*, public/logos/*, public/images/**
```

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: the Next.js scaffold at the repo root (via a temp dir, because the root isn't empty)
- Create: `vitest.config.ts`, `playwright.config.ts`
- Modify: `package.json` scripts, `.gitignore`, `CLAUDE.md`, `docs/superpowers/specs/2026-09-28-bower-landing-design.md`

- [ ] **Step 1: Generate the scaffold in a temp dir**

Run from the repo root (Git Bash):
```bash
npx create-next-app@latest bower-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes
```
Expected: `bower-tmp/` with `src/app/page.tsx`, `package.json`, `postcss.config.mjs`, and `src/app/globals.css` containing `@import "tailwindcss";`.

- [ ] **Step 2: Move the scaffold into the root and remove boilerplate**

```bash
cp -r bower-tmp/. . && rm -rf bower-tmp
rm -f public/*.svg src/app/favicon.ico
```
Keep the root `CLAUDE.md`. If create-next-app wrote its own `CLAUDE.md` or `AGENTS.md`, check that ours wasn't overwritten (`git diff CLAUDE.md` must be empty) and delete `AGENTS.md` if it was created.

- [ ] **Step 3: Install dependencies**

```bash
npm i clsx tailwind-merge
npm i -D vitest @playwright/test
npx playwright install chromium
```

- [ ] **Step 4: Add configs**

`vitest.config.ts`:
```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
```

`playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  outputDir: "tests/visual/.results",
  timeout: 120_000,
  use: { baseURL: "http://localhost:3000", deviceScaleFactor: 1 },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:visual": "playwright test && python scripts/visual_diff.py",
"assets": "python scripts/extract-assets.py"
```

Append to `.gitignore`:
```
# visual tests
/tests/visual/output/
/tests/visual/.results/
/playwright-report/
```

- [ ] **Step 5: Update docs for Tailwind v4**

In `CLAUDE.md`, replace
`- No ad-hoc hex values or magic numbers in JSX. Colors, radii, spacing, and type scale go in \`tailwind.config.ts\` tokens.`
with
`- No ad-hoc hex values in JSX. Colors, shadows, gradients and animations are tokens in the Tailwind v4 \`@theme\` block in \`src/app/globals.css\`.`

Under `## Stack` in `CLAUDE.md`, add the line `- Python 3 + Pillow for \`scripts/\` (asset extraction, visual diff)`. Add `npm run test          # vitest unit tests` and `npm run assets        # re-extract brand assets from the design` to the Commands block.

In the spec, replace `- Design tokens live in \`tailwind.config.ts\` (\`theme.extend\`), never as ad-hoc hex values in JSX.` with `- Design tokens live in the Tailwind v4 \`@theme\` block in \`src/app/globals.css\`, never as ad-hoc hex values in JSX.`

- [ ] **Step 6: Verify the scaffold builds**

Run: `npm run build`
Expected: `✓ Compiled successfully` and the route `/` listed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind v4, vitest, playwright"
```

---

### Task 2: Extract brand assets and write image placeholders

**Files:**
- Create: `scripts/extract-assets.py`, `scripts/fit-image.py`
- Output: `public/brand/*`, `public/logos/*`, `public/images/**`

- [ ] **Step 1: Write the extraction script**

`scripts/extract-assets.py`:
```python
"""Crop pixel-exact brand assets from the transparent 2x design export.

Boxes are in 1x design coordinates (Final Design.png); the source is the 2x export.
Also writes solid placeholder images for every AI-generated slot that doesn't exist yet.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC_2X = ROOT / "assets" / "Frame 2147241938.png"
PUBLIC = ROOT / "public"
PLACEHOLDER = (0xC0, 0xDC, 0xEB)

# dest -> (x0, y0, x1, y1, circle)
CROPS = {
    "brand/logo-lockup.png": (120, 30, 321, 62, False),
    "brand/logo-lockup-lg.png": (120, 10621, 351, 10661, False),
    "brand/hero-glass.png": (839, 148, 1320, 640, False),
    "brand/play-reel.png": (408, 1686, 1020, 2138, False),
    "brand/wordmark.png": (133, 11038, 1313, 11179, False),
    "brand/whatsapp.png": (360, 536, 384, 560, True),
    "logos/logoipsum-shield.png": (353, 1321, 567, 1353, False),
    "logos/logoipsum-diamond.png": (615, 1321, 777, 1353, False),
    "images/team/ssm-siam.png": (264, 10136, 364, 10236, False),
    "images/testimonials/avatar-1.png": (684, 8396, 740, 8452, True),
    "images/testimonials/avatar-2.png": (1044, 8396, 1100, 8452, True),
}

# AI-generated slots: dest -> (width, height) at 2x
GENERATED = {
    **{f"images/hero/gallery-{i}.jpg": (1072, 1224) for i in range(1, 5)},
    **{f"images/recent-works/work-{i}.jpg": (1072, 1224) for i in range(1, 5)},
    "images/services/ui-ux-design.jpg": (1116, 728),
    "images/services/logo-branding.jpg": (1116, 728),
    "images/services/web-development.jpg": (1116, 728),
    "images/services/ui-ux-redesign.jpg": (1116, 728),
    **{f"images/projects/project-{i}.jpg": (1100, 1006) for i in range(1, 5)},
    "images/testimonials/avatar-3.jpg": (112, 112),
}


def crop(dest: str, box: tuple) -> None:
    x0, y0, x1, y1, circle = box
    img = Image.open(SRC_2X).convert("RGBA").crop((x0 * 2, y0 * 2, x1 * 2, y1 * 2))
    if circle:
        mask = Image.new("L", img.size, 0)
        ImageDraw.Draw(mask).ellipse((0, 0, img.width - 1, img.height - 1), fill=255)
        alpha = Image.composite(img.getchannel("A"), mask, mask)
        img.putalpha(alpha)
    out = PUBLIC / dest
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    print(f"crop  {dest} {img.size}")


def placeholder(dest: str, size: tuple) -> None:
    out = PUBLIC / dest
    if out.exists():
        print(f"keep  {dest}")
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", size, PLACEHOLDER).save(out, quality=90)
    print(f"stub  {dest} {size}")


def main() -> None:
    for dest, box in CROPS.items():
        crop(dest, box)
    for dest, size in GENERATED.items():
        placeholder(dest, size)
    mark = Image.open(ROOT / "assets" / "Group 1413375668.png")
    mark.save(PUBLIC / "brand" / "logo-mark.png")
    print("copy  brand/logo-mark.png", mark.size)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Write the image fitting script (used in Task 16)**

`scripts/fit-image.py`:
```python
"""Cover-crop an image to an exact size and save as JPEG.

Usage: python scripts/fit-image.py <src> <dest> <width> <height>
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps


def main() -> None:
    src, dest, width, height = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    img = Image.open(src).convert("RGB")
    fitted = ImageOps.fit(img, (width, height), method=Image.LANCZOS, centering=(0.5, 0.5))
    Path(dest).parent.mkdir(parents=True, exist_ok=True)
    fitted.save(dest, quality=88, optimize=True)
    print(f"{dest} {fitted.size}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Run the extraction**

Run: `npm run assets`
Expected: 11 `crop` lines, 17 `stub` lines, 1 `copy` line.

- [ ] **Step 4: Eyeball the crops**

Open (Read tool) `public/brand/play-reel.png`, `public/brand/hero-glass.png`, `public/brand/wordmark.png`, `public/logos/logoipsum-shield.png`, `public/images/testimonials/avatar-1.png`, and `public/images/team/ssm-siam.png`. Each must show only the intended element with a transparent background (or the photo), with no neighboring text clipped in. If a crop is off, adjust its box in `CROPS` by measuring on `assets/Final Design.png` and re-run.

- [ ] **Step 5: Commit**

```bash
git add scripts public
git commit -m "feat: extract brand assets from design and stub generated images"
```

---

### Task 3: Visual verification harness

**Files:**
- Create: `tests/visual/capture.spec.ts`, `scripts/visual_diff.py`

- [ ] **Step 1: Write the capture test**

`tests/visual/capture.spec.ts`:
```ts
import { test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
] as const;

for (const vp of viewports) {
  test(`capture ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    // Scroll through the page so lazy images load, then return to top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `tests/visual/output/${vp.name}.png`, fullPage: true });
  });
}
```

- [ ] **Step 2: Write the diff script**

`scripts/visual_diff.py`:
```python
"""Compare Playwright screenshots against the Figma exports.

Writes side-by-side slices (design | build | diff) and prints a per-band mismatch report.
"""
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tests" / "visual" / "output"
PAIRS = {
    "desktop": ROOT / "assets" / "Final Design.png",
    "mobile": ROOT / "assets" / "Frame 2147241977.png",
}
BAND = 700


def compare(name: str, design_path: Path) -> None:
    shot_path = OUT / f"{name}.png"
    if not shot_path.exists():
        print(f"[skip] {shot_path} missing")
        return
    design = Image.open(design_path).convert("RGB")
    shot = Image.open(shot_path).convert("RGB")
    print(f"\n== {name}: design {design.size}, build {shot.size} (height diff {shot.height - design.height:+d}px)")

    width, height = design.width, max(design.height, shot.height)
    d = Image.new("RGB", (width, height), "white")
    d.paste(design, (0, 0))
    s = Image.new("RGB", (width, height), "white")
    s.paste(shot.crop((0, 0, width, shot.height)), (0, 0))
    diff = ImageChops.difference(d, s).convert("L").point(lambda v: 255 if v > 40 else 0)

    slices = OUT / f"{name}-slices"
    slices.mkdir(parents=True, exist_ok=True)
    for i, y in enumerate(range(0, height, BAND)):
        box = (0, y, width, min(y + BAND, height))
        band = diff.crop(box)
        pct = 100 * band.histogram()[255] / (band.width * band.height)
        print(f"  band {i:02d} y={y:5d}-{box[3]:5d}: {pct:5.1f}% differing")
        red = Image.merge("RGB", (band, Image.new("L", band.size, 0), Image.new("L", band.size, 0)))
        row = Image.new("RGB", (width * 3, box[3] - y), "white")
        row.paste(d.crop(box), (0, 0))
        row.paste(s.crop(box), (width, 0))
        row.paste(red, (width * 2, 0))
        row.save(slices / f"{i:02d}.png")


if __name__ == "__main__":
    for name, path in PAIRS.items():
        compare(name, path)
```

- [ ] **Step 3: Run the harness against the scaffold**

Run: `npm run test:visual`
Expected: 2 Playwright tests pass. The diff prints desktop and mobile band reports with high mismatch everywhere (nothing is built yet), and `tests/visual/output/desktop-slices/00.png` exists.

- [ ] **Step 4: Commit**

```bash
git add tests/visual/capture.spec.ts scripts/visual_diff.py
git commit -m "test: add playwright capture and design diff harness"
```

---

### Task 4: Design tokens, font, root layout, `cn`

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/lib/cn.ts`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  --color-page: #f6fcff;
  --color-page-alt: #eefaff;
  --color-surface: #ffffff;
  --color-navy: #003853;
  --color-navy-ink: #003148;
  --color-ink: #001b25;
  --color-body: #425761;
  --color-muted: #6b7fa3;
  --color-accent: #1e66d6;
  --color-placeholder: #c0dceb;
  --color-gutter: #f4f7fb;
  --color-line: #e6eaea;
  --color-hint: #7b8a91;
  --color-label: #0f1c3f;
  --color-link: #39537a;
  --color-whatsapp-text: #0c2756;
  --color-role: #003d5b;
  --color-name: #03292c;
  --color-caption: #567072;
  --color-avatar-empty: #d9d9d9;
  --color-success: #4caf50;

  --shadow-button: inset 0 1px 3px rgb(255 255 255 / 0.08), 0 4px 10px rgb(0 56 83 / 0.28);
  --shadow-soft: 0 4px 16px rgb(0 56 83 / 0.06);

  --animate-marquee: marquee 40s linear infinite;

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
}

@utility bg-navy-gradient {
  background-image: linear-gradient(180deg, #0c4468 0%, #033b58 30%, #003853 60%, #053d5c 100%);
}

@utility bg-deep-gradient {
  background-image: linear-gradient(180deg, #102b41 0%, #0b2232 30%, #081e2b 60%, #0a2131 100%);
}

@utility scrollbar-none {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

html {
  scroll-behavior: smooth;
}

body {
  overflow-x: clip;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Bower Tech Labs — Product Design That Ships in Days, Not Months.",
  description:
    "SaaS dashboards, marketing sites, and digital products — designed, built, and ready to test while agencies are still scheduling their third discovery call.",
  icons: { icon: "/brand/logo-mark.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-page font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Stub `src/app/page.tsx` so the build passes**

```tsx
export default function Home() {
  return <main />;
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Commit**

```bash
git add src/app src/lib/cn.ts
git commit -m "feat: add design tokens, Inter font, root layout"
```

---

### Task 5: Content types and content files

**Files:**
- Create: `src/types/content.ts`, all files in `src/content/`

- [ ] **Step 1: Create `src/types/content.ts`**

```ts
export type Link = { label: string; href: string };

export type ImageAsset = { src: string; alt: string; width?: number; height?: number };

export type Service = { title: string; subtitle: string; image: ImageAsset };

export type Project = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: Link;
  image: ImageAsset;
  variant: "default" | "featured";
};

export type ProcessStep = { step: string; title: string; description: string };

export type Testimonial = { name: string; role: string; quote: string; avatar: ImageAsset };

export type PricingPlan = {
  title: string;
  tag: string;
  packageName: string;
  price: string;
  features: string[];
};

export type TeamMemberInfo = { name: string; role: string; photo?: ImageAsset };

export type FooterColumn = { title: string; links: Link[] };

export type SelectOption = { label: string; value: string };

export type ContactFieldName =
  | "fullName"
  | "company"
  | "email"
  | "whatsapp"
  | "service"
  | "budget"
  | "details";

export type ContactField = {
  name: ContactFieldName;
  label: string;
  placeholder: string;
  kind: "input" | "select" | "textarea";
  type?: "text" | "email" | "tel";
  required?: boolean;
  optional?: boolean;
  options?: SelectOption[];
  fullWidth?: boolean;
};
```

- [ ] **Step 2: Create `src/content/site.ts`**

```ts
export const site = {
  name: "Bower Tech Labs",
  email: "bowertechlabs@gmail.com",
  whatsappUrl: "https://wa.me/",
  whatsappLabel: "Quick Chat- WhatsApp",
  bookCallUrl: "#contact",
  primaryCta: { label: "Become a Client", href: "#contact" },
} as const;
```

- [ ] **Step 3: Create `src/content/navigation.ts`**

```ts
import type { Link } from "@/types/content";

export const navigation: Link[] = [
  { label: "Services", href: "#services" },
  { label: "About us", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact us", href: "#contact" },
];
```

- [ ] **Step 4: Create `src/content/hero.ts`**

`\n` marks a desktop-only line break (see `LineBreaks`, Task 6).
```ts
import type { ImageAsset } from "@/types/content";

export const hero = {
  status: "Available for Work",
  title: "Product Design That\nShips in Days, Not Months.",
  description:
    "SaaS dashboards, marketing sites, and digital products — designed, built,\nand ready to test while agencies are still scheduling their third discovery call.",
  primaryCta: { label: "Request a Quote", href: "#contact" },
  gallery: [
    { src: "/images/hero/gallery-1.jpg", alt: "SaaS analytics dashboard design" },
    { src: "/images/hero/gallery-2.jpg", alt: "Mobile banking app screens" },
    { src: "/images/hero/gallery-3.jpg", alt: "Brand identity stationery" },
    { src: "/images/hero/gallery-4.jpg", alt: "Marketing website design" },
  ] satisfies ImageAsset[],
};
```

- [ ] **Step 5: Create `src/content/clients.ts`**

```ts
import type { ImageAsset } from "@/types/content";

const shield = { src: "/logos/logoipsum-shield.png", alt: "Logoipsum", width: 214, height: 32 };
const diamond = { src: "/logos/logoipsum-diamond.png", alt: "Logoipsum", width: 162, height: 32 };

export const clientLogos: ImageAsset[] = [shield, diamond, shield, diamond, shield, diamond];
```

- [ ] **Step 6: Create `src/content/about.ts`**

```ts
export const about = {
  lead: "Bower Tech Labs is a lean design studio that builds digital products for",
  rest: "one outcome: conversion. We're small enough to skip the bureaucracy and senior enough to out-deliver teams 10x our size.",
  reelAlt: "Play Reel — Bower Tech Labs showreel, 00:48",
};
```

- [ ] **Step 7: Create `src/content/services.ts`**

```ts
import type { Service } from "@/types/content";

export const servicesSection = {
  title: "What We Do, Full Stop",
  subtitle:
    "Strategy, design, and build — one team, one invoice, zero handoffs.\nFrom wireframe to live URL, you talk to the same people who actually do the work",
  cta: { label: "Start a Project", href: "#contact" },
};

export const services: Service[] = [
  {
    title: "UI/UX Design",
    subtitle: "Website, Mobile App, Dashboard",
    image: { src: "/images/services/ui-ux-design.jpg", alt: "UI/UX design work" },
  },
  {
    title: "Logo & Branding",
    subtitle: "(Website+ Mobile App+ Dashboard",
    image: { src: "/images/services/logo-branding.jpg", alt: "Logo and branding work" },
  },
  {
    title: "Web Development",
    subtitle: "Web Flow, Framer, +more",
    image: { src: "/images/services/web-development.jpg", alt: "Web development work" },
  },
  {
    title: "UI/UX Redesign",
    subtitle: "Website, Mobile App, Dashboard",
    image: { src: "/images/services/ui-ux-redesign.jpg", alt: "UI/UX redesign work" },
  },
];
```

- [ ] **Step 8: Create `src/content/projects.ts`**

Copy is verbatim, including the double space in "into  high".
```ts
import type { Project } from "@/types/content";

const title = "Meticulous Digital Visual Craftsmanship for Global Brands.";
const description =
  "Bower Tech Labs crafts premium UI/UX and web designs that turn visions into  high-performing digital experiences—brand strategy, development, and beyond.";
const cta = { label: "See Project Details", href: "#contact" };

export const projectsSection = {
  title: "Our Projects",
  subtitle:
    "Built by two award-winning creative developers, our vault gives you access to the techniques,\ncomponents, code, and tools behind our projects. Build, tweak, and make them your own.",
};

export const projects: Project[] = [
  { number: "01", eyebrow: "About Bower Tech", title, description, cta, variant: "default", image: { src: "/images/projects/project-1.jpg", alt: "Fintech web app case study" } },
  { number: "02", eyebrow: "About Bower Tech", title, description, cta, variant: "default", image: { src: "/images/projects/project-2.jpg", alt: "E-commerce mobile app case study" } },
  { number: "03", eyebrow: "About Bower Tech", title, description, cta, variant: "default", image: { src: "/images/projects/project-3.jpg", alt: "Healthcare dashboard case study" } },
  { number: "04", eyebrow: "2025", title, description, cta, variant: "featured", image: { src: "/images/projects/project-4.jpg", alt: "Travel booking website case study" } },
];
```

- [ ] **Step 9: Create `src/content/process.ts`**

```ts
import type { ProcessStep } from "@/types/content";

export const processSection = {
  title: "How We Works",
  subtitle: "No agency theater, no 6-week onboarding.\nFour steps from brief to launch",
};

export const processSteps: ProcessStep[] = [
  {
    step: "STEP 01",
    title: "Send Us the Idea",
    description:
      "Tell us what you're building — new site, product, dashboard, rebrand, whatever stage it's at. Two lines or two paragraphs, doesn't matter. We just need the shape of it.",
  },
  {
    step: "STEP 02",
    title: "We Ask the Right Questions",
    description:
      "We come back with sharp, specific questions — not a 40-item intake form, so we understand your goals, users, and timeline well enough to scope it right the first time.",
  },
  {
    step: "STEP 03",
    title: "You Get a Real Quote",
    description:
      ' Fixed price, fixed timeline, fixed deliverables. No "it depends," no hidden hours, no surprise invoices later. You\'ll know exactly what you\'re paying for before you say yes',
  },
  {
    step: "STEP 04",
    title: "We Build, You Watch",
    description:
      "We Build, You Watch: Kickoff call or straight into asynchronous work—your choice. You get weekly progress updates, full Figma access, and a refined feedback loop to ensure we hit the mark fast. You're never left wondering what's happening",
  },
];
```

- [ ] **Step 10: Create `src/content/recent-works.ts`**

```ts
import type { ImageAsset } from "@/types/content";

export const recentWorksSection = {
  title: "Our Recent Works",
  subtitle: "End-to-end digital craftsmanship — from brand strategy to\npixel-perfect shipped products.",
  gallery: [
    { src: "/images/recent-works/work-1.jpg", alt: "AI productivity app landing page" },
    { src: "/images/recent-works/work-2.jpg", alt: "Crypto wallet mobile app" },
    { src: "/images/recent-works/work-3.jpg", alt: "Real estate website" },
    { src: "/images/recent-works/work-4.jpg", alt: "Fitness tracking dashboard" },
  ] satisfies ImageAsset[],
};
```

- [ ] **Step 11: Create `src/content/testimonials.ts`**

```ts
import type { Testimonial } from "@/types/content";

const quote =
  "Bower Tech Labs crafts premium UI/UX and web designs that turn visions into high-performing digital experiences—brand strategy, development, and beyond.";

export const testimonialsSection = {
  title: "What we do\nexpectionally",
  subtitle: "End-to-end digital craftsmanship — from brand strategy to\npixel-perfect shipped products.",
};

export const testimonials: Testimonial[] = [
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-1.png", alt: "Keefe Dashiell" } },
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-2.png", alt: "Keefe Dashiell" } },
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-3.jpg", alt: "Keefe Dashiell" } },
];
```

- [ ] **Step 12: Create `src/content/pricing.ts`**

```ts
import type { PricingPlan } from "@/types/content";

const designFeatures = [
  "UX Research",
  "High-Fidelity Design",
  "Responsive Design",
  "Figma Prototype",
  "Design System",
  "Developer Handoff",
  "Unlimited Revision",
];

export const pricingSection = {
  title: "Straightforward Pricing, No Games.",
  subtitle: {
    before: "Not sure which tier fits? ",
    emphasis: "Book a free 15-minute call.",
    after: "\nWe'll scope it together and send a fixed quote by tomorrow.",
  },
};

export const pricingPlans: PricingPlan[] = [
  { title: "Website Design", tag: "1-5 Pages", packageName: "Lunch Package- Design Only", price: "$1550", features: designFeatures },
  {
    title: "Development",
    tag: "1-5 Pages",
    packageName: "Lunch Package",
    price: "$1250",
    features: [
      "UX Research",
      "Fully Responsive & Mobile-First Code",
      "CMS Integration (Blog, Products, Dashboard)",
      "SEO Basics + Lightning-Fast Performance",
      "Smooth Animation & Micro-Interations",
      "Clean Code + Full Developer Handoff",
      "5 Revisions+ 30 Days Free Support",
    ],
  },
  { title: "Website Design", tag: "1-10 Pages", packageName: "Lunch Package- Design Only", price: "$3550", features: designFeatures },
  { title: "Mobile App Design", tag: "1-5 Pages", packageName: "Lunch Package- Design Only", price: "$1550", features: designFeatures },
];
```

- [ ] **Step 13: Create `src/content/footer.ts`**

```ts
import type { FooterColumn } from "@/types/content";

export const serviceLinks = [
  "UI/UX Design",
  "Logo & Branding",
  "Web flow Development",
  "Framer Development",
  "WordPress Development",
  "Web/App/Dashboard Redesign",
  "Other Services",
];

export const footer = {
  description:
    "Trexa Lab crafts premium UI/UX and web designs that turn visions into high-performing digital experiences—brand strategy, development, and beyond.",
  emailLabel: "Email us :",
  copyright: "© 2026, Bower Tech Labs Agency | All Rights Reserved.",
  wordmarkAlt: "Bower Tech Labs",
};

export const footerColumns: FooterColumn[] = [
  { title: "Socials", links: serviceLinks.map((label) => ({ label, href: "#services" })) },
  {
    title: "Quick Links",
    links: [
      { label: "Services", href: "#services" },
      { label: "About us", href: "#about" },
      { label: "Process", href: "#process" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact us", href: "#contact" },
    ],
  },
  {
    title: "Socials",
    links: ["Dribble", "Behance", "Instagram", "LinkedIn", "Facebook", "X (twitter)"].map((label) => ({ label, href: "#" })),
  },
];
```

- [ ] **Step 14: Create `src/content/contact.ts`**

```ts
import type { ContactField, TeamMemberInfo } from "@/types/content";
import { serviceLinks } from "./footer";

export const contactSection = {
  title: "Tell Us\nAbout Your Project",
  subtitle:
    "We're a small, senior design team — UI/UX, branding, and product design, no junior handoffs. Tell us what you're building.",
  bullets: [
    "Response time: 12 hours (business hours)",
    "We're happy to sign a NDA (if needed).",
    "We're open for White Label - B2B contract.",
  ],
};

export const team: TeamMemberInfo[] = [
  { name: "Shoron Hasan", role: "Founder & CEO" },
  { name: "Ssm Siam", role: "UI/UX Designer", photo: { src: "/images/team/ssm-siam.png", alt: "Ssm Siam" } },
];

export const contactForm = {
  submitLabel: "Request a Quote",
  altPrompt: "Not Interested to submit the form?",
  altCta: "Book a Direct call with Sales",
  successMessage: "Thanks! We'll get back to you within 12 hours.",
  fields: [
    { name: "fullName", label: "Full Name", placeholder: "Jane Smith", kind: "input", type: "text", required: true },
    { name: "company", label: "Company Name", placeholder: "Eg. Goggle", kind: "input", type: "text", optional: true },
    { name: "email", label: "Email Address", placeholder: "you@example.com", kind: "input", type: "email", required: true },
    { name: "whatsapp", label: "What’s App Number", placeholder: "+8801753292444", kind: "input", type: "tel", optional: true },
    {
      name: "service",
      label: "Service Required",
      placeholder: "Select a Service",
      kind: "select",
      required: true,
      options: serviceLinks.map((label) => ({ label, value: label })),
    },
    {
      name: "budget",
      label: "Project Budget",
      placeholder: "Select a Range",
      kind: "select",
      required: true,
      options: [
        { label: "Under $1,000", value: "<1000" },
        { label: "$1,000 – $3,000", value: "1000-3000" },
        { label: "$3,000 – $5,000", value: "3000-5000" },
        { label: "$5,000+", value: "5000+" },
      ],
    },
    { name: "details", label: "Project Details", placeholder: "Tell us more about your idea...", kind: "textarea", required: true, fullWidth: true },
  ] satisfies ContactField[],
};
```

- [ ] **Step 15: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 16: Commit**

```bash
git add src/types src/content
git commit -m "feat: add typed content for all sections (verbatim copy)"
```

---

### Task 6: UI primitives

**Files:**
- Create: `src/components/ui/{LineBreaks,Container,Button,icons,IconButton,Badge,SectionHeading,Card,Avatar,BulletList}.tsx`

- [ ] **Step 1: `LineBreaks.tsx`**

```tsx
import { Fragment } from "react";

type LineBreaksProps = { text: string; breakOn?: "lg" | "always" };

/** Renders "\n" as a line break. By default breaks only at lg+; on mobile the text wraps naturally. */
export function LineBreaks({ text, breakOn = "lg" }: LineBreaksProps) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              {" "}
              <br className={breakOn === "lg" ? "hidden lg:inline" : undefined} />
            </>
          )}
          {line}
        </Fragment>
      ))}
    </>
  );
}
```

- [ ] **Step 2: `Container.tsx`**

```tsx
import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

/** 1200px content column (120px gutters at 1440), 20px gutters on mobile. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-[1240px] px-5", className)} {...props} />;
}
```

- [ ] **Step 3: `Button.tsx`**

```tsx
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-navy-gradient text-white shadow-button",
  flat: "bg-navy text-white",
  dark: "bg-deep-gradient text-white shadow-button",
  light: "bg-surface text-whatsapp-text shadow-soft",
  outline: "border border-line bg-surface text-ink",
} as const;

const sizes = {
  sm: "h-11 px-5 text-[15px]",
  md: "h-[52px] px-8 text-[17px]",
  lg: "h-14 px-10 text-[17px]",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};
type LinkButtonProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href">;
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps>;
export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.02em]",
    "transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button(props: ButtonProps) {
  const { variant, size, icon, className, children, ...rest } = props;
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (typeof props.href === "string") {
    const { href, ...anchorProps } = rest as Omit<LinkButtonProps, keyof BaseProps>;
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<NativeButtonProps, keyof BaseProps>;
  return (
    <button className={classes} {...buttonProps} type={buttonProps.type ?? "button"}>
      {content}
    </button>
  );
}
```

- [ ] **Step 4: `icons.tsx` and `IconButton.tsx`**

`icons.tsx`:
```tsx
import { cn } from "@/lib/cn";

export function ArrowIcon({ direction = "right", className }: { direction?: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("size-4", direction === "left" && "rotate-180", className)}
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

`IconButton.tsx`:
```tsx
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & { label: string; children: ReactNode };

/** 40px outlined circle. Disabled state has no visual change (design shows arrows always enabled). */
export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-ink text-ink",
        "transition-transform duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-default",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 5: `Badge.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = { variant?: "status" | "tag"; children: ReactNode; className?: string };

export function Badge({ variant = "status", children, className }: BadgeProps) {
  if (variant === "tag") {
    return (
      <span className={cn("inline-flex h-9 shrink-0 items-center rounded-[4px] bg-navy px-3 text-[13px] text-white", className)}>
        {children}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex h-8 items-center gap-2 rounded-full bg-surface pr-3.5 pl-3.5 text-[15px] text-body", className)}>
      <span aria-hidden="true" className="size-4 rounded-full bg-success" />
      {children}
    </span>
  );
}
```

- [ ] **Step 6: `SectionHeading.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LineBreaks } from "./LineBreaks";

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
  as: Tag = "h2",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Tag
        id={titleId}
        className={cn("text-[32px] font-semibold leading-[1.15] tracking-[-0.04em] text-ink lg:text-[48px]", titleClassName)}
      >
        <LineBreaks text={title} breakOn={titleBreakOn} />
      </Tag>
      {subtitle && (
        <p className={cn("mt-3 text-[15px] leading-6 text-body lg:mt-5 lg:text-base", subtitleClassName)}>
          {typeof subtitle === "string" ? <LineBreaks text={subtitle} /> : subtitle}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 7: `Card.tsx`, `Avatar.tsx`, `BulletList.tsx`**

`Card.tsx`:
```tsx
import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return <Tag className={cn("rounded-3xl bg-surface", className)} {...props} />;
}
```

`Avatar.tsx`:
```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = { src: string; alt: string; size: number; className?: string };

export function Avatar({ src, alt, size, className }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
```

`BulletList.tsx`:
```tsx
import { cn } from "@/lib/cn";

type BulletListProps = { items: string[]; className?: string; itemClassName?: string };

/** Dot bullets: dot 10px from the left edge, text 24px from the left edge. */
export function BulletList({ items, className, itemClassName }: BulletListProps) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            "flex items-baseline gap-2.5 pl-2.5",
            "before:size-1 before:shrink-0 before:-translate-y-[0.3em] before:rounded-full before:bg-current before:content-['']",
            itemClassName,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui
git commit -m "feat: add ui primitives (button, badge, heading, card, container...)"
```

---

### Task 7: Contact validation (TDD) and form primitives

**Files:**
- Create: `src/lib/validation/contact.ts`, `src/lib/validation/contact.test.ts`
- Create: `src/components/ui/form/{Field,Input,Select,Textarea}.tsx`

- [ ] **Step 1: Write the failing test**

`src/lib/validation/contact.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { emptyContactValues, validateContact, type ContactValues } from "./contact";

const valid: ContactValues = {
  fullName: "Jane Smith",
  company: "",
  email: "jane@example.com",
  whatsapp: "",
  service: "UI/UX Design",
  budget: "1000-3000",
  details: "A dashboard redesign.",
};

describe("validateContact", () => {
  it("returns no errors for a valid submission without optional fields", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags every required field when empty", () => {
    expect(Object.keys(validateContact(emptyContactValues)).sort()).toEqual(
      ["budget", "details", "email", "fullName", "service"].sort(),
    );
  });

  it("treats whitespace-only text as empty", () => {
    const errors = validateContact({ ...valid, fullName: "   ", details: "\n " });
    expect(errors.fullName).toBeDefined();
    expect(errors.details).toBeDefined();
  });

  it("rejects malformed email", () => {
    expect(validateContact({ ...valid, email: "jane@" }).email).toBe("Please enter a valid email address.");
  });

  it("never requires company or whatsapp", () => {
    const errors = validateContact({ ...valid, company: "", whatsapp: "" });
    expect(errors.company).toBeUndefined();
    expect(errors.whatsapp).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test`
Expected: FAIL, "Failed to resolve import ./contact".

- [ ] **Step 3: Implement `src/lib/validation/contact.ts`**

```ts
import type { ContactFieldName } from "@/types/content";

export type ContactValues = Record<ContactFieldName, string>;
export type ContactErrors = Partial<Record<ContactFieldName, string>>;

export const emptyContactValues: ContactValues = {
  fullName: "",
  company: "",
  email: "",
  whatsapp: "",
  service: "",
  budget: "",
  details: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.service) errors.service = "Please select a service.";
  if (!values.budget) errors.budget = "Please select a budget range.";
  if (!values.details.trim()) errors.details = "Please tell us about your project.";
  return errors;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: 5 passed.

- [ ] **Step 5: Form primitives**

`src/components/ui/form/Field.tsx`:
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ id, label, required, optional, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="text-[17px] font-medium leading-6 tracking-[-0.02em] text-label">
        {label}
        {required && "*"}
        {optional && <span className="ml-1 text-[11px] font-normal tracking-normal text-body">(Optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[13px] leading-4 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

`src/components/ui/form/Input.tsx`:
```tsx
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export const fieldControlClasses =
  "mt-3 h-[46px] w-full border-b border-line bg-transparent text-base text-ink outline-none placeholder:text-hint transition-colors focus:border-navy aria-[invalid=true]:border-red-500";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(fieldControlClasses, className)} {...props} />;
}
```

`src/components/ui/form/Select.tsx`:
```tsx
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import type { SelectOption } from "@/types/content";
import { fieldControlClasses } from "./Input";

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  placeholder: string;
  options: SelectOption[];
  value: string;
};

export function Select({ placeholder, options, value, className, ...props }: SelectProps) {
  return (
    <select
      value={value}
      className={cn(fieldControlClasses, "cursor-pointer appearance-none", !value && "text-hint", className)}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-ink">
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

`src/components/ui/form/Textarea.tsx`:
```tsx
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { fieldControlClasses } from "./Input";

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(fieldControlClasses, "h-[110px] resize-none pt-2", className)} {...props} />;
}
```

- [ ] **Step 6: Verify and commit**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, 5 tests pass.
```bash
git add src/lib/validation src/components/ui/form
git commit -m "feat: add contact validation (tested) and form primitives"
```

---

### Task 8: Carousel logic (TDD), motion components

**Files:**
- Create: `src/lib/carousel.ts`, `src/lib/carousel.test.ts`, `src/hooks/useCarousel.ts`
- Create: `src/components/motion/{Reveal,Marquee}.tsx`

- [ ] **Step 1: Write the failing test**

`src/lib/carousel.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { getCarouselState } from "./carousel";

describe("getCarouselState", () => {
  it("at the start: cannot go back, can go forward", () => {
    expect(getCarouselState(0, 1500, 800)).toEqual({ canPrev: false, canNext: true });
  });

  it("in the middle: both directions", () => {
    expect(getCarouselState(300, 1500, 800)).toEqual({ canPrev: true, canNext: true });
  });

  it("at the end: can go back, cannot go forward", () => {
    expect(getCarouselState(700, 1500, 800)).toEqual({ canPrev: true, canNext: false });
  });

  it("tolerates sub-pixel rounding at both ends", () => {
    expect(getCarouselState(1.4, 1500, 800).canPrev).toBe(false);
    expect(getCarouselState(698.6, 1500, 800).canNext).toBe(false);
  });

  it("content that fits: no navigation", () => {
    expect(getCarouselState(0, 800, 800)).toEqual({ canPrev: false, canNext: false });
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test`
Expected: FAIL, "Failed to resolve import ./carousel".

- [ ] **Step 3: Implement `src/lib/carousel.ts`**

```ts
export type CarouselState = { canPrev: boolean; canNext: boolean };

export function getCarouselState(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  tolerance = 2,
): CarouselState {
  return {
    canPrev: scrollLeft > tolerance,
    canNext: scrollLeft + clientWidth < scrollWidth - tolerance,
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: 10 passed (5 validation + 5 carousel).

- [ ] **Step 5: `src/hooks/useCarousel.ts`**

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCarouselState, type CarouselState } from "@/lib/carousel";

/** Scroll-snap carousel controller. Steps by one item (first child width + track column gap). */
export function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CarouselState>({ canPrev: false, canNext: true });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (el) setState(getCarouselState(el.scrollLeft, el.scrollWidth, el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  }, []);

  return {
    trackRef,
    canPrev: state.canPrev,
    canNext: state.canNext,
    prev: () => step(-1),
    next: () => step(1),
  };
}
```

- [ ] **Step 6: `src/components/motion/Reveal.tsx`**

The resting (revealed) state is identical to the design. Under reduced motion it is visible immediately via `motion-reduce:` classes.
```tsx
"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = { as?: ElementType; delay?: number; className?: string; children: ReactNode };

export function Reveal({ as: Tag = "div", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 7: `src/components/motion/Marquee.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = { children: ReactNode; className?: string; trackClassName?: string; duration?: number };

/** Infinite horizontal scroll with faded edges. Content is duplicated once; pauses on hover. */
export function Marquee({ children, className, trackClassName = "gap-6 pr-6 lg:gap-12 lg:pr-12", duration = 40 }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]" style={{ animationDuration: `${duration}s` }}>
        <div className={cn("flex shrink-0 items-center", trackClassName)}>{children}</div>
        <div aria-hidden="true" className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify and commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: clean, 10 tests pass.
```bash
git add src/lib/carousel.ts src/lib/carousel.test.ts src/hooks src/components/motion
git commit -m "feat: add carousel hook (tested), reveal and marquee motion"
```

---

### Task 9: Brand and media patterns

**Files:**
- Create: `src/components/patterns/{LogoLockup,WhatsAppButton,CurvedGallery,PlayReel}.tsx`

- [ ] **Step 1: `LogoLockup.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  nav: { src: "/brand/logo-lockup.png", width: 201, height: 32, className: "h-6 w-auto lg:h-8" },
  footer: { src: "/brand/logo-lockup-lg.png", width: 231, height: 40, className: "h-10 w-auto" },
} as const;

type LogoLockupProps = { variant?: keyof typeof variants; className?: string };

export function LogoLockup({ variant = "nav", className }: LogoLockupProps) {
  const v = variants[variant];
  return (
    <Link href="/" aria-label="Bower Tech Labs home" className={cn("inline-flex shrink-0", className)}>
      <Image src={v.src} alt="Bower Tech Labs" width={v.width} height={v.height} priority={variant === "nav"} className={v.className} />
    </Link>
  );
}
```

- [ ] **Step 2: `WhatsAppButton.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type WhatsAppButtonProps = { href: string; label: string; size?: "sm" | "lg"; className?: string };

/** White pill with WhatsApp icon. lg = hero (243×56), sm = footer (200×44). */
export function WhatsAppButton({ href, label, size = "lg", className }: WhatsAppButtonProps) {
  const icon = size === "lg" ? 24 : 20;
  return (
    <Button
      href={href}
      variant="light"
      size={size}
      className={cn(size === "lg" ? "px-5" : "px-5 text-[14px]", className)}
      icon={<Image src="/brand/whatsapp.png" alt="" width={icon} height={icon} />}
    >
      {label}
    </Button>
  );
}
```

- [ ] **Step 3: `CurvedGallery.tsx`**

Geometry: 4 panels centered in the viewport. Desktop panel = 536 inner + 4px white borders each side, 16px gutter (pitch 560). Mobile = 300 inner + 3px borders, 7px gutter. Parabolic overlays in the page color carve the concave top and bottom (desktop depth 67/65px, mobile 9/8px).
```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/types/content";

type CurvedGalleryProps = { images: ImageAsset[]; priority?: boolean; className?: string };

export function CurvedGallery({ images, priority, className }: CurvedGalleryProps) {
  return (
    <div className={cn("relative h-[276px] w-full overflow-hidden bg-gutter lg:h-[612px]", className)}>
      <div className="absolute inset-0 flex justify-center gap-[7px] lg:gap-4">
        {images.map((image, i) => (
          <div
            key={i}
            className="relative h-full w-[306px] shrink-0 border-x-[3px] border-white bg-placeholder lg:w-[544px] lg:border-x-4"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 536px, 300px"
              priority={priority && i < 2}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[9px] w-full fill-page lg:h-[67px]"
      >
        <path d="M0 0H1440Q720 200 0 0Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[8px] w-full fill-page lg:h-[65px]"
      >
        <path d="M0 100H1440Q720 -100 0 100Z" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 4: `PlayReel.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";

type PlayReelProps = { alt: string; className?: string };

/** Tick-ring dial with ghost "Play"/"Reel" and the reel card — pixel-exact asset from the design. */
export function PlayReel({ alt, className }: PlayReelProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[612px]", className)}>
      <Image src="/brand/play-reel.png" alt={alt} width={612} height={452} className="h-auto w-full" />
    </div>
  );
}
```

- [ ] **Step 5: Verify and commit**

Run: `npx tsc --noEmit && npm run lint`
```bash
git add src/components/patterns
git commit -m "feat: add logo, whatsapp button, curved gallery, play reel patterns"
```

---

### Task 10: Card patterns

**Files:**
- Create: `src/components/patterns/{ServiceCard,ProjectCard,StepCard,TestimonialCard,PricingCard,TeamMember}.tsx`

- [ ] **Step 1: `ServiceCard.tsx`**

Desktop: card 590×509, p16, image 558×364 r16, title 26px, subtitle 18px light.
```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { Service } from "@/types/content";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <Card as="article" className={cn("p-4 transition-transform duration-150 hover:-translate-y-0.5", className)}>
      <div className="relative aspect-[558/364] overflow-hidden rounded-2xl bg-placeholder">
        <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 1024px) 558px, 100vw" className="object-cover" />
      </div>
      <div className="px-4 pt-5 pb-6 lg:px-5 lg:pt-6 lg:pb-10">
        <h3 className="text-xl font-semibold leading-7 tracking-[-0.04em] text-ink lg:text-[26px] lg:leading-8">{service.title}</h3>
        <p className="mt-1 text-[15px] font-light leading-6 text-body lg:mt-2 lg:text-lg">{service.subtitle}</p>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: `ProjectCard.tsx`**

Tab shifts left 80px per index on both breakpoints. The first card has a square top-right corner under the tab. The featured variant (card 04) insets the desktop text another 24px and uses the navy button. Mobile order is eyebrow → title → body → image → full-width dark button.
```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types/content";

type ProjectCardProps = { project: Project; index: number; className?: string };

export function ProjectCard({ project, index, className }: ProjectCardProps) {
  const featured = project.variant === "featured";
  return (
    <article className={cn("flex flex-col", className)}>
      <div className="flex justify-end" style={{ paddingRight: index * 80 }}>
        <span className="flex size-14 items-center justify-center rounded-tr-[4px] bg-navy-gradient text-2xl text-white [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]">
          {project.number}
        </span>
      </div>
      <div className={cn("flex flex-col gap-6 rounded-3xl bg-surface p-5 lg:flex-row lg:p-6", index === 0 && "rounded-tr-none")}>
        <div className={cn("flex flex-col lg:w-[578px] lg:shrink-0 lg:justify-between", featured && "lg:p-6")}>
          <p className="text-sm leading-6 text-muted lg:text-base">{project.eyebrow}</p>
          <div className="mt-3 lg:mt-0">
            <h3
              className={cn(
                "text-2xl leading-7 tracking-[-0.03em] text-ink lg:text-[34px] lg:leading-10",
                featured ? "lg:max-w-[400px]" : "lg:max-w-[520px]",
              )}
            >
              {project.title}
            </h3>
            <p className="mt-3 max-w-[440px] text-[15px] leading-6 text-body lg:mt-4">{project.description}</p>
            <Button
              href={project.cta.href}
              variant={featured ? "primary" : "dark"}
              size="sm"
              className="mt-10 hidden px-6 lg:inline-flex"
            >
              {project.cta.label}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[296/270] overflow-hidden rounded-2xl bg-placeholder lg:aspect-auto lg:h-[503px] lg:w-[550px] lg:shrink-0">
          <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 1024px) 550px, 100vw" className="object-cover" />
        </div>
        <Button href={project.cta.href} variant="dark" size="sm" className="w-full lg:hidden">
          {project.cta.label}
        </Button>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: `StepCard.tsx`**

```tsx
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { ProcessStep } from "@/types/content";

export function StepCard({ step, className }: { step: ProcessStep; className?: string }) {
  return (
    <Card as="article" className={cn("p-5 pb-10 lg:p-6", className)}>
      <p className="text-[15px] leading-6 text-accent">{step.step}</p>
      <h3 className="mt-6 text-xl font-semibold leading-7 tracking-[-0.04em] text-ink lg:mt-12 lg:text-[26px] lg:leading-8">
        {step.title}
      </h3>
      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-6 text-body">{step.description}</p>
    </Card>
  );
}
```
(`whitespace-pre-wrap` keeps the design's leading space on STEP 03.)

- [ ] **Step 4: `TestimonialCard.tsx`**

Desktop: avatar on top, name/role below. Mobile: avatar left, name/role right.
```tsx
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { Testimonial } from "@/types/content";

export function TestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <Card as="figure" className={cn("flex flex-col p-5 lg:p-6", className)}>
      <figcaption className="flex items-center gap-4 lg:flex-col lg:items-start">
        <Avatar src={testimonial.avatar.src} alt={testimonial.avatar.alt} size={56} />
        <div>
          <p className="text-[17px] font-semibold leading-6 tracking-[-0.02em] text-name">{testimonial.name}</p>
          <p className="mt-0.5 text-xs leading-4 text-caption lg:mt-1">{testimonial.role}</p>
        </div>
      </figcaption>
      <blockquote className="mt-8 text-base leading-6 text-label lg:mt-10 lg:text-lg lg:leading-7">{testimonial.quote}</blockquote>
    </Card>
  );
}
```

- [ ] **Step 5: `PricingCard.tsx`**

```tsx
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { BulletList } from "@/components/ui/BulletList";
import { Card } from "@/components/ui/Card";
import type { PricingPlan } from "@/types/content";

export function PricingCard({ plan, className }: { plan: PricingPlan; className?: string }) {
  return (
    <Card as="article" className={cn("p-5 lg:p-6", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-6">
        <h3 className="text-xl font-semibold tracking-[-0.04em] text-ink lg:text-2xl">{plan.title}</h3>
        <Badge variant="tag">{plan.tag}</Badge>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-base font-medium tracking-[-0.02em] text-ink lg:text-lg">{plan.packageName}</p>
        <p className="text-[26px] font-semibold leading-8 tracking-[-0.04em] text-ink">{plan.price}</p>
      </div>
      <BulletList items={plan.features} className="mt-4" itemClassName="text-base leading-8 text-body" />
    </Card>
  );
}
```

- [ ] **Step 6: `TeamMember.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { TeamMemberInfo } from "@/types/content";

export function TeamMember({ member, className }: { member: TeamMemberInfo; className?: string }) {
  return (
    <div className={cn("w-[100px]", className)}>
      <div className="relative size-20 overflow-hidden rounded-2xl bg-avatar-empty lg:size-[100px] lg:rounded-[20px]">
        {member.photo && <Image src={member.photo.src} alt={member.photo.alt} fill sizes="100px" className="object-cover" />}
      </div>
      <p className="mt-4 text-lg leading-6 tracking-[-0.02em] text-black">{member.name}</p>
      <p className="mt-1 text-[13px] leading-4 text-role">{member.role}</p>
    </div>
  );
}
```

- [ ] **Step 7: Verify and commit**

Run: `npx tsc --noEmit && npm run lint`
```bash
git add src/components/patterns
git commit -m "feat: add service, project, step, testimonial, pricing, team cards"
```

---

### Task 11: Carousel and ContactForm patterns

**Files:**
- Create: `src/components/patterns/Carousel.tsx`, `src/components/patterns/ContactForm.tsx`

- [ ] **Step 1: `Carousel.tsx`**

```tsx
"use client";

import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowIcon } from "@/components/ui/icons";

type CarouselTrackProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  label: string;
  className?: string;
  children: ReactNode;
};

export function CarouselTrack({ trackRef, label, className, children }: CarouselTrackProps) {
  return (
    <div
      ref={trackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("flex snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-none", className)}
    >
      {children}
    </div>
  );
}

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
};

export function CarouselControls({ onPrev, onNext, canPrev, canNext, className }: CarouselControlsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <IconButton label="Previous" onClick={onPrev} disabled={!canPrev}>
        <ArrowIcon direction="left" />
      </IconButton>
      <IconButton label="Next" onClick={onNext} disabled={!canNext}>
        <ArrowIcon />
      </IconButton>
    </div>
  );
}
```

- [ ] **Step 2: `ContactForm.tsx`**

```tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { emptyContactValues, validateContact, type ContactErrors, type ContactValues } from "@/lib/validation/contact";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/form/Field";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { Textarea } from "@/components/ui/form/Textarea";
import type { ContactField, ContactFieldName } from "@/types/content";

type ContactFormProps = {
  fields: ContactField[];
  submitLabel: string;
  altPrompt: string;
  altCta: string;
  altHref: string;
  successMessage: string;
  className?: string;
};

type ControlEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export function ContactForm({ fields, submitLabel, altPrompt, altCta, altHref, successMessage, className }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: ContactFieldName) => (event: ControlEvent) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setSubmitted(false);
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setValues(emptyContactValues);
    }
  };

  return (
    <Card className={cn("p-5 lg:p-8", className)}>
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
          {fields.map((field) => {
            const id = `contact-${field.name}`;
            const error = errors[field.name];
            const common = {
              id,
              name: field.name,
              value: values[field.name],
              onChange: handleChange(field.name),
              required: field.required,
              "aria-invalid": error ? true : undefined,
              "aria-describedby": error ? `${id}-error` : undefined,
            };
            return (
              <Field
                key={field.name}
                id={id}
                label={field.label}
                required={field.required}
                optional={field.optional}
                error={error}
                className={cn(field.fullWidth && "lg:col-span-2")}
              >
                {field.kind === "select" ? (
                  <Select {...common} placeholder={field.placeholder} options={field.options ?? []} />
                ) : field.kind === "textarea" ? (
                  <Textarea {...common} placeholder={field.placeholder} />
                ) : (
                  <Input {...common} type={field.type ?? "text"} placeholder={field.placeholder} />
                )}
              </Field>
            );
          })}
        </div>
        <Button type="submit" size="md" className="mt-10 w-full">
          {submitLabel}
        </Button>
        {submitted && (
          <p role="status" className="mt-4 text-center text-[15px] text-navy">
            {successMessage}
          </p>
        )}
      </form>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 lg:flex-row">
        <p className="text-[15px] text-link">{altPrompt}</p>
        <Button href={altHref} variant="outline" className="h-[42px] px-5 text-base font-normal">
          {altCta}
        </Button>
      </div>
    </Card>
  );
}
```
If lint flags the unused `_removed` binding, replace that line with:
```ts
if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
```

- [ ] **Step 3: Verify and commit**

Run: `npx tsc --noEmit && npm run lint`
```bash
git add src/components/patterns
git commit -m "feat: add carousel and contact form patterns"
```

---

### Task 12: Navbar and Footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: `Navbar.tsx`**

The link group is centered on the page (x 467–974), independent of logo and button widths. Mobile shows only logo + CTA.
```tsx
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoLockup } from "@/components/patterns/LogoLockup";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";

export function Navbar() {
  return (
    <header className="relative z-10">
      <Container className="relative flex items-center justify-between py-6">
        <LogoLockup />
        <nav aria-label="Primary" className="hidden lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2">
          <ul className="flex items-center gap-5">
            {navigation.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-[15px] tracking-[-0.02em] text-body transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          href={site.primaryCta.href}
          variant="flat"
          size="sm"
          className="h-9 px-3.5 text-[13px] lg:h-11 lg:px-5 lg:text-[15px]"
        >
          {site.primaryCta.label}
        </Button>
      </Container>
    </header>
  );
}
```

- [ ] **Step 2: `Footer.tsx`**

Desktop columns start at x 731 / 992 / 1172 (grid `611px 261px 180px 1fr`). Mobile: the services column spans full width, then Quick Links and Socials side by side, then the copyright.
```tsx
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoLockup } from "@/components/patterns/LogoLockup";
import { WhatsAppButton } from "@/components/patterns/WhatsAppButton";
import { footer, footerColumns } from "@/content/footer";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="pt-20 pb-10 lg:pt-[181px] lg:pb-[68px]">
      <Container>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-[611px_261px_180px_1fr] lg:gap-0">
          <div className="col-span-2 lg:col-span-1">
            <LogoLockup variant="footer" />
            <p className="mt-6 max-w-[400px] text-base leading-6 text-body">{footer.description}</p>
            <p className="mt-6 text-[15px] font-medium tracking-[-0.02em] text-whatsapp-text">{footer.emailLabel}</p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:gap-4">
              <Button href={`mailto:${site.email}`} size="sm" className="w-full px-5 text-[14px] lg:w-auto">
                {site.email}
              </Button>
              <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} size="sm" className="w-full lg:w-auto" />
            </div>
            <p className="mt-12 hidden text-base text-ink lg:block">{footer.copyright}</p>
          </div>
          {footerColumns.map((column, i) => (
            <nav key={i} aria-label={column.title} className={cn(i === 0 && "col-span-2 lg:col-span-1")}>
              <h2 className="text-xl font-medium tracking-[-0.02em] text-ink">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-base leading-6 text-body transition-colors hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 text-center text-[15px] text-ink lg:hidden">{footer.copyright}</p>
        <div className="mt-6 border-t border-line lg:mt-[55px]" />
        <Image
          src="/brand/wordmark.png"
          alt={footer.wordmarkAlt}
          width={1180}
          height={141}
          className="mt-8 h-auto w-full lg:mt-[62px] lg:ml-[13px] lg:w-[1180px]"
        />
      </Container>
    </footer>
  );
}
```

- [ ] **Step 3: Verify and commit**

Run: `npx tsc --noEmit && npm run lint`
```bash
git add src/components/layout
git commit -m "feat: add navbar and footer"
```

---

### Task 13: Sections: Hero, ClientLogos, About, Services

**Files:**
- Create: `src/components/sections/{Hero,ClientLogos,About,Services}.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: `Hero.tsx`**

```tsx
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LineBreaks } from "@/components/ui/LineBreaks";
import { Reveal } from "@/components/motion/Reveal";
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
          priority
          className="pointer-events-none absolute top-14 right-5 hidden lg:block"
        />
        <Reveal className="relative max-w-[640px]">
          <Badge>{hero.status}</Badge>
          <h1
            id="hero-title"
            className="mt-6 text-[36px] font-semibold leading-10 tracking-[-0.045em] text-ink lg:mt-10 lg:text-[60px] lg:leading-[60px]"
          >
            <LineBreaks text={hero.title} />
          </h1>
          <p className="mt-5 text-[15px] leading-5 text-body lg:mt-6 lg:text-[17px] lg:leading-6">
            <LineBreaks text={hero.description} />
          </p>
          <div className="mt-8 flex flex-col gap-3 lg:mt-10 lg:flex-row lg:gap-4">
            <Button href={hero.primaryCta.href} size="lg" className="h-12 w-full lg:h-14 lg:w-auto">
              {hero.primaryCta.label}
            </Button>
            <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} className="h-12 w-full lg:h-14 lg:w-auto" />
          </div>
        </Reveal>
      </Container>
      <CurvedGallery images={hero.gallery} priority className="mt-[54px] lg:mt-[67px]" />
    </section>
  );
}
```

- [ ] **Step 2: `ClientLogos.tsx`**

```tsx
import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { clientLogos } from "@/content/clients";

export function ClientLogos() {
  return (
    <section aria-label="Clients" className="pt-12 lg:pt-[66px]">
      <Marquee className="mx-auto max-w-[1010px]">
        {clientLogos.map((logo, i) => (
          <Image
            key={i}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-[18px] w-auto lg:h-8"
          />
        ))}
      </Marquee>
    </section>
  );
}
```

- [ ] **Step 3: `About.tsx`**

The design has a double space between "for" and "one"; it is rendered as a non-breaking space plus a space.
```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PlayReel } from "@/components/patterns/PlayReel";
import { about } from "@/content/about";

export function About() {
  return (
    <section id="about" aria-label="About" className="pt-20 lg:pt-[132px]">
      <Container>
        <Reveal>
          <p className="mx-auto max-w-[1100px] text-center text-[26px] leading-8 tracking-[-0.04em] lg:text-[40px] lg:leading-[48px]">
            <span className="font-semibold text-ink">{about.lead}</span>
            {"  "}
            <span className="font-light text-body">{about.rest}</span>
          </p>
        </Reveal>
        <Reveal className="mt-10 lg:mt-[57px]">
          <PlayReel alt={about.reelAlt} />
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: `Services.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/patterns/ServiceCard";
import { services, servicesSection } from "@/content/services";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="pt-20 lg:pt-[156px]">
      <Container>
        <Reveal>
          <SectionHeading titleId="services-title" title={servicesSection.title} subtitle={servicesSection.subtitle} />
        </Reveal>
        <ul className="mt-8 grid gap-5 lg:mt-12 lg:grid-cols-2">
          {services.map((service, i) => (
            <li key={service.title}>
              <Reveal delay={(i % 2) * 100} className="h-full">
                <ServiceCard service={service} className="h-full" />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Button href={servicesSection.cta.href} size="lg" className="h-12 w-full lg:h-14 lg:w-auto">
            {servicesSection.cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Wire into `src/app/page.tsx`**

```tsx
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClientLogos />
        <About />
        <Services />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Visual check**

Run: `npm run test:visual`
Then open `tests/visual/output/desktop-slices/00.png` through `03.png` (design | build | diff). Nav, hero, gallery, logos, about, play reel and services should line up with the design within a few px. Placeholder blue panels are expected. Note gross misalignments for Task 17; don't tune yet.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections src/app/page.tsx
git commit -m "feat: add hero, client logos, about, services sections"
```

---

### Task 14: Sections: Projects, Process, RecentWorks

**Files:**
- Create: `src/components/sections/{Projects,Process,RecentWorks}.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: `Projects.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import { projects, projectsSection } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 lg:pt-[159px]">
      <Container>
        <Reveal>
          <SectionHeading titleId="projects-title" align="center" title={projectsSection.title} subtitle={projectsSection.subtitle} />
        </Reveal>
        <ol className="mt-8 flex flex-col gap-6 lg:mt-12">
          {projects.map((project, i) => (
            <li key={project.number}>
              <Reveal>
                <ProjectCard project={project} index={i} />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: `Process.tsx`**

The `#EEFAFF` band is mobile only (see Decisions).
```tsx
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StepCard } from "@/components/patterns/StepCard";
import { processSection, processSteps } from "@/content/process";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="mt-20 bg-page-alt py-20 lg:mt-0 lg:bg-transparent lg:pt-[181px] lg:pb-0"
    >
      <Container>
        <Reveal>
          <SectionHeading titleId="process-title" align="center" title={processSection.title} subtitle={processSection.subtitle} />
        </Reveal>
        <ol className="mx-auto mt-8 grid max-w-[1020px] gap-5 lg:mt-11 lg:grid-cols-2 lg:gap-6">
          {processSteps.map((step, i) => (
            <li key={step.step}>
              <Reveal delay={(i % 2) * 100} className="h-full">
                <StepCard step={step} className="h-full" />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: `RecentWorks.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CurvedGallery } from "@/components/patterns/CurvedGallery";
import { recentWorksSection } from "@/content/recent-works";

export function RecentWorks() {
  return (
    <section aria-labelledby="recent-works-title" className="pt-20 lg:pt-[200px]">
      <Container>
        <Reveal>
          <SectionHeading
            titleId="recent-works-title"
            align="center"
            title={recentWorksSection.title}
            subtitle={recentWorksSection.subtitle}
          />
        </Reveal>
      </Container>
      <CurvedGallery images={recentWorksSection.gallery} className="mt-12 lg:mt-0" />
    </section>
  );
}
```

- [ ] **Step 4: Add to `page.tsx`** after `<Services />`:

```tsx
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { RecentWorks } from "@/components/sections/RecentWorks";
// ...
        <Services />
        <Projects />
        <Process />
        <RecentWorks />
```

- [ ] **Step 5: Visual check and commit**

Run: `npm run test:visual`, then review slices 04–11 (desktop). Watch the tab stagger (01 → 04 stepping 80px left) and the card-01 square corner.
```bash
git add src/components/sections src/app/page.tsx
git commit -m "feat: add projects, process, recent works sections"
```

---

### Task 15: Sections: Testimonials, Pricing, Contact

**Files:**
- Create: `src/components/sections/{Testimonials,Pricing,Contact}.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: `Testimonials.tsx`**

At lg the grid bleeds to the right viewport edge (`mr-[calc(50%-50vw)]`), so cards run off-screen as in the design.
```tsx
"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { TestimonialCard } from "@/components/patterns/TestimonialCard";
import { testimonials, testimonialsSection } from "@/content/testimonials";
import { useCarousel } from "@/hooks/useCarousel";

export function Testimonials() {
  const { trackRef, prev, next, canPrev, canNext } = useCarousel();
  const controls = { onPrev: prev, onNext: next, canPrev, canNext };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="pt-20 lg:pt-[116px]">
      <Container>
        <div className="grid gap-8 lg:mr-[calc(50%-50vw)] lg:grid-cols-[540px_1fr] lg:gap-0">
          <div className="flex flex-col lg:justify-between">
            <Reveal>
              <SectionHeading
                titleId="testimonials-title"
                title={testimonialsSection.title}
                subtitle={testimonialsSection.subtitle}
                subtitleClassName="lg:mt-6 lg:text-lg"
              />
            </Reveal>
            <CarouselControls {...controls} className="hidden lg:flex" />
          </div>
          <CarouselTrack trackRef={trackRef} label="Testimonials">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="w-full shrink-0 snap-start lg:w-[336px]">
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

- [ ] **Step 2: `Pricing.tsx`**

```tsx
"use client";

import { Container } from "@/components/ui/Container";
import { LineBreaks } from "@/components/ui/LineBreaks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { PricingCard } from "@/components/patterns/PricingCard";
import { pricingPlans, pricingSection } from "@/content/pricing";
import { useCarousel } from "@/hooks/useCarousel";

export function Pricing() {
  const { trackRef, prev, next, canPrev, canNext } = useCarousel();
  const { before, emphasis, after } = pricingSection.subtitle;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="pt-20 lg:pt-[198px]">
      <Container>
        <Reveal>
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
        </Reveal>
        <div className="mt-8 lg:mt-12 lg:mr-[calc(50%-50vw)]">
          <CarouselTrack trackRef={trackRef} label="Pricing plans">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="w-full shrink-0 snap-start lg:w-[384px]">
                <PricingCard plan={plan} className="h-full" />
              </div>
            ))}
          </CarouselTrack>
        </div>
        <CarouselControls onPrev={prev} onNext={next} canPrev={canPrev} canNext={canNext} className="mt-6 justify-center" />
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: `Contact.tsx`**

```tsx
import { BulletList } from "@/components/ui/BulletList";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/patterns/ContactForm";
import { TeamMember } from "@/components/patterns/TeamMember";
import { contactForm, contactSection, team } from "@/content/contact";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-20 lg:pt-[200px]">
      <Container className="grid gap-10 lg:grid-cols-[540px_1fr] lg:gap-0">
        <Reveal>
          <SectionHeading
            titleId="contact-title"
            title={contactSection.title}
            titleBreakOn="always"
            subtitle={contactSection.subtitle}
            titleClassName="text-navy-ink lg:leading-[58px]"
            subtitleClassName="max-w-[440px] text-base lg:mt-7 lg:text-lg"
          />
          <BulletList items={contactSection.bullets} className="mt-6 gap-3 lg:mt-10" itemClassName="text-[15px] leading-6 text-body" />
          <div className="mt-10 flex gap-11 lg:mt-[60px]">
            {team.map((member) => (
              <TeamMember key={member.name} member={member} />
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <ContactForm
            fields={contactForm.fields}
            submitLabel={contactForm.submitLabel}
            altPrompt={contactForm.altPrompt}
            altCta={contactForm.altCta}
            altHref={site.bookCallUrl}
            successMessage={contactForm.successMessage}
          />
        </Reveal>
      </Container>
    </section>
  );
}
```
(`titleBreakOn="always"`: "Tell Us / About Your Project" breaks on mobile too.)

- [ ] **Step 4: Final `page.tsx`**

```tsx
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { RecentWorks } from "@/components/sections/RecentWorks";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClientLogos />
        <About />
        <Services />
        <Projects />
        <Process />
        <RecentWorks />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify, visual check, commit**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: all pass.
Run: `npm run test:visual`. The desktop build height should be within ~100px of 11246.
```bash
git add src/components src/app/page.tsx
git commit -m "feat: add testimonials, pricing, contact sections; compose page"
```

---

### Task 16: Generate images for empty slots (Krea)

**Files:**
- Replace: the 17 stub images listed in `GENERATED` in `scripts/extract-assets.py`

- [ ] **Step 1: Load the Krea tools**

Use ToolSearch `select:mcp__claude_ai_krea__generate_image,mcp__claude_ai_krea__get_job,mcp__claude_ai_krea__get_prompting_guide`, then read the prompting guide once. If the Krea connector is unavailable or needs authorization, stop and tell the user. The stub placeholders are already design-correct (`#C0DCEB`).

- [ ] **Step 2: Generate each image**

Shared style suffix for every prompt except the avatar: `premium product design showcase, soft light-blue and white palette with deep navy #003853 accents, clean studio lighting, minimal, high-end Dribbble shot, no readable text, no watermark`.

| Output file | Size (fit-image) | Subject prompt |
|---|---|---|
| `public/images/hero/gallery-1.jpg` | 1072 1224 | SaaS analytics dashboard UI on a floating laptop, portrait crop |
| `public/images/hero/gallery-2.jpg` | 1072 1224 | mobile banking app screens on three floating phones, portrait crop |
| `public/images/hero/gallery-3.jpg` | 1072 1224 | brand identity stationery set with a blue bird-wing logo, portrait crop |
| `public/images/hero/gallery-4.jpg` | 1072 1224 | marketing website hero section on a large monitor, portrait crop |
| `public/images/services/ui-ux-design.jpg` | 1116 728 | wireframes transforming into polished mobile app UI screens |
| `public/images/services/logo-branding.jpg` | 1116 728 | logo construction grid and brand color swatches on a desk |
| `public/images/services/web-development.jpg` | 1116 728 | modern website in a browser window beside a code editor panel |
| `public/images/services/ui-ux-redesign.jpg` | 1116 728 | before-and-after website redesign, two browser windows side by side |
| `public/images/projects/project-1.jpg` | 1100 1006 | fintech web app case study presentation board |
| `public/images/projects/project-2.jpg` | 1100 1006 | e-commerce mobile app case study with phone mockups |
| `public/images/projects/project-3.jpg` | 1100 1006 | healthcare analytics dashboard case study |
| `public/images/projects/project-4.jpg` | 1100 1006 | travel booking website case study on laptop and phone |
| `public/images/recent-works/work-1.jpg` | 1072 1224 | AI productivity app landing page, portrait crop |
| `public/images/recent-works/work-2.jpg` | 1072 1224 | crypto wallet mobile app screens, portrait crop |
| `public/images/recent-works/work-3.jpg` | 1072 1224 | real estate listing website, portrait crop |
| `public/images/recent-works/work-4.jpg` | 1072 1224 | fitness tracking dashboard, portrait crop |
| `public/images/testimonials/avatar-3.jpg` | 112 112 | photorealistic professional headshot of a smiling woman with long wavy brown hair, black blazer over a teal top, soft outdoor background (no style suffix) |

For each: generate with the closest supported aspect ratio, poll `get_job` until done, download the result URL to the scratchpad (`curl -L -o <scratch>/<name>.png <url>`), then fit it:
```bash
python scripts/fit-image.py <scratch>/<name>.png public/images/<path>.jpg <width> <height>
```

- [ ] **Step 3: Review**

Open each generated file (Read tool). Reject and regenerate any with readable gibberish text, off-palette saturated colors, or artifacts.

- [ ] **Step 4: Commit**

```bash
git add public/images
git commit -m "feat: add generated imagery for empty design slots"
```

---

### Task 17: Desktop fidelity tuning (1440)

**Files:**
- Modify: section/pattern components as needed. Only class values (sizes, spacing, tracking, weights), never structure or copy.

- [ ] **Step 1: Capture and diff**

Run: `npm run test:visual`

- [ ] **Step 2: Tune band by band, top to bottom**

For each `tests/visual/output/desktop-slices/NN.png` (design | build | diff):
1. Compare the vertical positions of text lines and boxes against the **Reference measurements** table. Fix the first offending element in the band: section `pt-*`, `mt-*`, `leading-*`. An offset propagates down the page, so always fix top-down.
2. Compare text line widths. If a heading is wider or narrower than the reference (e.g. hero H1 line 2 = 614px, "What We Do, Full Stop" = 441px, "Our Projects" = 246px, pricing title = 697px, "Send Us the Idea" = 195px, "UI/UX Design" = 154px, project title line 1 = 370px), adjust `tracking-*` first, then font size, then weight. To measure the build, run this in Playwright or the browser console: `[...document.querySelectorAll('h1,h2,h3')].map(e => [e.textContent, e.getBoundingClientRect().width])` (for multi-line text, use a `Range` on the first line).
3. Confirm line breaks match the design exactly (about paragraph: 3 lines ending "digital" / "the" / "size."; project title: 2 lines on cards 1–3 and 3 lines on card 4).
4. Re-run `npm run test:visual` after each band's fixes.

Target: every band except those holding generated images is under ~3% differing, and every text line starts within ±2px of the reference.

- [ ] **Step 3: Verify and commit**

Run: `npm run lint && npm test && npm run build`
```bash
git add src
git commit -m "fix: tune desktop layout to match design at 1440"
```

---

### Task 18: Mobile fidelity tuning (375)

**Files:**
- Modify: base (non-`lg:`) classes only, so desktop is not disturbed.

- [ ] **Step 1: Capture and diff**

Run: `npm run test:visual`, then review `tests/visual/output/mobile-slices/*.png`.

Mobile reference points (from `Frame 2147241977.png`): 20px side gutters (content x 20–355); nav logo ~152×24 at y 24–60 with a 36px-tall CTA; hero H1 36px / 40 lh (3 lines: "Product Design / That Ships in Days, / Not Months."); full-width buttons 48px tall; gallery y 584–859 with its middle gutter at x 181–193; about text 26px / 32 lh centered; service images 303×198; project tabs 56px stepping 80px left; project image 296×270; one testimonial card and one pricing card per view, with centered arrows below; contact form single column; footer stacked with full-width pills and wordmark.

Remember decision 1: where mobile content differs from desktop (services count, projects heading, spelling), the desktop content is correct. Those bands will differ by design; don't "fix" them.

- [ ] **Step 2: Tune top-down** (same method as Task 17).

- [ ] **Step 3: Check the in-between widths**

Using Playwright or the browser, check that 768 and 1024–1280 widths don't break: no horizontal page scroll, no overlapping text, and the hero glass not covering the headline. At lg below 1240 the container shrinks, so if the hero glass collides with the H1 at 1024–1200, hide it below `xl` (`hidden xl:block`). That is the only allowed structural tweak.

- [ ] **Step 4: Verify and commit**

Run: `npm run lint && npm test && npm run build`
```bash
git add src
git commit -m "fix: tune mobile layout to match design at 375"
```

---

### Task 19: Final verification

- [ ] **Step 1: Full check**

Run: `npm run lint && npm test && npm run build && npm run test:visual`
Expected: lint clean, 10 unit tests pass, build succeeds, visual bands report printed.

- [ ] **Step 2: Behavior smoke test (Playwright or manual at 1440 and 375)**

- Nav links scroll to their sections (FAQ intentionally goes nowhere).
- Testimonials and pricing arrows move by one card; arrows at the ends do nothing and look unchanged.
- Marquee scrolls and pauses on hover.
- Sections fade/rise in on scroll. With OS reduced-motion on, there is no motion and everything is visible.
- Contact form: submitting empty shows 5 errors; a valid submit shows the success message and clears the form.

- [ ] **Step 3: Report**

Report honestly: remaining diff bands and why (generated images, marquee position, font anti-aliasing), and any deviations. Remind the user of placeholder links in `src/content/site.ts` (`whatsappUrl`, `bookCallUrl`) and `src/content/footer.ts` (social `#` links).

- [ ] **Step 4: Commit any last fixes**

```bash
git add -A
git commit -m "chore: final verification pass"
```
