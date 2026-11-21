---
title: Character
aside: false
---

# Character

<p class="bless-lead">A grid of character cards. Each card opens a hash-routed modal with the profile and cast. Deep links survive reload.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/character-frame')" />

## Into your app

Run `npx blessing-ui add character` to copy the folder to `src/features/character/` (Nuxt: `app/features/character/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./character/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./character/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./character/", ""), src]),
);
</script>
