---
title: Find a time
aside: false
---

# Find a time

<p class="bless-lead">A poll for a meeting time. You mark when you are free, the heatmap shows how many people are free at each time, and the best times come first: the most people for the whole meeting, then the earliest.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/meet-frame')" />

## Into your app

Run `npx blessing-ui add meet` to copy the folder to `src/features/meet/` (Nuxt: `app/features/meet/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./meet/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./meet/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./meet/", ""), src]),
);
</script>
