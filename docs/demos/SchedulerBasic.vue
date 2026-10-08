<script setup lang="ts">
import { ref } from "vue";
import { BlessScheduler, type BlessScheduleEvent } from "blessing-ui";

const events = ref<BlessScheduleEvent[]>([
  { id: "e1", title: "Standup", date: "2026-10-12", start: 9 * 60, end: 9 * 60 + 30 },
  { id: "e2", title: "Design review", date: "2026-10-13", start: 10 * 60, end: 11 * 60 + 30 },
  { id: "e3", title: "1:1", date: "2026-10-13", start: 10 * 60 + 30, end: 11 * 60 },
  { id: "e4", title: "Lunch", date: "2026-10-15", start: 12 * 60, end: 13 * 60 },
]);
const date = ref<string | null>("2026-10-14");
const selected = ref<string | null>(null);
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessScheduler
      v-model="events"
      v-model:date="date"
      v-model:selected="selected"
      :day-start="8"
      :day-end="18"
      label="Team calendar"
    />
  </div>
</template>
