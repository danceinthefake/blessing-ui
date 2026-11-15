<script setup lang="ts">
import { BlessBulletChart, BlessStack } from "blessing-ui";

const pct = (v: number) => `${v}%`;
const thousands = (v: number) => `${v}k`;
</script>

<template>
  <BlessStack :gap="3" style="max-width: 560px">
    <BlessBulletChart
      label="Completion"
      :value="72"
      :target="80"
      :bands="[50, 80, 100]"
      :format="pct"
    />
    <BlessBulletChart
      label="Plays"
      :value="41"
      :target="35"
      :bands="[20, 35, 50]"
      :format="thousands"
    />
    <BlessBulletChart label="Rating" :value="4.4" :target="4.5" :min="1" :bands="[3, 4, 5]" />
    <BlessBulletChart label="New members" :value="128" :target="150" color="chart-3" />
  </BlessStack>
</template>
