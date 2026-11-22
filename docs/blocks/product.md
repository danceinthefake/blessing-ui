---
title: Product page
aside: false
---

# Product page

<p class="bless-lead">One product: photos with a lightbox, the price, color and size with sold-out sizes, the quantity, and Add to cart. Tabs hold the description, the details, and the reviews, which filter by stars. Related products close the page.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/product-frame')" />

## Into your app

Run `npx blessing-ui add product` to copy the folder to `src/features/product/` (Nuxt: `app/features/product/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./product/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./product/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./product/", ""), src]),
);
</script>
