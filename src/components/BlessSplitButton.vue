<script setup lang="ts">
import BlessButton from "./BlessButton.vue";
import BlessButtonGroup from "./BlessButtonGroup.vue";
import BlessDropdownMenu from "./BlessDropdownMenu.vue";
import type { BlessMenuItem } from "./menu";

defineOptions({ name: "BlessSplitButton" });

withDefaults(
  defineProps<{
    label: string;
    items: BlessMenuItem[];
    color?: "text" | "accent" | "danger";
    variant?: "solid" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    menuLabel?: string;
  }>(),
  { color: "text", variant: "solid", size: "md", menuLabel: "More actions" },
);
const emit = defineEmits<{ click: [e: MouseEvent]; select: [item: BlessMenuItem] }>();
</script>

<template>
  <BlessButtonGroup class="bless-split" :label="label">
    <BlessButton :color :variant :size :disabled :loading @click="emit('click', $event)">
      <slot>{{ label }}</slot>
    </BlessButton>
    <BlessDropdownMenu :items placement="bottom-end" @select="emit('select', $event)">
      <template #trigger="{ open }">
        <BlessButton
          :color
          :variant
          :size
          :disabled
          :aria-label="menuLabel"
          :aria-expanded="open"
          class="bless-split__more"
          >▾</BlessButton
        >
      </template>
    </BlessDropdownMenu>
  </BlessButtonGroup>
</template>

<style>
.bless-split__more {
  padding-inline: var(--bless-space-2);
}
</style>
