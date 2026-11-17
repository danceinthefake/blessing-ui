<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, histogramBins, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessHistogram" });
const pack = useLabelPack("BlessHistogram");

const props = withDefaults(
  defineProps<{
    /** the raw values; the chart counts them in bins */
    values: number[];
    /** about how many bins; the edges are round numbers */
    bins?: number;
    color?: string;
    height?: number;
    /** text for a bin edge, for example `(v) => v + " min"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ range: string; count: string }>;
  }>(),
  { bins: 10, color: "chart-1", height: 240, label: "Chart" },
);

const text = computed(() => ({ range: "Range", count: "Count", ...pack(), ...props.labels }));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const data = computed(() => histogramBins(props.values, props.bins));
const yt = computed(() => niceTicks(0, Math.max(1, ...data.value.map((b) => b.count)), 4));
const PAD = 8;
const BOTTOM = 22;
const frame = computed(() => ({
  x0: 8 + 6 * Math.max(...yt.value.map((t) => numberText(t).length)),
  x1: width.value - PAD,
  y0: PAD,
  y1: props.height - BOTTOM,
}));
const px = computed(() => {
  const d = data.value;
  return scale([d[0]?.from ?? 0, d.at(-1)?.to ?? 1], [frame.value.x0, frame.value.x1]);
});
const py = computed(() => scale([0, yt.value.at(-1)!], [frame.value.y1, frame.value.y0]));
const edges = computed(() =>
  data.value.length ? [data.value[0]!.from, ...data.value.map((b) => b.to)] : [],
);
const range = (b: { from: number; to: number }) => `${fmt.value(b.from)}–${fmt.value(b.to)}`;
</script>

<template>
  <figure ref="box" class="bless-plot bless-histogram" :style="{ '--_c': chartColor(color, 0) }">
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
          {{ t }}
        </text>
      </g>
      <text
        v-for="e in edges"
        :key="e"
        class="bless-plot__tick"
        :x="px(e)"
        :y="frame.y1 + 14"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ fmt(e) }}
      </text>
      <template v-for="(b, i) in data" :key="b.from">
        <rect
          v-if="b.count"
          class="bless-plot__mark"
          :style="{ '--_i': i }"
          :x="px(b.from) + 0.5"
          :y="py(b.count)"
          :width="Math.max(1, px(b.to) - px(b.from) - 1)"
          :height="py(0) - py(b.count)"
        >
          <title>{{ range(b) }}: {{ b.count }}</title>
        </rect>
      </template>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.range }}</th>
            <th scope="col">{{ text.count }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in data" :key="b.from">
            <th scope="row">{{ range(b) }}</th>
            <td>{{ b.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>
