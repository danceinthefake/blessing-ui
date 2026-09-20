<script setup lang="ts">
import {} from "vue";
import { useFieldId } from "../composables/useFieldId";

defineOptions({ name: "BlessColorPicker", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    /** preset swatches, hex */
    swatches?: string[];
    disabled?: boolean;
    label?: string;
    /** show the hex next to the well */
    showValue?: boolean;
  }>(),
  { swatches: () => [], label: "Colour", showValue: true },
);
const model = defineModel<string>({ default: "#e85078" });
const id = useFieldId(props);
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
    <code v-if="showValue" class="bless-color__value">{{ model }}</code>
    <div
      v-if="swatches.length"
      class="bless-color__swatches"
      role="group"
      :aria-label="`${label} presets`"
    >
      <button
        v-for="s in swatches"
        :key="s"
        type="button"
        class="bless-color__swatch"
        :class="{ 'bless-color__swatch--on': s.toLowerCase() === model.toLowerCase() }"
        :style="{ '--_c': s }"
        :aria-label="s"
        :aria-pressed="s.toLowerCase() === model.toLowerCase()"
        :disabled
        @click="model = s"
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
  position: relative;
  display: inline-block;
  width: 36px;
  height: 36px;
  background: var(--_c);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-color__well:focus-within {
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
