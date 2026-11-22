---
title: Billing
aside: false
---

# Billing

<p class="bless-lead">The plan, the usage, the card, and the invoices of an account. An overdue invoice shows at the top with a way to pay it. A smaller plan that cannot hold your seats or files says what to remove first.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/billing-frame')" />

## Into your app

Run `npx blessing-ui add billing` to copy the folder to `src/features/billing/` (Nuxt: `app/features/billing/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./billing/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./billing/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./billing/", ""), src]),
);
</script>
