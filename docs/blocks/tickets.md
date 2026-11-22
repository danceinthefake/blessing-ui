---
title: Tickets
aside: false
---

# Tickets

<p class="bless-lead">Seats for a show: pick them on the map, or ask for the best seats side by side in a zone. A seat that someone takes first comes off your order with a reason, and paid seats become tickets with a code.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/tickets-frame')" />

## Into your app

Run `npx blessing-ui add tickets` to copy the folder to `src/features/tickets/` (Nuxt: `app/features/tickets/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./tickets/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./tickets/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./tickets/", ""), src]),
);
</script>
