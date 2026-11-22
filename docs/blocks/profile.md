---
title: Profile
aside: false
---

# Profile

<p class="bless-lead">A public profile: cover, avatar, bio, and counts with Follow, a year of activity as a heatmap, and tabs for works, recent activity, and badges. Follow updates the count at once and undoes it if the server says no.</p>

<BlockDemo :files :components="meta.components" :height="meta.height" :frame="withBase('/blocks/profile-frame')" />

## Into your app

Run `npx blessing-ui add profile` to copy the folder to `src/features/profile/` (Nuxt: `app/features/profile/`). Then render `index.vue` from a page. Replace `api.ts` with your real adapter. The view and the use-case stay the same.

<script setup>
import { withBase } from "vitepress";
import meta from "./profile/meta";
const files = Object.fromEntries(
  Object.entries(import.meta.glob("./profile/**/*.{vue,ts}", { query: "?raw", import: "default", eager: true }))
    .filter(([p]) => !p.endsWith("meta.ts"))
    .map(([p, src]) => [p.replace("./profile/", ""), src]),
);
</script>
