<script setup lang="ts">
import { BlessButton, BlessButtonGroup } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessButtonGroup label="Pager">
      <BlessButton variant="outline">←</BlessButton>
      <BlessButton variant="outline">1</BlessButton>
      <BlessButton variant="outline">2</BlessButton>
      <BlessButton variant="outline">→</BlessButton>
    </BlessButtonGroup>
    <BlessButtonGroup label="Actions">
      <BlessButton color="accent">Save</BlessButton>
      <BlessButton color="accent">▾</BlessButton>
    </BlessButtonGroup>
    <BlessButtonGroup orientation="vertical" label="Stack">
      <BlessButton size="sm">Top</BlessButton>
      <BlessButton size="sm">Mid</BlessButton>
      <BlessButton size="sm">End</BlessButton>
    </BlessButtonGroup>
  </div>
</template>
