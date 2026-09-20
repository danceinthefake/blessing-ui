<script setup lang="ts">
import { computed, ref } from "vue";
import { useFieldId } from "../composables/useFieldId";

defineOptions({ name: "BlessKnob", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    size?: "sm" | "md" | "lg";
    label?: string;
    showValue?: boolean;
    format?: (v: number) => string;
    disabled?: boolean;
    /** degrees of arc, centred at the bottom gap */
    sweep?: number;
  }>(),
  { min: 0, max: 100, step: 1, size: "md", label: "Value", showValue: true, sweep: 270 },
);
const model = defineModel<number>({ default: 0 });
const id = useFieldId(props);
const dial = ref<HTMLElement>();

const ratio = computed(() => (model.value - props.min) / (props.max - props.min || 1));
const startDeg = computed(() => 180 + (360 - props.sweep) / 2); // arc starts lower-left
const deg = computed(() => startDeg.value + ratio.value * props.sweep);
const text = computed(() => (props.format ?? String)(model.value));

// pointer → angle → value; the hidden <input type=range> keeps keyboard + a11y native
function fromPointer(e: PointerEvent) {
  const r = dial.value!.getBoundingClientRect();
  const a =
    (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
    Math.PI;
  let d = (a - 90 + 360) % 360; // 0 = bottom, clockwise
  const gap = (360 - props.sweep) / 2;
  d = Math.min(props.sweep, Math.max(0, d - gap));
  const raw = props.min + (d / props.sweep) * (props.max - props.min);
  model.value = Math.min(props.max, Math.max(props.min, Math.round(raw / props.step) * props.step));
}
function onDown(e: PointerEvent) {
  if (props.disabled) return;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  fromPointer(e);
}
function onMove(e: PointerEvent) {
  if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) fromPointer(e);
}
</script>

<template>
  <div class="bless-knob" :class="[`bless-knob--${size}`, { 'bless-knob--disabled': disabled }]">
    <div
      ref="dial"
      class="bless-knob__dial"
      :style="{
        '--_start': `${startDeg}deg`,
        '--_sweep': `${sweep}deg`,
        '--_fill': `${ratio * sweep}deg`,
        '--_deg': `${deg}deg`,
      }"
      @pointerdown="onDown"
      @pointermove="onMove"
    >
      <span class="bless-knob__hand" aria-hidden="true" />
      <input
        v-bind="$attrs"
        :id="id()"
        v-model.number="model"
        type="range"
        class="bless-knob__input"
        :min
        :max
        :step
        :disabled
        :aria-label="label"
        :aria-valuetext="text"
      />
      <span v-if="showValue" class="bless-knob__value" aria-hidden="true">{{ text }}</span>
    </div>
    <label v-if="label" :for="id()" class="bless-knob__label">{{ label }}</label>
  </div>
</template>

<style>
.bless-knob {
  --_s: 72px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-knob--sm {
  --_s: 48px;
}
.bless-knob--lg {
  --_s: 104px;
}
.bless-knob__dial {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--_s);
  height: var(--_s);
  border-radius: 50%;
  background:
    radial-gradient(circle, var(--bless-color-bg) 62%, transparent 63%),
    conic-gradient(
      from var(--_start),
      var(--bless-color-accent) 0 var(--_fill),
      var(--bless-color-border) var(--_fill) var(--_sweep),
      transparent var(--_sweep)
    );
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.bless-knob__dial:active {
  cursor: grabbing;
}
.bless-knob__hand {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 38%;
  background: var(--bless-color-text);
  transform-origin: 50% 0;
  transform: translate(-50%, 0) rotate(calc(var(--_deg) - 180deg));
  pointer-events: none;
}
.bless-knob__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.bless-knob__dial:has(.bless-knob__input:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 3px;
}
.bless-knob__value {
  position: absolute;
  bottom: -2px;
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  color: var(--bless-color-text-muted);
}
.bless-knob__label {
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-knob--disabled {
  opacity: 0.4;
}
.bless-knob--disabled .bless-knob__dial {
  pointer-events: none;
}
</style>
