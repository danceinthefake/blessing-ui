<script setup lang="ts">
import { BlessButton } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessButton href="#">Link</BlessButton>
    <BlessButton disabled>Disabled</BlessButton>
    <BlessButton loading color="accent">Saving</BlessButton>
    <BlessButton color="accent"><template #prefix>▶</template>Play</BlessButton>
    <BlessButton icon aria-label="Settings" variant="outline">⚙</BlessButton>
    <BlessButton href="#" disabled>Disabled link</BlessButton>
  </div>
  <BlessButton block color="accent" style="margin-top: 12px">Block — full width</BlessButton>
</template>
