<template>
  <BlessRadialBar :data="goals" label="Goals this week" />
</template>

<script setup lang="ts">
import { BlessRadialBar } from "blessing-ui";

// the goals of a podcast team for one week
const goals = [
  { label: "Episodes published", value: 3, max: 4 },
  { label: "Social clips", value: 9, max: 12 },
  { label: "Guest calls", value: 5, max: 5 },
  { label: "Newsletter", value: 0.5, max: 1 },
];
</script>
