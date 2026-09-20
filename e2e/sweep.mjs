// Cross-browser sweep: open every docs page in each browser, fail on page errors / console errors.
// Usage: node e2e/sweep.mjs [chromium,firefox,webkit] [baseUrl]
import { chromium, firefox, webkit } from "playwright";
import { readdirSync } from "node:fs";

const want = (process.argv[2] ?? "chromium,firefox,webkit").split(",");
const base = process.argv[3] ?? "http://localhost:4173";
const pages = [
  "/",
  "/guide/install",
  "/guide/tokens",
  "/guide/dark-mode",
  "/guide/palettes",
  "/guide/brand",
  "/guide/story",
  "/guide/gestures",
  ...readdirSync("docs/components")
    .filter((f) => f.endsWith(".md"))
    .map((f) => `/components/${f.replace(".md", "")}`),
  "/stage-demo",
  "/layout-demo",
];
const ignore = [
  /favicon/,
  /404 \(Not Found\)/,
  /ERR_NAME_NOT_RESOLVED/,
  /Failed to load resource/,
  /youtube|mozilla\.net|picsum/,
];
// known third-party noise, scoped to a page: ProseMirror throws this in headless WebKit only
// (tiptap issues #4498 / #5118); Chromium and Firefox are clean, real WebKit users are not affected.
const allow = {
  "/components/editor": [/Applying a mismatched transaction/],
  // VitePress sets --vp-offset on its navbar client-side (style="" on the server); not ours
  "/": [/Hydration completed but contains mismatches/],
};
const engines = { chromium, firefox, webkit };
let failed = 0;

for (const name of want) {
  let browser;
  try {
    browser = await engines[name].launch();
  } catch (e) {
    console.log(`## ${name}: cannot launch (${e.message.split("\n")[0]}) — skipped`);
    continue;
  }
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
  let bad = 0;
  for (const path of pages) {
    errors.length = 0;
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(150);
      // exercise: click the first demo button if any, press Escape
      const btn = page.locator(".demo__preview button").first();
      if (await btn.count()) await btn.click({ timeout: 1000 }).catch(() => {});
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(100);
    } catch (e) {
      errors.push(`navigation: ${e.message.split("\n")[0]}`);
    }
    const real = errors.filter(
      (e) => !ignore.some((r) => r.test(e)) && !(allow[path] ?? []).some((r) => r.test(e)),
    );
    if (real.length) {
      bad++;
      console.log(`  ✗ ${name} ${path}\n    ${[...new Set(real)].slice(0, 4).join("\n    ")}`);
    }
  }
  console.log(`## ${name}: ${pages.length - bad}/${pages.length} pages clean`);
  failed += bad;
  await browser.close();
}
process.exit(failed ? 1 : 0);
