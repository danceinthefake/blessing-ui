<script setup lang="ts">
import { useLabelFor } from "../composables/useFieldId";

defineOptions({ name: "BlessFloatLabel" });
const props = withDefaults(
  defineProps<{
    label: string;
    /** id of the control; by default the control inside takes the wrapper's id */
    for?: string;
    /** over = floats up on focus/value; in = always inside, top-aligned (IFTA) */
    variant?: "over" | "in";
  }>(),
  { variant: "over" },
);
const id = useLabelFor(props.for);
</script>

<template>
  <div class="bless-float" :class="`bless-float--${variant}`">
    <slot />
    <label class="bless-float__label" :for="id">{{ label }}</label>
  </div>
</template>

<style>
/* CSS-only: relies on the wrapped control having a placeholder (even " ") so :placeholder-shown works */
.bless-float {
  position: relative;
  font-family: var(--bless-font-sans);
}
/* room above for the floated label, so it never overlaps what sits above */
.bless-float--over {
  --bless-float-room: 14px;
  padding-block-start: var(--bless-float-room);
}
.bless-float__label {
  position: absolute;
  inset-inline-start: var(--bless-space-3);
  top: calc(50% + var(--bless-float-room, 0px) / 2);
  translate: 0 -50%;
  font-size: var(--bless-text-md);
  color: var(--bless-color-text-muted);
  pointer-events: none;
  transition:
    top var(--bless-duration-base) var(--bless-ease-out),
    font-size var(--bless-duration-base) var(--bless-ease-out),
    translate var(--bless-duration-base) var(--bless-ease-out),
    var(--bless-lean-transition);
}
.bless-float :is(input, textarea, select)::placeholder {
  color: transparent;
}
.bless-float--over:has(:is(input, textarea, select):focus) .bless-float__label,
.bless-float--over:has(:is(input, textarea):not(:placeholder-shown)) .bless-float__label,
.bless-float--over:has(select:valid) .bless-float__label {
  top: 0;
  translate: none;
  font-size: var(--bless-text-2xs);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
}
.bless-float--over:has(:focus) .bless-float__label {
  color: var(--bless-color-accent-text);
}
.bless-float--in .bless-float__label {
  top: 6px;
  translate: none;
  font-size: var(--bless-text-2xs);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
}
.bless-float--in
  :is(.bless-input__control, .bless-select__control, .bless-textarea__control, input, textarea) {
  padding-top: 14px;
}
.bless-float--in :is(.bless-input__field, .bless-select__field) {
  height: 52px;
}
</style>
