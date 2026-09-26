---
title: Data page
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./data-page/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./data-page/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./data-page/", ""), src]),
);
</script>

# Data page

<p class="bless-lead">Breadcrumb, title row with primary action, a status filter and a sortable, searchable, selectable data table whose bulk Remove can be undone.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/data-page-frame')" />

## Into your app

Copy the folder to `src/features/data-page/` (Nuxt: `app/features/data-page/`) and render `index.vue` from a page. Replace `api.ts` with your real adapter; the view and the use-case don't change.
