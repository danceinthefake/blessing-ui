// After `vite build` (preserveModules + cssCodeSplit):
//  1. rename  X.vue_vue_type_style_index_0_lang.css → X.css
//  2. prepend `import "./X.css"` to X.js so bundlers pull only the CSS of what you import
//  3. prepend `import "./style.css"` (tokens) to index.js
//  4. write dist/blessing-ui.css = tokens + every component's CSS, for the no-bundler / import-everything case
//  5. link the shared plain CSS (sr.css, chart.css) to each module whose SFC imports it: the build
//     emits the file but replaces the import with an empty placeholder
import { cpSync, readdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { linkSharedCss } from "./shared-css.mjs";

const dist = "dist";
const comps = join(dist, "components");
const all = [readFileSync(join(dist, "style.css"), "utf8")];
let linked = 0;

for (const f of readdirSync(comps).sort()) {
  const m = f.match(/^(.+)\.vue_vue_type_style_index_\d+_lang\.css$/);
  if (!m) continue;
  const name = m[1];
  const css = join(comps, `${name}.css`);
  renameSync(join(comps, f), css);
  const body = readFileSync(css, "utf8");
  if (body.trim()) all.push(body);
  const js = join(comps, `${name}.js`);
  if (existsSync(js)) {
    const src = readFileSync(js, "utf8").replace(/\/\* empty css\s*\*\/\n?/g, "");
    writeFileSync(js, `import "./${name}.css";\n${src}`);
    linked++;
  }
}
// 5. the shared plain CSS: into the all-in-one file, and an import in each module that needs it
all.push(...linkSharedCss("src/components", comps));
const index = join(dist, "index.js");
writeFileSync(
  index,
  `import "./style.css";\n${readFileSync(index, "utf8").replace(/\/\* empty css\s*\*\/\n?/g, "")}`,
);
// strip leftover placeholders anywhere else
for (const dir of [dist, comps, join(dist, "composables")])
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
    const p = join(dir, f);
    const s = readFileSync(p, "utf8");
    if (s.includes("/* empty css")) writeFileSync(p, s.replace(/\/\* empty css\s*\*\/\n?/g, ""));
  }
writeFileSync(join(dist, "blessing-ui.css"), all.join("\n"));
console.log(
  `postbuild: linked ${linked} component stylesheets, wrote dist/blessing-ui.css (${(all.join("\n").length / 1024).toFixed(0)} KB)`,
);
// 6. ship the blocks for `npx blessing-ui add` (meta.ts is docs-only; blocks.json is the list)
cpSync("docs/blocks", join(dist, "blocks"), {
  recursive: true,
  filter: (p) => !p.endsWith(".md") && !p.endsWith("meta.ts"),
});
cpSync("docs/.vitepress/blocks.json", join(dist, "blocks/blocks.json"));
