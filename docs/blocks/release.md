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

<p class="bless-lead">Blu-ray / CD release cards with cover, price, date and a purchase button; the grid collapses to one column on phones.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/release-frame')" />

## Into your app

Copy the folder to `src/features/release/` (Nuxt: `app/features/release/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
