<script setup lang="ts">
import { ref } from "vue";
import { BlessDurationInput, BlessLabel } from "blessing-ui";
const run = ref<number | null>(5400);
const short = ref<number | null>(null);
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-run">Run time</BlessLabel>
      <BlessDurationInput id="d-run" v-model="run" />
      <small>seconds: {{ run ?? "—" }} · try 1h 30m, 90s, or 1:15:00</small>
    </div>
    <div class="col">
      <BlessLabel for="d-short">Meeting (h:mm, 15 min to 8 h)</BlessLabel>
      <BlessDurationInput id="d-short" v-model="short" :seconds="false" :min="900" :max="28800" />
    </div>
  </div>
</template>
