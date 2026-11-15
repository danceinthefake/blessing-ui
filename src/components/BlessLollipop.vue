<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, niceTicks, numberText, scale, useWidth } from "./chart";
import "./chart.css";
import "./sr.css";

defineOptions({ name: "BlessLollipop" });
const pack = useLabelPack("BlessLollipop");

export interface BlessLollipopItem {
  label: string;
  value: number;
  /** a token name or any CSS color, to make one item stand out */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    data: BlessLollipopItem[];
    /** put the items in order of value, high first */
    sort?: boolean;
    color?: string;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ item: string; value: string }>;
  }>(),
  { color: "chart-1", label: "Chart" },
);

const text = computed(() => ({ item: "Item", value: "Value", ...pack(), ...props.labels }));
const fmt = computed(() => props.format ?? numberText);
const box = ref<HTMLElement>();
const width = useWidth(box);

const ROW = 28;
const rows = computed(() =>
  props.sort ? [...props.data].sort((a, b) => b.value - a.value) : props.data,
);
const xt = computed(() => {
  const vs = rows.value.map((r) => r.value);
  return vs.length ? niceTicks(Math.min(0, ...vs), Math.max(0, ...vs), 5) : [0, 1];
});
const labelW = computed(() =>
  Math.min(160, 12 + 7 * Math.max(0, ...rows.value.map((r) => r.label.length))),
);
const height = computed(() => rows.value.length * ROW + 24);
// room at the end for the value text
const px = computed(() =>
  scale([xt.value[0]!, xt.value.at(-1)!], [labelW.value + 8, width.value - 48]),
);
</script>

<template>
  <figure ref="box" class="bless-plot bless-lollipop" :style="{ '--_c': chartColor(color, 0) }">
    <svg :viewBox="`0 0 ${width} ${height}`" :height class="bless-plot__svg" aria-hidden="true">
      <g v-for="t in xt" :key="t">
        <line
          class="bless-plot__grid"
          :class="{ 'bless-plot__zero': t === 0 }"
          :x1="px(t)"
          :x2="px(t)"
          :y1="0"
          :y2="height - 20"
        />
        <text class="bless-plot__tick" :x="px(t)" :y="height - 6" text-anchor="middle">
          {{ fmt(t) }}
        </text>
      </g>
      <g
        v-for="(r, i) in rows"
        :key="r.label"
        class="bless-lollipop__row"
        :style="r.color ? { '--_c': chartColor(r.color, 0) } : undefined"
      >
        <text
          class="bless-plot__cat"
          :x="labelW"
          :y="i * ROW + ROW / 2"
          text-anchor="end"
          dominant-baseline="middle"
        >
          {{ r.label }}
        </text>
        <line :x1="px(0)" :x2="px(r.value)" :y1="i * ROW + ROW / 2" :y2="i * ROW + ROW / 2" />
        <circle :cx="px(r.value)" :cy="i * ROW + ROW / 2" r="6" />
        <text
          class="bless-plot__tick"
          :x="px(r.value) + (r.value < 0 ? -10 : 10)"
          :y="i * ROW + ROW / 2"
          :text-anchor="r.value < 0 ? 'end' : 'start'"
          dominant-baseline="middle"
        >
          {{ fmt(r.value) }}
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
            <th scope="col">{{ text.value }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.label">
            <th scope="row">{{ r.label }}</th>
            <td>{{ fmt(r.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-lollipop__row line {
  stroke: var(--_c);
  stroke-width: 2;
}
.bless-lollipop__row circle {
  fill: var(--_c);
}
</style>
