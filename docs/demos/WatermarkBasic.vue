<script setup lang="ts">
import { BlessText, BlessWatermark } from "blessing-ui";
</script>

<template>
  <div style="position: relative; overflow: hidden; padding: 48px 24px; max-width: 560px">
    <BlessWatermark text="NEWS" />
    <BlessText as="p" weight="bold">Episode 3 airs this week</BlessText>
    <BlessText as="p" size="sm" muted>2019.04.18 · 24:00</BlessText>
  </div>
</template>
