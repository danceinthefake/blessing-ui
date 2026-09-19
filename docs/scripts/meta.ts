// Generates docs/.vitepress/meta.json — props / events / slots / exposed for every component,
// read by <PropsTable>. Run: pnpm docs:meta
import { createChecker } from "vue-component-meta";
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../..", import.meta.url));
const checker = createChecker(resolve(root, "tsconfig.json"), {
  forceUseTs: true,
  printer: { newLine: 1 },
  schema: { ignore: ["HTMLElement", "Element", "Node"] },
});

const dir = resolve(root, "src/components");
const out: Record<string, unknown> = {};
const clean = (s: string) => s.replace(/^\s*\*\s?/gm, "").trim();

for (const f of readdirSync(dir)
  .filter((f) => f.endsWith(".vue"))
  .sort()) {
  const meta = checker.getComponentMeta(resolve(dir, f));
  const name = f.replace(".vue", "");
  out[name] = {
    props: meta.props
      .filter((p) => !p.global)
      .map((p) => ({
        name: p.name,
        type: p.type,
        required: p.required,
        default: p.default,
        description: clean(p.description),
      })),
    events: meta.events.map((e) => ({
      name: e.name,
      type: e.type,
      description: clean(e.description),
    })),
    slots: meta.slots.map((s) => ({
      name: s.name,
      type: s.type,
      description: clean(s.description),
    })),
    exposed: meta.exposed
      .filter(
        (e) =>
          ![
            "$slots",
            "$props",
            "$attrs",
            "$emit",
            "$el",
            "$refs",
            "$parent",
            "$root",
            "$watch",
            "$forceUpdate",
            "$nextTick",
            "$options",
            "$data",
          ].includes(e.name),
      )
      .map((e) => ({ name: e.name, type: e.type, description: clean(e.description) })),
  };
}
writeFileSync(resolve(root, "docs/.vitepress/meta.json"), JSON.stringify(out, null, 1));
console.log(`meta: ${Object.keys(out).length} components`);
