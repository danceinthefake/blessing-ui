<script setup lang="ts">
import { computed, ref } from "vue";
import { BlessButton, BlessContextMeter } from "blessing-ui";

const chat = ref(96_000);
const parts = computed(() => [
  { label: "System prompt", tokens: 3_200 },
  { label: "Show notes (files)", tokens: 41_500 },
  { label: "Chat", tokens: chat.value },
  { label: "Tool results", tokens: 18_300 },
]);
</script>

<template>
  <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
    <BlessContextMeter :parts :max="200_000" />
    <BlessButton size="sm" variant="outline" @click="chat += 12_000"
      >Send a long message</BlessButton
    >
    <BlessButton size="sm" variant="ghost" @click="chat = 96_000">Reset</BlessButton>
  </div>
</template>
