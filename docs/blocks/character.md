---
title: Character
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./character/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./character/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./character/", ""), src]),
);
</script>

# Character

<p class="bless-lead">A grid of character cards; each opens a hash-routed modal with the profile and cast. Deep links survive reload.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/character-frame')" />

## Into your app

Copy the folder to `src/features/character/` (Nuxt: `app/features/character/`) and render `index.vue` from a page. Replace `api.ts` with your real adapter; the view and the use-case don't change.
