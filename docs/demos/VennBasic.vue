<template>
  <BlessVenn :sets :overlaps :format="thousands" label="Where people follow the show" />
</template>

<script setup lang="ts">
import { BlessVenn } from "blessing-ui";

// people who follow the show in each place, in thousands
const sets = [
  { key: "pod", label: "Podcast apps", size: 48 },
  { key: "yt", label: "YouTube", size: 36 },
  { key: "mail", label: "Newsletter", size: 21 },
];
const overlaps = [
  { keys: ["pod", "yt"], size: 14 },
  { keys: ["pod", "mail"], size: 11 },
  { keys: ["yt", "mail"], size: 6 },
  { keys: ["pod", "yt", "mail"], size: 4 },
];
const thousands = (v: number) => `${v}k`;
</script>
