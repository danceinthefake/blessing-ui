<script setup lang="ts">
import { inject } from "vue";
import BlessSkew from "./BlessSkew.vue";
import { toggleGroupKey } from "./toggle";

defineOptions({ name: "BlessToggle" });

const props = withDefaults(
  defineProps<{
    /** required inside a BlessToggleGroup */
    value?: string | number;
    size?: "sm" | "md" | "lg";
    color?: "text" | "accent" | "danger";
    disabled?: boolean;
    label?: string;
  }>(),
  { size: "md", color: "accent" },
);

const pressed = defineModel<boolean>("pressed", { default: false });
const group = inject(toggleGroupKey, null);

const isOn = () => (group && props.value !== undefined ? group.has(props.value) : pressed.value);
function toggle() {
  if (props.disabled || group?.disabled.value) return;
  if (group && props.value !== undefined) group.toggle(props.value);
  else pressed.value = !pressed.value;
}
</script>

<template>
  <BlessSkew
    as="button"
    type="button"
    class="bless-toggle"
    :class="[`bless-toggle--${size}`, `bless-toggle--${color}`, { 'bless-toggle--on': isOn() }]"
    :color="isOn() ? color : 'none'"
    :aria-pressed="isOn()"
    :aria-label="label"
    :disabled="disabled || group?.disabled.value"
    @click="toggle"
  >
    <slot />
  </BlessSkew>
</template>

<style>
.bless-toggle {
  border-radius: var(--bless-radius-plate);
  --_c: var(--bless-color-text);
  --_on: var(--bless-color-on-text);
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-none);
  text-transform: uppercase;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    color var(--bless-duration-slow),
    border-color var(--bless-duration-slow),
    background var(--bless-duration-slow),
    var(--bless-lean-transition);
}
.bless-toggle--accent {
  --_c: var(--bless-color-accent);
  --_on: var(--bless-color-on-accent);
}
.bless-toggle--danger {
  --_c: var(--bless-color-danger);
  --_on: var(--bless-color-on-accent);
}
.bless-toggle--sm {
  padding: var(--bless-space-1) var(--bless-space-2);
  font-size: var(--bless-text-xs);
}
.bless-toggle--md {
  padding: var(--bless-space-2) var(--bless-space-3);
}
.bless-toggle--lg {
  padding: var(--bless-space-3) var(--bless-space-4);
  font-size: var(--bless-text-md);
}
/* hover is attention, not a choice: ink until pressed on */
.bless-toggle:hover:not(:disabled) {
  color: var(--bless-color-text);
  border-color: var(--bless-color-text);
}
/* choosing fills */
.bless-toggle--on,
.bless-toggle--on:hover:not(:disabled) {
  border-color: var(--_c);
  background: var(--_c);
  color: var(--_on);
}
.bless-toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-toggle .bless-skew__inner {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
</style>
