<script setup lang="ts">
import { ref } from "vue";
import { BlessCompare } from "blessing-ui";
import { shots } from "./_data";
const pos = ref(50);
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessCompare v-model="pos" style="aspect-ratio: 3 / 2">
      <template #before><img :src="shots[6].src" alt="before" /></template>
      <template #after><img :src="shots[0].src" alt="after" /></template>
    </BlessCompare>
    <small>{{ pos }}% · drag or use ← →</small>
  </div>
</template>
