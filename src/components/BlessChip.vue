<script setup lang="ts">
defineOptions({ name: "BlessChip" });

withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    image?: string;
    removable?: boolean;
    removeLabel?: string;
    color?: "surface" | "accent" | "text";
    size?: "sm" | "md";
  }>(),
  { removeLabel: "Remove", color: "surface", size: "md" },
);
const emit = defineEmits<{ remove: [] }>();
</script>

<template>
  <span class="bless-chip" :class="[`bless-chip--${color}`, `bless-chip--${size}`]">
    <img v-if="image" :src="image" alt="" class="bless-chip__img" />
    <span v-else-if="icon" class="bless-chip__icon" aria-hidden="true">{{ icon }}</span>
    <span class="bless-chip__label"
      ><slot>{{ label }}</slot></span
    >
    <button
      v-if="removable"
      type="button"
      class="bless-chip__remove"
      :aria-label="`${removeLabel} ${label ?? ''}`"
      @click="emit('remove')"
    >
      <span aria-hidden="true">×</span>
    </button>
  </span>
</template>

<style>
.bless-chip {
  border-radius: var(--bless-radius-petal);
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: 2px var(--bless-space-3);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
  transform: skewX(var(--bless-skew));
}
.bless-chip > * {
  transform: skewX(var(--bless-skew-counter));
}
.bless-chip--sm {
  padding: 0 var(--bless-space-2);
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
.bless-chip__img {
  width: 18px;
  height: 18px;
  object-fit: cover;
  border-radius: var(--bless-radius-petal); /* a petal, like the chip — never a circle */
}
.bless-chip__remove {
  margin-inline-end: calc(-1 * var(--bless-space-1));
  padding: 0 2px;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  line-height: 1;
  opacity: 0.7;
  cursor: pointer;
}
.bless-chip__remove:hover {
  opacity: 1;
}
.bless-chip__remove:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
