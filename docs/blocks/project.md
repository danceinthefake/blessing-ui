---
title: Project
aside: false
---

# Project

<p class="bless-lead">A team project with a board and a timeline in tabs. Cards move between columns with a limit on work in progress, the timeline shows the plan, and Share opens access by person and by link.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/project-frame')" />

## Into your app

Run `npx blessing-ui add project` to copy the folder to `src/features/project/` (Nuxt: `app/features/project/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./project/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./project/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./project/", ""), src]),
);
</script>
