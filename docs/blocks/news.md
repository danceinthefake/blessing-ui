---
title: News
---

<script setup>
import Block from "./news/index.vue";
import meta from "./news/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./news/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./news/", ""), src]),
);
</script>

# News

<p class="bless-lead">Dated news rows with NEW! badges under an oversized watermark — the front page of an official site.</p>

<BlockDemo :files :components="meta.components" :height="meta.height">
  <Block />
</BlockDemo>

## Into your app

Copy the folder to `src/features/news/` (Nuxt: `app/features/news/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
