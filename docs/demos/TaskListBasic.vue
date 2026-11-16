<script setup lang="ts">
import { ref } from "vue";
import { BlessTaskList, type BlessTask } from "blessing-ui";

// a fixed "today", so the late task is late on every visit
const tasks = ref<BlessTask[]>([
  {
    id: "edit",
    title: "Edit episode 41",
    due: "2026-11-14",
    assignee: { name: "Budi Santoso" },
    subtasks: [
      { id: "edit-1", title: "Cut the long intro", done: true },
      { id: "edit-2", title: "Level the two voices" },
      { id: "edit-3", title: "Export at −16 LUFS" },
    ],
  },
  {
    id: "notes",
    title: "Write the show notes",
    due: "2026-11-18",
    assignee: { name: "Ana Putri" },
  },
  { id: "cover", title: "Make the cover art", due: "2026-11-20" },
  {
    id: "guest",
    title: "Book the guest for episode 42",
    done: true,
    assignee: { name: "Ana Putri" },
  },
]);
</script>

<template>
  <BlessTaskList v-model="tasks" today="2026-11-16" style="max-width: 560px" />
</template>
