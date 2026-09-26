---
title: Page states
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./states/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./states/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./states/", ""), src]),
);
</script>

# Page states

<p class="bless-lead">The three non-happy paths every list needs — loading skeleton, empty with a call to action, and error with retry — behind one `state` switch.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/states-frame')" />

## Into your app

Copy the folder to `src/features/states/` (Nuxt: `app/features/states/`) and render `index.vue` from a page. There is no data here: replace the `state` picker with your own loading / empty / error / ready state, and put your list where the three rows are.
