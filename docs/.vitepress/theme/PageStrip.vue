<template>
  <p v-if="kicker" :key="route.path" class="strip" aria-hidden="true">
    <span class="strip__dot" />
    <span>{{ kicker }}</span>
  </p>
</template>

<script setup lang="ts">
// A quiet sentence-case volume line over a leaf page: which volume, which group, which number.
// Replaces the dark uppercase eyecatch strip (revamp 2026-11).
import { computed } from "vue";
import { useRoute } from "vitepress";
import { groups } from "../components";
import blocks from "../blocks.json";

const route = useRoute();
// the number follows the sidebar and the catalog: alphabetical inside a group
const order = groups.flatMap((g) =>
  [...g.items]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => ({ slug: e.slug, group: g.title })),
);
const pad = (n: number) => String(n).padStart(3, "0");

const kicker = computed(() => {
  const path = route.path.replace(/\.html$/, "");
  if (path.endsWith("/")) return "";
  const id = path.startsWith("/id/");
  const [, section, slug] = path.replace(/^\/id/, "").split("/");
  if (section === "components") {
    const i = order.findIndex((e) => e.slug === slug);
    return i < 0 ? "" : `Volume 02 · ${order[i]!.group} · ${pad(i + 1)}`;
  }
  if (section === "blocks") {
    const b = blocks.find((x) => x.slug === (slug ?? "").replace(/-frame$/, ""));
    return b ? `Volume 03 · ${b.group}` : "";
  }
  if (section === "guide") return `Volume 01 · ${id ? "Panduan" : "Guide"}`;
  if (section === "design") return `Volume 04 · ${id ? "Desain" : "Design"}`;
  return "";
});
</script>

<style scoped>
/* aria-hidden: the sidebar already says where the reader is */
.strip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-medium);
  color: var(--bless-color-text-muted);
}
.strip__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--bless-color-accent);
  flex: none;
}
</style>
