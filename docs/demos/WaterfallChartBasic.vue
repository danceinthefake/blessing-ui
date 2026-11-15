<script setup lang="ts">
import { BlessChart, BlessWaterfallChart, type BlessWaterfallStep } from "blessing-ui";

// the money of a podcast in one month, in dollars
const steps: BlessWaterfallStep[] = [
  { label: "Start", value: 1200 },
  { label: "Sponsors", value: 2400 },
  { label: "Members", value: 860 },
  { label: "Hosting", value: -320 },
  { label: "Editing", value: -1500 },
  { label: "Gear", value: -540 },
  { label: "End", total: true },
];
const dollars = (v: number) => `$${v}`;
</script>

<template>
  <BlessChart
    title="Cash this month"
    description="Dollars, from the start of the month to the end"
    height="auto"
  >
    <BlessWaterfallChart :steps :format="dollars" label="Cash this month" />
  </BlessChart>
</template>
