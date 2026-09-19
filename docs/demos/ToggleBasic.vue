<script setup lang="ts">
import { BlessToggle } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessToggle>Bold</BlessToggle>
    <BlessToggle color="accent" :pressed="true">Pinned</BlessToggle>
    <BlessToggle size="sm" disabled>Off</BlessToggle>
  </div>
</template>
