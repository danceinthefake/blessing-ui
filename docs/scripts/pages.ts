// Scaffolds docs/components/<slug>.md for every registry entry that has no page yet.
// Existing pages are never touched — edit them freely. Run: pnpm docs:pages
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { groups } from "../.vitepress/components.ts";

const docs = fileURLToPath(new URL("..", import.meta.url));
const demos = readdirSync(resolve(docs, "demos")).filter((f) => f.endsWith(".vue"));
// a demo belongs to the longest component name it starts with (ButtonGroupBasic → ButtonGroup, not Button)
const shorts = groups.flatMap((g) => g.items.map((e) => e.name.replace(/^Bless/, "")));
const owner = (d: string) =>
  shorts.filter((s) => d.startsWith(s)).sort((a, b) => b.length - a.length)[0];
let made = 0;

for (const g of groups)
  for (const e of g.items) {
    const file = resolve(docs, "components", `${e.slug}.md`);
    if (existsSync(file)) continue;
    const short = e.name.replace(/^Bless/, "");
    const mine = demos.filter((d) => owner(d) === short);
    const names = [e.name, ...(e.also ?? [])];
    const imports = mine
      .map((d) => `import ${d.replace(".vue", "")} from "../demos/${d}";`)
      .join("\n");
    const blocks = mine
      .map((d) => {
        const c = d.replace(".vue", "");
        const label = c
          .slice(short.length)
          .replace(/([A-Z])/g, " $1")
          .trim();
        return `<Demo title="${label}">\n  <${c} />\n  <template #code>\n\n<<< ../demos/${d}\n\n  </template>\n</Demo>`;
      })
      .join("\n\n");
    const md = `---
title: ${short}
---

<script setup>
${imports}
</script>

# ${short}

<p class="bless-lead">${e.text.replace(/`/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>

${blocks || "<!-- add docs/demos/" + short + "Basic.vue then re-run pnpm docs:pages, or write a <Demo> here -->"}

## Usage

\`\`\`ts
import { ${names.join(", ")} } from "blessing-ui";
\`\`\`

## API

${names.map((n) => (names.length > 1 ? `### ${n}\n\n` : "") + `<PropsTable name="${n}" />`).join("\n\n")}
`;
    writeFileSync(file, md);
    made++;
  }
console.log(`pages: ${made} created`);
