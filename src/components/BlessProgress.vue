<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessProgress" });

const props = withDefaults(
  defineProps<{
    /** omit for indeterminate */
    value?: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    color?: "accent" | "text" | "danger" | "success" | "warning";
    size?: "sm" | "md" | "lg";
    /** text for showValue; default is the percentage */
    format?: (value: number, max: number) => string;
  }>(),
  { max: 100, color: "accent", size: "md" },
);

const pct = computed(() =>
  props.value === undefined
    ? undefined
    : Math.min(100, Math.max(0, (props.value / props.max) * 100)),
);
</script>

<template>
  <div
    class="bless-progress"
    :class="[
      `bless-progress--${color}`,
      `bless-progress--${size}`,
      {
        'bless-progress--indeterminate': pct === undefined,
        'bless-progress--done': pct !== undefined && pct >= 100,
      },
    ]"
  >
    <div v-if="label || showValue" class="bless-progress__head">
      <span v-if="label" class="bless-progress__label">{{ label }}</span>
      <span v-if="showValue && pct !== undefined" class="bless-progress__value">{{
        format ? format(value!, max) : `${Math.round(pct)}%`
      }}</span>
    </div>
    <div
      class="bless-progress__track"
      role="progressbar"
      :aria-label="label ?? 'Progress'"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="value"
      :aria-valuetext="format && value !== undefined ? format(value, max) : undefined"
    >
      <div
        class="bless-progress__fill"
        :style="pct !== undefined ? { width: `${pct}%` } : undefined"
      />
    </div>
  </div>
</template>

<style>
.bless-progress {
  --_c: var(--bless-color-accent);
  --_h: 6px;
  display: block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-progress--text {
  --_c: var(--bless-color-text);
}
.bless-progress--danger {
  --_c: var(--bless-color-danger);
}
.bless-progress--success {
  --_c: var(--bless-color-success);
}
.bless-progress--warning {
  --_c: var(--bless-color-warning);
}
.bless-progress--sm {
  --_h: 3px;
}
.bless-progress--lg {
  --_h: 12px;
}
.bless-progress__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--bless-space-2);
}
.bless-progress__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-progress__value {
  margin-inline-start: auto; /* stays at the end when there is no label */
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  color: var(
    --bless-color-text
  ); /* not --_c: warning/success are fills, and accent is 3.6:1 as text */
}
.bless-progress__track {
  border-radius: var(--bless-radius);
  position: relative;
  height: var(--_h);
  overflow: hidden;
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-progress__fill {
  min-width: 0; /* a length, so the done state's overflow animates */
  height: 100%;
  background: var(--_c);
  transition: width var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-progress--indeterminate .bless-progress__fill {
  width: 40%;
  animation: bless-progress-slide 1.2s var(--bless-ease-in-out) infinite;
}
/* overflow: a finished bar outgrows its track and leans past the end */
.bless-progress--done .bless-progress__track {
  overflow: visible;
}
.bless-progress--done .bless-progress__fill {
  min-width: calc(100% + var(--bless-space-6));
  transform: skewX(var(--bless-lean));
  transform-origin: 0 100%;
  transition:
    width var(--bless-duration-slow) var(--bless-ease-out),
    min-width var(--bless-duration-slow) var(--bless-ease-out),
    transform var(--bless-duration-slow) var(--bless-ease-out);
}
@keyframes bless-progress-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-progress--indeterminate .bless-progress__fill {
    animation: none;
    width: 100%;
    opacity: 0.4;
  }
}
</style>
