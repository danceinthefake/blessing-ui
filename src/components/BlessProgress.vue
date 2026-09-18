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
      { 'bless-progress--indeterminate': pct === undefined },
    ]"
  >
    <div v-if="label || showValue" class="bless-progress__head">
      <span v-if="label" class="bless-progress__label">{{ label }}</span>
      <span v-if="showValue && pct !== undefined" class="bless-progress__value"
        >{{ Math.round(pct) }}%</span
      >
    </div>
    <div
      class="bless-progress__track"
      role="progressbar"
      :aria-label="label"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="value"
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
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  color: var(--_c);
}
.bless-progress__track {
  position: relative;
  height: var(--_h);
  overflow: hidden;
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-progress__fill {
  height: 100%;
  background: var(--_c);
  transition: width var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-progress--indeterminate .bless-progress__fill {
  width: 40%;
  animation: bless-progress-slide 1.2s var(--bless-ease-in-out) infinite;
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
