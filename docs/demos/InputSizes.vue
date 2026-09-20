<script setup lang="ts">
import { BlessInput } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessInput size="sm" placeholder="sm" aria-label="Small"
        ><template #prefix>¥</template></BlessInput
      >
    </div>
    <div class="col">
      <BlessInput placeholder="md" type="search" aria-label="Medium"
        ><template #suffix>⌘K</template></BlessInput
      >
    </div>
    <div class="col"><BlessInput size="lg" placeholder="lg" aria-label="Large" /></div>
  </div>
</template>
