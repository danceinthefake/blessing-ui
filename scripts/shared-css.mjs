// The shared plain CSS of the components (sr.css, chart.css). The library build emits each file,
// but it replaces the `import "./x.css"` of a module with an empty placeholder. This puts the
// import back in each module whose SFC has it, and returns the CSS for the all-in-one file.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function linkSharedCss(src, comps) {
  const shared = readdirSync(src).filter((f) => f.endsWith(".css"));
  const bodies = shared.map((f) => {
    if (!existsSync(join(comps, f))) throw new Error(`postbuild: the build did not emit ${f}`);
    return readFileSync(join(comps, f), "utf8");
  });
  for (const f of readdirSync(src).filter((f) => f.endsWith(".vue"))) {
    const sfc = readFileSync(join(src, f), "utf8");
    const used = shared.filter((c) => sfc.includes(`import "./${c}"`));
    const js = join(comps, f.replace(/\.vue$/, ".js"));
    if (used.length && existsSync(js))
      writeFileSync(js, used.map((c) => `import "./${c}";\n`).join("") + readFileSync(js, "utf8"));
  }
  return bodies;
}
