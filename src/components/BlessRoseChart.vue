<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessRoseChart" });
const pack = useLabelPack("BlessRoseChart");

export interface BlessRoseItem {
  label: string;
  value: number;
  color?: string;
}

const props = withDefaults(
  defineProps<{
    /** one wedge for each item, clockwise from the top */
    data: BlessRoseItem[];
    color?: string;
    /** the width of the chart in pixels */
    size?: number;
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ item: string; value: string }>;
  }>(),
  { color: "chart-1", size: 300, label: "Chart" },
);

const text = computed(() => ({ item: "Item", value: "Value", ...pack(), ...props.labels }));
const fmt = computed(() => props.format ?? numberText);
const C = 150;
const MAX_R = 112;
const at = (a: number, r: number) => [C + r * Math.sin(a), C - r * Math.cos(a)] as const;
const wedges = computed(() => {
  const n = props.data.length || 1;
  const step = (Math.PI * 2) / n;
  const top = Math.max(0, ...props.data.map((d) => d.value)) || 1;
  return props.data.map((d, i) => {
    // the area of a wedge follows the value, so its radius is the square root of the share
    const r = Math.sqrt(Math.max(0, d.value) / top) * MAX_R;
    const a0 = i * step + 0.01;
    const a1 = (i + 1) * step - 0.01;
    const [x0, y0] = at(a0, r);
    const [x1, y1] = at(a1, r);
    const [lx, ly] = at((a0 + a1) / 2, MAX_R + 16);
    return {
      ...d,
      d:
        r > 0
          ? `M${C},${C}L${x0.toFixed(1)},${y0.toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}Z`
          : "",
      lx,
      ly,
      color: chartColor(d.color ?? props.color, 0),
    };
  });
});
</script>

<template>
  <figure class="bless-rose" :style="{ inlineSize: `${size}px` }">
    <svg viewBox="0 0 300 300" class="bless-rose__svg" aria-hidden="true">
      <circle
        v-for="f in [0.25, 0.5, 0.75, 1]"
        :key="f"
        class="bless-rose__ring"
        :cx="C"
        :cy="C"
        :r="Math.sqrt(f) * MAX_R"
      />
      <path
        v-for="w in wedges"
        :key="w.label"
        class="bless-rose__wedge"
        :d="w.d"
        :style="{ '--_c': w.color }"
      >
        <title>{{ w.label }}: {{ fmt(w.value) }}</title>
      </path>
      <text
        v-for="w in wedges"
        :key="`t${w.label}`"
        class="bless-rose__label"
        :x="w.lx"
        :y="w.ly"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ w.label }}
      </text>
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
          <tr v-for="d in data" :key="d.label">
            <th scope="row">{{ d.label }}</th>
            <td>{{ fmt(d.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<style>
.bless-rose {
  max-inline-size: 100%;
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-rose__svg {
  display: block;
  inline-size: 100%;
  overflow: visible;
}
.bless-rose__ring {
  fill: none;
  stroke: var(--bless-color-border);
  stroke-dasharray: 2 3;
}
.bless-rose__wedge {
  fill: var(--_c);
  stroke: var(--bless-color-bg);
  stroke-width: 1;
  transition: opacity var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-rose__wedge:hover {
  opacity: 0.75;
}
.bless-rose__label {
  fill: var(--bless-color-text-muted);
  font-size: 11px;
}
@media (prefers-reduced-motion: reduce) {
  .bless-rose__wedge {
    transition: none;
  }
}
</style>
