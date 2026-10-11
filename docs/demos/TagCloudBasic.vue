<script setup lang="ts">
import { ref } from "vue";
import { BlessTagCloud } from "blessing-ui";

const tags = [
  { label: "vue", weight: 48 },
  { label: "elixir", weight: 31 },
  { label: "accessibility", weight: 27 },
  { label: "tokens", weight: 12 },
  { label: "dark mode", weight: 22 },
  { label: "forms", weight: 36 },
  { label: "charts", weight: 9 },
  { label: "rtl", weight: 6 },
  { label: "motion", weight: 15 },
];
const last = ref("");
</script>

<template>
  <BlessTagCloud :tags="tags" sort="label" @select="last = $event.label" />
  <small>picked: {{ last || "—" }}</small>
</template>
