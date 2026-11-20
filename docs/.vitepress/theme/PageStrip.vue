<script setup lang="ts">
// A slim eyecatch over the title of a leaf page: which volume, which group, which number.
// A landing page (an index) opens with a full Eyecatch instead, so it gets no strip.
import { computed } from "vue";
import { useRoute } from "vitepress";
import { groups } from "../components";
import blocks from "../blocks.json";

const route = useRoute();
const order = groups.flatMap((g) => g.items.map((e) => ({ slug: e.slug, group: g.title })));
const pad = (n: number) => String(n).padStart(3, "0");

const kicker = computed(() => {
  const path = route.path.replace(/\.html$/, "");
  if (path.endsWith("/")) return "";
  const id = path.startsWith("/id/");
  const [, section, slug] = path.replace(/^\/id/, "").split("/");
  if (section === "components") {
    const i = order.findIndex((e) => e.slug === slug);
    return i < 0 ? "" : `${order[i]!.group} · ${pad(i + 1)}`;
  }
  if (section === "blocks") {
    const b = blocks.find((x) => x.slug === (slug ?? "").replace(/-frame$/, ""));
    return b ? `Volume 02 · ${b.group}` : "";
  }
  if (section === "guide") return `Volume 01 · ${id ? "Panduan" : "Guide"}`;
  if (section === "design") return `Volume 03 · ${id ? "Desain" : "Design"}`;
  return "";
});
</script>

<template>
  <div v-if="kicker" :key="route.path" class="strip" aria-hidden="true">
    <span class="strip__text">{{ kicker }}</span>
    <span class="strip__slash" />
  </div>
</template>

<style scoped>
/* aria-hidden: the sidebar already says where the reader is */
.strip {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 32px;
  margin-bottom: 20px;
  padding-inline: 14px;
  background: var(--bless-color-media-bg);
}
.strip__text {
  position: relative;
  z-index: 1;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #fff;
}
.strip__slash {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -12px;
  width: 30%;
  background: var(--bless-color-accent);
  transform: skewX(var(--bless-lean));
}
</style>
