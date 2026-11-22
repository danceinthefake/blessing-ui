---
title: Developers
aside: false
---

# Developers

<p class="bless-lead">API keys, a webhook, and a log of each change. A new key shows in full only once. A webhook needs a public https address, and a failed delivery can be sent again.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/developers-frame')" />

## Into your app

Run `npx blessing-ui add developers` to copy the folder to `src/features/developers/` (Nuxt: `app/features/developers/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./developers/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./developers/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./developers/", ""), src]),
);
</script>
