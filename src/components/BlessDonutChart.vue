<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";

defineOptions({ name: "BlessDonutChart" });
const pack = useLabelPack("BlessDonutChart");

export interface BlessDonutSlice {
  label: string;
  value: number;
  /** a token name or any CSS color; default: the chart colors in order */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    data: BlessDonutSlice[];
    /** a full pie, with no hole and no total */
    pie?: boolean;
    /** the width of the circle in pixels */
    size?: number;
    /** text for one value, for example `(v) => v + " GB"` */
    format?: (v: number) => string;
    /** names the chart for screen readers */
    label?: string;
    labels?: Partial<{ total: string }>;
  }>(),
  { size: 180, label: "Chart" },
);

const text = computed(() => ({ total: "Total", ...pack(), ...props.labels }));
const fmt = computed(() => props.format ?? numberText);
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

const total = computed(() => props.data.reduce((n, d) => n + Math.max(0, d.value || 0), 0));
// each slice is a dash on a circle with pathLength 100: no arc math, and one slice can be the full ring
const slices = computed(() => {
  let at = 0;
  return props.data.map((d, i) => {
    const share = total.value ? Math.max(0, d.value || 0) / total.value : 0;
    const s = { ...d, share, start: at * 100, color: chartColor(d.color, i) };
    at += share;
    return s;
  });
});
const GAP = computed(() => (slices.value.filter((s) => s.share > 0).length > 1 ? 0.6 : 0));
const R = 40;
const ring = computed(() => (props.pie ? R : 14));
// a pie is a circle of half the radius with a stroke as wide as the radius
const r = computed(() => (props.pie ? R / 2 : R - ring.value / 2));
</script>

<template>
  <figure class="bless-donut" :aria-label="label" role="group">
    <div class="bless-donut__plot" :style="{ inlineSize: `${size}px` }">
      <svg viewBox="0 0 100 100" class="bless-donut__svg" aria-hidden="true">
        <circle class="bless-donut__track" cx="50" cy="50" :r :stroke-width="ring" />
        <template v-for="(s, i) in slices" :key="i">
          <circle
            v-if="s.share > 0"
            class="bless-donut__slice"
            cx="50"
            cy="50"
            :r
            :stroke-width="ring"
            pathLength="100"
            :stroke-dasharray="`${Math.max(0.01, s.share * 100 - GAP)} ${100 - s.share * 100 + GAP}`"
            :stroke-dashoffset="-s.start"
            :style="{ '--_c': s.color }"
          >
            <title>{{ s.label }}: {{ fmt(s.value) }} ({{ pct.format(s.share) }})</title>
          </circle>
        </template>
      </svg>
      <div v-if="!pie" class="bless-donut__center" aria-hidden="true">
        <strong>{{ fmt(total) }}</strong>
        <span>{{ text.total }}</span>
      </div>
    </div>
    <ul role="list" class="bless-donut__legend">
      <li v-for="(s, i) in slices" :key="i" :style="{ '--_c': s.color }">
        <span class="bless-donut__name">{{ s.label }}</span>
        <span class="bless-donut__value">{{ fmt(s.value) }}</span>
        <span class="bless-donut__share">{{ pct.format(s.share) }}</span>
      </li>
    </ul>
  </figure>
</template>

<style>
.bless-donut {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-4) var(--bless-space-6);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-donut__plot {
  position: relative;
  flex: none;
  max-inline-size: 100%;
}
.bless-donut__svg {
  display: block;
  inline-size: 100%;
  rotate: -90deg;
  /* the ring opens out from its middle */
  --_gx: calc(0.6 + 0.4 * var(--bless-grow));
  --_gy: var(--_gx);
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft);
}
.bless-donut__track {
  fill: none;
  stroke: var(--bless-color-surface-2);
}
.bless-donut__slice {
  fill: none;
  stroke: var(--_c);
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-donut__slice:hover {
  opacity: 0.75;
}
.bless-donut__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
}
.bless-donut__center strong {
  font-size: var(--bless-text-lg);
  font-variant-numeric: tabular-nums;
}
.bless-donut__center span {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-donut__legend {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: var(--bless-space-1) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-sm);
}
.bless-donut__legend li {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}
.bless-donut__name {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-donut__name::before {
  content: "";
  flex: none;
  inline-size: 10px;
  block-size: 10px;
  background: var(--_c);
}
.bless-donut__value,
.bless-donut__share {
  text-align: end;
  font-variant-numeric: tabular-nums;
}
.bless-donut__share {
  color: var(--bless-color-text-muted);
}
@media (prefers-reduced-motion: reduce) {
  .bless-donut__slice {
    transition: none;
  }
}
</style>
