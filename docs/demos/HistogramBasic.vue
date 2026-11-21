<template>
  <BlessChart
    title="Time listened"
    description="Minutes, 400 listeners of episode 41"
    height="auto"
  >
    <BlessHistogram :values :bins :format="(v) => `${v}`" label="Minutes listened" />
    <template #footer>
      <BlessSlider
        v-model="bins"
        :min="4"
        :max="30"
        show-value
        label="About how many bins"
        style="max-width: 280px"
      />
    </template>
  </BlessChart>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessChart, BlessHistogram, BlessSlider } from "blessing-ui";

// minutes that 400 listeners stayed: many leave early, a second group stays to the end
const values = Array.from({ length: 400 }, (_, i) => {
  const r = ((i * 7919) % 1000) / 1000;
  return i % 3 === 0 ? Math.round(38 + r * 8) : Math.round(2 + r * r * 30);
});
const bins = ref(12);
</script>
