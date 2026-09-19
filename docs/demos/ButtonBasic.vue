<script setup lang="ts">
import { BlessButton } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessButton>Default</BlessButton>
    <BlessButton color="accent">Accent</BlessButton>
    <BlessButton color="danger">Danger</BlessButton>
    <BlessButton variant="outline" color="accent">Outline</BlessButton>
    <BlessButton variant="ghost">Ghost</BlessButton>
  </div>
</template>
