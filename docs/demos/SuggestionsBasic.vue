<script setup lang="ts">
import { ref } from "vue";
import { BlessPromptInput, BlessStack, BlessSuggestions, BlessText } from "blessing-ui";

const items = [
  { label: "Name this episode", prompt: "Suggest three short titles for this episode.", icon: "🏷" },
  { label: "Write show notes", prompt: "Write show notes with the main points.", icon: "📝" },
  { label: "Find quotes", prompt: "Find three quotes for social posts.", icon: "💬" },
  "Translate to Indonesian",
];
const sent = ref("");
</script>

<template>
  <BlessStack :gap="3" style="max-width: 560px">
    <BlessSuggestions :items @select="(p) => (sent = p)" />
    <BlessPromptInput @send="(m) => (sent = m.text)" />
    <BlessText v-if="sent" as="p" size="sm">Sent: {{ sent }}</BlessText>
  </BlessStack>
</template>
