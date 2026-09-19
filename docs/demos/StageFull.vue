<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";
import {
  BlessBadge,
  BlessDash,
  BlessSection,
  BlessSidebarNav,
  BlessStage,
  BlessText,
} from "blessing-ui";
import { navItems } from "./_nav";
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
        :items="navItems"
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
      <BlessText as="p" size="xs" muted style="margin-top: var(--bless-space-8)"
        ><a :href="withBase('/components/stage')">← back to docs</a></BlessText
      >
    </template>

    <BlessSection title="News">
      <BlessText as="p" v-for="n in 3" :key="n"
        >2019.04.0{{ n }}<BlessDash /><BlessBadge v-if="n === 1" /> Blu-ray Disc BOX 発売決定 —
        {{ active }}</BlessText
      >
    </BlessSection>
    <BlessSection title="ストーリー" watermark="Story">
      <BlessText as="p" v-for="n in 6" :key="n"
        >第{{ n }}話 — resize under 800px for the drawer</BlessText
      >
    </BlessSection>

    <template #footer>
      <BlessText size="2xs" muted>© Blessing UI</BlessText>
    </template>
  </BlessStage>
</template>
