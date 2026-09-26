<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessProgress } from "blessing-ui";
const value = ref(35);
</script>

<template>
  <div class="col">
    <BlessProgress :value label="Upload" show-value />
    <BlessProgress :value="80" color="success" size="sm" label="Synced" />
    <BlessProgress :value="20" color="danger" size="lg" label="Battery" />
    <BlessProgress
      :value="42"
      :max="128"
      label="Download"
      show-value
      :format="(v, m) => `${v} of ${m} MB`"
    />
    <BlessProgress label="Preparing" />
    <div class="row">
      <BlessButton size="sm" @click="value = Math.min(100, value + 15)">+15</BlessButton>
      <BlessButton size="sm" variant="outline" @click="value = 0">Reset</BlessButton>
    </div>
  </div>
</template>
