<script lang="ts">
/**
 * The center line and the control limits of a Shewhart control chart: the mean, and the mean
 * ± 3 standard deviations of the sample. Points outside the limits are out of control.
 */
export function controlLimits(values: number[]) {
  const n = values.length;
  const mean = n ? values.reduce((a, b) => a + b, 0) / n : 0;
  const sd = n > 1 ? Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1)) : 0;
  return { mean, ucl: mean + 3 * sd, lcl: mean - 3 * sd };
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { niceTicks, scale, useWidth } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessControlChart" });
const pack = useLabelPack("BlessControlChart");

const props = withDefaults(
  defineProps<{
    /** the measures in time order */
    values: number[];
    /** a label for each point, for example the time or the sample number */
    points?: string[];
    /** fixed limits; without them, the chart works them out from the values */
    ucl?: number;
    lcl?: number;
    center?: number;
    unit?: string;
    height?: number;
    locale?: string;
    labels?: Partial<{
      title: string;
      center: string;
      ucl: string;
      lcl: string;
      inControl: string;
      out: (count: number) => string;
      point: string;
      value: string;
      state: string;
      ok: string;
      bad: string;
    }>;
  }>(),
  { height: 240, locale: "en" },
);

const text = computed(() => ({
  title: "Control chart",
  center: "Mean",
  ucl: "Upper limit",
  lcl: "Lower limit",
  inControl: "All points are within the control limits.",
  out: (n: number) => (n === 1 ? "1 point is out of control." : `${n} points are out of control.`),
  point: "Point",
  value: "Value",
  state: "State",
  ok: "in control",
  bad: "out of control",
  ...pack(),
  ...props.labels,
}));
const limits = computed(() => {
  const c = controlLimits(props.values);
  return { mean: props.center ?? c.mean, ucl: props.ucl ?? c.ucl, lcl: props.lcl ?? c.lcl };
});
const out = (v: number) => v > limits.value.ucl || v < limits.value.lcl;
const outCount = computed(() => props.values.filter(out).length);
const box = ref<HTMLElement>();
const width = useWidth(box);
const PAD = { l: 48, r: 72, t: 12, b: 24 };
const ticks = computed(() => {
  const all = [...props.values, limits.value.ucl, limits.value.lcl];
  return niceTicks(Math.min(...all), Math.max(...all));
});
const y = computed(() =>
  scale([ticks.value[0]!, ticks.value.at(-1)!], [props.height - PAD.b, PAD.t]),
);
const x = computed(() =>
  scale([0, Math.max(1, props.values.length - 1)], [PAD.l, width.value - PAD.r]),
);
const line = computed(() =>
  props.values.map((v, i) => `${i ? "L" : "M"}${x.value(i)},${y.value(v)}`).join(" "),
);
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 3 }));
const fmt = (v: number) => `${num.value.format(v)}${props.unit ? ` ${props.unit}` : ""}`;
const lines = computed(() => [
  { key: "ucl", v: limits.value.ucl, label: text.value.ucl },
  { key: "center", v: limits.value.mean, label: text.value.center },
  { key: "lcl", v: limits.value.lcl, label: text.value.lcl },
]);
</script>

<template>
  <figure class="bless-spc">
    <div ref="box" class="bless-spc__box">
      <svg :width="width" :height="height" aria-hidden="true">
        <g v-for="t in ticks" :key="t">
          <line :x1="PAD.l" :x2="width - PAD.r" :y1="y(t)" :y2="y(t)" class="bless-spc__grid" />
          <text :x="PAD.l - 6" :y="y(t)" class="bless-spc__tick">{{ num.format(t) }}</text>
        </g>
        <g v-for="l in lines" :key="l.key">
          <line
            :x1="PAD.l"
            :x2="width - PAD.r"
            :y1="y(l.v)"
            :y2="y(l.v)"
            class="bless-spc__limit"
            :class="`is-${l.key}`"
          />
          <text :x="width - PAD.r + 6" :y="y(l.v)" class="bless-spc__name">{{ l.label }}</text>
        </g>
        <path :d="line" class="bless-spc__path" pathLength="1" />
        <template v-for="(v, i) in values" :key="i">
          <rect
            v-if="out(v)"
            :x="x(i) - 5"
            :y="y(v) - 5"
            width="10"
            height="10"
            class="bless-spc__point is-out"
            :transform="`rotate(45 ${x(i)} ${y(v)})`"
          />
          <circle v-else :cx="x(i)" :cy="y(v)" r="3.5" class="bless-spc__point" />
        </template>
      </svg>
    </div>
    <figcaption class="bless-spc__caption" :class="{ 'is-bad': outCount }">
      <span
        ><span aria-hidden="true">{{ outCount ? "◆" : "✓" }}</span>
        {{ outCount ? text.out(outCount) : text.inControl }}</span
      >
      <span class="bless-spc__limits"
        >{{ text.center }} {{ fmt(limits.mean) }} · {{ text.ucl }} {{ fmt(limits.ucl) }} ·
        {{ text.lcl }} {{ fmt(limits.lcl) }}</span
      >
    </figcaption>
    <table class="bless-sr">
      <caption>
        {{ text.title }}
      </caption>
      <thead>
        <tr>
          <th scope="col">{{ text.point }}</th>
          <th scope="col">{{ text.value }}</th>
          <th scope="col">{{ text.state }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(v, i) in values" :key="i">
          <th scope="row">{{ points?.[i] ?? i + 1 }}</th>
          <td>{{ fmt(v) }}</td>
          <td>{{ out(v) ? text.bad : text.ok }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>

<style>
.bless-spc {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-spc__box svg {
  display: block;
}
.bless-spc__grid {
  stroke: var(--bless-color-border);
  stroke-opacity: 0.5;
}
.bless-spc__tick,
.bless-spc__name {
  fill: var(--bless-color-text);
  font-size: 11px;
  dominant-baseline: middle;
  font-variant-numeric: tabular-nums;
}
.bless-spc__tick {
  text-anchor: end;
}
/* the limits are dashed and the mean is solid, so the lines differ by more than color */
.bless-spc__limit {
  stroke: var(--bless-color-danger);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}
.bless-spc__limit.is-center {
  stroke: var(--bless-color-text);
  stroke-dasharray: none;
}
.bless-spc__path {
  fill: none;
  stroke: var(--bless-color-chart-1);
  stroke-width: 2;
}
.bless-spc__point {
  fill: var(--bless-color-bg);
  stroke: var(--bless-color-chart-1);
  stroke-width: 2;
}
.bless-spc__point.is-out {
  fill: var(--bless-color-danger);
  stroke: var(--bless-color-danger);
}
.bless-spc__caption {
  display: grid;
  gap: 2px;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
}
.bless-spc__caption.is-bad {
  color: var(--bless-color-danger-text);
}
.bless-spc__limits {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-normal);
  color: var(--bless-color-text);
  font-variant-numeric: tabular-nums;
}
.bless-spc__path {
  stroke-dasharray: 1;
  animation: bless-draw var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
