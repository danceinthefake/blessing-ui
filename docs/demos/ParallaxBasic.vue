<script setup lang="ts">
import { BlessParallax, BlessText } from "blessing-ui";
import { shots } from "./_data";
</script>

<template>
  <BlessParallax :src="shots[5].src" height="240px" :speed="0.4">
    <BlessText size="xl" weight="thin" style="text-shadow: 0 2px 12px rgb(0 0 0 / 0.5)"
      >scroll</BlessText
    >
  </BlessParallax>
</template>
