<script setup lang="ts">
import { BlessButton } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessButton>Solid</BlessButton>
    <BlessButton variant="outline">Outline</BlessButton>
    <BlessButton variant="ghost">Ghost</BlessButton>
    <BlessButton color="danger">Danger</BlessButton>
  </div>
</template>
