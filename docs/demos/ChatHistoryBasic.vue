<script setup lang="ts">
import { ref } from "vue";
import { BlessChatHistory, type BlessChat } from "blessing-ui";

// a fixed "now", so the groups are the same on every visit
const now = new Date(2026, 10, 15, 16);
const ago = (days: number, hour = 10) => new Date(2026, 10, 15 - days, hour);
const chats = ref<BlessChat[]>([
  { id: 1, title: "Titles for episode 41", time: ago(0, 15) },
  { id: 2, title: "Questions for Budi", time: ago(0, 9) },
  { id: 3, title: "Fix the echo in the raw file", time: ago(1) },
  { id: 4, title: "Compare two USB microphones", time: ago(4) },
  { id: 5, title: "Show notes for episode 40", time: ago(6) },
  { id: 6, title: "Sponsor message, 30 seconds", time: ago(18) },
  { id: 7, title: "Plan for season two", time: ago(75) },
]);
const selected = ref<string | number>(1);
const rename = (id: string | number, title: string) =>
  (chats.value = chats.value.map((c) => (c.id === id ? { ...c, title } : c)));
const remove = (id: string | number) => (chats.value = chats.value.filter((c) => c.id !== id));
</script>

<template>
  <BlessChatHistory
    v-model:selected="selected"
    :chats
    :now
    style="max-width: 300px"
    @rename="rename"
    @remove="remove"
  />
</template>
