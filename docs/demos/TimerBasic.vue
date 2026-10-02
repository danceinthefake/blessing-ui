<script setup lang="ts">
import { BlessTimer } from "blessing-ui";
</script>

<template>
  <div class="col" style="gap: 2rem">
    <div>
      <small>Countdown</small>
      <BlessTimer :duration="90" />
    </div>
    <div>
      <small>Stopwatch</small>
      <BlessTimer mode="stopwatch" />
    </div>
    <div>
      <small>Interval: 3 rounds of work and rest</small>
      <BlessTimer
        mode="interval"
        :phases="[
          { label: 'Work', seconds: 25 },
          { label: 'Rest', seconds: 5 },
        ]"
        :rounds="3"
      />
    </div>
  </div>
</template>
