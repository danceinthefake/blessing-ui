<template>
  <figure ref="box" class="bless-plot bless-bump">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <text
        v-for="r in series.length"
        :key="r"
        class="bless-plot__tick"
        x="4"
        :y="py(r)"
        dominant-baseline="middle"
      >
        #{{ r }}
      </text>
      <template v-for="(row, k) in data" :key="k">
        <text
          v-if="k % every === 0 || k === data.length - 1"
          class="bless-plot__tick"
          :x="px(k)"
          :y="height - 8"
          text-anchor="middle"
        >
          {{ row[x] }}
        </text>
      </template>
      <g v-for="l in lines" :key="l.key" class="bless-bump__line" :style="{ '--_c': l.color }">
        <title>{{ l.name }}</title>
        <path :d="l.d" />
        <circle v-for="([cx, cy], k) in l.pts" :key="k" :cx :cy r="4" />
        <text
          v-if="l.pts.length"
          class="bless-bump__name"
          :x="l.pts.at(-1)![0] + 10"
          :y="l.pts.at(-1)![1]"
          dominant-baseline="middle"
        >
          {{ l.name }}
        </text>
      </g>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.step }}</th>
            <th v-for="s in series" :key="s.key" scope="col">{{ s.label ?? s.key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, k) in data" :key="k">
            <th scope="row">{{ row[x] }}</th>
            <td v-for="s in series" :key="s.key">
              {{ text.rank(ranks[k]![s.key]!, fmt(num(row, s.key))) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script lang="ts">
/** The rank of each key in each row: 1 is the highest value (or the lowest, with `lower`). Ties share a rank. */
export function bumpRanks(
  rows: Record<string, unknown>[],
  keys: string[],
  lower = false,
): Record<string, number>[] {
  return rows.map((r) => {
    const vals = keys.map((k) => ({ k, v: Number(r[k]) || 0 }));
    const sorted = [...vals].sort((a, b) => (lower ? a.v - b.v : b.v - a.v));
    const out: Record<string, number> = {};
    sorted.forEach((s, i) => {
      out[s.k] = i && sorted[i - 1]!.v === s.v ? out[sorted[i - 1]!.k]! : i + 1;
    });
    return out;
  });
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import {
  chartColor,
  numberText,
  scale,
  useWidth,
  type BlessChartRow,
  type BlessChartSeries,
} from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessBumpChart" });
const pack = useLabelPack("BlessBumpChart");

const props = withDefaults(
  defineProps<{
    /** one row for each step, in order, with a value for each series */
    data: BlessChartRow[];
    /** the field of a row with the text of its step */
    x: string;
    series: BlessChartSeries[];
    /** a lower value ranks higher, for example a time */
    lower?: boolean;
    height?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ step: string; rank: (rank: number, value: string) => string }>;
  }>(),
  { height: 260, label: "Chart" },
);

const text = computed(() => ({
  step: "Step",
  rank: (r: number, v: string) => `#${r} (${v})`,
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const ranks = computed(() =>
  bumpRanks(
    props.data,
    props.series.map((s) => s.key),
    props.lower,
  ),
);
const nameW = computed(() =>
  Math.min(140, 16 + 7 * Math.max(0, ...props.series.map((s) => (s.label ?? s.key).length))),
);
const BOTTOM = 22;
const px = computed(() =>
  scale([0, Math.max(1, props.data.length - 1)], [28, width.value - nameW.value]),
);
const py = computed(() =>
  scale([1, Math.max(2, props.series.length)], [14, props.height - BOTTOM - 8]),
);
const lines = computed(() =>
  props.series.map((s, i) => {
    const pts = ranks.value.map((r, k) => [px.value(k), py.value(r[s.key]!)] as const);
    return {
      key: s.key,
      name: s.label ?? s.key,
      color: chartColor(s.color, i),
      pts,
      d: pts.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(""),
    };
  }),
);
const every = computed(() =>
  Math.max(
    1,
    Math.ceil(56 / ((width.value - 28 - nameW.value) / Math.max(1, props.data.length - 1))),
  ),
);
const num = (r: BlessChartRow, k: string) => Number(r[k]) || 0;
</script>

<style>
.bless-bump__line path {
  fill: none;
  stroke: var(--_c);
  stroke-width: 3;
  stroke-linejoin: round;
}
.bless-bump__line circle {
  fill: var(--_c);
  stroke: var(--bless-color-bg);
  stroke-width: 2;
}
.bless-bump__name {
  fill: var(--bless-color-text);
  font-size: var(--bless-text-xs);
}
/* a hover on one line fades the others, so a path can be followed through the crossings */
.bless-bump svg:has(.bless-bump__line:hover) .bless-bump__line:not(:hover) {
  opacity: 0.25;
}
.bless-bump__line {
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
@media (prefers-reduced-motion: reduce) {
  .bless-bump__line {
    transition: none;
  }
}
</style>
