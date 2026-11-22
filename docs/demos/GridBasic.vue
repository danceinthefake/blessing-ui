<template>
  <BlessGrid :columns="3" min="10rem" :gap="3">
    <div v-for="n in 6" :key="n" class="cell">{{ n }}</div>
  </BlessGrid>
</template>

<script setup lang="ts">
import { BlessGrid } from "blessing-ui";
</script>

<style scoped>
.cell {
  padding: var(--bless-space-6);
  border: 1px solid var(--bless-color-border);
  background: var(--bless-color-surface);
  text-align: center;
}
</style>
