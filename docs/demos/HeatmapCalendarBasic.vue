<script setup lang="ts">
import { ref } from "vue";
import { BlessHeatmapCalendar } from "blessing-ui";
import { addDays, toISO } from "../../src/composables/date";

// a made-up year: quiet weekends, a busy stretch, some empty weeks
const end = "2026-10-02";
const data: Record<string, number> = {};
for (let i = 0; i < 371; i++) {
  const d = addDays(new Date(2026, 9, 2), -i);
  const wk = d.getDay() === 0 || d.getDay() === 6;
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  if (r > (wk ? 0.8 : 0.35) && i % 53 > 6) data[toISO(d)] = Math.ceil(r * (i < 60 ? 12 : 6));
}
const picked = ref<string | null>(null);
</script>

<template>
  <div class="col">
    <BlessHeatmapCalendar v-model="picked" :data :end label="Commits" unit="commit" />
    <small>{{ picked ? `picked ${picked}` : "click a day; arrows move by day and week" }}</small>
  </div>
</template>
