<script setup lang="ts">
import { useTheme } from "../composables/useTheme";

defineOptions({ name: "BlessShapeToggle" });

withDefaults(defineProps<{ label?: string }>(), { label: "Corners" });
const { shape, setShape } = useTheme();
</script>

<template>
  <button
    type="button"
    class="bless-shape-toggle"
    :aria-label="label"
    :title="
      shape === 'rounded'
        ? 'Rounded corners — switch to sharp'
        : 'Sharp corners — switch to rounded'
    "
    :aria-pressed="shape === 'rounded'"
    @click="setShape(shape === 'rounded' ? 'sharp' : 'rounded')"
  >
    <span class="bless-shape-toggle__plate" aria-hidden="true" />
  </button>
</template>

<style>
/* one parallelogram; its corners show the current setting */
.bless-shape-toggle {
  display: inline-flex;
  padding: var(--bless-space-1);
  border: 0;
  background: none;
  cursor: pointer;
}
.bless-shape-toggle__plate {
  display: block;
  width: 22px;
  height: 14px;
  border: 2px solid var(--bless-color-text);
  border-radius: var(--bless-radius);
  transform: skewX(var(--bless-skew));
  transition: border-radius var(--bless-duration-base) var(--bless-ease-out);
}
.bless-shape-toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
