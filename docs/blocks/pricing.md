---
title: Pricing
---

<script setup>
import Block from "./pricing/index.vue";
import meta from "./pricing/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./pricing/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./pricing/", ""), src]),
);
</script>

# Pricing

<p class="bless-lead">Three tiers with a monthly/yearly switch, a highlighted recommended plan and a feature checklist.</p>

<BlockDemo :files :components="meta.components" :height="meta.height">
  <Block />
</BlockDemo>

## Into your app

Copy the folder to `src/features/pricing/` (Nuxt: `app/features/pricing/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
