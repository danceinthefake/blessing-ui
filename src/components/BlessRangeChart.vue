<template>
  <figure ref="box" class="bless-plot bless-rangechart" :style="{ '--_c': chartColor(color, 0) }">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in xt" :key="t">
        <line class="bless-plot__grid" :x1="px(t)" :x2="px(t)" y1="0" :y2="height - 20" />
        <text class="bless-plot__tick" :x="px(t)" :y="height - 6" text-anchor="middle">
          {{ fmt(t) }}
        </text>
      </g>
      <g v-for="(d, i) in data" :key="d.label" class="bless-rangechart__row">
        <title>{{ d.label }}: {{ fmt(d.low) }} – {{ fmt(d.high) }}</title>
        <text
          class="bless-plot__cat"
          :x="labelW"
          :y="i * ROW + ROW / 2"
          text-anchor="end"
          dominant-baseline="middle"
        >
          {{ d.label }}
        </text>
        <rect
          class="bless-rangechart__bar"
          :x="px(Math.min(d.low, d.high))"
          :y="i * ROW + 8"
          :width="Math.max(2, Math.abs(px(d.high) - px(d.low)))"
          :height="ROW - 16"
        />
        <line
          v-if="d.value !== undefined"
          class="bless-rangechart__mark"
          :x1="px(d.value)"
          :x2="px(d.value)"
          :y1="i * ROW + 4"
          :y2="i * ROW + ROW - 4"
        />
      </g>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.item }}</th>
            <th scope="col">{{ text.low }}</th>
            <th scope="col">{{ text.high }}</th>
            <th v-if="marks" scope="col">{{ text.value }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in data" :key="d.label">
            <th scope="row">{{ d.label }}</th>
            <td>{{ fmt(d.low) }}</td>
            <td>{{ fmt(d.high) }}</td>
            <td v-if="marks">{{ d.value === undefined ? "–" : fmt(d.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessRangeChart" });
const pack = useLabelPack("BlessRangeChart");

export interface BlessRangeRow {
  label: string;
  low: number;
  high: number;
  /** a mark inside the range, for example the average */
  value?: number;
}

const props = withDefaults(
  defineProps<{
    data: BlessRangeRow[];
    color?: string;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ item: string; low: string; high: string; value: string }>;
  }>(),
  { color: "chart-1", label: "Chart" },
);

const text = computed(() => ({
  item: "Item",
  low: "Low",
  high: "High",
  value: "Mark",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const ROW = 30;
const xt = computed(() => {
  const vs = props.data.flatMap((d) => [d.low, d.high]);
  return vs.length ? niceTicks(Math.min(...vs), Math.max(...vs), 5) : [0, 1];
});
const labelW = computed(() =>
  Math.min(160, 12 + 7 * Math.max(0, ...props.data.map((d) => d.label.length))),
);
const height = computed(() => props.data.length * ROW + 24);
const px = computed(() =>
  scale([xt.value[0]!, xt.value.at(-1)!], [labelW.value + 8, width.value - 12]),
);
const marks = computed(() => props.data.some((d) => d.value !== undefined));
</script>

<style>
.bless-rangechart__bar {
  fill: var(--_c);
}
.bless-rangechart__row:hover .bless-rangechart__bar {
  opacity: 0.75;
}
.bless-rangechart__mark {
  stroke: var(--bless-color-text);
  stroke-width: 3;
}
</style>
