<template>
  <BlessButtonGroup class="bless-splitbtn" :label="label">
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
          :aria-label="text.menu"
          :aria-expanded="open"
          class="bless-splitbtn__more"
          ><BlessIcon name="chevron-down" size="xs"
        /></BlessButton>
      </template>
    </BlessDropdownMenu>
  </BlessButtonGroup>
</template>

<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessButtonGroup from "./BlessButtonGroup.vue";
import BlessDropdownMenu from "./BlessDropdownMenu.vue";
import BlessIcon from "./BlessIcon.vue";
import type { BlessMenuItem } from "./menu";

defineOptions({ name: "BlessSplitButton" });

const props = withDefaults(
  defineProps<{
    label: string;
    items: BlessMenuItem[];
    color?: "text" | "accent" | "danger";
    variant?: "solid" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    labels?: Partial<{ menu: string }>;
  }>(),
  { color: "text", variant: "solid", size: "md" },
);
const pack = useLabelPack("BlessSplitButton");
const text = computed(() => ({
  menu: "More actions",
  ...pack(),
  ...props.labels,
}));

const emit = defineEmits<{ click: [e: MouseEvent]; select: [item: BlessMenuItem] }>();
</script>

<style>
.bless-splitbtn__more {
  padding-inline: var(--bless-space-2);
}
</style>
