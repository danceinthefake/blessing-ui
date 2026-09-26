<script setup lang="ts">
import { computed } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessSlider", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    /** show current value bubble */
    showValue?: boolean;
    format?: (v: number) => string;
    label?: string;
  }>(),
  { min: 0, max: 100, step: 1 },
);

const model = defineModel<number>({ default: 0 });
const id = useFieldId(props);
const fs = useFieldState();
const pct = computed(() => ((model.value - props.min) / (props.max - props.min || 1)) * 100);
const text = computed(() => (props.format ?? String)(model.value));
</script>

<template>
  <div
    class="bless-slider"
    :class="{ 'bless-slider--disabled': disabled }"
    :style="{ '--_p': `${pct}%` }"
  >
    <div v-if="label || showValue" class="bless-slider__head">
      <label v-if="label" :for="id()" class="bless-slider__label">{{ label }}</label>
      <output v-if="showValue" :for="id()" class="bless-slider__value">{{ text }}</output>
    </div>
    <input
      v-bind="$attrs"
      :id="id()"
      v-model.number="model"
      type="range"
      :min
      :max
      :step
      :disabled
      class="bless-slider__input"
      :aria-valuetext="format ? text : undefined"
      :aria-invalid="fs.invalid.value || undefined"
      :aria-describedby="($attrs['aria-describedby'] as string) ?? fs.describedby.value"
    />
  </div>
</template>

<style>
.bless-slider {
  display: block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-slider__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--bless-space-2);
}
.bless-slider__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-slider__value {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  color: var(--bless-color-accent-text);
}
.bless-slider__input {
  display: block;
  width: 100%;
  height: 20px;
  margin: 0;
  background: transparent;
  appearance: none;
  cursor: pointer;
}
.bless-slider__input::-webkit-slider-runnable-track {
  height: 6px;
  background: linear-gradient(
    to right,
    var(--bless-color-accent) var(--_p),
    var(--bless-color-surface) var(--_p)
  );
  transform: skewX(var(--bless-skew));
}
.bless-slider__input::-moz-range-track {
  height: 6px;
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-slider__input::-moz-range-progress {
  height: 6px;
  background: var(--bless-color-accent);
}
.bless-slider__input::-webkit-slider-thumb {
  appearance: none;
  border-radius: var(--bless-radius-petal);
  width: 14px;
  height: 20px;
  margin-top: -7px;
  background: var(--bless-color-text);
  border: 0;
  transition: background var(--bless-duration-base);
}
.bless-slider__input::-moz-range-thumb {
  width: 14px;
  height: 20px;
  background: var(--bless-color-text);
  border: 0;
  border-radius: var(--bless-radius-petal);
  transform: skewX(var(--bless-skew));
}
.bless-slider__input:active::-webkit-slider-thumb {
  background: var(--bless-color-accent);
}
.bless-slider__input:active::-moz-range-thumb {
  background: var(--bless-color-accent);
}
.bless-slider__input:focus-visible {
  outline: 0;
}
.bless-slider__input:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-slider__input:focus-visible::-moz-range-thumb {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-slider--disabled {
  opacity: 0.4;
}
.bless-slider--disabled .bless-slider__input {
  cursor: not-allowed;
}
</style>
