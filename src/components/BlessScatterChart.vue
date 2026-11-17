<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessScatterChart" });
const pack = useLabelPack("BlessScatterChart");

export interface BlessScatterPoint {
  x: number;
  y: number;
  /** makes a bubble: the area of the dot grows with it */
  size?: number;
  /** the name of the point, in the hover and the table */
  label?: string;
  /** the id of the group in `groups`, for its color */
  group?: string;
}
export interface BlessScatterGroup {
  id: string;
  label?: string;
  color?: string;
}

const props = withDefaults(
  defineProps<{
    points: BlessScatterPoint[];
    /** the names and colors of the groups, in the order of the legend */
    groups?: BlessScatterGroup[];
    /** the name of each axis, under it and in the table */
    xLabel?: string;
    yLabel?: string;
    height?: number;
    /** text for a y value; `formatX` for an x value */
    format?: (v: number) => string;
    formatX?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ point: string; group: string; size: string }>;
  }>(),
  { groups: () => [], xLabel: "x", yLabel: "y", height: 280, label: "Chart" },
);

const text = computed(() => ({
  point: "Point",
  group: "Group",
  size: "Size",
  ...pack(),
  ...props.labels,
}));
const fy = computed(() => props.format ?? numberText);
const fx = computed(() => props.formatX ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const valid = computed(() =>
  props.points.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
);
const range = (vs: number[]) => (vs.length ? niceTicks(Math.min(...vs), Math.max(...vs)) : [0, 1]);
const xt = computed(() => range(valid.value.map((p) => p.x)));
const yt = computed(() => range(valid.value.map((p) => p.y)));

const PAD = 12;
const BOTTOM = 40;
const frame = computed(() => ({
  x0: 22 + 6 * Math.max(...yt.value.map((t) => fy.value(t).length)),
  x1: width.value - PAD,
  y0: PAD,
  y1: props.height - BOTTOM,
}));
const px = computed(() =>
  scale([xt.value[0]!, xt.value.at(-1)!], [frame.value.x0, frame.value.x1]),
);
const py = computed(() =>
  scale([yt.value[0]!, yt.value.at(-1)!], [frame.value.y1, frame.value.y0]),
);

const groupOf = (id?: string) => props.groups.findIndex((g) => g.id === id);
const hasSize = computed(() => valid.value.some((p) => p.size != null));
const maxSize = computed(() => Math.max(1e-9, ...valid.value.map((p) => Math.abs(p.size ?? 0))));
const hasLabel = computed(() => valid.value.some((p) => p.label));
const dots = computed(() =>
  valid.value
    .map((p, i) => {
      const g = groupOf(p.group);
      return {
        key: i,
        cx: px.value(p.x),
        cy: py.value(p.y),
        // the area, not the radius, grows with the size, so a bubble twice the size looks twice as big
        r: hasSize.value ? 3 + 15 * Math.sqrt(Math.abs(p.size ?? 0) / maxSize.value) : 4,
        color: chartColor(props.groups[g]?.color, Math.max(0, g)),
        title: `${p.label ? `${p.label}: ` : ""}${props.xLabel} ${fx.value(p.x)}, ${props.yLabel} ${fy.value(p.y)}${p.size != null ? `, ${text.value.size} ${fy.value(p.size)}` : ""}`,
      };
    })
    // big bubbles first, so a small one is never hidden under a big one
    .sort((a, b) => b.r - a.r),
);
</script>

<template>
  <figure ref="box" class="bless-plot bless-scatter">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in yt" :key="`y${t}`">
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
          {{ fy(t) }}
        </text>
      </g>
      <g v-for="t in xt" :key="`x${t}`">
        <line
          class="bless-plot__grid"
          :class="{ 'bless-plot__zero': t === 0 }"
          :x1="px(t)"
          :x2="px(t)"
          :y1="frame.y0"
          :y2="frame.y1"
        />
        <text
          class="bless-plot__tick"
          :x="px(t)"
          :y="frame.y1 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ fx(t) }}
        </text>
      </g>
      <text
        class="bless-plot__cat"
        :x="(frame.x0 + frame.x1) / 2"
        :y="height - 6"
        text-anchor="middle"
      >
        {{ xLabel }}
      </text>
      <text
        class="bless-plot__cat"
        :transform="`translate(10 ${(frame.y0 + frame.y1) / 2}) rotate(-90)`"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ yLabel }}
      </text>
      <circle
        v-for="(d, i) in dots"
        :key="d.key"
        class="bless-plot__mark bless-scatter__dot"
        :cx="d.cx"
        :cy="d.cy"
        :r="d.r"
        :style="{ '--_c': d.color, '--_i': i }"
      >
        <title>{{ d.title }}</title>
      </circle>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th v-if="hasLabel" scope="col">{{ text.point }}</th>
            <th v-if="groups.length" scope="col">{{ text.group }}</th>
            <th scope="col">{{ xLabel }}</th>
            <th scope="col">{{ yLabel }}</th>
            <th v-if="hasSize" scope="col">{{ text.size }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in valid" :key="i">
            <td v-if="hasLabel">{{ p.label }}</td>
            <td v-if="groups.length">{{ groups[groupOf(p.group)]?.label ?? p.group }}</td>
            <td>{{ fx(p.x) }}</td>
            <td>{{ fy(p.y) }}</td>
            <td v-if="hasSize">{{ p.size == null ? "–" : fy(p.size) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-scatter__dot {
  fill: color-mix(in srgb, var(--_c) 70%, transparent);
  stroke: var(--_c);
  stroke-width: 1;
}
</style>
