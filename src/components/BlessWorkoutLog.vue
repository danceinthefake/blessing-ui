<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessWorkoutLog" });
const pack = useLabelPack("BlessWorkoutLog");

export interface BlessWorkoutSet {
  weight: number;
  reps: number;
  done?: boolean;
}

const props = withDefaults(
  defineProps<{
    exercise: string;
    /** the sets of the last session, for each row */
    previous?: { weight: number; reps: number }[];
    /** the unit of the weight */
    unit?: string;
    locale?: string;
    labels?: Partial<{
      set: string;
      last: string;
      weight: string;
      reps: string;
      done: string;
      add: string;
      remove: (n: number) => string;
      volume: (total: string) => string;
      field: (what: string, n: number) => string;
    }>;
  }>(),
  { previous: () => [], unit: "kg", locale: "en" },
);
const sets = defineModel<BlessWorkoutSet[]>({ default: () => [] });

const text = computed(() => ({
  set: "Set",
  last: "Last time",
  weight: "Weight",
  reps: "Reps",
  done: "Done",
  add: "Add a set",
  remove: (n: number) => `Remove set ${n}`,
  volume: (t: string) => `Volume ${t}`,
  field: (w: string, n: number) => `${w}, set ${n}`,
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 1 }));
const patch = (i: number, p: Partial<BlessWorkoutSet>) =>
  (sets.value = sets.value.map((s, k) => (k === i ? { ...s, ...p } : s)));
// a new set copies the last one, which is what people do most of the time
function add() {
  const last = sets.value.at(-1) ?? props.previous[sets.value.length] ?? { weight: 0, reps: 0 };
  sets.value = [...sets.value, { weight: last.weight, reps: last.reps, done: false }];
}
const remove = (i: number) => (sets.value = sets.value.filter((_, k) => k !== i));
/** weight × reps of the done sets */
const volume = computed(() =>
  sets.value.filter((s) => s.done).reduce((n, s) => n + s.weight * s.reps, 0),
);
const read = (e: Event) => Math.max(0, (e.target as HTMLInputElement).valueAsNumber || 0);
</script>

<template>
  <section class="bless-workout" :aria-label="exercise">
    <h3 class="bless-workout__name">{{ exercise }}</h3>
    <table class="bless-workout__table">
      <thead>
        <tr>
          <th scope="col">{{ text.set }}</th>
          <th scope="col">{{ text.last }}</th>
          <th scope="col">{{ text.weight }} ({{ unit }})</th>
          <th scope="col">{{ text.reps }}</th>
          <th scope="col">{{ text.done }}</th>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, i) in sets" :key="i" :class="{ 'is-done': s.done }">
          <th scope="row">{{ i + 1 }}</th>
          <td class="bless-workout__last">
            {{ previous[i] ? `${num.format(previous[i]!.weight)} × ${previous[i]!.reps}` : "–" }}
          </td>
          <td>
            <input
              type="number"
              inputmode="decimal"
              min="0"
              step="0.5"
              :value="s.weight"
              :aria-label="text.field(text.weight, i + 1)"
              @change="patch(i, { weight: read($event) })"
            />
          </td>
          <td>
            <input
              type="number"
              inputmode="numeric"
              min="0"
              step="1"
              :value="s.reps"
              :aria-label="text.field(text.reps, i + 1)"
              @change="patch(i, { reps: read($event) })"
            />
          </td>
          <td>
            <input
              type="checkbox"
              class="bless-workout__check"
              :checked="!!s.done"
              :aria-label="text.field(text.done, i + 1)"
              @change="patch(i, { done: ($event.target as HTMLInputElement).checked })"
            />
          </td>
          <td>
            <button
              type="button"
              class="bless-workout__remove"
              :aria-label="text.remove(i + 1)"
              :title="text.remove(i + 1)"
              @click="remove(i)"
            >
              ✕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="bless-workout__foot">
      <button type="button" class="bless-workout__add" @click="add">+ {{ text.add }}</button>
      <span class="bless-workout__volume">{{ text.volume(`${num.format(volume)} ${unit}`) }}</span>
    </div>
  </section>
</template>

<style>
.bless-workout {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-workout__name {
  margin: 0;
  font-size: var(--bless-text-md);
}
.bless-workout__table {
  inline-size: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.bless-workout__table th,
.bless-workout__table td {
  padding: var(--bless-space-1);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: center;
}
.bless-workout__table thead th {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-normal);
  color: var(--bless-color-text-muted);
}
.bless-workout__table tr.is-done {
  background: color-mix(in srgb, var(--bless-color-success) 14%, var(--bless-color-bg));
}
.bless-workout__last {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-workout__table input[type="number"] {
  inline-size: 3.75rem;
  min-block-size: 2.25rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  text-align: center;
}
.bless-workout__check {
  inline-size: 1.25rem;
  block-size: 1.25rem;
  accent-color: var(--bless-color-accent);
}
.bless-workout__table input:focus-visible,
.bless-workout__remove:focus-visible,
.bless-workout__add:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-workout__remove {
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  cursor: pointer;
}
.bless-workout__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-workout__add {
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) dashed var(--bless-color-border);
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-workout__volume {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
</style>
