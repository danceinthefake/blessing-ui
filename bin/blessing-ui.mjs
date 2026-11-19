#!/usr/bin/env node
// Copies a block folder from the package into your app. No dependencies: node:fs only.
//   npx blessing-ui list
//   npx blessing-ui add <block...> [--dir <folder>] [--force]
import { cpSync, existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const shipped = fileURLToPath(new URL("../dist/blocks/", import.meta.url));

/** The block files, without the docs-only meta.ts. */
const files = (dir) =>
  readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => statSync(join(dir, f)).isFile() && f !== "meta.ts");

/** Copy the blocks and the sibling blocks they import into `dir`. Returns what it did. */
export function add(names, { dir, from = shipped, force = false }) {
  const known = new Set(readdirSync(from).filter((f) => statSync(join(from, f)).isDirectory()));
  const todo = [...names];
  const done = new Set();
  const packages = new Set();
  const skipped = [];
  while (todo.length) {
    const name = todo.shift();
    if (done.has(name)) continue;
    if (!known.has(name))
      throw new Error(`No block "${name}". Run "blessing-ui list" to see the blocks.`);
    done.add(name);
    const src = join(from, name);
    for (const f of files(src)) {
      if (!/\.(vue|ts)$/.test(f)) continue;
      for (const [, spec] of readFileSync(join(src, f), "utf8").matchAll(/from "([^"]+)"/g)) {
        const sibling = spec.match(/^\.\.\/([\w-]+)\//);
        if (sibling && !f.includes("/") && known.has(sibling[1])) todo.push(sibling[1]);
        else if (!spec.startsWith(".") && spec !== "vue" && spec !== "blessing-ui")
          packages.add(
            spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0],
          );
      }
    }
    const to = join(dir, name);
    // never overwrite the user's edits without --force
    if (existsSync(to) && !force) {
      skipped.push(name);
      continue;
    }
    for (const f of files(src)) cpSync(join(src, f), join(to, f));
  }
  return {
    copied: [...done].filter((n) => !skipped.includes(n)),
    skipped,
    packages: [...packages],
  };
}

function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === "list") {
    const list = JSON.parse(readFileSync(join(shipped, "blocks.json"), "utf8"));
    for (const b of list) console.log(`${b.slug.padEnd(12)} ${b.group}: ${b.summary}`);
    return 0;
  }
  if (cmd !== "add" || !rest.some((a) => !a.startsWith("-"))) {
    console.log(`Usage:
  blessing-ui list                                   show the blocks
  blessing-ui add <block...> [--dir <folder>] [--force]
                                                     copy blocks into <folder> (default
                                                     src/features, or app/features in Nuxt)`);
    return cmd ? 1 : 0;
  }
  const at = rest.indexOf("--dir");
  const nuxt = ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"].some((f) => existsSync(f));
  const dir = resolve(at >= 0 ? rest[at + 1] : nuxt ? "app/features" : "src/features");
  const names = rest.filter((a, i) => !a.startsWith("-") && rest[i - 1] !== "--dir");
  try {
    const r = add(names, { dir, force: rest.includes("--force") });
    for (const n of r.copied) console.log(`Copied ${n} to ${join(dir, n)}`);
    for (const n of r.skipped)
      console.log(`Kept ${join(dir, n)}: it exists. Use --force to replace it.`);
    if (r.packages.length) console.log(`Install also: ${r.packages.join(" ")}`);
    return 0;
  } catch (e) {
    console.error(e.message);
    return 1;
  }
}

// npx starts us through a node_modules/.bin symlink
if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1]))
  process.exitCode = main(process.argv.slice(2));
