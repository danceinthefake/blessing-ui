// Prints the docs pages that the changes since a git ref reach, for E2E_ONLY (see e2e/only.mjs).
// Usage: E2E_ONLY=$(node e2e/affected.mjs [ref]) node e2e/sweep.mjs chromium
// The ref defaults to HEAD, so it covers the changes in the working tree. It prints "*" (every
// page) for a change that reaches the whole site, and "-" (no page) for a change that reaches none.
// The barrel (src/index.ts) makes every demo depend on every component, so the links come from
// the imports between components and the names that each block uses, not from the import graph.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";

const ref = process.argv[2] ?? "HEAD";
const lines = (cmd) => execSync(cmd, { encoding: "utf8" }).split("\n").filter(Boolean);
const changed = new Set([
  ...lines(`git diff --name-only ${ref}`),
  ...lines("git ls-files --others --exclude-standard"),
]);
const read = (f) => readFileSync(f, "utf8");
const ls = (dir) => readdirSync(dir);

const src = Object.fromEntries(
  ls("src/components")
    .filter((f) => /^Bless\w+\.vue$/.test(f))
    .map((f) => [f.replace(".vue", ""), read(`src/components/${f}`)]),
);
const pageOf = new Map();
for (const f of ls("docs/components").filter((f) => f.endsWith(".md")))
  for (const m of read(`docs/components/${f}`).matchAll(/<PropsTable name="(Bless\w+)"/g))
    pageOf.set(m[1], `/components/${f.replace(".md", "")}`);
const blocks = Object.fromEntries(
  ls("docs/blocks")
    .filter((d) => !d.includes("."))
    .map((d) => [
      d,
      // a block can have a parts/ folder
      readdirSync(`docs/blocks/${d}`, { recursive: true })
        .filter((f) => /\.(vue|ts)$/.test(f))
        .map((f) => read(`docs/blocks/${d}/${f}`))
        .join("\n"),
    ]),
);

const pages = new Set();
const reached = new Set();
let everything = false;
// a component reaches the components that import it, and so on
function reach(name) {
  if (reached.has(name)) return;
  reached.add(name);
  for (const [other, text] of Object.entries(src)) if (text.includes(`./${name}.vue`)) reach(other);
}
// a helper file reaches each component that imports it
const importers = (path) =>
  Object.entries(src)
    .filter(([, text]) => text.includes(path))
    .forEach(([name]) => reach(name));

for (const f of changed) {
  let m;
  if (/\.test\.ts$|^e2e\/|\.md$/.test(f) && !f.startsWith("docs/")) continue;
  if (/^docs\/\.vitepress\/(meta|blocks)\.json$|^docs\/public\//.test(f)) continue;
  if ((m = f.match(/^src\/components\/(Bless\w+)\.vue$/))) reach(m[1]);
  else if ((m = f.match(/^src\/components\/(\w+)\.(ts|css)$/))) importers(`./${m[1]}`);
  else if ((m = f.match(/^src\/composables\/(\w+)\.ts$/))) {
    importers(`composables/${m[1]}`);
    for (const [slug, text] of Object.entries(blocks))
      if (text.includes(m[1])) pages.add(`/blocks/${slug}`);
    for (const dir of ["guide", "id/guide"])
      for (const g of ls(`docs/${dir}`).filter((g) => g.endsWith(".md")))
        if (read(`docs/${dir}/${g}`).includes(m[1])) pages.add(`/${dir}/${g.replace(".md", "")}`);
  } else if (
    (m =
      f.match(/^docs\/blocks\/([\w-]+)\//) ?? f.match(/^docs\/blocks\/([\w-]+?)(?:-frame)?\.md$/))
  )
    pages.add(`/blocks/${m[1]}`);
  else if ((m = f.match(/^docs\/((?:id\/)?(?:components|guide|design))\/([\w-]+)\.md$/)))
    pages.add(`/${m[1]}/${m[2] === "index" ? "" : m[2]}`);
  else if ((m = f.match(/^docs\/demos\/(\w+)\.vue$/))) {
    for (const d of ls("docs/components").filter((d) => d.endsWith(".md")))
      if (read(`docs/components/${d}`).includes(`${m[1]}.vue`))
        pages.add(`/components/${d.replace(".md", "")}`);
  } else everything = true; // tokens, global CSS, the barrel, label packs, the docs theme, config
}
for (const name of reached) {
  if (pageOf.has(name)) pages.add(pageOf.get(name));
  for (const [slug, text] of Object.entries(blocks))
    if (new RegExp(`\\b${name}\\b`).test(text)) pages.add(`/blocks/${slug}`);
}
const list = [...pages].sort();
console.error(
  everything
    ? "affected: every page"
    : `affected: ${list.length} pages${list.length ? `\n  ${list.join("\n  ")}` : ""}`,
);
console.log(everything ? "*" : list.join(",") || "-");
