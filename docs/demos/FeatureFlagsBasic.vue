<template>
  <BlessFeatureFlags v-model="enabled" :flags style="max-width: 560px" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessFeatureFlags } from "blessing-ui";

const flags = [
  {
    key: "new-player",
    name: "New player",
    description: "The redesigned audio player with chapters.",
    rollout: 25,
    env: "production",
  },
  {
    key: "ai-notes",
    name: "Show notes from the transcript",
    description: "A draft of the notes after each upload.",
    rollout: 5,
    env: "production",
  },
  {
    key: "live-rooms",
    name: "Live rooms",
    description: "Record with listeners in the room.",
    env: "staging",
  },
  { key: "dark-embed", name: "Dark embed player", rollout: 100, env: "production" },
];
const enabled = ref<Record<string, boolean>>({
  "new-player": true,
  "ai-notes": true,
  "dark-embed": true,
});
</script>
