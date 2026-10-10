---
title: Blocks
---

<script setup>
import blocks from "../.vitepress/blocks.json";
import { withBase } from "vitepress";
const groups = [...new Set(blocks.map((b) => b.group))];
</script>

# Blocks

A block is a finished section, for example a news list, a schedule table, or a login form. Blessing components build it. It ships as **source that you copy into your project**. It is not a package that you import. Copy the folder and rename what you like. Then point its data at your backend. Use the offline `api.ts` if the block has one. Otherwise use the arrays at the top of `index.vue`.

Every block follows one contract:

- `index.vue`: the block. It imports only from `blessing-ui` and its own folder.
- `parts/`: sub-components, for a block that outgrows one file.
- `use<Name>.ts`: state and behavior, as a plain Vue composable.
- `domain.ts` and `api.ts`: types, pure helpers, and a port with an offline mock.

Nothing crosses block folders. Delete one and the others still build.

::: tip Two sets
**Official site** blocks are the sections of the front page of an anime official site. These are the shapes that Blessing was drawn for. **App** blocks are the everyday product screens: sign-in, dashboards, settings, data pages.
:::

<div v-for="g in groups" :key="g">
  <h2>{{ g }}</h2>
  <ul>
    <li v-for="b in blocks.filter((x) => x.group === g)" :key="b.slug">
      <a :href="withBase(`/blocks/${b.slug}`)"><strong>{{ b.title }}</strong></a> — {{ b.summary }}
    </li>
  </ul>
</div>
