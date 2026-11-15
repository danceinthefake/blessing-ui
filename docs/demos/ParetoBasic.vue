<script setup lang="ts">
import { BlessPareto } from "blessing-ui";

// why listeners stopped an episode early, from a survey of 412 answers
const reasons = [
  { label: "Long intro", value: 128 },
  { label: "Ads", value: 96 },
  { label: "Low sound", value: 74 },
  { label: "Off topic", value: 41 },
  { label: "Echo", value: 29 },
  { label: "Too fast", value: 22 },
  { label: "Music", value: 13 },
  { label: "Other", value: 9 },
];
</script>

<template>
  <BlessPareto :data="reasons" label="Why listeners stopped early" />
</template>
