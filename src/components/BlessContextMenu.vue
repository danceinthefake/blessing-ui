<script setup lang="ts">
import BlessDropdownMenu from "./BlessDropdownMenu.vue";
import type { BlessMenuItem } from "./menu";

defineOptions({ name: "BlessContextMenu" });

defineProps<{
  items: BlessMenuItem[];
  checked?: Record<string, boolean>;
  radios?: Record<string, string>;
}>();
const emit = defineEmits<{ select: [item: BlessMenuItem] }>();
</script>

<template>
  <BlessDropdownMenu
    :items
    :checked
    :radios
    context
    block
    placement="bottom-start"
    @select="emit('select', $event)"
  >
    <template #trigger><slot /></template>
  </BlessDropdownMenu>
</template>
