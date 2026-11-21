---
title: Blocks
---

<Eyecatch kicker="Volume 03 · finished screens" title="Blocks" num="03" :level="1" />

A block is a finished section, for example a news list, a schedule table, or a login form. Blessing components build it. It ships as **source that you copy into your project**. It is not a package that you import. Run `npx blessing-ui add <block>` to copy the folder into `src/features/`, or copy it by hand. Then rename what you like. Then point its data at your backend. Use the offline `api.ts` if the block has one. Otherwise use the arrays at the top of `index.vue`.

Every block follows one contract:

- `index.vue`: the block. It imports only from `blessing-ui` and its own folder.
- `parts/`: sub-components, for a block that outgrows one file.
- `use<Name>.ts`: state and behavior, as a plain Vue composable.
- `domain.ts` and `api.ts`: types, pure helpers, and a port with an offline mock.

Nothing crosses block folders. Delete one and the others still build.

::: tip Two kinds
**Official site** blocks are the sections of the front page of an anime official site. These are the shapes that Blessing was drawn for. The other groups are product screens. Accounts and admin, People and messages, Work, Money, and Everyday cover every kind of site on the [site types](../design/site-types) page.
:::

<div v-for="g in groups" :key="g">
  <h2>{{ g }}</h2>
  <ChapterCards :items="cards(g)" />
</div>

<script setup>
import blocks from "../.vitepress/blocks.json";
import { withBase } from "vitepress";
const groups = [...new Set(blocks.map((b) => b.group))];
const cards = (g) =>
  blocks
    .filter((b) => b.group === g)
    .map((b) => ({
      title: b.title,
      text: b.summary,
      link: `/blocks/${b.slug}`,
      img: `/preview-${b.slug}.png`,
    }));
</script>
