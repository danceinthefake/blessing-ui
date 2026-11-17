<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessBatteryLevel" });
const pack = useLabelPack("BlessBatteryLevel");

const props = withDefaults(
  defineProps<{
    /** the charge, 0 to 100 */
    level: number;
    charging?: boolean;
    /** at or below this level, the battery is low */
    low?: number;
    /** what the battery is in, for example "Door sensor" */
    label?: string;
    labels?: Partial<{ battery: string; charging: string; low: string }>;
  }>(),
  { low: 20 },
);

const text = computed(() => ({
  battery: "Battery",
  charging: "Charging",
  low: "Low",
  ...pack(),
  ...props.labels,
}));
const value = computed(() => Math.round(Math.min(100, Math.max(0, props.level))));
const isLow = computed(() => !props.charging && value.value <= props.low);
const words = computed(() =>
  [`${value.value}%`, props.charging && text.value.charging, isLow.value && text.value.low]
    .filter(Boolean)
    .join(", "),
);
</script>

<template>
  <span
    class="bless-battery"
    :class="{ 'is-low': isLow, 'is-charging': charging }"
    role="meter"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="value"
    :aria-valuetext="words"
    :aria-label="label ? `${text.battery}, ${label}` : text.battery"
  >
    <span class="bless-battery__body" aria-hidden="true">
      <span class="bless-battery__fill" :style="{ inlineSize: `${value}%` }" />
    </span>
    <span class="bless-battery__text" aria-hidden="true">
      {{ value }}%<template v-if="charging"> · {{ text.charging }}</template
      ><template v-if="isLow"> · {{ text.low }}</template>
    </span>
  </span>
</template>

<style>
.bless-battery {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  font-variant-numeric: tabular-nums;
}
.bless-battery__body {
  position: relative;
  display: inline-block;
  inline-size: 2.25rem;
  block-size: 1rem;
  padding: 2px;
  border: 2px solid currentColor;
}
/* the tip of the battery */
.bless-battery__body::after {
  content: "";
  position: absolute;
  inset-block: 3px;
  inset-inline-end: -5px;
  inline-size: 3px;
  background: currentColor;
}
.bless-battery__fill {
  display: block;
  block-size: 100%;
  background: currentColor;
}
/* low: red with the word; charging: the word */
.bless-battery.is-low {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-battery__fill {
  transform-box: fill-box;
  transform-origin: 0 50%;
  --_gx: var(--bless-grow);
  --_gy: 1;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
.bless-battery__fill:dir(rtl) {
  transform-origin: 100% 50%;
}
</style>
