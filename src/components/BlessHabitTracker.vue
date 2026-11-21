<template>
  <div class="bless-habits">
    <table v-if="dates.length" class="bless-habits__table">
      <thead>
        <tr>
          <th scope="col" class="bless-habits__name">{{ text.habit }}</th>
          <th
            v-for="d in dates"
            :key="d"
            scope="col"
            class="bless-habits__day"
            :class="{ 'is-end': d === last }"
          >
            <span>{{ fmt(d, { weekday: "narrow" }) }}</span>
            <span class="bless-habits__date">{{ fmt(d, { day: "numeric" }) }}</span>
            <span class="bless-sr">{{ fmt(d, { dateStyle: "full" }) }}</span>
          </th>
          <th scope="col" class="bless-habits__streak">{{ text.streak }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in habits" :key="h.id">
          <th scope="row" class="bless-habits__name">{{ h.name }}</th>
          <td v-for="d in dates" :key="d" class="bless-habits__cell">
            <input
              type="checkbox"
              class="bless-habits__check"
              :checked="sets[h.id]!.has(d)"
              :aria-label="
                text.mark(h.name, fmt(d, { weekday: 'long', day: 'numeric', month: 'long' }))
              "
              @change="toggle(h.id, d)"
            />
          </td>
          <td class="bless-habits__streak">
            <span aria-hidden="true">{{ streak(sets[h.id]!, last!) }}</span>
            <span class="bless-sr">{{ text.streakOf(streak(sets[h.id]!, last!)) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
export interface BlessHabit {
  id: string;
  name: string;
}

/** The `days` dates that end on `end`, oldest first, as YYYY-MM-DD. */
export function lastDays(end: string, days: number): string[] {
  const t = Date.parse(`${end}T00:00:00Z`);
  return Array.from({ length: days }, (_, i) =>
    new Date(t - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10),
  );
}
/** Days in a row that are done, back from `end`. If `end` is not done yet, the count starts the day before. */
export function streak(done: Set<string>, end: string): number {
  let t = Date.parse(`${end}T00:00:00Z`);
  const key = () => new Date(t).toISOString().slice(0, 10);
  if (!done.has(key())) t -= 86_400_000;
  let n = 0;
  while (done.has(key())) {
    n++;
    t -= 86_400_000;
  }
  return n;
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessHabitTracker" });
const pack = useLabelPack("BlessHabitTracker");

const props = withDefaults(
  defineProps<{
    habits: BlessHabit[];
    /** the number of days to show */
    days?: number;
    /** the last day to show, as YYYY-MM-DD; default: today of the reader */
    end?: string;
    locale?: string;
    labels?: Partial<{
      habit: string;
      streak: string;
      streakOf: (days: number) => string;
      mark: (habit: string, day: string) => string;
    }>;
  }>(),
  { days: 7, locale: "en" },
);
/** the done days of each habit, by id */
const done = defineModel<Record<string, string[]>>("done", { default: () => ({}) });

const text = computed(() => ({
  habit: "Habit",
  streak: "Streak",
  streakOf: (n: number) => `${n} ${n === 1 ? "day" : "days"} in a row`,
  mark: (h: string, d: string) => `${h}, ${d}`,
  ...pack(),
  ...props.labels,
}));
// today of the reader is known only in the browser
const today = ref<string>();
onMounted(() => {
  const d = new Date();
  today.value = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
});
const last = computed(() => props.end ?? today.value);
const dates = computed(() => (last.value ? lastDays(last.value, props.days) : []));
const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(props.locale, { ...o, timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
const sets = computed(() =>
  Object.fromEntries(props.habits.map((h) => [h.id, new Set(done.value[h.id] ?? [])])),
);
function toggle(id: string, day: string) {
  const s = new Set(sets.value[id]);
  if (s.has(day)) s.delete(day);
  else s.add(day);
  done.value = { ...done.value, [id]: [...s].sort() };
}
</script>

<style>
.bless-habits {
  max-inline-size: 100%;
  overflow-x: auto;
  position: relative; /* hidden screen-reader text inside stays in the scroll box */
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-habits__table {
  border-collapse: collapse;
}
.bless-habits__table th,
.bless-habits__table td {
  padding: var(--bless-space-1);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  text-align: center;
}
.bless-habits__table .bless-habits__name {
  min-inline-size: 8rem;
  padding-inline-end: var(--bless-space-3);
  text-align: start;
}
thead .bless-habits__name,
thead .bless-habits__streak {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-habits__day {
  min-inline-size: 2.2rem;
  font-size: var(--bless-text-xs);
  font-weight: normal;
}
.bless-habits__day > span {
  display: block;
}
.bless-habits__day.is-end {
  font-weight: var(--bless-font-weight-bold);
}
.bless-habits__date {
  color: var(--bless-color-text-muted);
}
/* a done day is a filled square with a check; an open day is an empty square */
.bless-habits__check {
  display: grid;
  place-items: center;
  inline-size: 1.6rem;
  block-size: 1.6rem;
  margin: 0 auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  cursor: pointer;
  appearance: none;
}
.bless-habits__check:checked {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
}
.bless-habits__check:checked::after {
  content: "";
  inline-size: 6px;
  block-size: 11px;
  margin-block-start: -2px;
  border: solid var(--bless-color-on-accent);
  border-width: 0 2px 2px 0;
  rotate: 45deg;
}
.bless-habits__check:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
td.bless-habits__streak {
  min-inline-size: 3rem;
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
</style>
