<template>
  <BlessWorkoutLog
    v-model="sets"
    exercise="Back squat"
    :previous="[
      { weight: 57.5, reps: 8 },
      { weight: 60, reps: 8 },
      { weight: 60, reps: 7 },
    ]"
    style="max-width: 480px"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessWorkoutLog, type BlessWorkoutSet } from "blessing-ui";

const sets = ref<BlessWorkoutSet[]>([
  { weight: 60, reps: 8, done: true },
  { weight: 62.5, reps: 8, done: true },
  { weight: 62.5, reps: 6 },
]);
</script>
