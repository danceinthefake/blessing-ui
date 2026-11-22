---
title: Status page
aside: false
---

# Status page

<p class="bless-lead">The state of each part of a service, its uptime for 30 days, and the incidents with each update. An open incident sets the state of the parts that it affects. People can get the changes by email.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/status-frame')" />

## Into your app

Run `npx blessing-ui add status` to copy the folder to `src/features/status/` (Nuxt: `app/features/status/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./status/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./status/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./status/", ""), src]),
);
</script>
