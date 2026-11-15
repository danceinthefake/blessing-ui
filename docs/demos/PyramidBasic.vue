<script setup lang="ts">
import { BlessPyramid } from "blessing-ui";

// the share of listeners of a show in each age group, in percent
const ages = [
  { label: "65+", left: 2.1, right: 2.8 },
  { label: "55–64", left: 4.3, right: 4.9 },
  { label: "45–54", left: 7.8, right: 7.1 },
  { label: "35–44", left: 11.6, right: 10.2 },
  { label: "25–34", left: 15.9, right: 13.4 },
  { label: "18–24", left: 9.7, right: 10.2 },
];
const pct = (v: number) => `${v}%`;
</script>

<template>
  <BlessPyramid
    :data="ages"
    :format="pct"
    :labels="{ left: 'Men', right: 'Women', row: 'Age' }"
    label="Listeners by age and gender"
    style="max-width: 560px"
  />
</template>
