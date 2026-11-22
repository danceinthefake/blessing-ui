---
title: Study
aside: false
---

# Study

<p class="bless-lead">Decks of cards that come back by Leitner boxes. A card that you know at the first try moves up a box and waits longer, and a card that you miss goes back to box 1. The meter shows how far each deck is.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/study-frame')" />

## Into your app

Run `npx blessing-ui add study` to copy the folder to `src/features/study/` (Nuxt: `app/features/study/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./study/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./study/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./study/", ""), src]),
);
</script>
