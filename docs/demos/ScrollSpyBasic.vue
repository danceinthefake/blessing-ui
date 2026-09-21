<script setup lang="ts">
import { BlessSidebarNav, useScrollSpy } from "blessing-ui";

const sections = [
  { id: "spy-news", label: "News" },
  { id: "spy-story", label: "Story" },
  { id: "spy-cast", label: "Cast" },
];
const { active } = useScrollSpy(
  sections.map((s) => s.id),
  { rootMargin: "-20% 0px -60% 0px" },
);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessSidebarNav
      :items="sections.map((s) => ({ label: s.label, href: `#${s.id}` }))"
      :active="`#${active}`"
      style="position: sticky; top: 80px; min-width: 120px"
    />
    <div class="col" style="max-width: none">
      <section
        v-for="s in sections"
        :id="s.id"
        :key="s.id"
        style="
          min-height: 260px;
          padding: 12px;
          background: var(--bless-color-surface);
          scroll-margin-top: 80px;
        "
      >
        <b>{{ s.label }}</b> — scroll the page; the nav follows.
      </section>
    </div>
  </div>
</template>
