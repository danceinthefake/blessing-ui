<script setup lang="ts">
import { ref } from "vue";
import { BlessGantt, BlessSwitch, type BlessGanttTask } from "blessing-ui";

const picked = ref<string | number | null>(null);
const edit = ref(false);
const tasks = ref<BlessGanttTask[]>([
  { id: "plan", label: "Plan the release", start: "2026-09-28", end: "2026-10-02", progress: 100 },
  {
    id: "build",
    label: "Build the components",
    start: "2026-10-01",
    end: "2026-10-14",
    progress: 60,
    after: ["plan"],
  },
  {
    id: "docs",
    label: "Write the docs",
    start: "2026-10-05",
    end: "2026-10-16",
    progress: 25,
    after: ["plan"],
  },
  {
    id: "e2e",
    label: "End-to-end pass",
    start: "2026-10-17",
    end: "2026-10-19",
    after: ["build", "docs"],
  },
  { id: "ship", label: "Publish", start: "2026-10-20", end: "2026-10-20", after: ["e2e"] },
]);
</script>

<template>
  <div class="col">
    <BlessSwitch v-model="edit">Edit the plan</BlessSwitch>
    <BlessGantt
      v-model:tasks="tasks"
      v-model:selected="picked"
      :editable="edit"
      from="2026-09-28"
      to="2026-10-25"
      label="Release schedule"
    />
    <small>{{
      edit
        ? "drag a bar or its edges; Alt + arrows from the keyboard"
        : picked
          ? `selected: ${picked}`
          : "click a bar, or use the arrow keys and Enter"
    }}</small>
  </div>
</template>
