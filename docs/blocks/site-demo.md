---
layout: page
navbar: false
sidebar: false
aside: false
footer: false
title: Full site
---

<script setup>
import { withBase } from "vitepress";
import Site from "./site/index.vue";
</script>

<Site>
  <template #sidebar-after>
    <p style="margin-top: var(--bless-space-8); font-size: var(--bless-text-xs)">
      <a :href="withBase('/blocks/')">← back to blocks</a>
    </p>
  </template>
</Site>
