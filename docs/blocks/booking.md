---
title: Booking
aside: false
---

# Booking

<p class="bless-lead">Book a visit in two steps: a service, a day, and a free time, then your details. Closed days cannot be picked. If someone takes the time first, the block says so and goes back to the times.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/booking-frame')" />

## Into your app

Run `npx blessing-ui add booking` to copy the folder to `src/features/booking/` (Nuxt: `app/features/booking/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./booking/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./booking/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./booking/", ""), src]),
);
</script>
