---
title: Support desk
aside: false
---

# Support desk

<p class="bless-lead">A queue of tickets by the nearest deadline, and a ticket with its replies and notes. The time limits for the first reply and for the fix count only open hours, so a ticket from the weekend starts on Monday morning.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/support-frame')" />

## Into your app

Run `npx blessing-ui add support` to copy the folder to `src/features/support/` (Nuxt: `app/features/support/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./support/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./support/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./support/", ""), src]),
);
</script>
