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
sh("ENTRY=one pnpm exec vite build");
sh("ENTRY=all pnpm exec vite build");

const gz = (f) => gzipSync(readFileSync(resolve(here, "dist", f))).length;
const one = gz("one/one.js"),
  all = gz("all/all.js");
console.log(`\nBlessButton only: ${one} B gz · everything: ${all} B gz`);
const LIMIT_ONE = 3000;
if (one > LIMIT_ONE) {
  console.error(
    `✗ single-component import is ${one} B gz (> ${LIMIT_ONE}) — tree-shaking regressed`,
  );
  process.exit(1);
}
rmSync(resolve(here, tgz));
console.log("✓ consumer check passed");
