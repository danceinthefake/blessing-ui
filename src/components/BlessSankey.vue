<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { layoutSankey, type BlessSankeyLink, type BlessSankeyNode } from "./sankey";
import "./sr.css";

defineOptions({ name: "BlessSankey" });
const pack = useLabelPack("BlessSankey");

const props = withDefaults(
  defineProps<{
    /** the flows; a node is any id that a link names */
    links: BlessSankeyLink[];
    /** labels, colors, and order for the nodes; optional */
    nodes?: BlessSankeyNode[];
    height?: number;
    /** text for one value, for example `(v) => v.toLocaleString()` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ from: string; to: string; value: string }>;
  }>(),
  { nodes: () => [], height: 320, label: "Flows" },
);

const text = computed(() => ({
  from: "From",
  to: "To",
  value: "Value",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? ((v: number) => new Intl.NumberFormat().format(v)));

const box = ref<HTMLElement>();
const width = ref(640); // measured on mount, so the server and the first client render agree
let ro: ResizeObserver | undefined;
onMounted(() => {
  const read = () => (width.value = box.value?.clientWidth || width.value);
  read();
  if (typeof ResizeObserver === "function" && box.value) {
    ro = new ResizeObserver(read);
    ro.observe(box.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());

const NODE = 12;
// room at both sides for the labels of the first and the last column
const PAD = 8;
const laid = computed(() =>
  layoutSankey(props.links, props.nodes, width.value - 2 * PAD, props.height, NODE),
);
const last = computed(() => Math.max(0, ...laid.value.nodes.map((n) => n.col)));
const colour = (c: string | undefined, i: number) => {
  const v = c ?? `chart-${(i % 5) + 1}`;
  return /^[a-z0-9-]+$/i.test(v) ? `var(--bless-color-${v})` : v;
};
</script>

<template>
  <figure ref="box" class="bless-sankey">
    <svg
      :viewBox="`${-PAD} 0 ${width} ${height}`"
      :height
      class="bless-sankey__svg"
      aria-hidden="true"
    >
      <path
        v-for="(l, i) in laid.links"
        :key="i"
        class="bless-sankey__link"
        :d="l.d"
        :style="{ '--_c': colour(l.from.color, l.from.index) }"
      >
        <title>{{ l.from.label }} → {{ l.to.label }}: {{ fmt(l.value) }}</title>
      </path>
      <g v-for="n in laid.nodes" :key="n.id" :style="{ '--_c': colour(n.color, n.index) }">
        <rect class="bless-sankey__node" :x="n.x" :y="n.y" :width="NODE" :height="n.h" />
        <text
          class="bless-sankey__label"
          :x="n.col === last && last ? n.x - 6 : n.x + NODE + 6"
          :y="n.y + n.h / 2"
          :text-anchor="n.col === last && last ? 'end' : 'start'"
          dominant-baseline="middle"
        >
          {{ n.label }} <tspan class="bless-sankey__value">{{ fmt(n.value) }}</tspan>
        </text>
      </g>
    </svg>
    <!-- the same flows in words, for screen readers; a table ignores overflow, so a box clips it -->
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.from }}</th>
            <th scope="col">{{ text.to }}</th>
            <th scope="col">{{ text.value }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, i) in laid.links" :key="i">
            <td>{{ l.from.label }}</td>
            <td>{{ l.to.label }}</td>
            <td>{{ fmt(l.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-sankey {
  position: relative;
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-sankey__svg {
  display: block;
  inline-size: 100%;
  overflow: visible;
}
.bless-sankey__link {
  fill: var(--_c);
  opacity: 0.3;
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-sankey__link:hover {
  opacity: 0.6;
}
.bless-sankey__node {
  fill: var(--_c);
}
.bless-sankey__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  fill: var(--bless-color-text);
  paint-order: stroke;
  stroke: var(--bless-color-bg);
  stroke-width: 3px;
  stroke-linejoin: round;
}
.bless-sankey__value {
  font-weight: var(--bless-font-weight-normal);
  fill: var(--bless-color-text-muted);
}
@media (prefers-reduced-motion: reduce) {
  .bless-sankey__link {
    transition: none;
  }
}
</style>
