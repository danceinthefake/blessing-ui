<template>
  <figure ref="box" class="bless-plot bless-pareto" :style="{ '--_c': chartColor(color, 0) }">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in yt" :key="t">
        <line
          class="bless-plot__grid"
          :class="{ 'bless-plot__zero': t === 0 }"
          :x1="frame.x0"
          :x2="frame.x1"
          :y1="py(t)"
          :y2="py(t)"
        />
        <text
          class="bless-plot__tick"
          :x="frame.x0 - 6"
          :y="py(t)"
          text-anchor="end"
          dominant-baseline="middle"
        >
          {{ fmt(t) }}
        </text>
      </g>
      <text
        v-for="s in [0, 0.5, 1]"
        :key="s"
        class="bless-plot__tick"
        :x="frame.x1 + 6"
        :y="ps(s)"
        dominant-baseline="middle"
      >
        {{ pct.format(s) }}
      </text>
      <line class="bless-pareto__cut" :x1="frame.x0" :x2="frame.x1" :y1="ps(cut)" :y2="ps(cut)" />
      <template v-for="(r, i) in rows" :key="r.label">
        <rect
          class="bless-plot__mark"
          :class="{ 'is-rest': i >= few }"
          :style="{ '--_i': i }"
          :x="cx(i) - step * 0.35"
          :y="py(r.value)"
          :width="step * 0.7"
          :height="py(0) - py(r.value)"
        >
          <title>{{ r.label }}: {{ fmt(r.value) }} ({{ pct.format(r.running) }})</title>
        </rect>
        <text
          v-if="i % every === 0"
          class="bless-plot__tick"
          :x="cx(i)"
          :y="frame.y1 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ r.label }}
        </text>
      </template>
      <polyline class="bless-pareto__line" :points="line" />
      <circle
        v-for="(r, i) in rows"
        :key="r.label"
        class="bless-pareto__dot"
        :cx="cx(i)"
        :cy="ps(r.running)"
        r="3"
      />
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.item }}</th>
            <th scope="col">{{ text.value }}</th>
            <th scope="col">{{ text.running }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.label">
            <th scope="row">{{ r.label }}</th>
            <td>{{ fmt(r.value) }}</td>
            <td>{{ pct.format(r.running) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script lang="ts">
export interface BlessParetoItem {
  label: string;
  value: number;
}
/** The items from high to low, with the running share of the total after each one. */
export function paretoRows<T extends BlessParetoItem>(items: T[]): (T & { running: number })[] {
  const sorted = [...items].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const total = sorted.reduce((n, d) => n + d.value, 0) || 1;
  let sum = 0;
  return sorted.map((d) => ({ ...d, running: (sum += d.value) / total }));
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessPareto" });
const pack = useLabelPack("BlessPareto");

const props = withDefaults(
  defineProps<{
    data: BlessParetoItem[];
    /** the share that marks "the few": a dashed line, and the bars up to it are in full color */
    cut?: number;
    color?: string;
    height?: number;
    /** text for one value, for example `(v) => v + " min"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ item: string; value: string; running: string }>;
  }>(),
  { cut: 0.8, color: "chart-1", height: 260, label: "Chart" },
);

const text = computed(() => ({
  item: "Item",
  value: "Value",
  running: "Running share",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 });
const box = ref<HTMLElement>();
const width = useWidth(box);

const rows = computed(() => paretoRows(props.data));
const yt = computed(() => niceTicks(0, Math.max(1, ...rows.value.map((r) => r.value)), 4));
const BOTTOM = 22;
const frame = computed(() => ({
  x0: 8 + 6 * Math.max(...yt.value.map((t) => fmt.value(t).length)),
  x1: width.value - 34,
  y0: 8,
  y1: props.height - BOTTOM,
}));
const py = computed(() => scale([0, yt.value.at(-1)!], [frame.value.y1, frame.value.y0]));
const ps = computed(() => scale([0, 1], [frame.value.y1, frame.value.y0]));
const step = computed(() => (frame.value.x1 - frame.value.x0) / Math.max(1, rows.value.length));
const cx = (i: number) => frame.value.x0 + (i + 0.5) * step.value;
// the bars up to and with the first one that reaches the cut are "the few"
const few = computed(() => {
  const i = rows.value.findIndex((r) => r.running >= props.cut - 1e-9);
  return i < 0 ? rows.value.length : i + 1;
});
const line = computed(() =>
  rows.value.map((r, i) => `${cx(i).toFixed(1)},${ps.value(r.running).toFixed(1)}`).join(" "),
);
const every = computed(() => Math.max(1, Math.ceil(56 / step.value)));
</script>

<style>
/* the bars after the cut are a lighter shade, so "the few" stand out without a second color */
.bless-pareto .bless-plot__mark.is-rest {
  fill: color-mix(in srgb, var(--_c) 35%, var(--bless-color-bg));
}
.bless-pareto__line {
  fill: none;
  stroke: var(--bless-color-text);
  stroke-width: 2;
}
.bless-pareto__dot {
  fill: var(--bless-color-bg);
  stroke: var(--bless-color-text);
  stroke-width: 2;
}
.bless-pareto__cut {
  stroke: var(--bless-color-text-muted);
  stroke-dasharray: 4 3;
}
</style>
