<template>
  <figure class="bless-radialbar" role="group" :aria-label="label">
    <svg
      viewBox="0 0 100 100"
      class="bless-radialbar__svg"
      :style="{ inlineSize: `${size}px` }"
      aria-hidden="true"
    >
      <template v-for="g in rings" :key="g.label">
        <template v-if="g.r > W / 2">
          <circle class="bless-radialbar__track" cx="50" cy="50" :r="g.r" :stroke-width="W" />
          <circle
            v-if="g.share > 0"
            class="bless-radialbar__fill"
            cx="50"
            cy="50"
            :r="g.r"
            :stroke-width="W"
            pathLength="100"
            :stroke-dasharray="`${g.share * 100} 100`"
            :style="{ '--_c': g.color }"
          />
        </template>
      </template>
    </svg>
    <ul class="bless-radialbar__legend">
      <li v-for="g in rings" :key="g.label">
        <i :style="{ background: g.color }" aria-hidden="true" />
        <span class="bless-radialbar__name">{{ g.label }}</span>
        <span class="bless-radialbar__value">
          <strong>{{ pct.format(g.share) }}</strong> · {{ fmt(g.value) }} / {{ fmt(g.max) }}
        </span>
      </li>
    </ul>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { chartColor, numberText } from "./chart";

defineOptions({ name: "BlessRadialBar" });

export interface BlessRadialBarItem {
  label: string;
  value: number;
  /** the value of a full ring; default 100 */
  max?: number;
  /** a token name or any CSS color; default: the chart colors in order */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    /** one ring for each item, from the outside in */
    data: BlessRadialBarItem[];
    /** the width of the circle in pixels */
    size?: number;
    /** text for one value, for example `(v) => v + " min"` */
    format?: (v: number) => string;
    /** names the chart for screen readers */
    label?: string;
  }>(),
  { size: 180, label: "Chart" },
);

const fmt = computed(() => props.format ?? numberText);
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 });
const W = 8;
const GAP = 3;
const rings = computed(() =>
  props.data.map((d, i) => {
    const max = d.max ?? 100;
    const share = max > 0 ? Math.min(1, Math.max(0, d.value / max)) : 0;
    return { ...d, max, share, r: 46 - i * (W + GAP), color: chartColor(d.color, i) };
  }),
);
</script>

<style>
.bless-radialbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-6);
  margin: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-radialbar__svg {
  display: block;
  max-inline-size: 100%;
  rotate: -90deg;
}
.bless-radialbar__track,
.bless-radialbar__fill {
  fill: none;
}
.bless-radialbar__track {
  stroke: var(--bless-color-surface-2);
}
.bless-radialbar__fill {
  stroke: var(--_c);
  stroke-linecap: butt;
}
.bless-radialbar__legend {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-radialbar__legend li {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-radialbar__legend i {
  inline-size: 12px;
  block-size: 12px;
}
.bless-radialbar__value {
  margin-inline-start: auto;
  padding-inline-start: var(--bless-space-3);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-radialbar__value strong {
  color: var(--bless-color-text);
}
/* the chart opens out from its middle */
.bless-radialbar__svg {
  --_gx: calc(0.6 + 0.4 * var(--bless-grow));
  --_gy: var(--_gx);
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
