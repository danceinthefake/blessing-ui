---
title: Site header
aside: false
---

# Site header

<p class="bless-lead">A wordmark, the main navigation with one dropdown, a theme switch, and a sign-in button. On a phone, the links move into a sheet behind a menu button.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/header-frame')" />

## Into your app

Run `npx blessing-ui add header` to copy the folder to `src/features/header/` (Nuxt: `app/features/header/`). Put `index.vue` in the `#header` slot of [Layout](../components/layout), or at the top of your app shell. Your links go in the `links` array at the top of `index.vue`. To mark the current page, set `active` on its link. Under 720px, the links move into a sheet behind the menu button.

<script setup>
import { withBase } from "vitepress";
import meta from "./header/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./header/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./header/", ""), src]),
);
</script>
