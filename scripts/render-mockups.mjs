// Renders the HTML mockups in scripts/mockups/ to the landing page image slots.
// Usage: npm run mockups            (all)
//        npm run mockups -- work-1  (only templates whose name contains "work-1")
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const HERO = [1072, 1224];
const SERVICE = [1116, 728];
const PROJECT = [1100, 1006];

const jobs = [
  ["hero-gallery-1", "public/images/hero/gallery-1.jpg", HERO],
  ["hero-gallery-2", "public/images/hero/gallery-2.jpg", HERO],
  ["hero-gallery-3", "public/images/hero/gallery-3.jpg", HERO],
  ["hero-gallery-4", "public/images/hero/gallery-4.jpg", HERO],
  ["service-ui-ux-design", "public/images/services/ui-ux-design.jpg", SERVICE],
  ["service-logo-branding", "public/images/services/logo-branding.jpg", SERVICE],
  ["service-web-development", "public/images/services/web-development.jpg", SERVICE],
  ["service-ui-ux-redesign", "public/images/services/ui-ux-redesign.jpg", SERVICE],
  ["project-1", "public/images/projects/project-1.jpg", PROJECT],
  ["project-2", "public/images/projects/project-2.jpg", PROJECT],
  ["project-3", "public/images/projects/project-3.jpg", PROJECT],
  ["project-4", "public/images/projects/project-4.jpg", PROJECT],
  ["work-1", "public/images/recent-works/work-1.jpg", HERO],
  ["work-2", "public/images/recent-works/work-2.jpg", HERO],
  ["work-3", "public/images/recent-works/work-3.jpg", HERO],
  ["work-4", "public/images/recent-works/work-4.jpg", HERO],
];

const filter = process.argv[2];
const selected = filter ? jobs.filter(([name]) => name.includes(filter)) : jobs;
if (selected.length === 0) {
  console.error(`No template matches "${filter}"`);
  process.exit(1);
}

const browser = await chromium.launch();
try {
  for (const [name, out, [width, height]] of selected) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const src = pathToFileURL(resolve(root, "scripts/mockups", `${name}.html`)).href;
    await page.goto(src, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.addStyleTag({ content: `:root{--w:${width}px;--h:${height}px}` });
    const target = resolve(root, out);
    mkdirSync(dirname(target), { recursive: true });
    await page.screenshot({ path: target, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width, height } });
    await context.close();
    console.log(`${out} ${width}x${height}`);
  }
} finally {
  await browser.close();
}
