<template>
  <div class="bless-bullet">
    <span class="bless-bullet__label">{{ label }}</span>
    <div
      class="bless-bullet__track"
      role="meter"
      :aria-label="label"
      :aria-valuenow="value"
      :aria-valuemin="min"
      :aria-valuemax="top"
      :aria-valuetext="valuetext"
    >
      <span
        v-for="(b, i) in bands"
        :key="b"
        class="bless-bullet__band"
        :style="{
          insetInlineStart: pct(i ? bands[i - 1]! : min),
          inlineSize: `calc(${pct(b)} - ${pct(i ? bands[i - 1]! : min)})`,
          '--_k': `${8 + (bands.length - 1 - i) * (24 / Math.max(1, bands.length - 1))}%`,
        }"
      />
      <span
        class="bless-bullet__bar"
        :style="{ inlineSize: pct(value), '--_c': chartColor(color, 0) }"
      />
      <span
        v-if="target !== undefined"
        class="bless-bullet__target"
        :style="{ insetInlineStart: pct(target) }"
      />
    </div>
    <span class="bless-bullet__value" aria-hidden="true">{{ fmt(value) }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText } from "./chart";

defineOptions({ name: "BlessBulletChart" });
const pack = useLabelPack("BlessBulletChart");

const props = withDefaults(
  defineProps<{
    /** the name of the number, at the start of the row */
    label: string;
    value: number;
    /** the goal, drawn as a line across the bar */
    target?: number;
    /** the ends of the bands, low to high, for example `[50, 80, 100]` for poor, fair, and good */
    bands?: number[];
    min?: number;
    /** the end of the scale; default: the last band, or a round number above the value and the target */
    max?: number;
    color?: string;
    /** text for one value, for example `(v) => v + "%"` */
    format?: (v: number) => string;
    labels?: Partial<{
      target: string;
      /** the name of the band that holds the value */ band: (
        index: number,
        count: number,
      ) => string;
    }>;
  }>(),
  { bands: () => [], min: 0, color: "chart-1" },
);

const text = computed(() => ({
  target: "target",
  band: (i: number, n: number) =>
    n === 3 ? ["poor", "fair", "good"][i]! : `band ${i + 1} of ${n}`,
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const top = computed(
  () =>
    props.max ??
    props.bands.at(-1) ??
    niceTicks(props.min, Math.max(props.value, props.target ?? -Infinity), 4).at(-1)!,
);
const pct = (v: number) =>
  `${Math.min(100, Math.max(0, ((v - props.min) / (top.value - props.min || 1)) * 100))}%`;
// the band that holds the value, for screen readers: the color alone does not say it
const band = computed(() => {
  const i = props.bands.findIndex((b) => props.value <= b);
  const n = props.bands.length;
  return n ? text.value.band(i < 0 ? n - 1 : i, n) : undefined;
});
const valuetext = computed(() =>
  [
    fmt.value(props.value),
    props.target !== undefined && `${text.value.target} ${fmt.value(props.target)}`,
    band.value,
  ]
    .filter(Boolean)
    .join(", "),
);
</script>

<style>
.bless-bullet {
  display: grid;
  grid-template-columns: var(--bless-bullet-label, 8rem) 1fr auto;
  align-items: center;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-bullet__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-bullet__track {
  position: relative;
  block-size: 20px;
  background: var(--bless-color-surface-2);
}
/* the first band (poor) has the strongest shade of the text color, in both themes */
.bless-bullet__band {
  position: absolute;
  inset-block: 0;
  background: color-mix(in srgb, var(--bless-color-text) var(--_k), var(--bless-color-bg));
}
.bless-bullet__bar {
  position: absolute;
  inset-block: 6px;
  inset-inline-start: 0;
  background: var(--_c);
}
.bless-bullet__target {
  position: absolute;
  inset-block: 2px;
  inline-size: 3px;
  margin-inline-start: -1px;
  background: var(--bless-color-text);
}
.bless-bullet__value {
  min-inline-size: 3.5em;
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  text-align: end;
}
.bless-bullet__bar {
  transform-box: fill-box;
  transform-origin: 0 50%;
  --_gx: var(--bless-grow);
  --_gy: 1;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
.bless-bullet__bar:dir(rtl) {
  transform-origin: 100% 50%;
}
</style>
