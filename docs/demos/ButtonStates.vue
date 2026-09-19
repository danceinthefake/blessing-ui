<script setup lang="ts">
import { BlessButton } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessButton href="#">Link</BlessButton>
    <BlessButton disabled>Disabled</BlessButton>
    <BlessButton loading color="accent">Saving</BlessButton>
    <BlessButton color="accent"><template #prefix>▶</template>Play</BlessButton>
  </div>
</template>
