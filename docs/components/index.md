---
title: Components
---

<script setup>
import { groups } from "../.vitepress/components";
const total = groups.reduce((n, g) => n + g.items.length, 0);
// the sidebar order: alphabetical inside a group
const cards = (g) =>
  [...g.items]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ title: i.name.replace(/^Bless/, ""), text: i.text, link: `/components/${i.slug}` }));
</script>

<Eyecatch kicker="Volume 02 · the catalog" title="Components" num="02" :level="1" />

Every part of Blessing UI, in {{ groups.length }} groups and {{ total }} pages. Each page opens with when to use the part and when not to, then live demos and the API. Import a part from `blessing-ui`, or let the [resolver or the Nuxt module](../guide/install) import it for you.

<div v-for="g in groups" :key="g.title">
  <h2>{{ g.title }} <small class="count">{{ g.items.length }}</small></h2>
  <ChapterCards :items="cards(g)" />
</div>

<style scoped>
.count {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-normal);
  color: var(--bless-color-text-muted);
}
</style>
