---
title: Blocks
---

<script setup>
import blocks from "../.vitepress/blocks.json";
import { withBase } from "vitepress";
const groups = [...new Set(blocks.map((b) => b.group))];
</script>

# Blocks

A block is a finished section — a news list, a schedule table, a login form — built from Blessing components and shipped as **source you copy into your project**, not a package you import. Copy the folder, rename what you like, wire the mock `api.ts` to your backend.

Every block follows one contract:

- `index.vue` — the block; imports only from `blessing-ui` and its own folder
- `parts/` — sub-components when the block outgrows one file
- `use<Name>.ts` — state and behaviour, plain Vue composable
- `domain.ts` / `api.ts` — types, pure helpers, and a port with an offline mock

Nothing crosses block folders. Delete one and the others still build.

::: tip Two sets
**Official site** blocks are the sections of an anime-official-site front page — the shapes Blessing was drawn for. **App** blocks are the everyday product screens: sign-in, dashboards, settings, data pages.
:::

<div v-for="g in groups" :key="g">
  <h2>{{ g }}</h2>
  <ul>
    <li v-for="b in blocks.filter((x) => x.group === g)" :key="b.slug">
      <a :href="withBase(`/blocks/${b.slug}`)"><strong>{{ b.title }}</strong></a> — {{ b.summary }}
    </li>
  </ul>
</div>
