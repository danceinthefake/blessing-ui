<template>
  <section class="bless-meds" :aria-label="text.title">
    <p class="bless-meds__summary" role="status">{{ text.taken(done, doses.length) }}</p>
    <div class="bless-meds__track" aria-hidden="true">
      <span :style="{ inlineSize: `${doses.length ? (done / doses.length) * 100 : 0}%` }" />
    </div>
    <div v-for="s in slots" :key="s.time" class="bless-meds__slot">
      <h3 class="bless-meds__time">{{ s.time }}</h3>
      <label
        v-for="d in s.list"
        :key="d.id"
        class="bless-meds__dose"
        :class="{ 'is-taken': isTaken(d.id), 'is-late': late(d) }"
      >
        <input
          type="checkbox"
          :checked="isTaken(d.id)"
          :aria-label="text.mark(d.medicine, d.time)"
          @change="set(d.id, ($event.target as HTMLInputElement).checked)"
        />
        <span class="bless-meds__main">
          <span class="bless-meds__name">{{ d.medicine }}</span>
          <span class="bless-meds__amount"
            >{{ d.amount }}<template v-if="d.note"> · {{ d.note }}</template></span
          >
        </span>
        <span v-if="late(d)" class="bless-meds__late">{{ text.late }}</span>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessMedicationSchedule" });
const pack = useLabelPack("BlessMedicationSchedule");

export interface BlessDose {
  id: string;
  medicine: string;
  /** how much, for example "1 tablet" or "5 ml" */
  amount: string;
  /** HH:MM */
  time: string;
  /** for example "with food" */
  note?: string;
}

const props = defineProps<{
  doses: BlessDose[];
  /** the time now as HH:MM; with it, a dose that is due and not taken says late */
  now?: string;
  labels?: Partial<{
    title: string;
    late: string;
    taken: (done: number, total: number) => string;
    mark: (medicine: string, time: string) => string;
  }>;
}>();
/** the ids of the doses taken today */
const taken = defineModel<string[]>({ default: () => [] });

const text = computed(() => ({
  title: "Today's medicine",
  late: "late",
  taken: (d: number, t: number) => `${d} of ${t} doses taken`,
  mark: (m: string, t: string) => `${m} at ${t}`,
  ...pack(),
  ...props.labels,
}));
// one group for each time, in order of the day
const slots = computed(() => {
  const map = new Map<string, BlessDose[]>();
  for (const d of [...props.doses].sort((a, b) => a.time.localeCompare(b.time)))
    map.set(d.time, [...(map.get(d.time) ?? []), d]);
  return [...map.entries()].map(([time, list]) => ({ time, list }));
});
const isTaken = (id: string) => taken.value.includes(id);
const late = (d: BlessDose) => !!props.now && d.time < props.now && !isTaken(d.id);
const set = (id: string, on: boolean) =>
  (taken.value = on ? [...taken.value, id] : taken.value.filter((x) => x !== id));
const done = computed(() => props.doses.filter((d) => isTaken(d.id)).length);
</script>

<style>
.bless-meds {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-meds__summary {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-meds__track {
  block-size: 6px;
  background: var(--bless-color-surface-2);
}
.bless-meds__track span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-meds__slot {
  display: grid;
  gap: var(--bless-space-1);
}
.bless-meds__time {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
  letter-spacing: var(--bless-tracking-wide);
}
.bless-meds__dose {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: pointer;
}
.bless-meds__dose input {
  flex: none;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  accent-color: var(--bless-color-accent);
}
.bless-meds__dose input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-meds__main {
  display: grid;
  flex: 1;
}
.bless-meds__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-meds__amount {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
/* a taken dose is struck through; a late one has a dashed red edge and the word */
.bless-meds__dose.is-taken .bless-meds__name {
  text-decoration: line-through;
}
.bless-meds__dose.is-late {
  border: 2px dashed var(--bless-color-danger);
}
.bless-meds__late {
  color: var(--bless-color-danger-text);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-meds {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
