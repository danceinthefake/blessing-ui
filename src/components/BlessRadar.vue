<script setup lang="ts">
import { computed } from "vue";
import { polygon, radarMax, spoke } from "./radar";
import type { BlessRadarSeries } from "./radar";

defineOptions({ name: "BlessRadar" });

const props = withDefaults(
  defineProps<{
    /** the names around the edge. Three or more. */
    axes: string[];
    series: BlessRadarSeries[];
    /** the value at the edge. Default: the biggest value. */
    max?: number;
    /** rings between the center and the edge */
    rings?: number;
    /** width and height in px; the chart scales down with its container */
    size?: number;
    /** text for one value */
    format?: (v: number) => string;
    /** names the chart for screen readers */
    label?: string;
  }>(),
  { rings: 4, size: 320, label: "Radar chart" },
);

const palette = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
const colour = (s: BlessRadarSeries, i: number) => {
  const c = s.color ?? palette[i % palette.length];
  return /^[a-z0-9-]+$/i.test(c) ? `var(--bless-color-${c})` : c;
};
const PAD = 56; // room for the axis names
const c = computed(() => props.size / 2);
const r = computed(() => props.size / 2 - PAD);
const n = computed(() => props.axes.length);
const top = computed(() => radarMax(props.series, props.max));
const fmt = (v: number) => (props.format ?? String)(v);

const grid = computed(() =>
  Array.from({ length: props.rings }, (_, k) =>
    polygon(props.axes.map((_, i) => spoke(i, n.value, (k + 1) / props.rings, r.value, c.value))),
  ),
);
const spokes = computed(() => props.axes.map((_, i) => spoke(i, n.value, 1, r.value, c.value)));
const names = computed(() =>
  props.axes.map((name, i) => {
    const p = spoke(i, n.value, 1.12, r.value, c.value);
    const anchor = Math.abs(p.x - c.value) < 4 ? "middle" : p.x > c.value ? "start" : "end";
    return { name, x: p.x, y: p.y + 4, anchor };
  }),
);
const shapes = computed(() =>
  props.series.map((s, i) => {
    const pts = props.axes.map((_, k) => {
      const v = Math.min(top.value, Math.max(0, Number(s.values[k]) || 0));
      return spoke(k, n.value, v / top.value, r.value, c.value);
    });
    return { name: s.name, d: polygon(pts), color: colour(s, i), pts };
  }),
);
const summary = computed(
  () =>
    `${props.label}: ${props.series
      .map(
        (s) => `${s.name}: ${props.axes.map((a, i) => `${a} ${fmt(s.values[i] ?? 0)}`).join(", ")}`,
      )
      .join(". ")}`,
);
</script>

<template>
  <figure class="bless-radar">
    <svg
      role="img"
      :aria-label="summary"
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
    >
      <path v-for="(d, k) in grid" :key="k" class="bless-radar__ring" :d="d" />
      <line
        v-for="(p, i) in spokes"
        :key="i"
        class="bless-radar__spoke"
        :x1="c"
        :y1="c"
        :x2="p.x"
        :y2="p.y"
      />
      <g v-for="s in shapes" :key="s.name" :style="{ '--_c': s.color }">
        <path class="bless-radar__area" :d="s.d" />
        <circle
          v-for="(p, i) in s.pts"
          :key="i"
          class="bless-radar__dot"
          :cx="p.x"
          :cy="p.y"
          r="3"
        />
      </g>
      <text
        v-for="t in names"
        :key="t.name"
        class="bless-radar__name"
        :x="t.x"
        :y="t.y"
        :text-anchor="t.anchor"
      >
        {{ t.name }}
      </text>
    </svg>
    <figcaption v-if="series.length > 1" class="bless-radar__legend">
      <span v-for="s in shapes" :key="s.name" :style="{ '--_c': s.color }">
        <i class="bless-radar__swatch" aria-hidden="true" />{{ s.name }}
      </span>
    </figcaption>
  </figure>
</template>

<style>
.bless-radar {
  margin: 0;
  display: inline-grid;
  gap: var(--bless-space-3);
  max-inline-size: 100%;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-radar svg {
  max-inline-size: 100%;
  block-size: auto;
}
.bless-radar__ring,
.bless-radar__spoke {
  fill: none;
  stroke: var(--bless-color-border);
  stroke-width: 1;
}
.bless-radar__area {
  fill: color-mix(in srgb, var(--_c) 18%, transparent);
  stroke: var(--_c);
  stroke-width: 2;
  stroke-linejoin: miter; /* square corners, like everything else */
}
.bless-radar__dot {
  fill: var(--_c);
}
.bless-radar__name {
  fill: currentColor;
  font-size: var(--bless-text-sm);
  letter-spacing: var(--bless-tracking-normal);
}
.bless-radar__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-4);
  font-size: var(--bless-text-sm);
}
.bless-radar__swatch {
  display: inline-block;
  inline-size: 10px;
  block-size: 10px;
  margin-inline-end: var(--bless-space-2);
  background: var(--_c);
}
</style>
