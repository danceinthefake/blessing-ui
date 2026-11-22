---
title: Search results
aside: false
---

# Search results

<p class="bless-lead">A search page for a help center: the box, popular searches, results with the words marked, filters with counts, sort, and pages. A misspelled word gets a better spelling to try.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/search-frame')" />

## Into your app

Run `npx blessing-ui add search` to copy the folder to `src/features/search/` (Nuxt: `app/features/search/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./search/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./search/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./search/", ""), src]),
);
</script>
