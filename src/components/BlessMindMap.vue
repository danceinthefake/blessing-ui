<script lang="ts">
export interface BlessMindNode {
  label: string;
  children?: BlessMindNode[];
}
</script>

<script setup lang="ts">
import { computed, h, type FunctionalComponent } from "vue";
import { chartColor } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessMindMap" });

const props = defineProps<{
  /** the central idea; its children go to the two sides */
  root: BlessMindNode;
}>();

// the same tree as nested lists, for screen readers
const List: FunctionalComponent<{ nodes: BlessMindNode[] }> = ({ nodes }) =>
  h(
    "ul",
    nodes.map((n) =>
      h("li", [n.label, n.children?.length ? h(List, { nodes: n.children }) : null]),
    ),
  );

const ROW = 34;
const GAP = 22;
// ponytail: the width of a label is estimated from its length, measure the text if fonts vary a lot
const w = (s: string, depth: number) => Math.min(220, s.length * (depth === 1 ? 7.6 : 6.9) + 8);
const leaves = (n: BlessMindNode): number =>
  n.children?.length ? n.children.reduce((a, c) => a + leaves(c), 0) : 1;

interface Laid {
  key: string;
  label: string;
  depth: number;
  side: 1 | -1;
  x: number; // where the label starts, on the side of the root
  y: number;
  width: number;
  color: string;
  px: number; // where the line from the parent starts
  py: number;
}

const layout = computed(() => {
  const kids = props.root.children ?? [];
  const half = Math.ceil(kids.length / 2);
  const sides = [
    { side: 1 as const, list: kids.slice(0, half).map((n, i) => ({ n, i })) },
    { side: -1 as const, list: kids.slice(half).map((n, i) => ({ n, i: i + half })) },
  ];
  const rootW = Math.min(240, props.root.label.length * 8.6 + 28);
  const rows = Math.max(1, ...sides.map((s) => s.list.reduce((a, { n }) => a + leaves(n), 0)));
  const height = rows * ROW + 24;
  const out: Laid[] = [];
  const reach = { 1: rootW / 2, [-1]: rootW / 2 } as Record<1 | -1, number>;
  for (const { side, list } of sides) {
    const total = list.reduce((a, { n }) => a + leaves(n), 0);
    let row = (rows - total) / 2;
    const place = (
      n: BlessMindNode,
      depth: number,
      x: number,
      px: number,
      py: number,
      color: string,
      key: string,
    ) => {
      const width = w(n.label, depth);
      const span = leaves(n);
      let y: number;
      if (n.children?.length) {
        const start = row;
        n.children.forEach((c, i) =>
          place(c, depth + 1, x + width + GAP, 0, 0, color, `${key}.${i}`),
        );
        y = 12 + (start + span / 2) * ROW;
      } else {
        y = 12 + (row + 0.5) * ROW;
        row += 1;
      }
      // children are placed first, so set their line start now that the parent y is known
      for (const c of out)
        if (c.key.startsWith(`${key}.`) && c.depth === depth + 1) {
          c.px = x + width;
          c.py = y;
        }
      out.push({ key, label: n.label, depth, side, x, y, width, color, px, py });
      reach[side] = Math.max(reach[side], x + width);
    };
    for (const { n, i } of list)
      place(n, 1, rootW / 2 + GAP * 1.6, 0, 0, chartColor(undefined, i), `${i}`);
  }
  const left = reach[-1] + 8;
  const width = left + reach[1] + 8;
  const cy = height / 2;
  for (const d of out)
    if (d.depth === 1) {
      d.px = rootW / 2;
      d.py = (rows * ROW) / 2 + 12;
    }
  return { nodes: out, width, height, cx: left, cy, rootW };
});
// the position on the page: the side flips the x around the center
const X = (side: 1 | -1, x: number) => layout.value.cx + side * x;
const curve = (d: Laid) => {
  const x0 = X(d.side, d.px);
  const x1 = X(d.side, d.x);
  const m = (x0 + x1) / 2;
  return `M${x0},${d.py} C${m},${d.py} ${m},${d.y} ${x1},${d.y}`;
};
</script>

<template>
  <figure class="bless-mind">
    <svg
      :viewBox="`0 0 ${layout.width} ${layout.height}`"
      :style="{ maxInlineSize: `${layout.width}px` }"
      aria-hidden="true"
    >
      <g v-for="d in layout.nodes" :key="d.key" :style="{ '--_c': d.color }">
        <path :d="curve(d)" class="bless-mind__edge" :class="`is-d${Math.min(d.depth, 3)}`" />
        <line
          :x1="X(d.side, d.x)"
          :x2="X(d.side, d.x + d.width)"
          :y1="d.y"
          :y2="d.y"
          class="bless-mind__edge"
          :class="`is-d${Math.min(d.depth, 3)}`"
        />
        <text
          :x="X(d.side, d.x + 4)"
          :y="d.y - 6"
          :text-anchor="d.side === 1 ? 'start' : 'end'"
          class="bless-mind__label"
          :class="{ 'is-top': d.depth === 1 }"
        >
          {{ d.label }}
        </text>
      </g>
      <rect
        :x="layout.cx - layout.rootW / 2"
        :y="layout.cy - 20"
        :width="layout.rootW"
        height="40"
        class="bless-mind__root"
      />
      <text :x="layout.cx" :y="layout.cy" text-anchor="middle" class="bless-mind__rootlabel">
        {{ root.label }}
      </text>
    </svg>
    <div class="bless-sr"><List :nodes="[root]" /></div>
  </figure>
</template>

<style>
.bless-mind {
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-mind svg {
  display: block;
  inline-size: 100%;
  block-size: auto;
  margin-inline: auto;
}
.bless-mind__edge {
  fill: none;
  stroke: var(--_c);
  stroke-linecap: round;
}
.bless-mind__edge.is-d1 {
  stroke-width: 4;
}
.bless-mind__edge.is-d2 {
  stroke-width: 2.5;
}
.bless-mind__edge.is-d3 {
  stroke-width: 1.5;
}
.bless-mind__label {
  fill: var(--bless-color-text);
  font-size: 12px;
}
.bless-mind__label.is-top {
  font-size: 13px;
  font-weight: var(--bless-font-weight-bold);
}
.bless-mind__root {
  fill: var(--bless-color-text);
}
.bless-mind__rootlabel {
  fill: var(--bless-color-bg);
  font-size: 14px;
  font-weight: var(--bless-font-weight-bold);
  dominant-baseline: middle;
}
</style>
