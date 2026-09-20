---
title: Data page
---

<script setup>
import Block from "./data-page/index.vue";
import meta from "./data-page/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./data-page/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./data-page/", ""), src]),
);
</script>

# Data page

<p class="bless-lead">Breadcrumb, title row with primary action, filter chips and a sortable, searchable, selectable data table with bulk actions.</p>

<BlockDemo :files :components="meta.components" :height="meta.height">
  <Block />
</BlockDemo>

## Into your app

Copy the folder to `src/features/data-page/` (Nuxt: `app/features/data-page/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
