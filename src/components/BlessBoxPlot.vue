<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { boxStats, chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessBoxPlot" });
const pack = useLabelPack("BlessBoxPlot");

export interface BlessBoxGroup {
  label: string;
  /** the raw values; the chart computes the quartiles */
  values: number[];
  color?: string;
}

const props = withDefaults(
  defineProps<{
    groups: BlessBoxGroup[];
    height?: number;
    /** text for one value, for example `(v) => v + " ms"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{
      group: string;
      min: string;
      q1: string;
      median: string;
      q3: string;
      max: string;
      outliers: string;
    }>;
  }>(),
  { height: 280, label: "Chart" },
);

const text = computed(() => ({
  group: "Group",
  min: "Low",
  q1: "Lower quartile",
  median: "Median",
  q3: "Upper quartile",
  max: "High",
  outliers: "Outliers",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const stats = computed(() => props.groups.map((g) => boxStats(g.values)));
const ticks = computed(() => {
  const all = stats.value.flatMap((s) => (s ? [s.min, s.max, ...s.outliers] : []));
  return all.length ? niceTicks(Math.min(...all), Math.max(...all)) : [0, 1];
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
const slot = computed(() => (frame.value.x1 - frame.value.x0) / Math.max(1, props.groups.length));

const boxes = computed(() =>
  props.groups.map((g, i) => {
    const s = stats.value[i];
    const mid = frame.value.x0 + (i + 0.5) * slot.value;
    const half = Math.min(36, slot.value * 0.3);
    return {
      key: i,
      label: g.label,
      mid,
      half,
      color: chartColor(g.color, i),
      s: s && {
        ...s,
        y: {
          min: py.value(s.min),
          q1: py.value(s.q1),
          median: py.value(s.median),
          q3: py.value(s.q3),
          max: py.value(s.max),
        },
        out: s.outliers.map((v) => ({ v, y: py.value(v) })),
        title: `${g.label}: ${text.value.median} ${fmt.value(s.median)}, ${text.value.q1} ${fmt.value(s.q1)}, ${text.value.q3} ${fmt.value(s.q3)}, ${text.value.min} ${fmt.value(s.min)}, ${text.value.max} ${fmt.value(s.max)}`,
      },
    };
  }),
);
</script>

<template>
  <figure ref="box" class="bless-plot bless-boxplot">
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
      <g v-for="b in boxes" :key="b.key" :style="{ '--_c': b.color }">
        <text
          class="bless-plot__cat"
          :x="b.mid"
          :y="frame.y1 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ b.label }}
        </text>
        <g v-if="b.s" class="bless-boxplot__group">
          <title>{{ b.s.title }}</title>
          <line
            class="bless-boxplot__whisker"
            :x1="b.mid"
            :x2="b.mid"
            :y1="b.s.y.max"
            :y2="b.s.y.q3"
          />
          <line
            class="bless-boxplot__whisker"
            :x1="b.mid"
            :x2="b.mid"
            :y1="b.s.y.q1"
            :y2="b.s.y.min"
          />
          <line
            class="bless-boxplot__whisker"
            :x1="b.mid - b.half / 2"
            :x2="b.mid + b.half / 2"
            :y1="b.s.y.max"
            :y2="b.s.y.max"
          />
          <line
            class="bless-boxplot__whisker"
            :x1="b.mid - b.half / 2"
            :x2="b.mid + b.half / 2"
            :y1="b.s.y.min"
            :y2="b.s.y.min"
          />
          <rect
            class="bless-boxplot__box"
            :x="b.mid - b.half"
            :y="b.s.y.q3"
            :width="b.half * 2"
            :height="Math.max(1, b.s.y.q1 - b.s.y.q3)"
          />
          <line
            class="bless-boxplot__median"
            :x1="b.mid - b.half"
            :x2="b.mid + b.half"
            :y1="b.s.y.median"
            :y2="b.s.y.median"
          />
          <circle
            v-for="(o, k) in b.s.out"
            :key="k"
            class="bless-boxplot__out"
            :cx="b.mid"
            :cy="o.y"
            r="3"
          />
        </g>
      </g>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.group }}</th>
            <th scope="col">{{ text.min }}</th>
            <th scope="col">{{ text.q1 }}</th>
            <th scope="col">{{ text.median }}</th>
            <th scope="col">{{ text.q3 }}</th>
            <th scope="col">{{ text.max }}</th>
            <th scope="col">{{ text.outliers }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in boxes" :key="b.key">
            <th scope="row">{{ b.label }}</th>
            <template v-if="b.s">
              <td>{{ fmt(b.s.min) }}</td>
              <td>{{ fmt(b.s.q1) }}</td>
              <td>{{ fmt(b.s.median) }}</td>
              <td>{{ fmt(b.s.q3) }}</td>
              <td>{{ fmt(b.s.max) }}</td>
              <td>{{ b.s.outliers.map(fmt).join(", ") || "–" }}</td>
            </template>
            <td v-else colspan="6">–</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-boxplot__box {
  fill: color-mix(in srgb, var(--_c) 25%, var(--bless-color-bg));
  stroke: var(--_c);
  stroke-width: 1.5;
}
.bless-boxplot__whisker {
  stroke: var(--_c);
  stroke-width: 1.5;
}
.bless-boxplot__median {
  stroke: var(--bless-color-text);
  stroke-width: 2.5;
}
.bless-boxplot__out {
  fill: var(--bless-color-bg);
  stroke: var(--_c);
  stroke-width: 1.5;
}
.bless-boxplot__group:hover .bless-boxplot__box {
  fill: color-mix(in srgb, var(--_c) 40%, var(--bless-color-bg));
}
</style>
