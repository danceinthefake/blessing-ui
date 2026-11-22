---
title: Article
aside: false
---

# Article

<p class="bless-lead">A long read with its reading time, a table of contents that follows the page, a pull quote, notes, and articles to read next. The editor writes notes inline, and the block numbers them in the order that they show.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/article-frame')" />

## Into your app

Run `npx blessing-ui add article` to copy the folder to `src/features/article/` (Nuxt: `app/features/article/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./article/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./article/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./article/", ""), src]),
);
</script>
