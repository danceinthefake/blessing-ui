<script setup lang="ts">
import { ref } from "vue";
import { BlessContinueWatching, type BlessResumeItem } from "blessing-ui";
import { art } from "./_data";

const items = ref<BlessResumeItem[]>([
  {
    id: "hs",
    title: "Home Studio",
    subtitle: "S1 · E2: Pick a microphone",
    image: art("🎙️", "f3e1e7"),
    href: "#hs",
    progress: 0.35,
    minutes: 44,
  },
  {
    id: "en",
    title: "Edit Night",
    subtitle: "S3 · E9: Noise, gone",
    image: art("✂️", "e8f3df"),
    href: "#en",
    progress: 0.8,
    minutes: 28,
  },
  {
    id: "rk",
    title: "Radio Kita Live",
    subtitle: "16 November",
    image: art("📻", "dfe8f3"),
    href: "#rk",
    progress: 0.1,
  },
]);
</script>

<template>
  <BlessContinueWatching :items @remove="(id) => (items = items.filter((i) => i.id !== id))" />
</template>
