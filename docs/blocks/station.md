---
title: Station
aside: false
---

# Station

<p class="bless-lead">A work station on a shop floor: the work order, a counter of good and scrap units, step-by-step instructions, and a quality check for each unit. Pause asks why the line stopped.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/station-frame')" />

## Into your app

Run `npx blessing-ui add station` to copy the folder to `src/features/station/` (Nuxt: `app/features/station/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./station/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./station/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./station/", ""), src]),
);
</script>
