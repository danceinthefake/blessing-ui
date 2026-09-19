<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessProgress } from "blessing-ui";
const value = ref(35);
</script>

<template>
  <div class="col">
    <BlessProgress :value label="Upload" show-value />
    <BlessProgress :value="80" color="success" size="sm" />
    <BlessProgress :value="20" color="danger" size="lg" />
    <BlessProgress label="Indeterminate" />
    <div class="row">
      <BlessButton size="sm" @click="value = Math.min(100, value + 15)">+15</BlessButton>
      <BlessButton size="sm" variant="outline" @click="value = 0">reset</BlessButton>
    </div>
  </div>
</template>
