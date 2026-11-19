---
title: Course
aside: false
---

<script setup>
import { withBase } from "vitepress";
import meta from "./course/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./course/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./course/", ""), src]),
);
</script>

# Course

<p class="bless-lead">An online course: the lesson path with locked lessons, the lesson video with notes at a time, and a short quiz. A full score marks the lesson done and opens the next one.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/course-frame')" />

## Into your app

Run `npx blessing-ui add course` to copy the folder to `src/features/course/` (Nuxt: `app/features/course/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.
