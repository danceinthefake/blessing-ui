---
title: Health
aside: false
---

# Health

<p class="bless-lead">A health tracker for one day: vitals with their normal ranges, the medicines to take, last night's sleep, the habits of the week, and the next doctor visit. Reschedule opens free times in a sheet.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/health-frame')" />

## Into your app

Run `npx blessing-ui add health` to copy the folder to `src/features/health/` (Nuxt: `app/features/health/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./health/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./health/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./health/", ""), src]),
);
</script>
