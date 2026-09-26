<script setup lang="ts">
import { useFieldId } from "../composables/useFieldId";

defineOptions({ name: "BlessColorPicker", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    /** preset swatches: hex, or { value, label } so a screen reader hears a name, not a hex */
    swatches?: (string | { value: string; label: string })[];
    disabled?: boolean;
    /** accessible name when there is no visible label (a BlessField's label is used otherwise) */
    label?: string;
    /** show the hex next to the well */
    showValue?: boolean;
  }>(),
  { swatches: () => [], showValue: true },
);
const model = defineModel<string>({ default: "#e85078" });
const id = useFieldId(props);
const norm = (s: string | { value: string; label: string }) =>
  typeof s === "string" ? { value: s, label: s } : s;
</script>

<template>
  <div class="bless-color" :class="{ 'bless-color--disabled': disabled }">
    <label :for="id()" class="bless-color__well" :style="{ '--_c': model }">
      <input
        v-bind="$attrs"
        :id="id()"
        v-model="model"
        type="color"
        class="bless-color__input"
        :disabled
        :aria-label="label"
      />
    </label>
    <output v-if="showValue" :for="id()" class="bless-color__value">{{ model }}</output>
    <div
      v-if="swatches.length"
      class="bless-color__swatches"
      role="group"
      :aria-label="`${label ?? 'Colour'} presets`"
    >
      <button
        v-for="s in swatches.map(norm)"
        :key="s.value"
        type="button"
        class="bless-color__swatch"
        :class="{ 'bless-color__swatch--on': s.value.toLowerCase() === model.toLowerCase() }"
        :style="{ '--_c': s.value }"
        :aria-label="s.label"
        :aria-pressed="s.value.toLowerCase() === model.toLowerCase()"
        :disabled
        @click="model = s.value"
      />
    </div>
  </div>
</template>

<style>
.bless-color {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-color__well {
  border-radius: var(--bless-radius-plate);
  position: relative;
  display: inline-block;
  width: 36px;
  height: 36px;
  background: var(--_c);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-color__well:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-color__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.bless-color__value {
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  color: var(--bless-color-text-muted);
}
.bless-color__swatches {
  display: inline-flex;
  gap: var(--bless-space-1);
}
.bless-color__swatch {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  background: var(--_c);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-color__swatch:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-color__swatch--on {
  border-color: var(--bless-color-text);
}
.bless-color__swatch:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-color--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
