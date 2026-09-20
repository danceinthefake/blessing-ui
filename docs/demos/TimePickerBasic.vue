<script setup lang="ts">
import { ref } from "vue";
import { BlessLabel, BlessTimePicker } from "blessing-ui";
const t = ref("24:00".replace("24", "00"));
const s = ref("13:30");
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
      <BlessLabel>With seconds</BlessLabel>
      <BlessTimePicker model-value="00:00:00" seconds size="lg" />
    </div>
  </div>
</template>
