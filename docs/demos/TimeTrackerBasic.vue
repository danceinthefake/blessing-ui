<template>
  <BlessTimeTracker v-model="entries" v-model:running="running" time-zone="Asia/Jakarta" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessTimeTracker, type BlessTimeEntry } from "blessing-ui";

// times in Jakarta (UTC+7); the timeZone prop keeps the server and the browser in step
const at = (d: number, h: number, m: number) => Date.UTC(2026, 10, d, h - 7, m);
const entries = ref<BlessTimeEntry[]>([
  { id: "1", task: "Mix episode 42", start: at(17, 9, 0), end: at(17, 10, 35) },
  { id: "2", task: "Reply to sponsors", start: at(17, 10, 50), end: at(17, 11, 20) },
  { id: "3", task: "Record the intro", start: at(16, 13, 0), end: at(16, 14, 10) },
  { id: "4", task: "Edit show notes", start: at(16, 14, 30), end: at(16, 15, 15) },
]);
const running = ref<{ task: string; start: number } | null>(null);
</script>
