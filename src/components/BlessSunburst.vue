<template>
  <figure class="bless-sunburst" :style="{ inlineSize: `${size}px` }">
    <svg viewBox="0 0 200 200" class="bless-sunburst__svg" aria-hidden="true">
      <path
        v-for="s in segs"
        :key="s.key"
        class="bless-sunburst__seg"
        :d="s.d"
        :style="{ '--_c': s.color, '--_k': `${100 - s.depth * 28}%` }"
      >
        <title>{{ s.path }}: {{ fmt(s.value) }} ({{ pct.format(s.value / (total || 1)) }})</title>
      </path>
    </svg>
    <div class="bless-sunburst__center" aria-hidden="true">
      <strong>{{ fmt(total) }}</strong>
      <span>{{ text.total }}</span>
    </div>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.part }}</th>
            <th scope="col">{{ text.value }}</th>
            <th scope="col">{{ text.share }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in segs" :key="s.key">
            <th scope="row">{{ s.path }}</th>
            <td>{{ fmt(s.value) }}</td>
            <td>{{ pct.format(s.value / (total || 1)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { totalOf, type TreemapNode } from "../composables/treemap";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessSunburst" });
const pack = useLabelPack("BlessSunburst");

const props = withDefaults(
  defineProps<{
    /** the same nodes as the treemap: a leaf has a `value`, a parent is the sum of its children */
    data: TreemapNode[];
    /** the width of the circle in pixels */
    size?: number;
    /** text for one value, for example `(v) => "$" + v` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ part: string; value: string; share: string; total: string }>;
  }>(),
  { size: 280, label: "Chart" },
);

const text = computed(() => ({
  part: "Part",
  value: "Value",
  share: "Share",
  total: "Total",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const pct = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

const total = computed(() => props.data.reduce((n, d) => n + totalOf(d), 0));
const depthOf = (ns: TreemapNode[] | undefined): number =>
  ns?.length ? 1 + Math.max(...ns.map((n) => depthOf(n.children))) : 0;
const HOLE = 34;
const OUTER = 98;
const ring = computed(() => (OUTER - HOLE) / Math.max(1, depthOf(props.data)));

// a point on a circle, with angle 0 at the top and going clockwise
const at = (a: number, r: number) =>
  `${(100 + r * Math.sin(a)).toFixed(2)} ${(100 - r * Math.cos(a)).toFixed(2)}`;
function arc(a0: number, a1: number, r0: number, r1: number): string {
  // a full ring cannot be one arc: stop just short of it
  const a = Math.min(a1, a0 + Math.PI * 2 - 1e-4);
  const big = a - a0 > Math.PI ? 1 : 0;
  return `M${at(a0, r1)}A${r1} ${r1} 0 ${big} 1 ${at(a, r1)}L${at(a, r0)}A${r0} ${r0} 0 ${big} 0 ${at(a0, r0)}Z`;
}

interface Seg {
  key: string;
  path: string;
  name: string;
  value: number;
  d: string;
  color: string;
  depth: number;
}
const segs = computed(() => {
  const out: Seg[] = [];
  const t = total.value || 1;
  const walk = (
    ns: TreemapNode[],
    a0: number,
    depth: number,
    color: string | null,
    path: string[],
  ) => {
    let a = a0;
    ns.forEach((n, i) => {
      const v = totalOf(n);
      const span = (v / t) * Math.PI * 2;
      const c = color && !n.color ? color : chartColor(n.color, i);
      const names = [...path, n.label];
      if (v > 0) {
        const r0 = HOLE + depth * ring.value;
        out.push({
          key: n.id,
          path: names.join(" › "),
          name: n.label,
          value: v,
          d: arc(a, a + span, r0, r0 + ring.value),
          color: c,
          depth,
        });
        if (n.children?.length) walk(n.children, a, depth + 1, c, names);
      }
      a += span;
    });
  };
  walk(props.data, 0, 0, null, []);
  return out;
});
</script>

<style>
.bless-sunburst {
  position: relative;
  max-inline-size: 100%;
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-sunburst__svg {
  display: block;
  inline-size: 100%;
}
/* the deeper the ring, the lighter the shade of its parent's color */
.bless-sunburst__seg {
  fill: color-mix(in srgb, var(--_c) var(--_k), var(--bless-color-bg));
  stroke: var(--bless-color-bg);
  stroke-width: 0.75;
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-sunburst__seg:hover {
  opacity: 0.75;
}
.bless-sunburst__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-sunburst__center strong {
  font-size: var(--bless-text-lg);
  color: var(--bless-color-text);
  font-variant-numeric: tabular-nums;
}
@media (prefers-reduced-motion: reduce) {
  .bless-sunburst__seg {
    transition: none;
  }
}
/* the chart opens out from its middle */
.bless-sunburst__svg {
  --_gx: calc(0.6 + 0.4 * var(--bless-grow));
  --_gy: var(--_gx);
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
