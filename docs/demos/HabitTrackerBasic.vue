<template>
  <BlessHabitTracker v-model:done="done" :habits end="2026-11-16" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessHabitTracker } from "blessing-ui";

// the habits of a host in the week before a recording; the week ends on a fixed day
const habits = [
  { id: "voice", name: "Warm up the voice" },
  { id: "read", name: "Read one article" },
  { id: "edit", name: "Edit 10 minutes of audio" },
];
const done = ref<Record<string, string[]>>({
  voice: ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-14", "2026-11-15", "2026-11-16"],
  read: ["2026-11-12", "2026-11-13", "2026-11-16"],
  edit: ["2026-11-10", "2026-11-11"],
});
</script>
