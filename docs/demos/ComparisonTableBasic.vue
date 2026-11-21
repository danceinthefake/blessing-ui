<template>
  <BlessComparisonTable :plans :rows label="Compare the hosting plans" style="max-width: 640px" />
</template>

<script setup lang="ts">
import { BlessComparisonTable } from "blessing-ui";

const plans = [
  { key: "free", label: "Hobby", note: "Free" },
  { key: "pro", label: "Creator", note: "$12 a month", highlight: true },
  { key: "team", label: "Network", note: "$49 a month" },
];
const rows = [
  { label: "Hosting", group: true },
  { label: "Audio storage", values: { free: "2 GB", pro: "100 GB", team: "1 TB" } },
  { label: "Shows", values: { free: "1", pro: "3", team: "No limit" } },
  { label: "Custom domain", values: { free: false, pro: true, team: true } },
  { label: "Tools", group: true },
  { label: "Transcripts", values: { free: false, pro: true, team: true } },
  { label: "Chapters", values: { free: true, pro: true, team: true } },
  { label: "Team seats", values: { free: "1", pro: "3", team: "20" } },
  { label: "Priority help", values: { free: false, pro: false, team: true } },
];
</script>
