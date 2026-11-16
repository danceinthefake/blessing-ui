<script setup lang="ts">
import { BlessBatteryLevel } from "blessing-ui";
</script>

<template>
  <div style="display: grid; gap: 12px; justify-items: start">
    <BlessBatteryLevel :level="86" label="Wireless mic" />
    <BlessBatteryLevel :level="45" charging label="Headphones" />
    <BlessBatteryLevel :level="14" label="Door sensor" />
  </div>
</template>
