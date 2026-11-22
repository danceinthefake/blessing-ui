---
title: Landing page
aside: false
---

# Landing page

<p class="bless-lead">A product landing page: a hero with two calls to action, a logo row, the features, numbers that count up, quotes from customers, an FAQ, and a closing call to action.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/landing-frame')" />

## Into your app

Run `npx blessing-ui add landing` to copy the folder to `src/features/landing/` (Nuxt: `app/features/landing/`). Then render `index.vue` from a page. It has no data layer: the arrays at the top of `index.vue` are where your data goes.

<script setup>
import { withBase } from "vitepress";
import meta from "./landing/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./landing/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./landing/", ""), src]),
);
</script>
