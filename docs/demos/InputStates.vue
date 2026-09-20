<script setup lang="ts">
import { BlessInput } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col"><BlessInput model-value="disabled" disabled aria-label="Disabled" /></div>
    <div class="col"><BlessInput model-value="readonly" readonly aria-label="Read only" /></div>
    <div class="col"><BlessInput type="number" model-value="25" aria-label="Number" /></div>
  </div>
</template>
