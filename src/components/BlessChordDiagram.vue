<script lang="ts">
export interface BlessChordGroup {
  key: string;
  label: string;
  color?: string;
}
type Span = { a0: number; a1: number };
/**
 * The chord layout, after d3-chord by Mike Bostock: each group gets an arc for the sum of its row,
 * and the arc splits into a chunk for each flow out of it, in the order of the groups.
 */
export function chordLayout(matrix: number[][], pad = 0.04) {
  const n = matrix.length;
  const rows = matrix.map((r) => r.reduce((a, b) => a + Math.max(0, b), 0));
  const total = rows.reduce((a, b) => a + b, 0) || 1;
  const k = (Math.PI * 2 - pad * n) / total;
  let at = 0;
  const groups: Span[] = [];
  const chunks: Span[][] = [];
  for (let i = 0; i < n; i++) {
    const start = at;
    chunks.push(
      matrix[i]!.map((v) => {
        const s = { a0: at, a1: at + Math.max(0, v) * k };
        at = s.a1;
        return s;
      }),
    );
    groups.push({ a0: start, a1: at });
    at += pad;
  }
  return { groups, chunks };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessChordDiagram" });
const pack = useLabelPack("BlessChordDiagram");

const props = withDefaults(
  defineProps<{
    groups: BlessChordGroup[];
    /** `matrix[i][j]` is the flow from group i to group j */
    matrix: number[][];
    /** the width of the chart in pixels */
    size?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ from: string; to: (name: string) => string }>;
  }>(),
  { size: 320, label: "Chart" },
);

const text = computed(() => ({
  from: "From",
  to: (n: string) => `To ${n}`,
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const C = 160;
const R = 120;
const W = 12;
const pt = (a: number, r: number) =>
  `${(C + r * Math.sin(a)).toFixed(1)},${(C - r * Math.cos(a)).toFixed(1)}`;
const layout = computed(() => chordLayout(props.matrix));
const colors = computed(() => props.groups.map((g, i) => chartColor(g.color, i)));
const arcs = computed(() =>
  layout.value.groups.map((g, i) => {
    const big = g.a1 - g.a0 > Math.PI ? 1 : 0;
    const mid = (g.a0 + g.a1) / 2;
    const [lx, ly] = pt(mid, R + W + 14)
      .split(",")
      .map(Number);
    return {
      d: `M${pt(g.a0, R + W)}A${R + W} ${R + W} 0 ${big} 1 ${pt(g.a1, R + W)}L${pt(g.a1, R)}A${R} ${R} 0 ${big} 0 ${pt(g.a0, R)}Z`,
      lx: lx!,
      ly: ly!,
      anchor: Math.sin(mid) > 0.1 ? "start" : Math.sin(mid) < -0.1 ? "end" : "middle",
      color: colors.value[i]!,
    };
  }),
);
// one ribbon for each pair: the chunk from i to j at one end, the chunk from j to i at the other
const ribbons = computed(() => {
  const out: { d: string; color: string; key: string; title: string }[] = [];
  const { chunks } = layout.value;
  const n = props.matrix.length;
  for (let i = 0; i < n; i++)
    for (let j = i; j < n; j++) {
      const a = chunks[i]![j]!;
      const b = chunks[j]![i]!;
      const ab = props.matrix[i]![j]! || 0;
      const ba = props.matrix[j]![i]! || 0;
      if (ab <= 0 && ba <= 0) continue;
      const arc = (s: Span) => `A${R} ${R} 0 ${s.a1 - s.a0 > Math.PI ? 1 : 0} 1 ${pt(s.a1, R)}`;
      out.push({
        key: `${i}-${j}`,
        d: `M${pt(a.a0, R)}${arc(a)}Q${C},${C} ${pt(b.a0, R)}${arc(b)}Q${C},${C} ${pt(a.a0, R)}Z`,
        color: colors.value[ab >= ba ? i : j]!,
        title:
          i === j
            ? `${props.groups[i]!.label}: ${fmt.value(ab)}`
            : `${props.groups[i]!.label} → ${props.groups[j]!.label}: ${fmt.value(ab)}, ${props.groups[j]!.label} → ${props.groups[i]!.label}: ${fmt.value(ba)}`,
      });
    }
  return out;
});
</script>

<template>
  <figure class="bless-chord" :style="{ inlineSize: `${size}px` }">
    <svg viewBox="0 0 320 320" class="bless-chord__svg" aria-hidden="true">
      <path
        v-for="r in ribbons"
        :key="r.key"
        class="bless-chord__ribbon"
        :d="r.d"
        :style="{ '--_c': r.color }"
      >
        <title>{{ r.title }}</title>
      </path>
      <path
        v-for="(a, i) in arcs"
        :key="i"
        class="bless-chord__arc"
        :d="a.d"
        :style="{ '--_c': a.color }"
      />
      <text
        v-for="(a, i) in arcs"
        :key="`t${i}`"
        class="bless-chord__label"
        :x="a.lx"
        :y="a.ly"
        :text-anchor="a.anchor"
        dominant-baseline="middle"
      >
        {{ groups[i]?.label }}
      </text>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.from }}</th>
            <th v-for="g in groups" :key="g.key" scope="col">{{ text.to(g.label) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(g, i) in groups" :key="g.key">
            <th scope="row">{{ g.label }}</th>
            <td v-for="(_, j) in groups" :key="j">{{ fmt(matrix[i]?.[j] ?? 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-chord {
  max-inline-size: 100%;
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-chord__svg {
  display: block;
  inline-size: 100%;
  overflow: visible;
}
.bless-chord__arc {
  fill: var(--_c);
}
.bless-chord__ribbon {
  fill: color-mix(in srgb, var(--_c) 55%, transparent);
  stroke: var(--bless-color-bg);
  stroke-width: 0.5;
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
/* a hover on a ribbon makes the others faint */
.bless-chord__svg:has(.bless-chord__ribbon:hover) .bless-chord__ribbon:not(:hover) {
  opacity: 0.2;
}
.bless-chord__label {
  fill: var(--bless-color-text);
  font-size: 11px;
}
@media (prefers-reduced-motion: reduce) {
  .bless-chord__ribbon {
    transition: none;
  }
}
</style>
