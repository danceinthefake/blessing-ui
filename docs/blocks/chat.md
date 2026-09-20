---
title: Chat
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./chat/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./chat/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./chat/", ""), src]),
);
</script>

# Chat

<p class="bless-lead">A conversation thread that sticks to the bottom, with a composer that sends on Enter and a typing indicator — the LINE-style screen.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/chat-frame')" />

## Into your app

Copy the folder to `src/features/chat/` (Nuxt: `app/features/chat/`) and render `index.vue` from a page. Replace `api.ts` — if the block has one — with your real adapter; the view and the use-case don't change.
