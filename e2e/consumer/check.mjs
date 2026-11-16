// pnpm e2e:consumer — pack the library, install it here, type-check strictly, build, assert sizes.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const here = import.meta.dirname;
const sh = (cmd, cwd = here) => execSync(cmd, { cwd, stdio: "inherit" });

rmSync(resolve(here, "node_modules"), { recursive: true, force: true });
rmSync(resolve(here, "dist"), { recursive: true, force: true });
// a tarball from an earlier version would otherwise be the one found below
for (const f of readdirSync(here)) if (f.endsWith(".tgz")) rmSync(resolve(here, f));
sh("pnpm pack --pack-destination e2e/consumer", root);
const tgz = readdirSync(here).find((f) => f.endsWith(".tgz"));
sh(`pnpm install --ignore-workspace --no-lockfile`);
// unpack the tarball into node_modules directly: a registry lookup of an unpublished package would fail policy checks
const target = resolve(here, "node_modules/blessing-ui");
rmSync(target, { recursive: true, force: true });
sh(
  `mkdir -p node_modules/blessing-ui && tar xzf ${tgz} -C node_modules/blessing-ui --strip-components=1`,
);
sh("pnpm exec vue-tsc --noEmit");
// the auto-import resolver finds components in the installed package, and nothing else
const { BlessingUiResolver } = await import(
  resolve(here, "node_modules/blessing-ui/dist/resolver.js")
);
const r = BlessingUiResolver();
if (
  r.resolve("BlessButton")?.from !== "blessing-ui/components/BlessButton" ||
  r.resolve("RouterLink")
) {
  console.error("✗ blessing-ui/resolver resolved the wrong names");
  process.exit(1);
}
sh("ENTRY=one pnpm exec vite build");
sh("ENTRY=all pnpm exec vite build");

const gz = (f) => gzipSync(readFileSync(resolve(here, "dist", f))).length;
const cssOf = (dir) => {
  const a = resolve(here, "dist", dir, "assets");
  return readdirSync(a)
    .filter((f) => f.endsWith(".css"))
    .reduce((n, f) => n + gz(`${dir}/assets/${f}`), 0);
};
const one = gz("one/one.js"),
  all = gz("all/all.js"),
  oneCss = cssOf("one"),
  allCss = cssOf("all");
console.log(
  `\nBlessButton only: ${one} B gz JS + ${oneCss} B gz CSS · everything: ${all} B gz JS + ${allCss} B gz CSS`,
);
const oneCssText = readdirSync(resolve(here, "dist/one/assets"))
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(resolve(here, "dist/one/assets", f), "utf8"))
  .join("");
if (!oneCssText.includes("--bless-color-accent:")) {
  console.error(
    "✗ single-component build lost the tokens (index.js side-effect import was tree-shaken)",
  );
  process.exit(1);
}
if (oneCssText.includes(".bless-datatable")) {
  console.error("✗ single-component build pulled unrelated component CSS");
  process.exit(1);
}
const LIMIT_CSS_ONE = 4000;
if (oneCss > LIMIT_CSS_ONE) {
  console.error(
    `✗ single-component CSS is ${oneCss} B gz (> ${LIMIT_CSS_ONE}) — per-component CSS regressed`,
  );
  process.exit(1);
}
const LIMIT_ONE = 3000;
if (one > LIMIT_ONE) {
  console.error(
    `✗ single-component import is ${one} B gz (> ${LIMIT_ONE}) — tree-shaking regressed`,
  );
  process.exit(1);
}
// the whole library, ~10% above today's 221.8 KB JS / 60.1 KB CSS gz (after Phase 35): room to add
// components, not to bloat. An app pays only for what it imports; this caps the growth of the catalog.
for (const [what, got, limit] of [
  ["everything JS", all, 244_000],
  ["everything CSS", allCss, 66_000],
]) {
  if (got > limit) {
    console.error(`✗ ${what} is ${got} B gz (> ${limit}) — raise the budget on purpose or trim`);
    process.exit(1);
  }
}
// the cost of each component alone, for the docs table and the log
sh("node sizes.mjs");
rmSync(resolve(here, tgz));
console.log("✓ consumer check passed");
