<template>
  <div>
    <BlessEventCalendar
      v-model:date="date"
      :events
      label="Team plan"
      @select="(e) => (picked = e)"
    />
    <BlessText v-if="picked" as="p" size="sm"
      >Picked: {{ picked.title }} on {{ picked.date }}</BlessText
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessEventCalendar, BlessText, type BlessCalendarEvent } from "blessing-ui";

const h = (hour: number, min = 0) => hour * 60 + min;
// the plan of a podcast team for November 2026
const events: BlessCalendarEvent[] = [
  { id: "1", title: "Launch week", date: "2026-11-02", color: "success" },
  { id: "2", title: "Record ep. 41", date: "2026-11-03", start: h(10), end: h(12) },
  { id: "3", title: "Edit ep. 41", date: "2026-11-04", start: h(13), end: h(17), color: "chart-2" },
  { id: "4", title: "Publish ep. 41", date: "2026-11-06", start: h(8), color: "chart-3" },
  { id: "5", title: "Guest call", date: "2026-11-10", start: h(9, 30) },
  { id: "6", title: "Record ep. 42", date: "2026-11-10", start: h(11) },
  { id: "7", title: "Sponsor review", date: "2026-11-10", start: h(14), color: "chart-4" },
  { id: "8", title: "Mix ep. 42", date: "2026-11-10", start: h(16), color: "chart-2" },
  { id: "9", title: "Publish ep. 42", date: "2026-11-13", start: h(8), color: "chart-3" },
  { id: "10", title: "Live show", date: "2026-11-20", color: "danger" },
  { id: "11", title: "Year plan", date: "2026-11-27", start: h(10) },
];
const date = ref("2026-11-15");
const picked = ref<BlessCalendarEvent>();
</script>
