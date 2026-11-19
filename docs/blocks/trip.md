---
title: Trip
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./trip/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./trip/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./trip/", ""), src]),
);
</script>

# Trip

<p class="bless-lead">A trip helper: search a city, then see its weather for five days, the time there next to the time at home, and the places to visit on a map. Each part does one small job.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/trip-frame')" />

## Into your app

Run `npx blessing-ui add trip` to copy the folder to `src/features/trip/` (Nuxt: `app/features/trip/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.
