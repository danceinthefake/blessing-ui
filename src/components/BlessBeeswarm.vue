<template>
  <figure ref="box" class="bless-plot bless-swarm">
    <ul v-if="groups.length" class="bless-swarm__legend" aria-hidden="true">
      <li v-for="(g, i) in groups" :key="g.key">
        <i :style="{ background: chartColor(g.color, i) }" />{{ g.label }}
      </li>
    </ul>
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in xt" :key="t">
        <line class="bless-plot__grid" :x1="px(t)" :x2="px(t)" y1="0" :y2="height - BOTTOM" />
        <text class="bless-plot__tick" :x="px(t)" :y="height - 6" text-anchor="middle">
          {{ fmt(t) }}
        </text>
      </g>
      <circle
        v-for="(d, i) in dots"
        :key="i"
        class="bless-swarm__dot"
        :cx="d.x"
        :cy="d.y"
        :r="radius"
        :style="{ '--_c': d.color }"
      >
        <title>{{ d.label ? `${d.label}: ` : "" }}{{ fmt(d.value) }}</title>
      </circle>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.group }}</th>
            <th scope="col">{{ text.count }}</th>
            <th scope="col">{{ text.min }}</th>
            <th scope="col">{{ text.median }}</th>
            <th scope="col">{{ text.max }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in summary" :key="s.name">
            <th scope="row">{{ s.name }}</th>
            <td>{{ s.n }}</td>
            <td>{{ show(s.min) }}</td>
            <td>{{ show(s.med) }}</td>
            <td>{{ show(s.max) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script lang="ts">
export interface BlessSwarmPoint {
  value: number;
  /** shown on hover */
  label?: string;
  /** the key of its group, for the color */
  group?: string;
}

/**
 * Moves dots up and down from a center line, so that dots of radius `r` at the given x do not overlap.
 * A greedy swarm, as in the beeswarm package for R by Aron Eklund: in order of x, each dot takes the
 * free place nearest to the line. Returns the y offset of each dot, in the input order.
 */
export function swarm(xs: number[], r: number): number[] {
  const order = xs.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]);
  const placed: { x: number; y: number }[] = [];
  const out: number[] = new Array(xs.length).fill(0);
  const d = 2 * r;
  for (const [x, i] of order) {
    const near = placed.filter((p) => x - p.x < d);
    let y = 0;
    for (let k = 0; ; k++) {
      // try 0, +d', -d', +2d', ... in small steps
      const cand = (k % 2 ? -1 : 1) * Math.ceil(k / 2) * r * 0.5;
      if (near.every((p) => (p.x - x) ** 2 + (p.y - cand) ** 2 >= d * d - 1e-6)) {
        y = cand;
        break;
      }
    }
    placed.push({ x, y });
    out[i] = y;
  }
  return out;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, quantile, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessBeeswarm" });
const pack = useLabelPack("BlessBeeswarm");

const props = withDefaults(
  defineProps<{
    data: (BlessSwarmPoint | number)[];
    /** the names and colors of the groups */
    groups?: { key: string; label: string; color?: string }[];
    /** the radius of a dot in pixels */
    radius?: number;
    height?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{
      group: string;
      count: string;
      min: string;
      median: string;
      max: string;
      all: string;
    }>;
  }>(),
  { groups: () => [], radius: 5, height: 200, label: "Chart" },
);

const text = computed(() => ({
  group: "Group",
  count: "Count",
  min: "Lowest",
  median: "Median",
  max: "Highest",
  all: "All",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const points = computed(() =>
  props.data
    .map((d) => (typeof d === "number" ? { value: d } : d))
    .filter((p) => Number.isFinite(p.value)),
);
const xt = computed(() => {
  const vs = points.value.map((p) => p.value);
  return vs.length ? niceTicks(Math.min(...vs), Math.max(...vs), 6) : [0, 1];
});
const BOTTOM = 22;
const px = computed(() => scale([xt.value[0]!, xt.value.at(-1)!], [12, width.value - 12]));
const mid = computed(() => (props.height - BOTTOM) / 2);
const dots = computed(() => {
  const xs = points.value.map((p) => px.value(p.value));
  const ys = swarm(xs, props.radius);
  return points.value.map((p, i) => {
    const g = props.groups.findIndex((x) => x.key === p.group);
    return {
      ...p,
      x: xs[i]!,
      y: mid.value + ys[i]!,
      color: chartColor(g < 0 ? undefined : props.groups[g]!.color, Math.max(0, g)),
    };
  });
});
const summary = computed(() => {
  const sets = props.groups.length
    ? props.groups.map((g) => ({
        name: g.label,
        vs: points.value.filter((p) => p.group === g.key).map((p) => p.value),
      }))
    : [{ name: text.value.all, vs: points.value.map((p) => p.value) }];
  return sets.map((s) => {
    const v = [...s.vs].sort((a, b) => a - b);
    return {
      name: s.name,
      n: v.length,
      min: v[0],
      med: v.length ? quantile(v, 0.5) : undefined,
      max: v.at(-1),
    };
  });
});
const show = (v: number | undefined) => (v === undefined ? "–" : fmt.value(v));
</script>

<style>
.bless-swarm__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: 0 0 var(--bless-space-2);
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-swarm__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-swarm__legend i {
  inline-size: 10px;
  block-size: 10px;
  border-radius: 50%;
}
.bless-swarm__dot {
  fill: var(--_c);
  stroke: var(--bless-color-bg);
  stroke-width: 1;
}
.bless-swarm__dot:hover {
  stroke: var(--bless-color-text);
  stroke-width: 2;
}
</style>
