<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";
import { BlessBottomTabs, BlessButton, BlessLayout, BlessSidebarNav, BlessText } from "blessing-ui";
import { navItems } from "./_nav";
const left = ref(false);
const right = ref(false);
const tab = ref("home");
</script>

<template>
  <BlessLayout v-model:left="left" v-model:right="right" :breakpoint="900">
    <template #header>
      <div style="display: flex; align-items: center; gap: 12px; padding: 10px 16px">
        <BlessButton size="sm" variant="ghost" aria-label="Menu" @click="left = !left"
          >☰</BlessButton
        >
        <BlessText weight="bold" style="flex: 1">Blessing</BlessText>
        <BlessButton size="sm" variant="ghost" aria-label="Filters" @click="right = !right"
          >⚙</BlessButton
        >
      </div>
    </template>
    <template #left>
      <div style="padding: 16px">
        <BlessSidebarNav
          :items="navItems"
          active="#news"
          @select="
            (i, e) => {
              if (!i.external) {
                e.preventDefault();
                left = false;
              }
            }
          "
        />
        <BlessText as="p" size="xs" muted style="margin-top: 24px"
          ><a :href="withBase('/components/layout')">← back to docs</a></BlessText
        >
      </div>
    </template>
    <template #right>
      <div style="padding: 16px">
        <BlessText weight="bold">Filters</BlessText
        ><BlessText as="p" size="sm" muted>right drawer</BlessText>
      </div>
    </template>
    <div style="padding: 16px; max-width: 720px">
      <BlessText as="h1" size="lg" weight="light">Layout</BlessText>
      <BlessText as="p" size="sm" muted
        >Resize below 900px: drawers go off-canvas, swipe in from the edges on touch, header hides
        on scroll down. Above: drawers sit beside the page.</BlessText
      >
      <BlessText v-for="n in 80" :key="n" as="p"
        >第{{ n }}話 — scroll to see the header reveal</BlessText
      >
    </div>
    <template #footer>
      <BlessBottomTabs
        v-model="tab"
        inline
        :items="[
          { label: 'Home', value: 'home', icon: '⌂' },
          { label: 'Search', value: 'search', icon: '⌕' },
          { label: 'Me', value: 'me', icon: '◯' },
        ]"
      />
    </template>
  </BlessLayout>
</template>
