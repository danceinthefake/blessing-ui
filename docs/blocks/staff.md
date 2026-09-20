---
title: Staff & Cast
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./staff/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./staff/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./staff/", ""), src]),
);
</script>

# Staff & Cast

<p class="bless-lead">Credits as two definition tables side by side — roles in skewed labels, names beside them.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/staff-frame')" />

## Into your app

Copy the folder to `src/features/staff/` (Nuxt: `app/features/staff/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
