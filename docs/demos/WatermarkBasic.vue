<script setup lang="ts">
import { BlessText, BlessWatermark } from "blessing-ui";
</script>

<template>
  <div class="boxed" style="position: relative; height: 140px; overflow: hidden">
    <BlessWatermark text="Music" position="top-left" />
    <BlessText as="p" style="position: relative">any positioned parent; aria-hidden</BlessText>
  </div>
</template>
