---
title: Onboarding
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./onboarding/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./onboarding/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./onboarding/", ""), src]),
);
</script>

# Onboarding

<p class="bless-lead">Three-step first-run wizard — workspace name, invite teammates, pick a palette — with a progress header and a finish screen.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/onboarding-frame')" />

## Into your app

Copy the folder to `src/features/onboarding/` (Nuxt: `app/features/onboarding/`) and render `index.vue` from a page. There is nothing to fetch: on `@finish`, send `form` to your API and route to the workspace instead of starting over.
