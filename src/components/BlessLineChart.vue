<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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

defineOptions({ name: "BlessLineChart" });

const props = withDefaults(
  defineProps<{
    /** one row for each point on the x axis */
    data: BlessChartRow[];
    /** the field of a row with its x value: a number, a `Date`, or a date text */
    x: string;
    /** one line for each series */
    series: BlessChartSeries[];
    /** fill the area under each line */
    area?: boolean;
    height?: number;
    /** text for one value, for example `(v) => v + " ms"` */
    format?: (v: number) => string;
    /** text for one x value; default: the number, or a short date in the local format */
    formatX?: (x: number | Date) => string;
    /** the name of the x column in the table for screen readers; default: `x` */
    xLabel?: string;
    /** names the chart and its table for screen readers */
    label?: string;
  }>(),
  { height: 280, label: "Chart" },
);

const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);
// dates are written after mount, so the server and the browser agree on the time zone
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const isTime = computed(() => props.data.some((r) => typeof r[props.x] !== "number"));
const xOf = (r: BlessChartRow) => {
  const v = r[props.x];
  return isTime.value ? new Date(v as string | number | Date).getTime() : Number(v);
};
const rows = computed(() =>
  props.data.filter((r) => Number.isFinite(xOf(r))).sort((a, b) => xOf(a) - xOf(b)),
);
const xText = (v: number) => {
  if (props.formatX) return props.formatX(isTime.value ? new Date(v) : v);
  if (!isTime.value) return numberText(v);
  return mounted.value
    ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(v)
    : "";
};
const yOf = (r: BlessChartRow, key: string) => {
  const v = r[key];
  return v == null || v === "" || !Number.isFinite(Number(v)) ? undefined : Number(v);
};

const ticks = computed(() => {
  const all = rows.value.flatMap((r) => props.series.map((s) => yOf(r, s.key) ?? NaN));
  const vals = all.filter(Number.isFinite);
  return vals.length ? niceTicks(Math.min(...vals), Math.max(...vals)) : [0, 1];
});

const PAD = 8;
const BOTTOM = 22;
const frame = computed(() => ({
  x0: 8 + 6 * Math.max(...ticks.value.map((t) => fmt.value(t).length)),
  x1: width.value - PAD,
  y0: PAD,
  y1: props.height - BOTTOM,
}));
const xs = computed(() => rows.value.map(xOf));
const px = computed(() => {
  const v = xs.value;
  return scale([v[0] ?? 0, v.at(-1) ?? 1], [frame.value.x0, frame.value.x1]);
});
const py = computed(() =>
  scale([ticks.value[0]!, ticks.value.at(-1)!], [frame.value.y1, frame.value.y0]),
);

// x ticks: round numbers on a number axis, or about one data point in each 90px on a date axis
const xTicks = computed(() => {
  if (!xs.value.length) return [];
  if (!isTime.value)
    return niceTicks(xs.value[0]!, xs.value.at(-1)!).filter(
      (t) => t >= xs.value[0]! && t <= xs.value.at(-1)!,
    );
  const every = Math.max(
    1,
    Math.ceil(xs.value.length / Math.max(2, (frame.value.x1 - frame.value.x0) / 90)),
  );
  return xs.value.filter((_, i) => i % every === 0);
});

// a gap in the data breaks the line, and the area under it
const lines = computed(() =>
  props.series.map((s, j) => {
    const segs: { x: number; y: number }[][] = [];
    let cur: { x: number; y: number }[] = [];
    rows.value.forEach((r, i) => {
      const v = yOf(r, s.key);
      if (v === undefined) {
        if (cur.length) segs.push(cur);
        cur = [];
      } else cur.push({ x: px.value(xs.value[i]!), y: py.value(v) });
    });
    if (cur.length) segs.push(cur);
    const base = py.value(Math.min(Math.max(0, ticks.value[0]!), ticks.value.at(-1)!));
    const path = (p: { x: number; y: number }[]) =>
      p.map((q, k) => `${k ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("");
    return {
      key: s.key,
      color: chartColor(s.color, j),
      line: segs.map(path).join(""),
      area: segs
        .filter((p) => p.length > 1)
        .map((p) => `${path(p)}L${p.at(-1)!.x.toFixed(1)} ${base}L${p[0]!.x.toFixed(1)} ${base}Z`)
        .join(""),
      // a lone point between gaps has no line, so it gets a dot
      dots: segs.filter((p) => p.length === 1).map((p) => p[0]!),
    };
  }),
);

// the crosshair: the nearest data point to the pointer
const hover = ref<number>();
function onMove(e: PointerEvent) {
  const svg = e.currentTarget as SVGSVGElement;
  const r = svg.getBoundingClientRect();
  if (!r.width || !xs.value.length) return;
  const at = ((e.clientX - r.left) / r.width) * width.value;
  let best = 0;
  xs.value.forEach((v, i) => {
    if (Math.abs(px.value(v) - at) < Math.abs(px.value(xs.value[best]!) - at)) best = i;
  });
  hover.value = best;
}
const tip = computed(() => {
  const i = hover.value;
  if (i === undefined || !rows.value[i]) return undefined;
  const x = px.value(xs.value[i]!);
  return {
    x,
    // the box goes to the other side of the line past the middle, so it stays inside
    end: x > width.value / 2,
    title: xText(xs.value[i]!),
    items: props.series.map((s, j) => ({
      key: s.key,
      label: s.label ?? s.key,
      color: chartColor(s.color, j),
      value: yOf(rows.value[i]!, s.key),
    })),
  };
});
</script>

<template>
  <figure ref="box" class="bless-plot bless-linechart">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :height
      class="bless-plot__svg"
      aria-hidden="true"
      @pointermove="onMove"
      @pointerleave="hover = undefined"
    >
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
      <text
        v-for="t in xTicks"
        :key="t"
        class="bless-plot__tick"
        :x="px(t)"
        :y="frame.y1 + 14"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ xText(t) }}
      </text>
      <g v-for="l in lines" :key="l.key" :style="{ '--_c': l.color }">
        <path v-if="area" class="bless-linechart__area" :d="l.area" />
        <path class="bless-linechart__line" :d="l.line" pathLength="1" />
        <circle
          v-for="(d, k) in l.dots"
          :key="k"
          class="bless-linechart__dot"
          :cx="d.x"
          :cy="d.y"
          r="3"
        />
      </g>
      <g v-if="tip">
        <line
          class="bless-linechart__cross"
          :x1="tip.x"
          :x2="tip.x"
          :y1="frame.y0"
          :y2="frame.y1"
        />
        <template v-for="it in tip.items" :key="it.key">
          <circle
            v-if="it.value !== undefined"
            class="bless-linechart__dot"
            :style="{ '--_c': it.color }"
            :cx="tip.x"
            :cy="py(it.value)"
            r="4"
          />
        </template>
      </g>
    </svg>
    <div
      v-if="tip"
      class="bless-linechart__tip"
      :class="{ 'bless-linechart__tip--end': tip.end }"
      :style="{ left: `${(tip.x / width) * 100}%` }"
      aria-hidden="true"
    >
      <strong>{{ tip.title }}</strong>
      <span
        v-for="it in tip.items"
        :key="it.key"
        class="bless-linechart__row"
        :style="{ '--_c': it.color }"
      >
        {{ it.label }} <b>{{ it.value === undefined ? "–" : fmt(it.value) }}</b>
      </span>
    </div>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ xLabel ?? x }}</th>
            <th v-for="s in series" :key="s.key" scope="col">{{ s.label ?? s.key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <th scope="row">{{ xText(xs[i]!) }}</th>
            <td v-for="s in series" :key="s.key">
              {{ yOf(r, s.key) === undefined ? "–" : fmt(yOf(r, s.key)!) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-linechart__line {
  fill: none;
  stroke: var(--_c);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 1;
  animation: bless-draw var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
.bless-linechart__area {
  fill: color-mix(in srgb, var(--_c) 18%, transparent);
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
/* the dots land after the line passes */
.bless-linechart__dot {
  fill: var(--_c);
  transform-box: fill-box;
  transform-origin: 50% 50%;
  --_gx: var(--bless-grow);
  animation: bless-grow var(--bless-duration-enter) var(--bless-ease-pop) var(--bless-duration-draw)
    backwards;
  stroke: var(--bless-color-bg);
  stroke-width: 2;
}
.bless-linechart__cross {
  stroke: var(--bless-color-text-muted);
  stroke-dasharray: 3 3;
}
.bless-linechart__tip {
  position: absolute;
  top: var(--bless-space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  /* the chart is drawn left to right in each direction, so the box moves in pixels, not by the edge */
  translate: var(--bless-space-3) 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 1px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  white-space: nowrap;
  pointer-events: none;
}
.bless-linechart__tip--end {
  translate: calc(-100% - var(--bless-space-3)) 0;
}
.bless-linechart__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-linechart__row::before {
  content: "";
  inline-size: 8px;
  block-size: 8px;
  background: var(--_c);
}
.bless-linechart__row b {
  margin-inline-start: auto;
  font-variant-numeric: tabular-nums;
}
</style>
