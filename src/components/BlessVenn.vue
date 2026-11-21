<template>
  <figure class="bless-venn">
    <svg :viewBox="`0 0 320 ${three ? 240 : 220}`" class="bless-venn__svg" aria-hidden="true">
      <circle
        v-for="(s, i) in sets"
        :key="s.key"
        class="bless-venn__set"
        :cx="centers[i]![0]"
        :cy="centers[i]![1]"
        :r="R"
        :style="{ '--_c': s.color }"
      >
        <title>{{ s.label }}: {{ fmt(s.size) }}</title>
      </circle>
      <text
        v-for="r in regions"
        :key="r.keys.join()"
        class="bless-venn__count"
        :class="{ 'is-shared': r.keys.length > 1 }"
        :x="r.at[0]"
        :y="r.at[1]"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ fmt(r.size) }}
      </text>
    </svg>
    <ul class="bless-venn__legend" aria-hidden="true">
      <li v-for="s in sets" :key="s.key">
        <i :style="{ background: s.color }" />{{ s.label }} <span>{{ fmt(s.size) }}</span>
      </li>
    </ul>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.part }}</th>
            <th scope="col">{{ text.count }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in regions" :key="r.keys.join()">
            <th scope="row">{{ r.name }}</th>
            <td>{{ fmt(r.size) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script lang="ts">
export interface BlessVennSet {
  key: string;
  label: string;
  /** everything in the set, with the parts it shares */
  size: number;
  color?: string;
}
export interface BlessVennOverlap {
  /** two or three set keys */
  keys: string[];
  /** everything that the sets share, with the part that all three share */
  size: number;
}
const id = (keys: string[]) => [...keys].sort().join("&");

/** The count of each region that only those sets cover, for two or three sets: the diagram of John Venn (1880), counted by inclusion and exclusion. */
export function vennRegions(
  sets: BlessVennSet[],
  overlaps: BlessVennOverlap[],
): { keys: string[]; size: number }[] {
  const of = (keys: string[]) =>
    keys.length === 1
      ? (sets.find((s) => s.key === keys[0])?.size ?? 0)
      : (overlaps.find((o) => id(o.keys) === id(keys))?.size ?? 0);
  const k = sets.map((s) => s.key);
  if (k.length === 2) {
    const ab = of(k);
    return [
      { keys: [k[0]!], size: of([k[0]!]) - ab },
      { keys: [k[1]!], size: of([k[1]!]) - ab },
      { keys: k, size: ab },
    ];
  }
  const [a, b, c] = k as [string, string, string];
  const abc = of([a, b, c]);
  const ab = of([a, b]) - abc;
  const ac = of([a, c]) - abc;
  const bc = of([b, c]) - abc;
  return [
    { keys: [a], size: of([a]) - ab - ac - abc },
    { keys: [b], size: of([b]) - ab - bc - abc },
    { keys: [c], size: of([c]) - ac - bc - abc },
    { keys: [a, b], size: ab },
    { keys: [a, c], size: ac },
    { keys: [b, c], size: bc },
    { keys: [a, b, c], size: abc },
  ];
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessVenn" });
const pack = useLabelPack("BlessVenn");

const props = withDefaults(
  defineProps<{
    /** two or three sets */
    sets: BlessVennSet[];
    /** the size of each overlap: each pair, and all three */
    overlaps?: BlessVennOverlap[];
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{
      part: string;
      count: string;
      only: (name: string) => string;
      and: (names: string[]) => string;
    }>;
  }>(),
  { overlaps: () => [], label: "Chart" },
);

const text = computed(() => ({
  part: "Part",
  count: "Count",
  only: (n: string) => `Only ${n}`,
  and: (ns: string[]) =>
    ns.length === 2 ? `${ns[0]} and ${ns[1]}` : `${ns.slice(0, -1).join(", ")}, and ${ns.at(-1)}`,
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const three = computed(() => props.sets.length >= 3);
const sets = computed(() =>
  props.sets.slice(0, 3).map((s, i) => ({ ...s, color: chartColor(s.color, i) })),
);
// a fixed layout: the circles do not scale with the counts
const CIRCLES = {
  two: [
    [120, 110],
    [200, 110],
  ],
  three: [
    [125, 100],
    [195, 100],
    [160, 160],
  ],
};
const R = computed(() => (three.value ? 68 : 78));
const centers = computed(() => (three.value ? CIRCLES.three : CIRCLES.two));
const SPOTS: Record<string, [number, number]> = {
  "2:0": [92, 110],
  "2:1": [228, 110],
  "2:0&1": [160, 110],
  "3:0": [100, 82],
  "3:1": [220, 82],
  "3:2": [160, 198],
  "3:0&1": [160, 74],
  "3:0&2": [124, 146],
  "3:1&2": [196, 146],
  "3:0&1&2": [160, 120],
};
const name = (k: string) => props.sets.find((s) => s.key === k)?.label ?? k;
const regions = computed(() =>
  vennRegions(sets.value, props.overlaps).map((r) => {
    const idx = r.keys.map((k) => sets.value.findIndex((s) => s.key === k)).join("&");
    return {
      ...r,
      at: SPOTS[`${sets.value.length}:${idx}`] ?? [0, 0],
      name:
        r.keys.length === 1 ? text.value.only(name(r.keys[0]!)) : text.value.and(r.keys.map(name)),
    };
  }),
);
</script>

<style>
.bless-venn {
  max-inline-size: 26rem;
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-venn__svg {
  display: block;
  inline-size: 100%;
}
.bless-venn__set {
  fill: color-mix(in srgb, var(--_c) 30%, transparent);
  stroke: var(--_c);
  stroke-width: 2;
}
.bless-venn__count {
  fill: var(--bless-color-text);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}
.bless-venn__count.is-shared {
  font-weight: var(--bless-font-weight-bold);
}
.bless-venn__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: var(--bless-space-2) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-sm);
}
.bless-venn__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-venn__legend i {
  inline-size: 10px;
  block-size: 10px;
}
.bless-venn__legend span {
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
/* the chart opens out from its middle */
.bless-venn__svg {
  --_gx: calc(0.6 + 0.4 * var(--bless-grow));
  --_gy: var(--_gx);
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
