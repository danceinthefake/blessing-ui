// The cost of each component on its own: bundle `blessing-ui/components/BlessX` from the installed
// package, minified, with vue and the optional peers left out as in a real app, and gzip the result.
// The tokens are not counted: every app loads them once. Writes docs/.vitepress/sizes.json for the
// docs table. Run by check.mjs after it installs the packed package.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "vite";

const here = import.meta.dirname;
const root = resolve(here, "../..");
const external = ["vue", /^@tiptap\//, /^@unovis\//];
// the public components: the ones the package entry exports by name
const entry = readFileSync(resolve(here, "node_modules/blessing-ui/dist/index.js"), "utf8");
const names = [...new Set([...entry.matchAll(/ as (Bless[A-Za-z0-9]+)\b/g)].map((m) => m[1]))]
  .filter((n) => entry.includes(`./components/${n}.js`))
  .sort();

const gz = (text) => gzipSync(text).length;
async function measure(name) {
  const out = await build({
    root: here,
    configFile: false,
    logLevel: "silent",
    plugins: [
      {
        name: "entry",
        resolveId: (id) => (id === "virtual:entry" ? "\0entry" : undefined),
        load: (id) =>
          id === "\0entry"
            ? `import C from "blessing-ui/components/${name}"; console.log(C);`
            : undefined,
      },
    ],
    build: {
      write: false,
      minify: true,
      cssCodeSplit: false,
      rollupOptions: { input: "virtual:entry", external, output: { codeSplitting: false } },
    },
  });
  const files = (Array.isArray(out) ? out : [out]).flatMap((o) => o.output);
  const js = files.filter((f) => f.type === "chunk").reduce((n, f) => n + gz(f.code), 0);
  const css = files
    .filter((f) => f.type === "asset" && f.fileName.endsWith(".css"))
    .reduce((n, f) => n + gz(String(f.source)), 0);
  return { name, js, css };
}

const sizes = [];
// a few at a time: each build is small, and running them together keeps the check quick
for (let i = 0; i < names.length; i += 8)
  sizes.push(...(await Promise.all(names.slice(i, i + 8).map(measure))));
writeFileSync(resolve(root, "docs/.vitepress/sizes.json"), JSON.stringify(sizes, null, 2) + "\n");
const kb = (b) => (b / 1000).toFixed(1);
console.log(`\nlargest components (gz JS + CSS, without vue and the tokens):`);
for (const s of [...sizes].sort((a, b) => b.js + b.css - (a.js + a.css)).slice(0, 10))
  console.log(`  ${s.name.padEnd(28)} ${kb(s.js).padStart(5)} KB + ${kb(s.css).padStart(4)} KB`);
