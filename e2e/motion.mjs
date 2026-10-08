// Reduced-motion audit: with prefers-reduced-motion: reduce, no component page may have a CSS
// animation or transition still running inside a component demo (JS-driven motion is covered by
// unit tests via reducedMotion()). Usage: node e2e/motion.mjs [baseUrl]
import { chromium } from "playwright";
import { readdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:4173";
const pages = readdirSync("docs/components")
  .filter((f) => f.endsWith(".md"))
  .map((f) => `/components/${f.replace(".md", "")}`);

// a busy indicator that stopped dead would read as frozen; the spinners slow to 2s instead (WCAG
// "essential" motion), so these two keyframes are allowed to run
const essential = new Set(["bless-spin", "bless-circular-spin"]);

const browser = await chromium.launch();
const page = await (await browser.newContext({ reducedMotion: "reduce" })).newPage();
let failed = 0;
for (const path of pages) {
  await page.goto(base + path, { waitUntil: "networkidle", timeout: 20000 });
  // VitePress's own theme flattens every animation under reduce, which would hide the library's gaps
  await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet
      }
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i];
        if (r instanceof CSSMediaRule && /reduced-motion: reduce/.test(r.conditionText))
          for (let j = r.cssRules.length - 1; j >= 0; j--)
            if (r.cssRules[j].selectorText === "*, ::before, ::after") r.deleteRule(j);
      }
    }
  });
  await page.waitForTimeout(400);
  const live = await page.evaluate(
    (essential) =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && a.effect?.target?.closest(".demo__preview"))
        .filter((a) => !essential.includes(a.animationName))
        .filter((a) => {
          const t = a.effect.getComputedTiming();
          return t.iterations === Infinity || t.endTime > 50; // ms; 0s tokens give 0
        })
        .map((a) => {
          const el = a.effect.target;
          const name = a.animationName ?? a.transitionProperty ?? "?";
          return `${
            el.className
              ?.toString()
              .split(" ")
              .find((c) => c.startsWith("bless-")) ?? el.tagName
          } · ${name} · ${a.effect.getComputedTiming().endTime}ms`;
        }),
    [...essential],
  );
  if (live.length) {
    failed++;
    console.log(`✗ ${path}\n    ${[...new Set(live)].join("\n    ")}`);
  }
}
await browser.close();
console.log(failed ? `\n${failed} page(s) still animate` : `ok · ${pages.length} pages calm`);
process.exit(failed ? 1 : 0);
