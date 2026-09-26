<script setup lang="ts">
import { BlessButton, BlessButtonGroup } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessButtonGroup label="Pager">
      <BlessButton variant="outline" aria-label="Previous">←</BlessButton>
      <BlessButton variant="outline">1</BlessButton>
      <BlessButton variant="outline">2</BlessButton>
      <BlessButton variant="outline" aria-label="Next">→</BlessButton>
    </BlessButtonGroup>
    <BlessButtonGroup label="Zoom">
      <BlessButton aria-label="Zoom out">−</BlessButton>
      <BlessButton>100%</BlessButton>
      <BlessButton aria-label="Zoom in">+</BlessButton>
    </BlessButtonGroup>
    <BlessButtonGroup orientation="vertical" label="Stack">
      <BlessButton size="sm">Top</BlessButton>
      <BlessButton size="sm">Mid</BlessButton>
      <BlessButton size="sm">End</BlessButton>
    </BlessButtonGroup>
  </div>
</template>
