---
title: Help center
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./help/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./help/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./help/", ""), src]),
);
</script>

# Help center

<p class="bless-lead">A help center: a search box, results with a filter by kind, and an article page with sections and related links. With no search, the common questions show. Each article has its own link.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/help-frame')" />

## Into your app

Run `npx blessing-ui add help` to copy the folder to `src/features/help/` (Nuxt: `app/features/help/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.
