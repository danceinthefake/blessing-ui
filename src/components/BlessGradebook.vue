<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessGradebook" });
const pack = useLabelPack("BlessGradebook");

export interface BlessGradeTask {
  id: string;
  title: string;
  /** the top score, 100 if not set */
  max?: number;
}
/** scores by student id, then by assignment id; a missing key is missing work */
export type BlessScores = Record<string, Record<string, number | null | undefined>>;

const props = withDefaults(
  defineProps<{
    students: { id: string; name: string }[];
    assignments: BlessGradeTask[];
    /** let the teacher type scores */
    editable?: boolean;
    /** the average in percent under which a student needs help */
    pass?: number;
    locale?: string;
    labels?: Partial<{
      caption: string;
      student: string;
      average: string;
      classAverage: string;
      missing: string;
      low: string;
      scoreOf: (student: string, task: string) => string;
      outOf: (max: number) => string;
    }>;
  }>(),
  { pass: 60, locale: "en" },
);
const scores = defineModel<BlessScores>({ default: () => ({}) });

const text = computed(() => ({
  caption: "Gradebook",
  student: "Student",
  average: "Average",
  classAverage: "Class average",
  missing: "Missing",
  low: "below pass",
  scoreOf: (s: string, t: string) => `${t} score for ${s}`,
  outOf: (m: number) => `out of ${m}`,
  ...pack(),
  ...props.labels,
}));
const max = (t: BlessGradeTask) => t.max ?? 100;
const get = (s: string, t: string) => scores.value[s]?.[t];
const pctFmt = computed(
  () => new Intl.NumberFormat(props.locale, { style: "percent", maximumFractionDigits: 0 }),
);
/** the mean of the shares, with missing work as zero */
function average(cells: { v: number | null | undefined; max: number }[]) {
  return cells.length ? cells.reduce((a, c) => a + (c.v ?? 0) / c.max, 0) / cells.length : 0;
}
const rows = computed(() =>
  props.students.map((s) => {
    const avg = average(props.assignments.map((t) => ({ v: get(s.id, t.id), max: max(t) })));
    return { s, avg, low: avg * 100 < props.pass };
  }),
);
const columns = computed(() =>
  props.assignments.map((t) => {
    const got = props.students.map((s) => get(s.id, t.id)).filter((v) => v != null) as number[];
    return got.length ? got.reduce((a, b) => a + b, 0) / got.length / max(t) : undefined;
  }),
);
function set(s: string, t: BlessGradeTask, raw: string) {
  const v = raw === "" ? null : Math.min(max(t), Math.max(0, Number(raw)));
  scores.value = { ...scores.value, [s]: { ...scores.value[s], [t.id]: v } };
}
</script>

<template>
  <div class="bless-grades" tabindex="0" role="group" :aria-label="text.caption">
    <table>
      <caption class="bless-sr">
        {{ text.caption }}
      </caption>
      <thead>
        <tr>
          <th scope="col">{{ text.student }}</th>
          <th v-for="t in assignments" :key="t.id" scope="col" class="is-num">
            {{ t.title }}
            <span class="bless-grades__max">{{ text.outOf(max(t)) }}</span>
          </th>
          <th scope="col" class="is-num">{{ text.average }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.s.id">
          <th scope="row">{{ r.s.name }}</th>
          <td
            v-for="t in assignments"
            :key="t.id"
            class="is-num"
            :class="{ 'is-missing': get(r.s.id, t.id) == null }"
          >
            <input
              v-if="editable"
              type="number"
              inputmode="decimal"
              min="0"
              :max="max(t)"
              :value="get(r.s.id, t.id) ?? ''"
              :placeholder="text.missing"
              :aria-label="text.scoreOf(r.s.name, t.title)"
              @change="set(r.s.id, t, ($event.target as HTMLInputElement).value)"
            />
            <template v-else>{{ get(r.s.id, t.id) ?? text.missing }}</template>
          </td>
          <td class="is-num bless-grades__avg" :class="{ 'is-low': r.low }">
            <span v-if="r.low" aria-hidden="true">▼ </span>{{ pctFmt.format(r.avg)
            }}<span v-if="r.low" class="bless-sr">, {{ text.low }}</span>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{{ text.classAverage }}</th>
          <td v-for="(c, i) in columns" :key="i" class="is-num">
            {{ c == null ? "–" : pctFmt.format(c) }}
          </td>
          <td class="is-num">
            {{ pctFmt.format(rows.reduce((a, r) => a + r.avg, 0) / (rows.length || 1)) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style>
.bless-grades {
  overflow-x: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-grades:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-grades table {
  min-inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-grades :is(th, td) {
  padding: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: start;
  white-space: nowrap;
}
.bless-grades thead th {
  vertical-align: bottom;
  font-size: var(--bless-text-xs);
}
.bless-grades .is-num {
  text-align: end;
}
.bless-grades__max {
  display: block;
  font-weight: var(--bless-font-weight-normal);
}
/* the name stays in view when the table scrolls */
.bless-grades tbody th,
.bless-grades tfoot th,
.bless-grades thead th:first-child {
  position: sticky;
  inset-inline-start: 0;
  background: var(--bless-color-bg);
}
.bless-grades td.is-missing {
  font-style: italic;
  font-size: var(--bless-text-xs);
}
.bless-grades input {
  inline-size: 4.5rem;
  min-block-size: 2rem;
  padding: 0 var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: end;
}
.bless-grades td.is-missing input {
  border-style: dashed;
}
.bless-grades input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-grades__avg {
  font-weight: var(--bless-font-weight-bold);
}
.bless-grades__avg.is-low {
  color: var(--bless-color-danger-text);
}
.bless-grades tfoot :is(th, td) {
  border-block-start: 2px solid var(--bless-color-text);
  border-block-end: 0;
  font-weight: var(--bless-font-weight-bold);
}
</style>
