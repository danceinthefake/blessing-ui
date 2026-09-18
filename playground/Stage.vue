<script setup lang="ts">
import { ref } from "vue";
import {
  BlessBadge,
  BlessDash,
  BlessSection,
  BlessSidebarNav,
  BlessStage,
  BlessText,
  type BlessNavItem,
} from "blessing-ui";

const items: BlessNavItem[] = [
  { label: "Home", href: "#home" },
  { label: "News", href: "#news", meta: "04.04", badge: true },
  { label: "On Air", href: "#onair" },
  { label: "Story", href: "#story" },
  { label: "Character", href: "#character" },
  { label: "Staff & Cast", href: "#staff" },
  { label: "Music", href: "#music" },
  { label: "Blu-ray & DVD", href: "#bd", badge: "BOX" },
  { label: "Shop", href: "https://example.com", external: true },
];
const active = ref("#news");
const open = ref(false);
</script>

<template>
  <BlessStage v-model:open="open">
    <template #background>
      <div
        style="
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            var(--bless-color-surface) 0 12px,
            var(--bless-color-bg) 12px 24px
          );
        "
      />
    </template>
    <template #sidebar>
      <BlessText
        as="p"
        size="xl"
        weight="thin"
        leading="none"
        style="margin-bottom: var(--bless-space-8)"
        >Blessing</BlessText
      >
      <BlessSidebarNav
        :items
        :active
        @select="
          (i, e) => {
            if (!i.external) {
              e.preventDefault();
              active = i.href;
              open = false;
            }
          }
        "
      />
    </template>

    <BlessSection title="News">
      <BlessText as="p" v-for="n in 3" :key="n"
        >2019.04.0{{ n }}<BlessDash /><BlessBadge v-if="n === 1" /> Blu-ray Disc BOX 発売決定 —
        {{ active }}</BlessText
      >
    </BlessSection>
    <BlessSection title="ストーリー" watermark="Story">
      <BlessText as="p" v-for="n in 6" :key="n"
        >第{{ n }}話 — resize under 800px for drawer</BlessText
      >
    </BlessSection>

    <template #footer>
      <BlessText size="2xs" muted>© Blessing UI playground</BlessText>
    </template>
  </BlessStage>
</template>
