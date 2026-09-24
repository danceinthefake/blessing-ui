<script setup lang="ts">
defineOptions({ name: "BlessInputGroup" });

withDefaults(defineProps<{ size?: "sm" | "md" | "lg"; disabled?: boolean }>(), { size: "md" });
</script>

<template>
  <fieldset
    class="bless-input-group"
    :class="[`bless-input-group--${size}`, { 'bless-input-group--disabled': disabled }]"
    :disabled
  >
    <span v-if="$slots.prefix" class="bless-input-group__addon bless-input-group__addon--prefix"
      ><slot name="prefix"
    /></span>
    <div class="bless-input-group__control"><slot /></div>
    <span v-if="$slots.suffix" class="bless-input-group__addon bless-input-group__addon--suffix"
      ><slot name="suffix"
    /></span>
  </fieldset>
</template>

<style>
/* one shared surface + underline; the inner BlessInput / BlessSelect goes transparent */
.bless-input-group {
  border-radius: var(--bless-radius-plate);
  --_h: 40px;
  position: relative;
  display: flex;
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
  align-items: stretch;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
}
.bless-input-group--sm {
  --_h: 32px;
}
.bless-input-group--lg {
  --_h: 48px;
}
/* same growing accent underline a bare field has */
.bless-input-group::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  bottom: calc(-2 * var(--bless-border-width));
  width: 100%;
  height: calc(2 * var(--bless-border-width));
  background: var(--bless-color-accent);
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform var(--bless-duration-slow) var(--bless-ease-out);
}
[dir="rtl"] .bless-input-group::after {
  transform-origin: 100% 50%;
}
.bless-input-group:focus-within::after {
  transform: scaleX(1);
}
.bless-input-group__control {
  flex: 1;
  min-width: 0;
}
.bless-input-group .bless-input__field,
.bless-input-group .bless-select__field {
  background: transparent;
  border-bottom: 0;
}
.bless-input-group .bless-input__field::after {
  display: none;
}
.bless-input-group__addon {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  flex: none;
  min-height: var(--_h);
  padding: 0 var(--bless-space-3);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
  white-space: nowrap;
}
.bless-input-group__addon--prefix {
  border-inline-end: var(--bless-border-width) solid var(--bless-color-bg);
}
.bless-input-group__addon--suffix {
  border-inline-start: var(--bless-border-width) solid var(--bless-color-bg);
}
.bless-input-group__addon > .bless-button {
  margin: 0 calc(-1 * var(--bless-space-2));
}
.bless-input-group--disabled {
  opacity: 0.4;
}
/* parallelogram field; content counter-skews so text stays upright */
.bless-input-group {
  transform: skewX(var(--bless-skew));
}
.bless-input-group > :not(.bless-skew, .bless-chip, .bless-badge, .bless-input-group__after) {
  transform: skewX(var(--bless-skew-counter));
}
/* the group is the parallelogram; the inputs inside it stay straight */
.bless-input-group .bless-input__field,
.bless-input-group .bless-select__field,
.bless-input-group .bless-combobox__field {
  transform: none;
}
.bless-input-group .bless-input__field > *,
.bless-input-group .bless-select__field > * {
  transform: none;
}
</style>
