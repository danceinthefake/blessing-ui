---
title: Sign in
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./signin/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./signin/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./signin/", ""), src]),
);
</script>

# Sign in

<p class="bless-lead">Email + password with native validation, remember-me, a forgot link and a divider to OAuth — the form every app starts with.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/signin-frame')" />

## Into your app

Copy the folder to `src/features/signin/` (Nuxt: `app/features/signin/`) and render `index.vue` from a page. Replace `api.ts` with your real adapter; the view and the use-case don't change.
