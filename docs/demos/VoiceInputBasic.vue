<template>
  <div style="max-width: 480px; display: flex; flex-direction: column; gap: 8px">
    <BlessTextarea
      v-model="notes"
      :rows="4"
      aria-label="Notes for the episode"
      placeholder="Press the microphone and speak"
    />
    <BlessVoiceInput v-model="notes" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessTextarea, BlessVoiceInput } from "blessing-ui";

const notes = ref("");
</script>
