<script setup lang="ts">
import { BlessBadge, BlessMarquee } from "blessing-ui";

const names = ["Vue 3", "Elixir", "Phoenix", "Tiptap", "Vite", "pnpm", "Cloudflare", "Playwright"];
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessMarquee label="Built with" :speed="50">
      <BlessBadge v-for="n in names" :key="n">{{ n }}</BlessBadge>
    </BlessMarquee>
    <BlessMarquee label="Built with, the other way" reverse :speed="30" :controls="false">
      <a v-for="n in names" :key="n" href="#marquee">{{ n }}</a>
    </BlessMarquee>
  </div>
</template>
