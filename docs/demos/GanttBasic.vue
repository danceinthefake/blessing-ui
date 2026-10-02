<script setup lang="ts">
import { ref } from "vue";
import { BlessGantt } from "blessing-ui";

const picked = ref<string | number | null>(null);
const tasks = [
  { id: "plan", label: "Plan the release", start: "2026-09-28", end: "2026-10-02", progress: 100 },
  {
    id: "build",
    label: "Build the components",
    start: "2026-10-01",
    end: "2026-10-14",
    progress: 60,
  },
  { id: "docs", label: "Write the docs", start: "2026-10-05", end: "2026-10-16", progress: 25 },
  { id: "e2e", label: "End-to-end pass", start: "2026-10-14", end: "2026-10-19" },
  { id: "ship", label: "Publish", start: "2026-10-20", end: "2026-10-20" },
];
</script>

<template>
  <div class="col">
    <BlessGantt
      v-model:selected="picked"
      :tasks
      from="2026-09-28"
      to="2026-10-25"
      label="Release schedule"
    />
    <small>{{
      picked ? `selected: ${picked}` : "click a bar, or use the arrow keys and Enter"
    }}</small>
  </div>
</template>
