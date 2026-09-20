---
title: On Air
---

<script setup>
import Block from "./onair/index.vue";
import meta from "./onair/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./onair/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./onair/", ""), src]),
);
</script>

# On Air

<p class="bless-lead">Broadcast schedule as a station table, with streaming services below — stacks into label/value rows on a phone.</p>

<BlockDemo :files :components="meta.components" :height="meta.height">
  <Block />
</BlockDemo>

## Into your app

Copy the folder to `src/features/onair/` (Nuxt: `app/features/onair/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
