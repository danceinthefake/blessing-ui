---
title: Warehouse
aside: false
---

# Warehouse

<p class="bless-lead">Stock levels against the reorder point, a picking list for each paid order, and deliveries that come in by barcode. A shipped order takes its items off the stock, and the low items go to the supplier in one purchase order.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/warehouse-frame')" />

## Into your app

Run `npx blessing-ui add warehouse` to copy the folder to `src/features/warehouse/` (Nuxt: `app/features/warehouse/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./warehouse/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./warehouse/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./warehouse/", ""), src]),
);
</script>
