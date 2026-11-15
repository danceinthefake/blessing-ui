<script setup lang="ts">
import { computed } from "vue";
import { chartColor, numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessHeatmap" });

const props = withDefaults(
  defineProps<{
    /** the names of the rows, down the start edge */
    rows: string[];
    /** the names of the columns, along the top */
    columns: string[];
    /** `values[row][column]`; `null` is a cell with no data */
    values: (number | null | undefined)[][];
    /** a token name or any CSS color for the highest value */
    color?: string;
    /** text for one value, for example `(v) => v + " plays"` */
    format?: (v: number) => string;
    /** names the table */
    label?: string;
  }>(),
  { color: "chart-1", label: "Heatmap" },
);

const fmt = computed(() => props.format ?? numberText);
const all = computed(() =>
  props.values.flat().filter((v): v is number => typeof v === "number" && Number.isFinite(v)),
);
const lo = computed(() => (all.value.length ? Math.min(...all.value) : 0));
const hi = computed(() => (all.value.length ? Math.max(...all.value) : 0));
// the share of the color: 12% for the lowest value, so it still differs from a cell with no data
const mix = (v: number) =>
  Math.round(12 + 88 * (hi.value === lo.value ? 1 : (v - lo.value) / (hi.value - lo.value)));
const cell = (r: number, c: number) => {
  const v = props.values[r]?.[c];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
};
const base = computed(() => chartColor(props.color, 0));
</script>

<template>
  <figure class="bless-heatmap">
    <div class="bless-heatmap__scroll">
      <table class="bless-heatmap__table" :style="{ '--_c': base }">
        <caption class="bless-sr">
          {{ label }}
        </caption>
        <thead>
          <tr>
            <td />
            <th v-for="col in columns" :key="col" scope="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in rows" :key="row">
            <th scope="row">{{ row }}</th>
            <td
              v-for="(col, c) in columns"
              :key="col"
              class="bless-heatmap__cell"
              :class="{ 'bless-heatmap__cell--empty': cell(r, c) === undefined }"
              :style="cell(r, c) === undefined ? undefined : { '--_m': `${mix(cell(r, c)!)}%` }"
              :title="`${row} · ${col}: ${cell(r, c) === undefined ? '–' : fmt(cell(r, c)!)}`"
            >
              <span class="bless-sr">{{ cell(r, c) === undefined ? "–" : fmt(cell(r, c)!) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <figcaption v-if="all.length" class="bless-heatmap__legend" aria-hidden="true">
      <span>{{ fmt(lo) }}</span>
      <span class="bless-heatmap__ramp" :style="{ '--_c': base }" />
      <span>{{ fmt(hi) }}</span>
    </figcaption>
  </figure>
</template>

<style>
.bless-heatmap {
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-heatmap__scroll {
  overflow-x: auto;
}
.bless-heatmap__table {
  border-collapse: separate;
  border-spacing: 2px;
  font-size: var(--bless-text-xs);
}
.bless-heatmap__table th {
  padding: 0 var(--bless-space-1);
  font-weight: var(--bless-font-weight-normal);
  color: var(--bless-color-text-muted);
  white-space: nowrap;
}
.bless-heatmap__table thead th {
  text-align: center;
}
.bless-heatmap__table tbody th {
  text-align: end;
}
.bless-heatmap__cell {
  min-inline-size: 22px;
  block-size: 22px;
  padding: 0;
  background: color-mix(in srgb, var(--_c) var(--_m), var(--bless-color-bg));
}
.bless-heatmap__cell--empty {
  background: var(--bless-color-surface-2);
}
.bless-heatmap__legend {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  margin-block-start: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-heatmap__ramp {
  inline-size: 120px;
  block-size: 8px;
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--_c) 12%, var(--bless-color-bg)),
    var(--_c)
  );
}
[dir="rtl"] .bless-heatmap__ramp {
  scale: -1 1;
}
</style>
