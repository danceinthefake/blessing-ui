---
title: Podcast
aside: false
---

# Podcast

<p class="bless-lead">A show with its episodes, a player, chapters, and a transcript that follows the audio. Each episode starts where you stopped. Chapters and transcript lines seek the player, and the place is kept as you listen.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/podcast-frame')" />

## Into your app

Run `npx blessing-ui add podcast` to copy the folder to `src/features/podcast/` (Nuxt: `app/features/podcast/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./podcast/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./podcast/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./podcast/", ""), src]),
);
</script>
