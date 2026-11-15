<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessCandlestick" });
const pack = useLabelPack("BlessCandlestick");

export interface BlessCandle {
  /** the day or period, as text on the axis */
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const props = withDefaults(
  defineProps<{
    data: BlessCandle[];
    height?: number;
    /** the color of a period that closes at or above its open; drawn hollow */
    up?: string;
    /** the color of a period that closes below its open; drawn filled */
    down?: string;
    /** text for one value, for example `(v) => "$" + v` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{
      period: string;
      open: string;
      high: string;
      low: string;
      close: string;
    }>;
  }>(),
  { height: 260, up: "success", down: "danger", label: "Chart" },
);

const text = computed(() => ({
  period: "Period",
  open: "Open",
  high: "High",
  low: "Low",
  close: "Close",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const yt = computed(() => {
  const d = props.data;
  return d.length
    ? niceTicks(Math.min(...d.map((c) => c.low)), Math.max(...d.map((c) => c.high)), 4)
    : [0, 1];
});
const PAD = 8;
const BOTTOM = 22;
const frame = computed(() => ({
  x0: 8 + 6 * Math.max(...yt.value.map((t) => fmt.value(t).length)),
  x1: width.value - PAD,
  y0: PAD,
  y1: props.height - BOTTOM,
}));
const py = computed(() =>
  scale([yt.value[0]!, yt.value.at(-1)!], [frame.value.y1, frame.value.y0]),
);
const step = computed(() => (frame.value.x1 - frame.value.x0) / Math.max(1, props.data.length));
const cx = (i: number) => frame.value.x0 + (i + 0.5) * step.value;
// one axis label for about every 56 pixels, so the text does not overlap
const every = computed(() => Math.max(1, Math.ceil(56 / step.value)));
const candles = computed(() =>
  props.data.map((c, i) => {
    const rising = c.close >= c.open;
    const top = py.value(Math.max(c.open, c.close));
    return {
      ...c,
      i,
      rising,
      x: cx(i),
      top,
      h: Math.max(1, py.value(Math.min(c.open, c.close)) - top),
      color: chartColor(rising ? props.up : props.down, 0),
    };
  }),
);
const bodyW = computed(() => Math.max(1, Math.min(18, step.value * 0.6)));
</script>

<template>
  <figure ref="box" class="bless-plot bless-candles">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in yt" :key="t">
        <line class="bless-plot__grid" :x1="frame.x0" :x2="frame.x1" :y1="py(t)" :y2="py(t)" />
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
      <template v-for="c in candles" :key="c.i">
        <text
          v-if="c.i % every === 0"
          class="bless-plot__tick"
          :x="c.x"
          :y="frame.y1 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ c.label }}
        </text>
        <g
          class="bless-candles__candle"
          :class="{ 'is-up': c.rising }"
          :style="{ '--_c': c.color }"
        >
          <title>
            {{ c.label }}: {{ text.open }} {{ fmt(c.open) }}, {{ text.high }} {{ fmt(c.high) }},
            {{ text.low }} {{ fmt(c.low) }}, {{ text.close }} {{ fmt(c.close) }}
          </title>
          <line :x1="c.x" :x2="c.x" :y1="py(c.high)" :y2="py(c.low)" />
          <rect :x="c.x - bodyW / 2" :y="c.top" :width="bodyW" :height="c.h" />
        </g>
      </template>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.period }}</th>
            <th scope="col">{{ text.open }}</th>
            <th scope="col">{{ text.high }}</th>
            <th scope="col">{{ text.low }}</th>
            <th scope="col">{{ text.close }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in data" :key="c.label">
            <th scope="row">{{ c.label }}</th>
            <td>{{ fmt(c.open) }}</td>
            <td>{{ fmt(c.high) }}</td>
            <td>{{ fmt(c.low) }}</td>
            <td>{{ fmt(c.close) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-candles__candle line {
  stroke: var(--_c);
  stroke-width: 1.5;
}
/* a fall is filled; a rise is hollow, so the shape says it and not only the color */
.bless-candles__candle rect {
  fill: var(--_c);
  stroke: var(--_c);
  stroke-width: 1.5;
}
.bless-candles__candle.is-up rect {
  fill: var(--bless-color-bg);
}
</style>
