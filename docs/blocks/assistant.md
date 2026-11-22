---
title: Assistant
aside: false
---

# Assistant

<p class="bless-lead">An AI assistant for a help center. The reply streams in with its plan, the tool it calls, and its sources, and you can stop it. A model that thinks first shows its reasoning. Earlier chats are on the side.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/assistant-frame')" />

## Into your app

Run `npx blessing-ui add assistant` to copy the folder to `src/features/assistant/` (Nuxt: `app/features/assistant/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./assistant/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./assistant/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./assistant/", ""), src]),
);
</script>
