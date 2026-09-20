---
title: Inbox
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./inbox/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./inbox/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./inbox/", ""), src]),
);
</script>

# Inbox

<p class="bless-lead">Two-pane mail: a list with unread indicators and a reading pane with actions. Collapses to one pane on a phone with a back button.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/inbox-frame')" />

## Into your app

Copy the folder to `src/features/inbox/` (Nuxt: `app/features/inbox/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
