<template>
  <figure ref="box" class="bless-plot bless-slope">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <text class="bless-plot__cat bless-slope__col" :x="x0" y="12" text-anchor="middle">
        {{ text.start }}
      </text>
      <text class="bless-plot__cat bless-slope__col" :x="x1" y="12" text-anchor="middle">
        {{ text.end }}
      </text>
      <line class="bless-plot__grid" :x1="x0" :x2="x0" :y1="TOP - 6" :y2="height - 6" />
      <line class="bless-plot__grid" :x1="x1" :x2="x1" :y1="TOP - 6" :y2="height - 6" />
      <g
        v-for="l in lines"
        :key="l.label"
        class="bless-slope__line"
        :class="{ 'is-down': !l.up }"
        :style="{ '--_c': l.color }"
      >
        <title>{{ l.label }}: {{ fmt(l.start) }} → {{ fmt(l.end) }}</title>
        <line :x1="x0" :x2="x1" :y1="py(l.start)" :y2="py(l.end)" />
        <circle :cx="x0" :cy="py(l.start)" r="4" />
        <circle :cx="x1" :cy="py(l.end)" r="4" />
        <text
          class="bless-plot__tick"
          :x="x0 - 10"
          :y="py(l.start)"
          text-anchor="end"
          dominant-baseline="middle"
        >
          <tspan class="bless-slope__name">{{ l.label }}</tspan> {{ fmt(l.start) }}
        </text>
        <text class="bless-plot__tick" :x="x1 + 10" :y="py(l.end)" dominant-baseline="middle">
          {{ fmt(l.end) }}
        </text>
      </g>
    </svg>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.item }}</th>
            <th scope="col">{{ text.start }}</th>
            <th scope="col">{{ text.end }}</th>
            <th scope="col">{{ text.change }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in data" :key="d.label">
            <th scope="row">{{ d.label }}</th>
            <td>{{ fmt(d.start) }}</td>
            <td>{{ fmt(d.end) }}</td>
            <td>{{ sign(d.end - d.start) }}{{ fmt(Math.abs(d.end - d.start)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessSlopeChart" });
const pack = useLabelPack("BlessSlopeChart");

export interface BlessSlopeItem {
  label: string;
  start: number;
  end: number;
  /** a token name or any CSS color; default: the chart color for a rise, gray for a fall */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    data: BlessSlopeItem[];
    height?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ start: string; end: string; item: string; change: string }>;
  }>(),
  { height: 300, label: "Chart" },
);

const text = computed(() => ({
  start: "Before",
  end: "After",
  item: "Item",
  change: "Change",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const TOP = 28;
const yt = computed(() => {
  const vs = props.data.flatMap((d) => [d.start, d.end]);
  return vs.length ? niceTicks(Math.min(...vs), Math.max(...vs), 4) : [0, 1];
});
const py = computed(() => scale([yt.value[0]!, yt.value.at(-1)!], [props.height - 12, TOP]));
// the names sit outside the two columns
const side = computed(() =>
  Math.min(
    170,
    24 + 7 * Math.max(0, ...props.data.map((d) => d.label.length + fmt.value(d.start).length)),
  ),
);
const x0 = computed(() => side.value);
const x1 = computed(() => Math.max(side.value + 80, width.value - 70));
const lines = computed(() =>
  props.data.map((d) => {
    const up = d.end >= d.start;
    return {
      ...d,
      up,
      color: d.color
        ? chartColor(d.color, 0)
        : up
          ? chartColor(undefined, 0)
          : "var(--bless-color-text-muted)",
    };
  }),
);
const sign = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "±");
</script>

<style>
.bless-slope__col {
  font-weight: var(--bless-font-weight-bold);
}
.bless-slope__line line {
  stroke: var(--_c);
  stroke-width: 2.5;
}
/* a fall is dashed, so the direction does not rest on the color */
.bless-slope__line.is-down line {
  stroke-dasharray: 5 4;
}
.bless-slope__line circle {
  fill: var(--_c);
}
.bless-slope__name {
  fill: var(--bless-color-text);
}
.bless-slope svg:has(.bless-slope__line:hover) .bless-slope__line:not(:hover) {
  opacity: 0.25;
}
.bless-slope__line {
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
@media (prefers-reduced-motion: reduce) {
  .bless-slope__line {
    transition: none;
  }
}
</style>
