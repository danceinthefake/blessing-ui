<script setup lang="ts">
import { BlessButton, BlessPopover, type Placement } from "blessing-ui";
const placements: Placement[] = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "right",
];
</script>

<template>
  <div class="row">
    <BlessPopover v-for="p in placements" :key="p" :placement="p" title="Popover">
      <template #trigger
        ><BlessButton variant="outline" size="sm">{{ p }}</BlessButton></template
      >
      <template #default="{ close }">
        <p style="margin: 0 0 8px">Native popover=auto: light dismiss, Esc, top layer.</p>
        <BlessButton size="sm" @click="close">close</BlessButton>
      </template>
    </BlessPopover>
  </div>
</template>
