---
title: Settings
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./settings/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./settings/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./settings/", ""), src]),
);
</script>

# Settings

<p class="bless-lead">Profile, notifications and a danger zone as stacked panels in one form — Enter saves, Discard restores — with a sticky save bar.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/settings-frame')" />

## Into your app

Copy the folder to `src/features/settings/` (Nuxt: `app/features/settings/`) and render `index.vue` from a page. Load `saved` from your API and send `form` in `save()`; Discard already puts `saved` back.
