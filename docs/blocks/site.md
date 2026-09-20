---
title: Full site
---

<script setup>
import { withBase } from "vitepress";
import meta from "./site/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./site/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./site/", ""), src]),
);
</script>

# Full site

<p class="bless-lead">All six showcase sections inside <code>BlessStage</code> — sidebar nav with scroll-spy, key-visual background, drawer on phones.</p>

`BlessStage` owns the viewport, so this one can't sit inside a doc page. Open it full-page and resize the window: under 800px the sidebar becomes a drawer behind the menu button.

<BlockDemo :files :components="meta.components" :full-page="withBase('/blocks/site-demo')" />

## Into your app

This is a *composition* block — it imports the six section blocks, so copy those folders next to it: `news/`, `onair/`, `character/`, `staff/`, `release/`, `story/`. Put your key visual in the `#background` slot and swap each block's `api.ts` for your CMS.
