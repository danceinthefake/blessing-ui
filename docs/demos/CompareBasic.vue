<script setup lang="ts">
import { ref } from "vue";
import { BlessCompare } from "blessing-ui";
import { shots } from "./_data";
const pos = ref(50);
</script>

<template>
  <div class="col" style="max-width: 480px">
    <BlessCompare v-model="pos" style="aspect-ratio: 3 / 2">
      <template #before
        ><img :src="shots[6].src" alt="Episode 1 key frame, flat colour"
      /></template>
      <template #after><img :src="shots[0].src" alt="Episode 1 key frame, final grade" /></template>
    </BlessCompare>
    <small>{{ pos }}% · drag or use ← →</small>
    <BlessCompare orientation="vertical" label="Compare top and bottom" style="aspect-ratio: 3 / 2">
      <template #before><img :src="shots[2].src" alt="Poster, red draft" /></template>
      <template #after><img :src="shots[3].src" alt="Poster, orange final" /></template>
    </BlessCompare>
  </div>
</template>
