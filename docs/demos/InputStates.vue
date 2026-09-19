<script setup lang="ts">
import { BlessInput } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col"><BlessInput model-value="disabled" disabled /></div>
    <div class="col"><BlessInput model-value="readonly" readonly /></div>
    <div class="col"><BlessInput type="number" model-value="25" /></div>
  </div>
</template>
