---
title: Site footer
aside: false
---

# Site footer

<p class="bless-lead">The wordmark with a newsletter signup, three columns of links, and a fine-print row with the copyright and the legal links. The columns stack on a phone.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/footer-frame')" />

## Into your app

Run `npx blessing-ui add footer` to copy the folder to `src/features/footer/` (Nuxt: `app/features/footer/`). Put `index.vue` in the `#footer` slot of [Layout](../components/layout), or at the end of your app shell. Your links go in the arrays at the top of `index.vue`. Replace `api.ts` with a POST to your mailing-list service. The view stays the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./footer/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./footer/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./footer/", ""), src]),
);
</script>
