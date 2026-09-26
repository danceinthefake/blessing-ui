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

<p class="bless-lead">A conversation thread that sticks to the bottom, with a composer that sends on Enter (never mid-IME conversion) and a typing indicator.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/chat-frame')" />

## Into your app

Copy the folder to `src/features/chat/` (Nuxt: `app/features/chat/`) and render `index.vue` from a page. Messages live in `useChat.ts`; swap its canned reply for your socket or API, and `send()` for your post call.
