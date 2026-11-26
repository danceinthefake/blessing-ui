// Product screenshots for the docs: hero (light/dark) from the full-site block, then the OG card,
// then a light preview of every block for the cards of the Blocks page.
// Needs a built site: pnpm docs:build && node docs/scripts/shots.mjs
// `node docs/scripts/shots.mjs blocks` makes only the block previews.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { copyFileSync, readFileSync } from "node:fs";

const onlyBlocks = process.argv.includes("blocks");
const blocks = JSON.parse(readFileSync("docs/.vitepress/blocks.json", "utf8"));

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
  // light and dark previews of each block, for its catalog card
  const queue = blocks.flatMap(({ slug }) => [
    { slug, dark: false },
    { slug, dark: true },
  ]);
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      const bp = await b.newPage({ viewport: { width: 800, height: 500 }, deviceScaleFactor: 2 });
      for (let job; (job = queue.shift());) {
        await bp.emulateMedia({ colorScheme: job.dark ? "dark" : "light" });
        await bp.goto(`http://localhost:${port}/blocks/${job.slug}-frame`, {
          waitUntil: "networkidle",
        });
        await bp.evaluate((d) => {
          document.documentElement.classList.toggle("dark", d);
          document.documentElement.dataset.theme = d ? "dark" : "light";
        }, job.dark);
        await bp.waitForTimeout(500);
        await bp.screenshot({
          path: `docs/public/preview-${job.slug}${job.dark ? "-dark" : ""}.png`,
        });
      }
      await bp.close();
    }),
  );
  if (!onlyBlocks) {
    for (const dark of [false, true]) {
      const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
      await p.goto(`http://localhost:${port}/blocks/site-full`, { waitUntil: "networkidle" });
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
    // block teasers for the homepage
    for (const slug of ["signin", "dashboard", "news"])
      for (const dark of [true]) {
        const bp = await b.newPage({
          viewport: { width: 800, height: 500 },
          deviceScaleFactor: 2,
          colorScheme: dark ? "dark" : "light",
        });
        await bp.goto(`http://localhost:${port}/blocks/${slug}-frame`, {
          waitUntil: "networkidle",
        });
        await bp.evaluate((d) => {
          document.documentElement.classList.toggle("dark", d);
          document.documentElement.dataset.theme = d ? "dark" : "light";
        }, dark);
        await bp.waitForTimeout(600);
        await bp.screenshot({ path: `docs/public/preview-${slug}${dark ? "-dark" : ""}.png` });
        await bp.close();
      }
    // the preview server caches misses; restart it so the fresh hero files are served to the OG page
    srv.kill();
    srv = await serve();
    const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
    await p.goto(`http://localhost:${port}/og`, { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    await p.locator(".og").screenshot({ path: "docs/public/og.png" });
    console.log(
      "hero-light.png, hero-dark.png, preview-<block>.png, preview-{signin,dashboard,news}-dark.png, og.png written to docs/public/",
    );
  }
} finally {
  await b.close();
  srv.kill();
}
