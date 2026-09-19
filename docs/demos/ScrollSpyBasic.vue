<script setup lang="ts">
import { useScrollSpy } from "blessing-ui";
const ids = ["spy-news", "spy-story", "spy-cast"];
const { active } = useScrollSpy(ids, { rootMargin: "-20% 0px -60% 0px" });
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <nav class="col" style="max-width: 140px; position: sticky; top: 80px">
      <a
        v-for="id in ids"
        :key="id"
        :href="`#${id}`"
        :style="{
          color: active === id ? 'var(--bless-color-accent)' : 'inherit',
          fontWeight: active === id ? 700 : 400,
        }"
      >
        {{ id.replace("spy-", "") }}
      </a>
    </nav>
    <div class="col" style="max-width: none">
      <section
        v-for="id in ids"
        :id
        :key="id"
        style="min-height: 260px; padding: 12px; background: var(--bless-color-surface)"
      >
        <b>{{ id.replace("spy-", "") }}</b> — scroll the page; the nav follows.
      </section>
    </div>
  </div>
</template>
