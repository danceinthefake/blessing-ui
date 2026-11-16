<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth, type BlessChartRow } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessParallelCoordinates" });
const pack = useLabelPack("BlessParallelCoordinates");

export interface BlessParallelAxis {
  key: string;
  label: string;
  format?: (v: number) => string;
}

const props = withDefaults(
  defineProps<{
    /** one line for each row */
    data: BlessChartRow[];
    /** the field with the name of a row */
    name: string;
    /** the axes, left to right; each has its own scale */
    axes: BlessParallelAxis[];
    height?: number;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ item: string }>;
  }>(),
  { height: 280, label: "Chart" },
);

const text = computed(() => ({ item: "Item", ...pack(), ...props.labels }));
const box = ref<HTMLElement>();
const width = useWidth(box);
const TOP = 34;
const BOTTOM = 20;
const num = (r: BlessChartRow, k: string) => Number(r[k]) || 0;
const fmtOf = (a: BlessParallelAxis) => a.format ?? numberText;
const axisX = computed(() => {
  const n = Math.max(1, props.axes.length - 1);
  return props.axes.map((_, i) => 40 + (i / n) * (width.value - 80));
});
const scales = computed(() =>
  props.axes.map((a) => {
    const vs = props.data.map((r) => num(r, a.key));
    const t = vs.length ? niceTicks(Math.min(...vs), Math.max(...vs), 4) : [0, 1];
    return { lo: t[0]!, hi: t.at(-1)!, y: scale([t[0]!, t.at(-1)!], [props.height - BOTTOM, TOP]) };
  }),
);
const lines = computed(() =>
  props.data.map((r, i) => ({
    name: String(r[props.name] ?? ""),
    color: chartColor(typeof r.color === "string" ? r.color : undefined, i),
    points: props.axes
      .map(
        (a, k) => `${axisX.value[k]!.toFixed(1)},${scales.value[k]!.y(num(r, a.key)).toFixed(1)}`,
      )
      .join(" "),
  })),
);
</script>

<template>
  <figure ref="box" class="bless-plot bless-parallel">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="(a, k) in axes" :key="a.key">
        <line
          class="bless-parallel__axis"
          :x1="axisX[k]"
          :x2="axisX[k]"
          :y1="TOP"
          :y2="height - BOTTOM"
        />
        <text
          class="bless-plot__cat bless-parallel__name"
          :x="axisX[k]"
          y="14"
          text-anchor="middle"
        >
          {{ a.label }}
        </text>
        <text class="bless-plot__tick" :x="axisX[k]" :y="TOP - 6" text-anchor="middle">
          {{ fmtOf(a)(scales[k]!.hi) }}
        </text>
        <text class="bless-plot__tick" :x="axisX[k]" :y="height - 6" text-anchor="middle">
          {{ fmtOf(a)(scales[k]!.lo) }}
        </text>
      </g>
      <polyline
        v-for="l in lines"
        :key="l.name"
        class="bless-parallel__line"
        :points="l.points"
        :style="{ '--_c': l.color }"
      >
        <title>{{ l.name }}</title>
      </polyline>
    </svg>
    <ul class="bless-parallel__legend" aria-hidden="true">
      <li v-for="l in lines" :key="l.name"><i :style="{ background: l.color }" />{{ l.name }}</li>
    </ul>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.item }}</th>
            <th v-for="a in axes" :key="a.key" scope="col">{{ a.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in data" :key="i">
            <th scope="row">{{ r[name] }}</th>
            <td v-for="a in axes" :key="a.key">{{ fmtOf(a)(num(r, a.key)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-parallel__axis {
  stroke: var(--bless-color-text-muted);
  stroke-width: 1;
}
.bless-parallel__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-parallel__line {
  fill: none;
  stroke: var(--_c);
  stroke-width: 2.5;
  stroke-linejoin: round;
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-parallel svg:has(.bless-parallel__line:hover) .bless-parallel__line:not(:hover) {
  opacity: 0.2;
}
.bless-parallel__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: var(--bless-space-2) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-parallel__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-parallel__legend i {
  inline-size: 12px;
  block-size: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .bless-parallel__line {
    transition: none;
  }
}
</style>
