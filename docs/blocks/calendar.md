---
title: Calendar
aside: false
---

# Calendar

<p class="bless-lead">A month of events that repeat by a rule, seen in a time zone you pick. Each event keeps the zone it was made in, so a clock change does not move it. A new event says what it overlaps.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/calendar-frame')" />

## Into your app

Run `npx blessing-ui add calendar` to copy the folder to `src/features/calendar/` (Nuxt: `app/features/calendar/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./calendar/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./calendar/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./calendar/", ""), src]),
);
</script>
