<script setup lang="ts">
import BlessPopover from "./BlessPopover.vue";
import type { Placement } from "../composables/useFloating";

defineOptions({ name: "BlessHoverCard" });

withDefaults(defineProps<{ placement?: Placement; openDelay?: number; closeDelay?: number }>(), {
  placement: "bottom",
  openDelay: 400,
  closeDelay: 200,
});
const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <BlessPopover
    v-model:open="open"
    trigger="hover"
    :placement
    :open-delay
    :close-delay
    class="bless-hover-card"
  >
    <template #trigger><slot name="trigger" /></template>
    <slot />
  </BlessPopover>
</template>

<style>
.bless-hover-card {
  border-radius: var(--bless-radius);
  padding: var(--bless-space-4);
  min-width: 200px;
}
</style>
