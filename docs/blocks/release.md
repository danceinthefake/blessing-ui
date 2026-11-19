---
title: Release
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./release/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./release/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./release/", ""), src]),
);
</script>

# Release

<p class="bless-lead">Blu-ray and CD release cards with cover, price, date, and a purchase button, soonest first. The grid reflows on phones.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/release-frame')" />

## Into your app

Run `npx blessing-ui add release` to copy the folder to `src/features/release/` (Nuxt: `app/features/release/`). Then render `index.vue` from a page. It has no data layer: the arrays at the top of `index.vue` are where your data goes.
