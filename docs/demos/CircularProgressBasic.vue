<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessCircularProgress } from "blessing-ui";
const v = ref(35);
</script>

<template>
  <div class="row" style="gap: 24px">
    <BlessCircularProgress :value="v" show-value label="Upload" />
    <BlessCircularProgress :value="80" color="success" :size="64" :thickness="6" show-value />
    <BlessCircularProgress :value="20" color="danger" :size="32" :thickness="3" />
    <BlessCircularProgress label="Loading" />
    <BlessButton size="sm" @click="v = (v + 15) % 101">+15</BlessButton>
  </div>
</template>
