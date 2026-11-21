<template>
  <figure
    class="bless-pyramid"
    :style="{ '--_l': chartColor(colors[0], 0), '--_r': chartColor(colors[1], 1) }"
  >
    <div class="bless-pyramid__legend" aria-hidden="true">
      <span><i class="is-left" />{{ text.left }}</span>
      <span><i class="is-right" />{{ text.right }}</span>
    </div>
    <div class="bless-pyramid__rows" aria-hidden="true">
      <div v-for="r in data" :key="r.label" class="bless-pyramid__row">
        <div class="bless-pyramid__side is-left">
          <span class="bless-pyramid__value">{{ fmt(r.left) }}</span>
          <span class="bless-pyramid__bar" :style="{ '--_w': share(r.left) }" />
        </div>
        <span class="bless-pyramid__label">{{ r.label }}</span>
        <div class="bless-pyramid__side is-right">
          <span class="bless-pyramid__bar" :style="{ '--_w': share(r.right) }" />
          <span class="bless-pyramid__value">{{ fmt(r.right) }}</span>
        </div>
      </div>
    </div>
    <div class="bless-sr">
      <table>
        <caption>
          {{ label }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.row }}</th>
            <th scope="col">{{ text.left }}</th>
            <th scope="col">{{ text.right }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in data" :key="r.label">
            <th scope="row">{{ r.label }}</th>
            <td>{{ fmt(r.left) }}</td>
            <td>{{ fmt(r.right) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor, numberText } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessPyramid" });
const pack = useLabelPack("BlessPyramid");

export interface BlessPyramidRow {
  /** the name of the row, in the middle, for example "25–34" */
  label: string;
  left: number;
  right: number;
}

const props = withDefaults(
  defineProps<{
    data: BlessPyramidRow[];
    /** the colors of the left and the right bars */
    colors?: [string, string];
    /** text for one value, for example `(v) => v + "%"` */
    format?: (v: number) => string;
    /** names the chart and its table for screen readers */
    label?: string;
    labels?: Partial<{ left: string; right: string; row: string }>;
  }>(),
  { colors: () => ["chart-1", "chart-2"], label: "Chart" },
);

const text = computed(() => ({
  left: "Left",
  right: "Right",
  row: "Group",
  ...pack(),
  ...props.labels,
}));
const fmt = computed(() => props.format ?? numberText);
// both sides share one scale, so equal values have equal bars
const max = computed(() => Math.max(1, ...props.data.flatMap((r) => [r.left, r.right])));
const share = (v: number) => Math.max(0, v) / max.value;
</script>

<style>
.bless-pyramid {
  margin: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-pyramid__legend {
  display: flex;
  justify-content: center;
  gap: var(--bless-space-4);
  margin-block-end: var(--bless-space-3);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-pyramid__legend span {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-pyramid__legend i {
  inline-size: 10px;
  block-size: 10px;
}
.bless-pyramid__legend .is-left,
.is-left > .bless-pyramid__bar {
  background: var(--_l);
}
.bless-pyramid__legend .is-right,
.is-right > .bless-pyramid__bar {
  background: var(--_r);
}
.bless-pyramid__rows {
  display: grid;
  gap: 3px;
}
.bless-pyramid__row {
  display: grid;
  grid-template-columns: 1fr var(--bless-pyramid-label, 4.5rem) 1fr;
  align-items: center;
  block-size: 1.5rem;
}
.bless-pyramid__side {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  block-size: 100%;
}
.bless-pyramid__side.is-left {
  justify-content: flex-end;
}
/* the room left after the value text is the full scale */
.bless-pyramid__bar {
  flex: none;
  inline-size: calc((100% - 3.5rem) * var(--_w));
  block-size: 100%;
}
.bless-pyramid__value {
  flex: none;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-pyramid__label {
  font-size: var(--bless-text-xs);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.bless-pyramid__rows {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
