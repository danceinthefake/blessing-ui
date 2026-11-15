<script setup lang="ts">
import { BlessBeeswarm } from "blessing-ui";

// the length of each episode of two show formats, in minutes
const interviews = [52, 47, 61, 58, 44, 49, 55, 63, 51, 46, 57, 50, 48, 66, 53, 45, 59, 54, 49, 52];
const solo = [21, 25, 18, 27, 23, 19, 31, 24, 22, 26, 20, 28, 33, 24, 22];
const data = [
  ...interviews.map((value, i) => ({ value, group: "interview", label: `Interview ${i + 1}` })),
  ...solo.map((value, i) => ({ value, group: "solo", label: `Solo ${i + 1}` })),
];
const groups = [
  { key: "interview", label: "Interviews" },
  { key: "solo", label: "Solo episodes" },
];
const minutes = (v: number) => `${v} min`;
</script>

<template>
  <BlessBeeswarm :data :groups :format="minutes" label="Length of each episode" />
</template>
