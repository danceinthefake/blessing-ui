<script setup lang="ts">
defineOptions({ name: "BlessFloatLabel" });
withDefaults(
  defineProps<{
    label: string;
    for?: string;
    /** over = floats up on focus/value; in = always inside, top-aligned (IFTA) */
    variant?: "over" | "in";
  }>(),
  { variant: "over" },
);
</script>

<template>
  <div class="bless-float" :class="`bless-float--${variant}`">
    <slot />
    <label class="bless-float__label" :for>{{ label }}</label>
  </div>
</template>

<style>
/* CSS-only: relies on the wrapped control having a placeholder (even " ") so :placeholder-shown works */
.bless-float {
  position: relative;
  font-family: var(--bless-font-sans);
}
.bless-float__label {
  position: absolute;
  left: var(--bless-space-3);
  top: 50%;
  translate: 0 -50%;
  font-size: var(--bless-text-md);
  color: var(--bless-color-text-muted);
  pointer-events: none;
  transition:
    top var(--bless-duration-base) var(--bless-ease-out),
    font-size var(--bless-duration-base) var(--bless-ease-out),
    translate var(--bless-duration-base) var(--bless-ease-out);
}
.bless-float :is(input, textarea, select)::placeholder {
  color: transparent;
}
.bless-float--over:has(:is(input, textarea, select):focus) .bless-float__label,
.bless-float--over:has(:is(input, textarea):not(:placeholder-shown)) .bless-float__label,
.bless-float--over:has(select:valid) .bless-float__label {
  top: 0;
  translate: 0 -100%;
  font-size: var(--bless-text-2xs);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
}
.bless-float--over:has(:focus) .bless-float__label {
  color: var(--bless-color-accent);
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
