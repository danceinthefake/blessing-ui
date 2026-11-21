---
title: Smart home
aside: false
---

# Smart home

<p class="bless-lead">A smart home app: scenes that set many devices at once, a floor plan that opens a room and its devices, the thermostat, and the batteries that run low. A scene and a device switch stay in step.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/home-frame')" />

## Into your app

Run `npx blessing-ui add home` to copy the folder to `src/features/home/` (Nuxt: `app/features/home/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./home/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./home/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./home/", ""), src]),
);
</script>
