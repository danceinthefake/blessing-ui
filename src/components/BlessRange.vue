<script setup lang="ts">
import { computed, useId } from "vue";

defineOptions({ name: "BlessRange" });

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    showValue?: boolean;
    format?: (v: number) => string;
    disabled?: boolean;
    /** minimum distance between the thumbs */
    gap?: number;
  }>(),
  { min: 0, max: 100, step: 1, showValue: false, gap: 0 },
);
/** [low, high] */
const model = defineModel<[number, number]>({ default: () => [25, 75] });
const uid = useId();
const fmt = (v: number) => (props.format ?? String)(v);
const pct = (v: number) => ((v - props.min) / (props.max - props.min || 1)) * 100;
const lo = computed(() => model.value[0]);
const hi = computed(() => model.value[1]);
function setLo(v: number) {
  model.value = [Math.min(v, hi.value - props.gap), hi.value];
}
function setHi(v: number) {
  model.value = [lo.value, Math.max(v, lo.value + props.gap)];
}
</script>

<template>
  <div
    class="bless-range"
    :class="{ 'bless-range--disabled': disabled }"
    :style="{ '--_lo': `${pct(lo)}%`, '--_hi': `${pct(hi)}%` }"
  >
    <div v-if="label || showValue" class="bless-range__head">
      <label v-if="label" :for="`${uid}-lo`" class="bless-range__label">{{ label }}</label>
      <span v-if="showValue" class="bless-range__value">{{ fmt(lo) }} – {{ fmt(hi) }}</span>
    </div>
    <div class="bless-range__track">
      <span class="bless-range__fill" aria-hidden="true" />
      <input
        :id="`${uid}-lo`"
        type="range"
        class="bless-range__input"
        :min
        :max
        :step
        :value="lo"
        :disabled
        :aria-label="`${label ?? 'Range'} minimum`"
        :aria-valuetext="fmt(lo)"
        @input="setLo(Number(($event.target as HTMLInputElement).value))"
      />
      <input
        :id="`${uid}-hi`"
        type="range"
        class="bless-range__input"
        :min
        :max
        :step
        :value="hi"
        :disabled
        :aria-label="`${label ?? 'Range'} maximum`"
        :aria-valuetext="fmt(hi)"
        @input="setHi(Number(($event.target as HTMLInputElement).value))"
      />
    </div>
  </div>
</template>

<style>
/* two native range inputs stacked; the fill is drawn between their thumbs */
.bless-range {
  display: block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-range__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-range__label {
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
}
.bless-range__value {
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-range__track {
  position: relative;
  height: 24px;
}
.bless-range__track::before {
  content: "";
  position: absolute;
  top: 10px;
  inset-inline-start: 0;
  inset-inline-end: 0;
  height: 4px;
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-range__fill {
  position: absolute;
  top: 10px;
  inset-inline-start: var(--_lo);
  inset-inline-end: calc(100% - var(--_hi));
  height: 4px;
  background: var(--bless-color-accent);
  transform: skewX(var(--bless-skew));
}
.bless-range__input {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  appearance: none;
  background: none;
  pointer-events: none;
}
.bless-range__input::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--bless-color-accent);
  border: 2px solid var(--bless-color-bg);
  transform: skewX(var(--bless-skew));
  cursor: grab;
  pointer-events: auto;
}
.bless-range__input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 0;
  background: var(--bless-color-accent);
  border: 2px solid var(--bless-color-bg);
  transform: skewX(var(--bless-skew));
  cursor: grab;
  pointer-events: auto;
}
.bless-range__input:focus-visible {
  outline: 0;
}
.bless-range__input:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-range__input:focus-visible::-moz-range-thumb {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-range--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
