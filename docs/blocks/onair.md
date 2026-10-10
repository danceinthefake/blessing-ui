---
title: On Air
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./onair/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./onair/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./onair/", ""), src]),
);
</script>

# On Air

<p class="bless-lead">Broadcast schedule as a station table, with streaming services below. On a phone, it stacks into label and value rows.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/onair-frame')" />

## Into your app

Copy the folder to `src/features/onair/` (Nuxt: `app/features/onair/`) and render `index.vue` from a page. It has no data layer: the arrays at the top of `index.vue` are where your data goes.
