<template>
  <figure ref="box" class="bless-plot bless-stream">
    <ul class="bless-stream__legend" aria-hidden="true">
      <li v-for="s in streams" :key="s.key"><i :style="{ background: s.color }" />{{ s.name }}</li>
    </ul>
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <path
        v-for="s in streams"
        :key="s.key"
        class="bless-stream__area"
        :d="s.d"
        :style="{ '--_c': s.color }"
      >
        <title>{{ s.name }}</title>
      </path>
      <template v-for="(r, k) in data" :key="k">
        <text
          v-if="k % every === 0"
          class="bless-plot__tick"
          :x="px(k)"
          :y="height - 8"
          :text-anchor="k === 0 ? 'start' : k === data.length - 1 ? 'end' : 'middle'"
        >
          {{ r[x] }}
        </text>
      </template>
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
          <tr v-for="(r, k) in data" :key="k">
            <th scope="row">{{ r[x] }}</th>
            <td v-for="s in series" :key="s.key">{{ fmt(num(r, s.key)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

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

defineOptions({ name: "BlessStreamgraph" });
const pack = useLabelPack("BlessStreamgraph");

const props = withDefaults(
  defineProps<{
    /** one row for each step on the x axis, in order */
    data: BlessChartRow[];
    /** the field of a row with the text of its step, for example the month */
    x: string;
    /** one stream for each series; the first is the bottom one */
    series: BlessChartSeries[];
    height?: number;
    /** text for one value, for example `(v) => v + "k"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ step: string }>;
  }>(),
  { height: 260, label: "Chart" },
);

const text = computed(() => ({ step: "Step", ...pack(), ...props.labels }));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);
const num = (r: BlessChartRow, k: string) => Math.max(0, Number(r[k]) || 0);

const BOTTOM = 22;
const totals = computed(() =>
  props.data.map((r) => props.series.reduce((n, s) => n + num(r, s.key), 0)),
);
const px = computed(() => scale([0, Math.max(1, props.data.length - 1)], [8, width.value - 8]));
// the streams sit around a center line, as in ThemeRiver (Havre et al., 2000): each step starts at minus half its total
const py = computed(() => {
  const half = Math.max(1, ...totals.value) / 2;
  return scale([-half, half], [props.height - BOTTOM, 4]);
});
const streams = computed(() => {
  const n = props.data.length;
  const base = totals.value.map((t) => -t / 2);
  return props.series.map((s, i) => {
    const lo = base.slice();
    const hi = props.data.map((r, k) => (base[k]! += num(r, s.key)));
    const top = hi.map((v, k) => `${px.value(k).toFixed(1)},${py.value(v).toFixed(1)}`);
    const bottom = lo
      .map((v, k) => `${px.value(k).toFixed(1)},${py.value(v).toFixed(1)}`)
      .reverse();
    return {
      key: s.key,
      name: s.label ?? s.key,
      color: chartColor(s.color, i),
      d: n ? `M${top.join("L")}L${bottom.join("L")}Z` : "",
    };
  });
});
// one step label for about every 64 pixels
const every = computed(() =>
  Math.max(1, Math.ceil(64 / ((width.value - 16) / Math.max(1, props.data.length - 1)))),
);
</script>

<style>
.bless-stream__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: 0 0 var(--bless-space-3);
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-stream__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-stream__legend i {
  inline-size: 10px;
  block-size: 10px;
}
.bless-stream__area {
  fill: var(--_c);
  stroke: var(--bless-color-bg);
  stroke-width: 1;
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
svg:has(.bless-stream__area:hover) .bless-stream__area:not(:hover) {
  opacity: 0.45;
}
@media (prefers-reduced-motion: reduce) {
  .bless-stream__area {
    transition: none;
  }
}
</style>
