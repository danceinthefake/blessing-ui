<script setup lang="ts">
import { BlessButton, BlessPopover } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessPopover
      v-for="p in ['top', 'bottom', 'left', 'right'] as const"
      :key="p"
      :placement="p"
      arrow
      title="With arrow"
    >
      <template #trigger
        ><BlessButton variant="outline" size="sm">{{ p }}</BlessButton></template
      >
      The arrow points at the trigger and stays inside the panel when it shifts.
    </BlessPopover>
  </div>
</template>
