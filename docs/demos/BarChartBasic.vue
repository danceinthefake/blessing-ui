<template>
  <BlessStack :gap="3">
    <BlessStack direction="row" :gap="4" wrap>
      <BlessSwitch v-model="stacked">Stacked</BlessSwitch>
      <BlessSwitch v-model="horizontal">Horizontal</BlessSwitch>
    </BlessStack>
    <BlessChart
      title="Plays"
      description="Thousands, by month"
      :legend="['Web', 'App']"
      height="auto"
    >
      <BlessBarChart
        :data
        x="month"
        :series
        :stacked
        :horizontal
        :format="(v) => `${v}k`"
        label="Plays by month"
      />
    </BlessChart>
  </BlessStack>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessBarChart, BlessChart, BlessStack, BlessSwitch } from "blessing-ui";

// plays of a podcast in thousands, by month and by app
const data = [
  { month: "Jun", web: 12, app: 18 },
  { month: "Jul", web: 15, app: 22 },
  { month: "Aug", web: 11, app: 26 },
  { month: "Sep", web: 18, app: 31 },
  { month: "Oct", web: 21, app: 29 },
  { month: "Nov", web: 24, app: 35 },
];
const series = [
  { key: "web", label: "Web" },
  { key: "app", label: "App" },
];
const stacked = ref(false);
const horizontal = ref(false);
</script>
