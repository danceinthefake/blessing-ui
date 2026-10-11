<script setup lang="ts">
import { BlessStat } from "blessing-ui";
</script>

<template>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 1rem"
  >
    <BlessStat
      label="Revenue"
      value="$12,400"
      :delta="12.5"
      :data="[4, 6, 5, 8, 7, 9, 12]"
      data-label="Revenue, last 7 days"
    />
    <BlessStat label="Error rate" value="2.1%" :delta="-0.4" good-when="down" />
    <BlessStat label="Signups" value="318" :delta="-8" data-label="Signups">
      <template #hint>Since last week</template>
    </BlessStat>
    <BlessStat label="Uptime" value="99.98%" :delta="0" />
  </div>
</template>
