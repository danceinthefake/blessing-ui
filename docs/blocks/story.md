---
title: Story
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./story/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./story/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./story/", ""), src]),
);
</script>

# Story

<p class="bless-lead">Episode list: number, title, air date and a synopsis that expands — with a synopsis-free intro above.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/story-frame')" />

## Into your app

Copy the folder to `src/features/story/` (Nuxt: `app/features/story/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
