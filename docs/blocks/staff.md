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

<p class="bless-lead">Credits as two definition lists side by side, with roles in ink labels and names beside them. On a phone, they stack.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/staff-frame')" />

## Into your app

Run `npx blessing-ui add staff` to copy the folder to `src/features/staff/` (Nuxt: `app/features/staff/`). Then render `index.vue` from a page. It has no data layer: the arrays at the top of `index.vue` are where your data goes.
