<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText, type BlessChartRow, type BlessChartSeries } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessMarimekko" });
const pack = useLabelPack("BlessMarimekko");

const props = withDefaults(
  defineProps<{
    /** one column for each row, with a value for each series */
    data: BlessChartRow[];
    /** the field with the name of the column */
    x: string;
    /** the parts of each column, from the bottom up */
    series: BlessChartSeries[];
    height?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ column: string; share: string }>;
  }>(),
  { height: 280, label: "Chart" },
);

const text = computed(() => ({
  column: "Column",
  share: "Share of all",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 });
const num = (r: BlessChartRow, k: string) => Math.max(0, Number(r[k]) || 0);
const cols = computed(() => {
  const totals = props.data.map((r) => props.series.reduce((n, s) => n + num(r, s.key), 0));
  const all = totals.reduce((a, b) => a + b, 0) || 1;
  return props.data.map((r, i) => ({
    name: String(r[props.x] ?? ""),
    share: totals[i]! / all,
    parts: props.series.map((s, k) => ({
      key: s.key,
      name: s.label ?? s.key,
      value: num(r, s.key),
      share: totals[i] ? num(r, s.key) / totals[i]! : 0,
      color: chartColor(s.color, k),
    })),
  }));
});
</script>

<template>
  <figure class="bless-mekko">
    <ul class="bless-mekko__legend" aria-hidden="true">
      <li v-for="(s, k) in series" :key="s.key">
        <i :style="{ background: chartColor(s.color, k) }" />{{ s.label ?? s.key }}
      </li>
    </ul>
    <div class="bless-mekko__plot" :style="{ blockSize: `${height}px` }" aria-hidden="true">
      <div
        v-for="c in cols"
        :key="c.name"
        class="bless-mekko__col"
        :style="{ flexGrow: c.share }"
        :title="`${c.name}: ${pct.format(c.share)}`"
      >
        <span
          v-for="p in [...c.parts].reverse()"
          :key="p.key"
          class="bless-mekko__part"
          :style="{ flexGrow: p.share, '--_c': p.color }"
          :title="`${c.name} · ${p.name}: ${fmt(p.value)} (${pct.format(p.share)})`"
        >
          <span v-if="p.share >= 0.12 && c.share >= 0.08" class="bless-mekko__pct">{{
            pct.format(p.share)
          }}</span>
        </span>
      </div>
    </div>
    <div class="bless-mekko__axis" aria-hidden="true">
      <span v-for="c in cols" :key="c.name" :style="{ flexGrow: c.share }">
        {{ c.name }} <b>{{ pct.format(c.share) }}</b>
      </span>
    </div>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.column }}</th>
            <th v-for="s in series" :key="s.key" scope="col">{{ s.label ?? s.key }}</th>
            <th scope="col">{{ text.share }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in cols" :key="c.name">
            <th scope="row">{{ c.name }}</th>
            <td v-for="p in c.parts" :key="p.key">
              {{ fmt(p.value) }} ({{ pct.format(p.share) }})
            </td>
            <td>{{ pct.format(c.share) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-mekko {
  margin: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-mekko__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: 0 0 var(--bless-space-2);
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-mekko__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-mekko__legend i {
  inline-size: 10px;
  block-size: 10px;
}
/* the width of a column is its share of all, and the height of a part is its share of the column */
.bless-mekko__plot,
.bless-mekko__axis {
  display: flex;
  gap: 2px;
}
.bless-mekko__col {
  display: flex;
  flex-basis: 0;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 0;
}
.bless-mekko__part {
  display: grid;
  flex-basis: 0;
  place-items: center;
  min-block-size: 0;
  overflow: hidden;
  background: var(--_c);
}
.bless-mekko__pct {
  padding: 0 4px;
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
.bless-mekko__axis {
  margin-block-start: var(--bless-space-1);
  font-size: var(--bless-text-xs);
}
.bless-mekko__axis span {
  flex-basis: 0;
  min-inline-size: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-mekko__axis b {
  color: var(--bless-color-text-muted);
  font-weight: normal;
}
.bless-mekko__col {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
