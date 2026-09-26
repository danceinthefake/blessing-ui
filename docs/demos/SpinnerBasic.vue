<script setup lang="ts">
import { BlessButton, BlessSpinner } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessSpinner size="sm" />
    <BlessSpinner />
    <BlessSpinner size="lg" />
    <BlessButton loading>Saving</BlessButton>
  </div>
</template>
