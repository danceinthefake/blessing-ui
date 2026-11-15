<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessWaterfallChart" });
const pack = useLabelPack("BlessWaterfallChart");

export interface BlessWaterfallStep {
  label: string;
  /** the change in this step; leave it out on a total */
  value?: number;
  /** a bar from zero to the sum so far, such as the start or the end */
  total?: boolean;
}

const props = withDefaults(
  defineProps<{
    steps: BlessWaterfallStep[];
    height?: number;
    /** text for one value, for example `(v) => "$" + v` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ step: string; change: string; total: string }>;
  }>(),
  { height: 280, label: "Chart" },
);

const text = computed(() => ({
  step: "Step",
  change: "Change",
  total: "Total",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const signed = (v: number) => (v > 0 ? `+${fmt.value(v)}` : fmt.value(v));
const box = ref<HTMLElement>();
const width = useWidth(box);

// each step from the sum before it to the sum after it; a total from zero
const bars = computed(() => {
  let sum = 0;
  return props.steps.map((s) => {
    const v = Number.isFinite(s.value) ? s.value! : 0;
    const from = s.total ? 0 : sum;
    if (!s.total) sum += v;
    return {
      ...s,
      from,
      to: sum,
      change: s.total ? undefined : v,
      kind: s.total ? "total" : v < 0 ? "down" : "up",
    };
  });
});
const ticks = computed(() => {
  const all = bars.value.flatMap((b) => [b.from, b.to]);
  return niceTicks(Math.min(0, ...all), Math.max(0, ...all));
});

const PAD = 8;
const BOTTOM = 22;
const frame = computed(() => ({
  x0: 8 + 6 * Math.max(...ticks.value.map((t) => fmt.value(t).length)),
  x1: width.value - PAD,
  y0: PAD,
  y1: props.height - BOTTOM,
}));
const py = computed(() =>
  scale([ticks.value[0]!, ticks.value.at(-1)!], [frame.value.y1, frame.value.y0]),
);
const band = computed(() => (frame.value.x1 - frame.value.x0) / Math.max(1, props.steps.length));
const left = (i: number) => frame.value.x0 + i * band.value + band.value * 0.15;
const barW = computed(() => band.value * 0.7);
</script>

<template>
  <figure ref="box" class="bless-plot bless-waterfall">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in ticks" :key="t">
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
      <g v-for="(b, i) in bars" :key="i">
        <rect
          class="bless-plot__mark bless-waterfall__bar"
          :class="`bless-waterfall__bar--${b.kind}`"
          :x="left(i)"
          :y="Math.min(py(b.from), py(b.to))"
          :width="barW"
          :height="Math.max(1, Math.abs(py(b.to) - py(b.from)))"
        >
          <title>{{ b.label }}: {{ b.change === undefined ? fmt(b.to) : signed(b.change) }}</title>
        </rect>
        <!-- a line from the end of this bar to the start of the next one -->
        <line
          v-if="i < bars.length - 1"
          class="bless-waterfall__link"
          :x1="left(i) + barW"
          :x2="left(i + 1)"
          :y1="py(b.to)"
          :y2="py(b.to)"
        />
        <text
          class="bless-plot__cat"
          :x="left(i) + barW / 2"
          :y="frame.y1 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ b.label }}
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
            <th scope="col">{{ text.change }}</th>
            <th scope="col">{{ text.total }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, i) in bars" :key="i">
            <th scope="row">{{ b.label }}</th>
            <td>{{ b.change === undefined ? "–" : signed(b.change) }}</td>
            <td>{{ fmt(b.to) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-waterfall__bar--up {
  --_c: var(--bless-color-success);
}
.bless-waterfall__bar--down {
  --_c: var(--bless-color-danger);
}
.bless-waterfall__bar--total {
  --_c: var(--bless-color-chart-1);
}
.bless-waterfall__link {
  stroke: var(--bless-color-text-muted);
  stroke-dasharray: 2 2;
}
</style>
