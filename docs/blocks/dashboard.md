---
title: Dashboard
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./dashboard/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./dashboard/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./dashboard/", ""), src]),
);
</script>

# Dashboard

<p class="bless-lead">Sidebar and toolbar shell with a stats row, a trend chart, and recent orders. On a phone, the sidebar becomes a strip that scrolls sideways.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/dashboard-frame')" />

## Into your app

Run `npx blessing-ui add dashboard` to copy the folder to `src/features/dashboard/` (Nuxt: `app/features/dashboard/`). Then render `index.vue` from a page. It has no data layer: the arrays at the top of `index.vue` are where your data goes.
