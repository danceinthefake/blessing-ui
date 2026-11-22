---
title: File manager
aside: false
---

# File manager

<p class="bless-lead">Folders and files in a grid or a list, with the folder path, a search in the folder, and the storage used. Upload adds files to the open folder. Pick a file to see its details, then rename it or delete it.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/files-frame')" />

## Into your app

Run `npx blessing-ui add files` to copy the folder to `src/features/files/` (Nuxt: `app/features/files/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./files/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./files/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./files/", ""), src]),
);
</script>
