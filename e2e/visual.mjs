// Visual diff of two builds of the docs: which component demos look different?
// Usage: node e2e/visual.mjs <baseUrl> <headUrl> [outDir] [--fail-on-change]
//
// There are no stored baseline images. Fonts and anti-aliasing differ from machine to machine, so a
// committed picture would "change" on every other computer. Instead both builds are rendered here, by
// the same browser, and compared with each other: in CI base is the previous commit and head the new
// one. A demo that differs from itself when rendered twice (random or live content) is reported as
// unstable and not compared. The result is a report, not a gate, because changing how things look is
// often the point; pass --fail-on-change to make it one.
import { chromium } from "playwright";
import { appendFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import pngjs from "pngjs";

const { PNG } = pngjs;
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const failOnChange = process.argv.includes("--fail-on-change");
const [baseUrl, headUrl, out = "visual-out"] = args;
if (!baseUrl || !headUrl) {
  console.error("usage: node e2e/visual.mjs <baseUrl> <headUrl> [outDir] [--fail-on-change]");
  process.exit(2);
}

const WORKERS = Number(process.env.VISUAL_WORKERS ?? 4);
const TOLERANCE = 4; // pixels that may differ before a demo counts as changed
const slugs = readdirSync("docs/components")
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(".md", ""));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

/** the screenshots of every demo on a page, or null when the page is not there */
async function shoot(page, url) {
  const res = await page
    .goto(url, { waitUntil: "networkidle", timeout: 25000 })
    .catch(() =>
      page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 }).catch(() => null),
    );
  if (!res || res.status() >= 400) return null;
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(250);
  const demos = page.locator(".demo__preview");
  const shots = [];
  for (let i = 0, n = await demos.count(); i < n; i++) {
    shots.push(
      await demos
        .nth(i)
        .screenshot({ animations: "disabled", caret: "hide", timeout: 15000 })
        .catch(() => null),
    );
  }
  return shots;
}

/** pixels that differ between two PNGs, and the diff picture; null when the sizes differ */
function compare(a, b) {
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) return { size: true, A, B };
  const diff = new PNG({ width: A.width, height: A.height });
  const n = pixelmatch(A.data, B.data, diff.data, A.width, A.height, { threshold: 0.1 });
  return { n, diff, A, B, area: A.width * A.height };
}

const found = { changed: [], unstable: [], added: [], removed: [], same: 0, errors: [] };
const keep = (scheme, slug, i, tag, buf) => {
  mkdirSync(join(out, scheme), { recursive: true });
  writeFileSync(join(out, scheme, `${slug}-${i}.${tag}.png`), buf);
};

async function check(browser, scheme, slug, page) {
  const path = `/components/${slug}`;
  const head = await shoot(page, headUrl + path);
  const base = await shoot(page, baseUrl + path);
  if (!head && !base) return found.errors.push(`${scheme} ${slug}: not found on either build`);
  if (!base) return found.added.push(`${scheme} ${slug}: new page (${head.length} demos)`);
  if (!head) return found.removed.push(`${scheme} ${slug}: page is gone`);

  const dirty = [];
  const count = Math.max(base.length, head.length);
  for (let i = 0; i < count; i++) {
    if (!base[i] && head[i]) found.added.push(`${scheme} ${slug} #${i + 1}: new demo`);
    else if (base[i] && !head[i]) found.removed.push(`${scheme} ${slug} #${i + 1}: demo is gone`);
    else if (!base[i]) continue;
    else if (base[i].equals(head[i])) found.same++;
    else dirty.push(i);
  }
  if (!dirty.length) return;

  // anything that differs is rendered once more on both sides: if either differs from itself it is
  // random or live content, not a change
  const baseAgain = await shoot(page, baseUrl + path);
  const headAgain = await shoot(page, headUrl + path);
  const moves = (a, b) => {
    if (!a || !b) return true;
    const r = compare(a, b);
    return r.size || r.n > TOLERANCE;
  };
  for (const i of dirty) {
    if (moves(base[i], baseAgain?.[i]) || moves(head[i], headAgain?.[i])) {
      found.unstable.push(`${scheme} ${slug} #${i + 1}`);
      continue;
    }
    const r = compare(base[i], head[i]);
    if (!r.size && r.n <= TOLERANCE) {
      found.same++;
      continue;
    }
    found.changed.push({
      scheme,
      slug,
      i: i + 1,
      text: r.size
        ? `size ${r.A.width}×${r.A.height} → ${r.B.width}×${r.B.height}`
        : `${r.n} px (${((r.n / r.area) * 100).toFixed(2)}%)`,
    });
    keep(scheme, slug, i + 1, "base", base[i]);
    keep(scheme, slug, i + 1, "head", head[i]);
    if (!r.size) keep(scheme, slug, i + 1, "diff", PNG.sync.write(r.diff));
  }
}

const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const queue = [...slugs];
  await Promise.all(
    Array.from({ length: WORKERS }, async () => {
      const ctx = await browser.newContext({
        viewport: { width: 1200, height: 900 },
        colorScheme: scheme,
        reducedMotion: "reduce",
      });
      const page = await ctx.newPage();
      for (let slug; (slug = queue.shift());) {
        await check(browser, scheme, slug, page).catch((e) =>
          found.errors.push(`${scheme} ${slug}: ${e.message.split("\n")[0]}`),
        );
      }
      await ctx.close();
    }),
  );
}
await browser.close();

const lines = [
  `## Visual diff · ${found.changed.length} changed · ${found.unstable.length} unstable · ${found.added.length} new · ${found.removed.length} gone · ${found.same} identical`,
  "",
];
if (found.changed.length) {
  lines.push("**Changed** (base, head and diff pictures are in the `visual-diff` artifact):", "");
  for (const c of found.changed) lines.push(`- \`${c.slug}\` #${c.i} · ${c.scheme} · ${c.text}`);
  lines.push("");
}
const list = (title, a) =>
  a.length && lines.push(`**${title}**`, "", ...a.map((x) => `- ${x}`), "");
list("New", found.added);
list("Gone", found.removed);
list(
  "Unstable (differs from itself when rendered twice: random or live content, not compared)",
  found.unstable,
);
list("Could not be checked", found.errors);
if (!found.changed.length) lines.push("No component demo looks different.", "");
const report = lines.join("\n");
writeFileSync(join(out, "report.md"), report);
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
process.exit(failOnChange && found.changed.length ? 1 : 0);
