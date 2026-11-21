---
title: Settings
aside: false
---

# Settings

<p class="bless-lead">Profile, notifications, and a danger zone as stacked panels in one form. Enter saves and Discard restores. A sticky save bar stays in view.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/settings-frame')" />

## Into your app

Run `npx blessing-ui add settings` to copy the folder to `src/features/settings/` (Nuxt: `app/features/settings/`). Then render `index.vue` from a page. Load `saved` from your API and send `form` in `save()`. Discard already puts `saved` back.

<script setup>
import { withBase } from "vitepress";
import meta from "./settings/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./settings/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./settings/", ""), src]),
);
</script>
