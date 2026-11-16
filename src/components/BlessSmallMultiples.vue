<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { niceTicks, numberText } from "./chart";
import BlessSparkline from "./BlessSparkline.vue";
import "./sr.css";

defineOptions({ name: "BlessSmallMultiples" });
const pack = useLabelPack("BlessSmallMultiples");

export interface BlessMultiple {
  label: string;
  values: number[];
  color?: string;
}

const props = withDefaults(
  defineProps<{
    series: BlessMultiple[];
    /** the names of the steps, for the table; default: 1, 2, 3 … */
    steps?: string[];
    /** the height of each small chart in pixels */
    height?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ item: string; scale: (lo: string, hi: string) => string }>;
  }>(),
  { height: 56, label: "Chart" },
);

const text = computed(() => ({
  item: "Item",
  scale: (lo: string, hi: string) => `All charts share one scale: ${lo} to ${hi}`,
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
// one scale for all, so the heights compare across the grid
const ticks = computed(() => {
  const vs = props.series.flatMap((s) => s.values).filter(Number.isFinite);
  return vs.length ? niceTicks(Math.min(0, ...vs), Math.max(...vs), 2) : [0, 1];
});
const lo = computed(() => ticks.value[0]!);
const hi = computed(() => ticks.value.at(-1)!);
const cols = computed(() => Math.max(0, ...props.series.map((s) => s.values.length)));
</script>

<template>
  <figure class="bless-multiples">
    <p class="bless-multiples__scale">{{ text.scale(fmt(lo), fmt(hi)) }}</p>
    <ul class="bless-multiples__grid" aria-hidden="true">
      <li v-for="(s, i) in series" :key="s.label" class="bless-multiples__cell">
        <span class="bless-multiples__head">
          <span class="bless-multiples__name">{{ s.label }}</span>
          <strong class="bless-multiples__last">{{
            s.values.length ? fmt(s.values.at(-1)!) : "–"
          }}</strong>
        </span>
        <BlessSparkline
          :data="s.values"
          :min="lo"
          :max="hi"
          :height
          :width="200"
          :color="s.color ?? `chart-${(i % 5) + 1}`"
          fill
          dot
          class="bless-multiples__spark"
        />
      </li>
    </ul>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.item }}</th>
            <th v-for="k in cols" :key="k" scope="col">{{ steps?.[k - 1] ?? k }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in series" :key="s.label">
            <th scope="row">{{ s.label }}</th>
            <td v-for="k in cols" :key="k">
              {{ s.values[k - 1] === undefined ? "–" : fmt(s.values[k - 1]!) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-multiples {
  margin: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-multiples__scale {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-multiples__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-multiples__cell {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-multiples__head {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-multiples__name {
  overflow: hidden;
  font-size: var(--bless-text-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-multiples__last {
  font-variant-numeric: tabular-nums;
}
/* the sparkline is the svg itself: it stretches to the cell */
.bless-multiples__spark {
  display: block;
  inline-size: 100%;
  block-size: auto;
}
</style>
