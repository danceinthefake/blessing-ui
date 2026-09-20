// Scaffolds docs/blocks/<slug>.md for every docs/blocks/<slug>/meta.ts, and writes the sidebar
// registry docs/.vitepress/blocks.json. Existing pages are never touched. Run: pnpm docs:blocks
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";

const docs = fileURLToPath(new URL("..", import.meta.url));
const dir = resolve(docs, "blocks");
const registry: { slug: string; title: string; group: string; summary: string; order: number }[] =
  [];
let made = 0;

for (const slug of readdirSync(dir).sort()) {
  const folder = resolve(dir, slug);
  if (!statSync(folder).isDirectory() || !existsSync(resolve(folder, "meta.ts"))) continue;
  const meta = (await import(pathToFileURL(resolve(folder, "meta.ts")).href)).default as {
    title: string;
    group: string;
    summary: string;
    components: string[];
    height?: string;
    order?: number; // sidebar position within the group
  };
  registry.push({
    slug,
    title: meta.title,
    group: meta.group,
    summary: meta.summary,
    order: meta.order ?? 99,
  });
  // the preview iframe page: no docs chrome, so lib styles and the block's media queries run clean
  const frame = resolve(dir, `${slug}-frame.md`);
  if (!existsSync(frame))
    writeFileSync(
      frame,
      `---
layout: page
navbar: false
sidebar: false
aside: false
footer: false
title: ${meta.title} (preview)
---

<script setup>
import Block from "./${slug}/index.vue";
</script>

<BlockFrame><Block /></BlockFrame>
`,
    );
  const page = resolve(dir, `${slug}.md`);
  if (existsSync(page)) continue;
  writeFileSync(
    page,
    `---
title: ${meta.title}
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./${slug}/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./${slug}/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./${slug}/", ""), src]),
);
</script>

# ${meta.title}

<p class="bless-lead">${meta.summary.replace(/</g, "&lt;")}</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/${slug}-frame')" />

## Into your app

Copy the folder to \`src/features/${slug}/\` (Nuxt: \`app/features/${slug}/\`) and render \`index.vue\` from a page. Replace \`api.ts\` — if the block has one — with your real adapter; the view and the use-case don't change.
`,
  );
  made++;
}
writeFileSync(
  resolve(docs, ".vitepress/blocks.json"),
  JSON.stringify(
    registry.sort((a, b) => a.order - b.order),
    null,
    1,
  ),
);
console.log(`blocks: ${registry.length} registered, ${made} pages created`);
