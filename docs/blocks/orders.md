---
title: Orders
aside: false
---

# Orders

<p class="bless-lead">The past orders of a buyer. Open an order to see where it is, cancel it before it ships, or return items within 30 days of delivery. Buy again puts the same items in the cart.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/orders-frame')" />

## Into your app

Run `npx blessing-ui add orders` to copy the folder to `src/features/orders/` (Nuxt: `app/features/orders/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./orders/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./orders/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./orders/", ""), src]),
);
</script>
