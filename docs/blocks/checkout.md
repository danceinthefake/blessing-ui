---
title: Checkout
aside: false
---

# Checkout

<p class="bless-lead">Three steps from cart to order: the address, a delivery time, and the card. The order summary with a discount code stays next to the steps, and each step says what is missing before it goes on.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/checkout-frame')" />

## Into your app

Run `npx blessing-ui add checkout` to copy the folder to `src/features/checkout/` (Nuxt: `app/features/checkout/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./checkout/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./checkout/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./checkout/", ""), src]),
);
</script>
