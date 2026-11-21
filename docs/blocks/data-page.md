---
title: Data page
aside: false
---

# Data page

<p class="bless-lead">Breadcrumb, a title row with a primary action, a status filter, and a sortable, searchable, selectable data table. A person can undo the bulk Remove.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/data-page-frame')" />

## Into your app

Run `npx blessing-ui add data-page` to copy the folder to `src/features/data-page/` (Nuxt: `app/features/data-page/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./data-page/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./data-page/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./data-page/", ""), src]),
);
</script>
