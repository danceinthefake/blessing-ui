<script setup lang="ts">
import { ref } from "vue";
import { BlessWaveform } from "blessing-ui";

// made-up loudness values; on a real page they come from your server or from `src`
const peaks = Array.from({ length: 96 }, (_, i) =>
  Math.abs(Math.sin(i / 6) * 0.6 + Math.sin(i / 2.3) * 0.3 + 0.1),
);
const position = ref(0.35);
const total = 185; // seconds
const clock = (p: number) => {
  const s = Math.round(p * total);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessWaveform
      v-model="position"
      :peaks="peaks"
      :bars="96"
      :value-text="clock"
      label="Seek the track"
    />
    <small>{{ clock(position) }} of {{ clock(1) }}</small>
  </div>
</template>
