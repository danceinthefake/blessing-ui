// Product screenshots for the docs: hero (light/dark) from the full-site block, then the OG card.
// Needs a built site: pnpm docs:build && node docs/scripts/shots.mjs
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { copyFileSync } from "node:fs";

const port = 4179;
const serve = async () => {
  const s = spawn("npx", ["vitepress", "preview", "docs", "--port", String(port)], {
    stdio: "ignore",
  });
  await new Promise((r) => setTimeout(r, 4000));
  return s;
};
let srv = await serve();
const b = await chromium.launch();
try {
  for (const dark of [false, true]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    await p.goto(`http://localhost:${port}/blocks/site-demo`, { waitUntil: "networkidle" });
    await p.evaluate((d) => {
      document.documentElement.classList.toggle("dark", d);
      document.documentElement.dataset.theme = d ? "dark" : "light";
    }, dark);
    await p.evaluate(() => document.querySelector(".site-docs-link")?.remove()); // docs-only nav
    await p.waitForTimeout(600);
    const name = `hero-${dark ? "dark" : "light"}.png`;
    await p.screenshot({ path: `docs/public/${name}` });
    copyFileSync(`docs/public/${name}`, `docs/.vitepress/dist/${name}`); // the OG page reads it from the preview
    await p.close();
  }
  // the preview server caches misses; restart it so the fresh hero files are served to the OG page
  srv.kill();
  srv = await serve();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await p.goto(`http://localhost:${port}/og`, { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.locator(".og").screenshot({ path: "docs/public/og.png" });
  console.log("hero-light.png, hero-dark.png, og.png written to docs/public/");
} finally {
  await b.close();
  srv.kill();
}
