<script setup lang="ts">
import { BlessButton, BlessInput, BlessInputGroup } from "blessing-ui";
</script>

<template>
  <div class="col">
    <BlessInputGroup>
      <template #prefix>https://</template>
      <BlessInput placeholder="saenai.tv" />
      <template #suffix>.com</template>
    </BlessInputGroup>
    <BlessInputGroup>
      <BlessInput placeholder="search episodes" />
      <template #suffix><BlessButton size="sm" color="accent">Go</BlessButton></template>
    </BlessInputGroup>
    <BlessInputGroup size="sm" disabled>
      <template #prefix>¥</template>
      <BlessInput size="sm" model-value="1980" />
    </BlessInputGroup>
  </div>
</template>
