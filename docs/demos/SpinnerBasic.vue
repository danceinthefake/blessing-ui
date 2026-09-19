<script setup lang="ts">
import { BlessButton, BlessSpinner } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessSpinner size="sm" />
    <BlessSpinner />
    <BlessSpinner size="lg" />
    <BlessSpinner color="accent" />
    <BlessButton loading color="accent">saving</BlessButton>
  </div>
</template>
