<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessTimePicker } from "blessing-ui";
const t = ref("00:00");
const s = ref("13:30");
const lap = ref("00:01:30");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col" style="max-width: 200px">
      <BlessLabel for="d-t">On air</BlessLabel>
      <BlessTimePicker id="d-t" v-model="t" :step="30" />
      <small>{{ t || "—" }}</small>
    </div>
    <div class="col" style="max-width: 200px">
      <BlessLabel for="d-s">Office hours (12h list)</BlessLabel>
      <BlessTimePicker id="d-s" v-model="s" min="09:00" max="18:00" hour12 size="sm" />
    </div>
    <div class="col" style="max-width: 200px">
      <BlessLabel for="d-lap">Lap time</BlessLabel>
      <BlessTimePicker id="d-lap" v-model="lap" seconds size="lg" />
    </div>
  </div>
</template>
