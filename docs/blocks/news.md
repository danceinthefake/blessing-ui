---
title: News
aside: false
---

# News

<p class="bless-lead">Dated news rows with NEW! badges and category tabs under an oversized watermark: the front page of an official site.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/news-frame')" />

## Into your app

Run `npx blessing-ui add news` to copy the folder to `src/features/news/` (Nuxt: `app/features/news/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./news/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./news/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./news/", ""), src]),
);
</script>
