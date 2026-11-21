<template>
  <div class="bless-cmptable">
    <table class="bless-cmptable__table">
      <caption class="bless-sr">
        {{ label ?? text.title }}
      </caption>
      <thead>
        <tr>
          <th scope="col" class="bless-cmptable__feature">{{ text.feature }}</th>
          <th
            v-for="p in plans"
            :key="p.key"
            scope="col"
            class="bless-cmptable__plan"
            :class="{ 'is-highlight': p.highlight }"
          >
            <span class="bless-cmptable__name">{{ p.label }}</span>
            <span v-if="p.note" class="bless-cmptable__note">{{ p.note }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(r, i) in rows" :key="i">
          <tr v-if="r.group" class="bless-cmptable__group">
            <th scope="colgroup" :colspan="plans.length + 1">{{ r.label }}</th>
          </tr>
          <tr v-else>
            <th scope="row" class="bless-cmptable__feature">{{ r.label }}</th>
            <td
              v-for="p in plans"
              :key="p.key"
              class="bless-cmptable__cell"
              :class="{ 'is-highlight': p.highlight }"
            >
              <template v-if="r.values?.[p.key] === true">
                <svg
                  class="bless-cmptable__yes"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M3 8.5 6.5 12 13 4.5" />
                </svg>
                <span class="bless-sr">{{ text.yes }}</span>
              </template>
              <template v-else-if="r.values?.[p.key] === false || r.values?.[p.key] === undefined">
                <span class="bless-cmptable__no" aria-hidden="true">–</span>
                <span class="bless-sr">{{ text.no }}</span>
              </template>
              <template v-else>{{ r.values[p.key] }}</template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessComparisonTable" });
const pack = useLabelPack("BlessComparisonTable");

export interface BlessComparePlan {
  key: string;
  label: string;
  /** a line under the name, for example the price */
  note?: string;
  /** stands out, for example the plan that most people take */
  highlight?: boolean;
}
export interface BlessCompareRow {
  label: string;
  /** a heading row that starts a group */
  group?: boolean;
  /** by plan key: `true` (yes), `false` (no), or a text such as "10 GB" */
  values?: Partial<Record<string, boolean | string>>;
}

const props = defineProps<{
  plans: BlessComparePlan[];
  rows: BlessCompareRow[];
  /** names the table */
  label?: string;
  labels?: Partial<{ feature: string; yes: string; no: string; title: string }>;
}>();

const text = computed(() => ({
  title: "Compare plans",
  feature: "Feature",
  yes: "Included",
  no: "Not included",
  ...pack(),
  ...props.labels,
}));
</script>

<style>
.bless-cmptable {
  max-inline-size: 100%;
  overflow-x: auto;
  position: relative; /* hidden screen-reader text inside stays in the scroll box */
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-cmptable__table {
  inline-size: 100%;
  border-collapse: collapse;
}
.bless-cmptable__table th,
.bless-cmptable__table td {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
/* the names of the plans stay at the top while the reader scrolls a long list */
.bless-cmptable__table thead th {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  background: var(--bless-color-bg);
  vertical-align: bottom;
}
.bless-cmptable__feature {
  text-align: start;
  font-weight: normal;
}
thead .bless-cmptable__feature {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-cmptable__plan {
  min-inline-size: 7rem;
  text-align: center;
}
.bless-cmptable__name {
  display: block;
  font-weight: var(--bless-font-weight-bold);
}
.bless-cmptable__note {
  display: block;
  font-size: var(--bless-text-xs);
  font-weight: normal;
  color: var(--bless-color-text-muted);
}
.bless-cmptable__plan.is-highlight .bless-cmptable__note {
  color: var(--bless-color-text);
}
.bless-cmptable__plan.is-highlight {
  border-block-start: 4px solid var(--bless-color-accent);
}
.bless-cmptable__table .is-highlight {
  background: var(--bless-color-surface-2);
}
.bless-cmptable__cell {
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.bless-cmptable__yes {
  display: inline-block;
  vertical-align: middle;
  fill: none;
  stroke: var(--bless-color-text);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-cmptable__no {
  color: var(--bless-color-text-muted);
}
.bless-cmptable__group th {
  padding-block-start: var(--bless-space-4);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-align: start;
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
</style>
