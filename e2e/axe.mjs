// Accessibility sweep: axe-core on every docs page (demo area only), fail on serious/critical.
// Usage: node e2e/axe.mjs [baseUrl]
import { chromium } from "playwright";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const axeSrc = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const base = process.argv[2] ?? "http://localhost:4173";
const pages = [
  ...readdirSync("docs/components")
    .filter((f) => f.endsWith(".md"))
    .map((f) => `/components/${f.replace(".md", "")}`),
  // block previews render inside iframes; audit the frame pages themselves
  ...readdirSync("docs/blocks")
    .filter((f) => f.endsWith("-frame.md"))
    .map((f) => `/blocks/${f.replace(".md", "")}`),
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
let total = 0;
const seen = new Map();
// both themes: contrast has to hold in each
for (const scheme of ["light", "dark"]) {
  await page.emulateMedia({ colorScheme: scheme });
  for (const path of pages) {
    // external media (video page) may never go network-idle; the DOM is what axe needs
    await page
      .goto(base + path, { waitUntil: "networkidle", timeout: 20000 })
      .catch(() => page.waitForLoadState("domcontentloaded"));
    if (!(await page.locator(".demo__preview, .block-frame").count())) continue; // full-page demos live elsewhere
    await page.addScriptTag({ content: axeSrc });
    const r = await page.evaluate(() =>
      // eslint-disable-next-line no-undef
      axe.run(
        { include: [[".demo__preview"], [".block-frame"]], exclude: [[".bless-watermark"]] },
        { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      ),
    );
    const bad = r.violations.filter((v) => ["serious", "critical"].includes(v.impact));
    if (bad.length) {
      total += bad.length;
      console.log(`✗ ${path} (${scheme})`);
      for (const v of bad) {
        console.log(
          `   ${v.impact} ${v.id}: ${v.help} — ${v.nodes
            .slice(0, 2)
            .map((n) => n.target.join(" "))
            .join(" | ")}`,
        );
        seen.set(v.id, (seen.get(v.id) ?? 0) + 1);
      }
    }
  }
}
console.log(`\n${pages.length} pages × 2 themes, ${total} serious/critical violations`);
for (const [id, n] of [...seen].sort((a, b) => b[1] - a[1])) console.log(`  ${n}× ${id}`);
await browser.close();
process.exit(total ? 1 : 0);
