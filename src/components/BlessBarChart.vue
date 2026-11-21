<template>
  <figure ref="box" class="bless-plot bless-barchart" :class="{ 'bless-plot--h': horizontal }">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in ticks" :key="t">
        <line
          v-if="horizontal"
          class="bless-plot__grid"
          :class="{ 'bless-plot__zero': t === 0 }"
          :x1="valueAt(t)"
          :x2="valueAt(t)"
          :y1="frame.y0"
          :y2="frame.y1"
        />
        <line
          v-else
          class="bless-plot__grid"
          :class="{ 'bless-plot__zero': t === 0 }"
          :x1="frame.x0"
          :x2="frame.x1"
          :y1="valueAt(t)"
          :y2="valueAt(t)"
        />
        <text
          class="bless-plot__tick"
          :x="horizontal ? valueAt(t) : frame.x0 - 6"
          :y="horizontal ? frame.y1 + 14 : valueAt(t)"
          :text-anchor="horizontal ? 'middle' : 'end'"
          dominant-baseline="middle"
        >
          {{ fmt(t) }}
        </text>
      </g>
      <text
        v-for="(c, i) in cats"
        :key="i"
        class="bless-plot__cat"
        :x="horizontal ? frame.x0 - 6 : band.start + (i + 0.5) * band.size"
        :y="horizontal ? band.start + (i + 0.5) * band.size : frame.y1 + 14"
        :text-anchor="horizontal ? 'end' : 'middle'"
        dominant-baseline="middle"
      >
        {{ c }}
      </text>
      <rect
        v-for="(b, i) in bars"
        :key="b.key"
        class="bless-plot__mark"
        :x="b.x"
        :y="b.y"
        :width="b.width"
        :height="b.height"
        :style="{ '--_c': b.color, '--_i': i }"
      >
        <title>{{ b.title }}</title>
      </rect>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.category }}</th>
            <th v-for="s in series" :key="s.key" scope="col">{{ s.label ?? s.key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in data" :key="i">
            <th scope="row">{{ cats[i] }}</th>
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
  niceTicks,
  numberText,
  scale,
  useWidth,
  type BlessChartRow,
  type BlessChartSeries,
} from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessBarChart" });
const pack = useLabelPack("BlessBarChart");

const props = withDefaults(
  defineProps<{
    /** one row for each category */
    data: BlessChartRow[];
    /** the field of a row that names its category */
    x: string;
    /** one bar for each series in each category */
    series: BlessChartSeries[];
    /** bars that grow to the side, with the categories down the start edge */
    horizontal?: boolean;
    /** the series on top of each other, not side by side */
    stacked?: boolean;
    height?: number;
    /** text for one value, for example `(v) => v + " ms"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ category: string }>;
  }>(),
  { height: 280, label: "Chart" },
);

const text = computed(() => ({ category: "Category", ...pack(), ...props.labels }));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const num = (row: BlessChartRow, key: string) => {
  const v = Number(row[key]);
  return Number.isFinite(v) ? v : 0;
};
const cats = computed(() => props.data.map((r) => String(r[props.x] ?? "")));

// the value range: each bar from zero, or each stack of the positive and the negative parts
const ticks = computed(() => {
  let lo = 0;
  let hi = 0;
  for (const r of props.data) {
    if (props.stacked) {
      let up = 0;
      let down = 0;
      for (const s of props.series)
        num(r, s.key) > 0 ? (up += num(r, s.key)) : (down += num(r, s.key));
      [lo, hi] = [Math.min(lo, down), Math.max(hi, up)];
    } else
      for (const s of props.series)
        [lo, hi] = [Math.min(lo, num(r, s.key)), Math.max(hi, num(r, s.key))];
  }
  return niceTicks(lo, hi);
});

const PAD = 8;
// room for the text beside the axis, from the longest text at about 7px a letter
const startRoom = computed(() =>
  props.horizontal
    ? Math.min(width.value * 0.35, 8 + 7 * Math.max(1, ...cats.value.map((c) => c.length)))
    : 8 + 6 * Math.max(...ticks.value.map((t) => fmt.value(t).length)),
);
const BOTTOM = 22;
const frame = computed(() => ({
  x0: startRoom.value,
  x1: width.value - PAD,
  y0: PAD,
  y1: props.height - BOTTOM,
}));

// the value axis and the category axis, in pixels, for either direction
const valueAt = computed(() => {
  const f = frame.value;
  const t = ticks.value;
  return props.horizontal
    ? scale([t[0]!, t.at(-1)!], [f.x0, f.x1])
    : scale([t[0]!, t.at(-1)!], [f.y1, f.y0]);
});
const band = computed(() => {
  const f = frame.value;
  const length = props.horizontal ? f.y1 - f.y0 : f.x1 - f.x0;
  return { start: props.horizontal ? f.y0 : f.x0, size: length / Math.max(1, cats.value.length) };
});

const bars = computed(() => {
  const v = valueAt.value;
  const { start, size } = band.value;
  const group = size * 0.7;
  const thick = props.stacked ? group : group / Math.max(1, props.series.length);
  return props.data.flatMap((r, i) => {
    let up = 0;
    let down = 0;
    return props.series.map((s, j) => {
      const val = num(r, s.key);
      let from = 0;
      if (props.stacked) {
        from = val > 0 ? up : down;
        if (val > 0) up += val;
        else down += val;
      }
      const a = v(from);
      const b = v(from + val);
      const at = start + i * size + (size - group) / 2 + (props.stacked ? 0 : j * thick);
      const lo = Math.min(a, b);
      const len = Math.abs(b - a);
      const w = Math.max(1, thick - (props.stacked ? 0 : 1));
      return {
        key: `${i}-${s.key}`,
        color: chartColor(s.color, j),
        title: `${cats.value[i]}${props.series.length > 1 ? ` · ${s.label ?? s.key}` : ""}: ${fmt.value(val)}`,
        ...(props.horizontal
          ? { x: lo, y: at, width: len, height: w }
          : { x: at, y: lo, width: w, height: len }),
      };
    });
  });
});
</script>
