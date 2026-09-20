---
title: Dashboard
---

<script setup>
import Block from "./dashboard/index.vue";
import meta from "./dashboard/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./dashboard/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./dashboard/", ""), src]),
);
</script>

# Dashboard

<p class="bless-lead">Sidebar + toolbar shell with a stats row, a trend chart and a recent-activity table. Wrap in BlessLayout for drawers on phones.</p>

<BlockDemo :files :components="meta.components" :height="meta.height">
  <Block />
</BlockDemo>

## Into your app

Copy the folder to `src/features/dashboard/` (Nuxt: `app/features/dashboard/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
