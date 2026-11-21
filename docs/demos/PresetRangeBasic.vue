<template>
  <BlessPresetRange v-model="range" today="2026-11-16" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessPresetRange } from "blessing-ui";

// a fixed "today", so the presets are the same on every visit
const range = ref<[string, string]>(["2026-11-10", "2026-11-16"]);
</script>
