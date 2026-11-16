<script setup lang="ts">
import { BlessControlChart } from "blessing-ui";

// the length of the mic body, one sample each half hour; the limits come from earlier runs
const values = [
  120.02, 119.98, 120.05, 120.01, 119.96, 120.03, 120.0, 120.07, 120.19, 120.04, 119.99, 120.02,
  119.81, 120.01,
];
const points = values.map(
  (_, i) => `${String(7 + Math.floor((i + 1) / 2)).padStart(2, "0")}:${i % 2 ? "00" : "30"}`,
);
</script>

<template>
  <BlessControlChart :values :points :center="120.01" :ucl="120.15" :lcl="119.87" unit="mm" />
</template>
