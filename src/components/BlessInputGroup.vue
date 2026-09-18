<script setup lang="ts">
defineOptions({ name: "BlessInputGroup" });

withDefaults(defineProps<{ size?: "sm" | "md" | "lg"; disabled?: boolean }>(), { size: "md" });
</script>

<template>
  <div
    class="bless-input-group"
    :class="[`bless-input-group--${size}`, { 'bless-input-group--disabled': disabled }]"
    role="group"
  >
    <span v-if="$slots.prefix" class="bless-input-group__addon bless-input-group__addon--prefix"
      ><slot name="prefix"
    /></span>
    <div class="bless-input-group__control"><slot /></div>
    <span v-if="$slots.suffix" class="bless-input-group__addon bless-input-group__addon--suffix"
      ><slot name="suffix"
    /></span>
  </div>
</template>

<style>
/* one shared surface + underline; the inner BlessInput / BlessSelect goes transparent */
.bless-input-group {
  --_h: 40px;
  display: flex;
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
.bless-input-group:focus-within {
  border-bottom-color: var(--bless-color-accent);
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
  border-right: var(--bless-border-width) solid var(--bless-color-bg);
}
.bless-input-group__addon--suffix {
  border-left: var(--bless-border-width) solid var(--bless-color-bg);
}
.bless-input-group__addon > .bless-button {
  margin: 0 calc(-1 * var(--bless-space-2));
}
.bless-input-group--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
