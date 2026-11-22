---
title: Timesheet
aside: false
---

# Timesheet

<p class="bless-lead">A week of time entries, the normal hours and overtime of each day, and the pay so far. Overtime follows the Indonesian rules: 1.5 times for the first hour on a work day, then 2 times, and more on a rest day. A sent week goes to approval and does not change.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/timesheet-frame')" />

## Into your app

Run `npx blessing-ui add timesheet` to copy the folder to `src/features/timesheet/` (Nuxt: `app/features/timesheet/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./timesheet/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./timesheet/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./timesheet/", ""), src]),
);
</script>
