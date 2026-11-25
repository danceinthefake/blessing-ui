<template>
  <span
    class="bless-chip"
    :class="[`bless-chip--${color}`, `bless-chip--${size}`, `bless-chip--${variant}`]"
  >
    <img v-if="image" :src="image" alt="" class="bless-chip__img" />
    <span v-else-if="icon" class="bless-chip__icon" aria-hidden="true">{{ icon }}</span>
    <span class="bless-chip__label"><slot>{{ label }}</slot></span>
    <button
      v-if="removable"
      type="button"
      class="bless-chip__remove"
      :aria-label="`${text.remove} ${label ?? ''}`"
      @click="emit('remove')"
    >
      <BlessIcon name="close" size="xs" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed } from "vue";
import BlessIcon from "./BlessIcon.vue";
defineOptions({ name: "BlessChip" });

const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    image?: string;
    removable?: boolean;
    color?: "surface" | "accent" | "text";
    /** filled (default) or outline (Fine-style quiet role chip) */
    variant?: "filled" | "outline";
    size?: "sm" | "md";
    labels?: Partial<{ remove: string }>;
  }>(),
  { color: "surface", variant: "filled", size: "md" },
);
const pack = useLabelPack("BlessChip");
const text = computed(() => ({
  remove: "Remove",
  ...pack(),
  ...props.labels,
}));

const emit = defineEmits<{ remove: [] }>();
</script>

<style>
.bless-chip {
  border-radius: var(--bless-radius-petal);
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: 2px var(--bless-space-3);
  border: var(--bless-border-width) solid transparent;
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.bless-chip--sm {
  padding: 1px var(--bless-space-2);
  font-size: var(--bless-text-xs);
}
.bless-chip--accent {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-chip--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.bless-chip--outline {
  border-color: var(--bless-color-border);
  background: color-mix(in srgb, var(--bless-color-bg) 45%, transparent);
  color: var(--bless-color-text-muted);
}
.bless-chip--outline.bless-chip--accent {
  border-color: color-mix(in srgb, var(--bless-color-accent) 32%, transparent);
  color: var(--bless-color-accent-text);
}
.bless-chip--outline.bless-chip--text {
  color: var(--bless-color-text);
}
.bless-chip__img {
  width: 18px;
  height: 18px;
  object-fit: cover;
  border-radius: var(--bless-radius-petal);
}
/* a 24px target without making the chip taller */
.bless-chip__remove {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  min-height: 24px;
  margin-block: -4px;
  margin-inline-end: calc(-1 * var(--bless-space-2));
  padding: 0;
  border: 0;
  border-radius: var(--bless-radius-pill);
  background: none;
  color: inherit;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transition: background var(--bless-duration-base) var(--bless-ease-out);
}
.bless-chip__remove:hover {
  background: var(--bless-color-hover);
}
.bless-chip__remove:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
