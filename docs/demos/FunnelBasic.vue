<script setup lang="ts">
import { BlessFunnel } from "blessing-ui";

const stages = [
  { label: "Visited", value: 12400 },
  { label: "Read the docs", value: 5300 },
  { label: "Installed", value: 1870 },
  { label: "Shipped", value: 420 },
];
</script>

<template>
  <BlessFunnel
    :stages="stages"
    :format="(v: number) => v.toLocaleString('en')"
    label="Adoption funnel"
    style="max-width: 560px"
  />
</template>
