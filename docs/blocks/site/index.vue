<script setup lang="ts">
import { ref } from "vue";
import {
  BlessSidebarNav,
  BlessStage,
  BlessText,
  useScrollSpy,
  type BlessNavItem,
} from "blessing-ui";
// composition block: it assembles the sibling showcase blocks, so copy those folders too
import News from "../news/index.vue";
import OnAir from "../onair/index.vue";
import Character from "../character/index.vue";
import Staff from "../staff/index.vue";
import Release from "../release/index.vue";
import Story from "../story/index.vue";

const sections = [
  { id: "news", label: "News", c: News, badge: true },
  { id: "onair", label: "On Air", c: OnAir },
  { id: "character", label: "Character", c: Character },
  { id: "staff", label: "Staff & Cast", c: Staff },
  { id: "release", label: "Release", c: Release, badge: "BOX" },
  { id: "story", label: "Story", c: Story },
];
const nav: BlessNavItem[] = [
  ...sections.map((s) => ({ label: s.label, href: `#${s.id}`, badge: s.badge })),
  { label: "Shop", href: "https://example.com", external: true },
];
const open = ref(false);
const { active } = useScrollSpy(sections.map((s) => s.id));
</script>

<template>
  <BlessStage v-model:open="open">
    <template #background>
      <!-- key visual goes here; a gradient stands in -->
      <div class="site__kv" />
    </template>
    <template #sidebar>
      <!-- the site's name is the page's one h1; each section below carries its own h2 -->
      <BlessText as="h1" size="xl" weight="thin" leading="none" class="site__brand"
        >Blessing</BlessText
      >
      <BlessText as="p" size="2xs" muted tracking="wider" uppercase class="site__sub"
        >TV Anime Official</BlessText
      >
      <BlessSidebarNav
        :items="nav"
        :active="`#${active}`"
        @select="(i) => !i.external && (open = false)"
      />
      <slot name="sidebar-after" />
    </template>

    <section v-for="s in sections" :id="s.id" :key="s.id" class="site__section">
      <component :is="s.c" />
    </section>

    <template #footer>
      <BlessText size="2xs" muted>© Blessing Software</BlessText>
    </template>
  </BlessStage>
</template>

<style scoped>
.site__kv {
  height: 100%;
  background:
    radial-gradient(
      60% 80% at 80% 20%,
      color-mix(in srgb, var(--bless-color-accent) 18%, transparent),
      transparent
    ),
    linear-gradient(180deg, var(--bless-color-surface), var(--bless-color-bg));
}
.site__brand {
  margin-bottom: var(--bless-space-1);
}
.site__sub {
  margin-bottom: var(--bless-space-8);
}
.site__section {
  scroll-margin-top: var(--bless-space-6);
}
.site__section + .site__section {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
