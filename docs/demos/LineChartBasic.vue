<script setup lang="ts">
import { ref } from "vue";
import { BlessChart, BlessLineChart, BlessStack, BlessSwitch } from "blessing-ui";

// listeners a day for two weeks; the app had no data on one day
const start = Date.UTC(2026, 10, 1);
const web = [320, 340, 310, 380, 420, 390, 450, 470, 440, 500, 530, 510, 560, 590];
const app = [210, 230, 260, null, 300, 320, 310, 350, 380, 400, 390, 430, 460, 480];
const data = web.map((w, i) => ({ day: new Date(start + i * 864e5), web: w, app: app[i] }));
const series = [
  { key: "web", label: "Web" },
  { key: "app", label: "App" },
];
const area = ref(false);
</script>

<template>
  <BlessStack :gap="3">
    <BlessSwitch v-model="area">Area</BlessSwitch>
    <BlessChart
      title="Listeners"
      description="Each day in November"
      :legend="['Web', 'App']"
      height="auto"
    >
      <BlessLineChart :data x="day" :series :area x-label="Day" label="Listeners each day" />
    </BlessChart>
  </BlessStack>
</template>
