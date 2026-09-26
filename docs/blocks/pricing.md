---
title: Pricing
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./pricing/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./pricing/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./pricing/", ""), src]),
);
</script>

# Pricing

<p class="bless-lead">Three tiers with a monthly/yearly switch, a highlighted recommended plan and a feature checklist.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/pricing-frame')" />

## Into your app

Copy the folder to `src/features/pricing/` (Nuxt: `app/features/pricing/`) and render `index.vue` from a page. It has no data layer: the arrays at the top of `index.vue` are where your data goes.
