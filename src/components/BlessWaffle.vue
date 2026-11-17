<script lang="ts">
export interface BlessWaffleSlice {
  label: string;
  value: number;
  /** a token name or any CSS color; default: the chart colors in order */
  color?: string;
}
/** Whole cells for each share that add up to `cells`, by the largest remainder method: each gets its floor, then the largest remainders get one more. */
export function waffleCells(values: number[], cells = 100): number[] {
  const vs = values.map((v) => Math.max(0, v || 0));
  const total = vs.reduce((a, b) => a + b, 0);
  if (!total) return vs.map(() => 0);
  const exact = vs.map((v) => (v / total) * cells);
  const out = exact.map(Math.floor);
  let left = cells - out.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => [e - Math.floor(e), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) if (left-- > 0) out[i]!++;
  return out;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { chartColor, numberText } from "./chart";

defineOptions({ name: "BlessWaffle" });
const props = withDefaults(
  defineProps<{
    data: BlessWaffleSlice[];
    /** text for one value, for example `(v) => v + " GB"` */
    format?: (v: number) => string;
    /** names the chart for screen readers */
    label?: string;
  }>(),
  { label: "Chart" },
);

const fmt = computed(() => props.format ?? numberText);
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });
const total = computed(() => props.data.reduce((n, d) => n + Math.max(0, d.value || 0), 0));
const slices = computed(() => {
  const n = waffleCells(props.data.map((d) => d.value));
  return props.data.map((d, i) => ({
    ...d,
    cells: n[i]!,
    share: total.value ? Math.max(0, d.value || 0) / total.value : 0,
    color: chartColor(d.color, i),
  }));
});
// the cells fill row by row from the top, one slice after the other
const grid = computed(() =>
  slices.value.flatMap((s, i) => Array.from({ length: s.cells }, () => i)),
);
</script>

<template>
  <figure class="bless-waffle" role="group" :aria-label="label">
    <div class="bless-waffle__grid" aria-hidden="true">
      <span
        v-for="(s, k) in grid"
        :key="k"
        class="bless-waffle__cell"
        :style="{ '--_c': slices[s]!.color }"
      />
      <span v-for="k in 100 - grid.length" :key="`e${k}`" class="bless-waffle__cell is-empty" />
    </div>
    <ul class="bless-waffle__legend">
      <li v-for="s in slices" :key="s.label">
        <i class="bless-waffle__key" :style="{ '--_c': s.color }" aria-hidden="true" />
        <span class="bless-waffle__name">{{ s.label }}</span>
        <span class="bless-waffle__value">{{ pct.format(s.share) }} · {{ fmt(s.value) }}</span>
      </li>
    </ul>
  </figure>
</template>

<style>
.bless-waffle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-6);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-waffle__grid {
  display: grid;
  grid-template-columns: repeat(10, var(--bless-waffle-cell, 14px));
  gap: 3px;
}
.bless-waffle__cell {
  aspect-ratio: 1;
  background: var(--_c);
}
.bless-waffle__cell.is-empty {
  background: var(--bless-color-surface-2);
}
.bless-waffle__legend {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-sm);
}
.bless-waffle__legend li {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-waffle__key {
  inline-size: 12px;
  block-size: 12px;
  background: var(--_c);
}
.bless-waffle__value {
  margin-inline-start: auto;
  padding-inline-start: var(--bless-space-3);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-waffle__grid {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
