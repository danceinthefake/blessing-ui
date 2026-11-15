<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessDumbbell" });
const pack = useLabelPack("BlessDumbbell");

export interface BlessDumbbellRow {
  label: string;
  /** the first value, for example before or the plan */
  start: number;
  /** the second value, for example after or the actual */
  end: number;
}

const props = withDefaults(
  defineProps<{
    data: BlessDumbbellRow[];
    /** the color of the end dot; the start dot is gray and hollow */
    color?: string;
    /** text for one value, for example `(v) => v + "%"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ start: string; end: string; row: string; change: string }>;
  }>(),
  { color: "chart-1", label: "Chart" },
);

const text = computed(() => ({
  start: "Before",
  end: "After",
  row: "Item",
  change: "Change",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const ROW = 32;
const xt = computed(() => {
  const vs = props.data.flatMap((r) => [r.start, r.end]);
  return vs.length ? niceTicks(Math.min(0, ...vs), Math.max(...vs), 5) : [0, 1];
});
// the names sit in a column at the start; about 7 pixels for each letter, at most 160
const labelW = computed(() =>
  Math.min(160, 12 + 7 * Math.max(0, ...props.data.map((r) => r.label.length))),
);
const height = computed(() => props.data.length * ROW + 24);
const px = computed(() =>
  scale([xt.value[0]!, xt.value.at(-1)!], [labelW.value + 8, width.value - 12]),
);
const sign = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "±");
const change = (r: BlessDumbbellRow) =>
  `${sign(r.end - r.start)}${fmt.value(Math.abs(r.end - r.start))}`;
</script>

<template>
  <figure ref="box" class="bless-plot bless-dumbbell" :style="{ '--_c': chartColor(color, 0) }">
    <div class="bless-dumbbell__legend" aria-hidden="true">
      <span><i class="bless-dumbbell__dot is-start" />{{ text.start }}</span>
      <span><i class="bless-dumbbell__dot" />{{ text.end }}</span>
    </div>
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in xt" :key="t">
        <line class="bless-plot__grid" :x1="px(t)" :x2="px(t)" :y1="0" :y2="height - 20" />
        <text class="bless-plot__tick" :x="px(t)" :y="height - 8" text-anchor="middle">
          {{ fmt(t) }}
        </text>
      </g>
      <g v-for="(r, i) in data" :key="r.label" class="bless-dumbbell__row">
        <title>
          {{ r.label }}: {{ text.start }} {{ fmt(r.start) }}, {{ text.end }} {{ fmt(r.end) }}
        </title>
        <text
          class="bless-plot__cat"
          :x="labelW"
          :y="i * ROW + ROW / 2"
          text-anchor="end"
          dominant-baseline="middle"
        >
          {{ r.label }}
        </text>
        <line
          class="bless-dumbbell__bar"
          :x1="px(r.start)"
          :x2="px(r.end)"
          :y1="i * ROW + ROW / 2"
          :y2="i * ROW + ROW / 2"
        />
        <circle class="bless-dumbbell__start" :cx="px(r.start)" :cy="i * ROW + ROW / 2" r="5" />
        <circle class="bless-dumbbell__end" :cx="px(r.end)" :cy="i * ROW + ROW / 2" r="6" />
      </g>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.row }}</th>
            <th scope="col">{{ text.start }}</th>
            <th scope="col">{{ text.end }}</th>
            <th scope="col">{{ text.change }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in data" :key="r.label">
            <th scope="row">{{ r.label }}</th>
            <td>{{ fmt(r.start) }}</td>
            <td>{{ fmt(r.end) }}</td>
            <td>{{ change(r) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-dumbbell__legend {
  display: flex;
  gap: var(--bless-space-4);
  margin-block-end: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-dumbbell__legend span {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-dumbbell__dot {
  display: inline-block;
  inline-size: 10px;
  block-size: 10px;
  border-radius: 50%;
  background: var(--_c);
}
.bless-dumbbell__dot.is-start {
  border: 2px solid var(--bless-color-text-muted);
  background: none;
}
.bless-dumbbell__bar {
  stroke: var(--bless-color-border);
  stroke-width: 3;
}
.bless-dumbbell__start {
  fill: var(--bless-color-bg);
  stroke: var(--bless-color-text-muted);
  stroke-width: 2;
}
.bless-dumbbell__end {
  fill: var(--_c);
}
</style>
