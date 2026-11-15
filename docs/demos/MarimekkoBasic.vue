<script setup lang="ts">
import { BlessMarimekko } from "blessing-ui";

// listeners by island and by app, in thousands
const islands = [
  { island: "Java", pod: 62, yt: 41, other: 12 },
  { island: "Sumatra", pod: 18, yt: 16, other: 4 },
  { island: "Bali", pod: 9, yt: 5, other: 2 },
  { island: "Sulawesi", pod: 7, yt: 8, other: 2 },
];
const series = [
  { key: "pod", label: "Podcast apps" },
  { key: "yt", label: "YouTube" },
  { key: "other", label: "Other" },
];
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessMarimekko
    :data="islands"
    x="island"
    :series
    :format="thousands"
    label="Listeners by island and app"
  />
</template>
