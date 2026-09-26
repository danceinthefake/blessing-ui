<script setup lang="ts">
import { BlessButton, BlessStack } from "blessing-ui";
</script>

<template>
  <BlessStack :gap="4">
    <BlessStack direction="row" :gap="2">
      <BlessButton size="sm">row</BlessButton>
      <BlessButton size="sm" variant="outline">gap 2</BlessButton>
    </BlessStack>
    <BlessStack direction="row" justify="between" align="center">
      <span>space-between</span>
      <BlessButton size="sm">→</BlessButton>
    </BlessStack>
    <BlessStack direction="row" :gap="1" wrap>
      <BlessButton v-for="n in 8" :key="n" size="sm" variant="ghost">{{ n }}</BlessButton>
    </BlessStack>
  </BlessStack>
</template>
