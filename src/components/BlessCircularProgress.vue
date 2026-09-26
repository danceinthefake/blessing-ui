<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessCircularProgress" });

const props = withDefaults(
  defineProps<{
    /** omit for indeterminate */
    value?: number;
    max?: number;
    size?: number;
    thickness?: number;
    color?: "accent" | "text" | "danger" | "success" | "warning" | "info";
    label?: string;
    showValue?: boolean;
    format?: (v: number) => string;
  }>(),
  { max: 100, size: 48, thickness: 4, color: "accent", showValue: false },
);
const r = computed(() => (props.size - props.thickness) / 2);
const c = computed(() => 2 * Math.PI * r.value);
const pct = computed(() =>
  props.value == null ? 0 : Math.min(1, Math.max(0, props.value / props.max)),
);
const text = computed(() =>
  (props.format ?? ((v: number) => `${Math.round((v / props.max) * 100)}%`))(props.value ?? 0),
);
</script>

<template>
  <span
    class="bless-circular"
    :class="[`bless-circular--${color}`, { 'bless-circular--indeterminate': value == null }]"
    :style="{ '--_s': `${size}px` }"
    role="progressbar"
    :aria-label="label ?? 'Progress'"
    :aria-valuenow="value"
    :aria-valuetext="value != null && format ? text : undefined"
    aria-valuemin="0"
    :aria-valuemax="max"
  >
    <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size" aria-hidden="true">
      <circle
        class="bless-circular__track"
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        :stroke-width="thickness"
        fill="none"
      />
      <circle
        class="bless-circular__bar"
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        :stroke-width="thickness"
        fill="none"
        :stroke-dasharray="c"
        :stroke-dashoffset="value == null ? c * 0.75 : c * (1 - pct)"
      />
    </svg>
    <span v-if="showValue && value != null" class="bless-circular__value"
      ><slot :value :percent="pct * 100">{{ text }}</slot></span
    >
  </span>
</template>

<style>
.bless-circular {
  --_c: var(--bless-color-accent);
  position: relative;
  display: inline-grid;
  place-items: center;
  width: var(--_s);
  height: var(--_s);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-circular--text {
  --_c: var(--bless-color-text);
}
.bless-circular--danger {
  --_c: var(--bless-color-danger);
}
.bless-circular--success {
  --_c: var(--bless-color-success);
}
.bless-circular--warning {
  --_c: var(--bless-color-warning);
}
.bless-circular--info {
  --_c: var(--bless-color-info);
}
.bless-circular svg {
  grid-area: 1 / 1;
  transform: rotate(-90deg);
}
.bless-circular__track {
  stroke: var(--bless-color-surface);
}
.bless-circular__bar {
  stroke: var(--_c);
  stroke-linecap: butt;
  transition: stroke-dashoffset var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-circular--indeterminate svg {
  animation: bless-circular-spin 1s var(--bless-ease-linear) infinite;
}
@keyframes bless-circular-spin {
  to {
    transform: rotate(270deg);
  }
}
.bless-circular__value {
  grid-area: 1 / 1;
  font-size: calc(var(--_s) * 0.26);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
@media (prefers-reduced-motion: reduce) {
  .bless-circular--indeterminate svg {
    animation-duration: 2s;
  }
}
</style>
