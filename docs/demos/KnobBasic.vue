<script setup lang="ts">
import { ref } from "vue";
import { BlessKnob } from "blessing-ui";
const vol = ref(35);
</script>

<template>
  <div class="row" style="gap: 32px; align-items: flex-end">
    <BlessKnob v-model="vol" label="Volume" :format="(v) => `${v}%`" />
    <BlessKnob :model-value="3" :min="1" :max="5" size="sm" label="Rating" />
    <BlessKnob
      :model-value="-20"
      :min="-60"
      :max="12"
      :step="0.5"
      size="lg"
      label="Gain"
      :sweep="300"
      :format="(v) => `${v} dB`"
    />
    <BlessKnob :model-value="70" disabled label="Locked" />
    <small>drag the dial · keyboard via the native range</small>
  </div>
</template>
