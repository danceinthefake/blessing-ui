<script lang="ts">
export type BlessRepeatFreq = "daily" | "weekly" | "monthly" | "yearly";
export interface BlessRecurrence {
  freq: BlessRepeatFreq;
  /** every `interval` days, weeks, months, or years */
  interval: number;
  /** the days of a weekly rule, 0 Monday to 6 Sunday */
  days?: number[];
  /** the end: never, after a count, or on a date (YYYY-MM-DD) */
  end: { type: "never" } | { type: "count"; count: number } | { type: "until"; until: string };
}

const CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
/** The rule as an RRULE of RFC 5545 (iCalendar), for calendar apps and servers. */
export function toRRule(r: BlessRecurrence): string {
  const parts = [`FREQ=${r.freq.toUpperCase()}`];
  if (r.interval > 1) parts.push(`INTERVAL=${r.interval}`);
  if (r.freq === "weekly" && r.days?.length)
    parts.push(
      `BYDAY=${[...r.days]
        .sort()
        .map((d) => CODES[d])
        .join(",")}`,
    );
  if (r.end.type === "count") parts.push(`COUNT=${r.end.count}`);
  if (r.end.type === "until") parts.push(`UNTIL=${r.end.until.replaceAll("-", "")}`);
  return parts.join(";");
}
</script>

<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessRecurrencePicker" });
const pack = useLabelPack("BlessRecurrencePicker");

const props = withDefaults(
  defineProps<{
    /** the language of the day names and the date, for example `id` */
    locale?: string;
    labels?: Partial<{
      every: string;
      unit: (freq: BlessRepeatFreq, n: number) => string;
      on: string;
      ends: string;
      never: string;
      after: string;
      times: string;
      onDate: string;
      /** the rule in one sentence */ summary: (parts: {
        every: string;
        days: string;
        end: string;
      }) => string;
      everyUnit: (n: number, unit: string) => string;
      endCount: (n: number) => string;
      endUntil: (date: string) => string;
    }>;
  }>(),
  { locale: "en" },
);
const rule = defineModel<BlessRecurrence>({
  default: () => ({ freq: "weekly", interval: 1, days: [0], end: { type: "never" } }),
});

const text = computed(() => ({
  every: "Repeat every",
  unit: (f: BlessRepeatFreq, n: number) =>
    ({ daily: "day", weekly: "week", monthly: "month", yearly: "year" })[f] + (n === 1 ? "" : "s"),
  on: "On",
  ends: "Ends",
  never: "Never",
  after: "After",
  times: "times",
  onDate: "On",
  summary: (p: { every: string; days: string; end: string }) =>
    [p.every, p.days && `on ${p.days}`, p.end].filter(Boolean).join(", "),
  everyUnit: (n: number, u: string) => (n === 1 ? `Every ${u}` : `Every ${n} ${u}`),
  endCount: (n: number) => (n === 1 ? "once" : `${n} times`),
  endUntil: (d: string) => `until ${d}`,
  ...pack(),
  ...props.labels,
}));

const uid = useId();
// 5 Jan 2026 is a Monday: the names of the days in the locale, Monday first
const dayNames = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 0, 5 + i));
    const f = (weekday: "short" | "long") =>
      new Intl.DateTimeFormat(props.locale, { weekday, timeZone: "UTC" }).format(d);
    return { short: f("short"), long: f("long") };
  }),
);
const list = (items: string[]) =>
  new Intl.ListFormat(props.locale, { type: "conjunction" }).format(items);
const date = (iso: string) =>
  new Intl.DateTimeFormat(props.locale, { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const set = (patch: Partial<BlessRecurrence>) => (rule.value = { ...rule.value, ...patch });
function toggleDay(i: number) {
  const days = new Set(rule.value.days ?? []);
  if (days.has(i) && days.size > 1) days.delete(i);
  else days.add(i);
  set({ days: [...days].sort() });
}
const sentence = computed(() => {
  const r = rule.value;
  const every = text.value.everyUnit(r.interval, text.value.unit(r.freq, r.interval));
  const days =
    r.freq === "weekly" && r.days?.length ? list(r.days.map((d) => dayNames.value[d]!.long)) : "";
  const end =
    r.end.type === "count"
      ? text.value.endCount(r.end.count)
      : r.end.type === "until"
        ? text.value.endUntil(date(r.end.until))
        : "";
  return text.value.summary({ every, days, end });
});
const FREQS: BlessRepeatFreq[] = ["daily", "weekly", "monthly", "yearly"];
const today = new Date().toISOString().slice(0, 10);
</script>

<template>
  <fieldset class="bless-repeat">
    <div class="bless-repeat__row">
      <label :for="`${uid}-n`">{{ text.every }}</label>
      <input
        :id="`${uid}-n`"
        class="bless-repeat__field bless-repeat__num"
        type="number"
        min="1"
        max="99"
        :value="rule.interval"
        @change="
          set({
            interval: Math.min(
              99,
              Math.max(1, Math.round(+($event.target as HTMLInputElement).value) || 1),
            ),
          })
        "
      />
      <select
        class="bless-repeat__field"
        :aria-label="text.every"
        :value="rule.freq"
        @change="set({ freq: ($event.target as HTMLSelectElement).value as BlessRepeatFreq })"
      >
        <option v-for="f in FREQS" :key="f" :value="f">{{ text.unit(f, rule.interval) }}</option>
      </select>
    </div>
    <div v-if="rule.freq === 'weekly'" class="bless-repeat__row" role="group" :aria-label="text.on">
      <span aria-hidden="true">{{ text.on }}</span>
      <span class="bless-repeat__days">
        <button
          v-for="(d, i) in dayNames"
          :key="i"
          type="button"
          class="bless-repeat__day"
          :aria-pressed="!!rule.days?.includes(i)"
          :title="d.long"
          @click="toggleDay(i)"
        >
          <span aria-hidden="true">{{ d.short }}</span>
          <span class="bless-sr">{{ d.long }}</span>
        </button>
      </span>
    </div>
    <div class="bless-repeat__row bless-repeat__end" role="radiogroup" :aria-label="text.ends">
      <span aria-hidden="true">{{ text.ends }}</span>
      <span class="bless-repeat__ends">
        <label class="bless-repeat__choice">
          <input
            type="radio"
            :name="`${uid}-end`"
            :checked="rule.end.type === 'never'"
            @change="set({ end: { type: 'never' } })"
          />
          {{ text.never }}
        </label>
        <label class="bless-repeat__choice">
          <input
            type="radio"
            :name="`${uid}-end`"
            :checked="rule.end.type === 'count'"
            @change="set({ end: { type: 'count', count: 10 } })"
          />
          {{ text.after }}
          <input
            class="bless-repeat__field bless-repeat__num"
            type="number"
            min="1"
            :aria-label="`${text.after} … ${text.times}`"
            :disabled="rule.end.type !== 'count'"
            :value="rule.end.type === 'count' ? rule.end.count : 10"
            @change="
              set({
                end: {
                  type: 'count',
                  count: Math.max(1, Math.round(+($event.target as HTMLInputElement).value) || 1),
                },
              })
            "
          />
          {{ text.times }}
        </label>
        <label class="bless-repeat__choice">
          <input
            type="radio"
            :name="`${uid}-end`"
            :checked="rule.end.type === 'until'"
            @change="set({ end: { type: 'until', until: today } })"
          />
          {{ text.onDate }}
          <input
            class="bless-repeat__field"
            type="date"
            :aria-label="text.ends"
            :disabled="rule.end.type !== 'until'"
            :value="rule.end.type === 'until' ? rule.end.until : ''"
            @change="
              ($event.target as HTMLInputElement).value &&
              set({ end: { type: 'until', until: ($event.target as HTMLInputElement).value } })
            "
          />
        </label>
      </span>
    </div>
    <p class="bless-repeat__summary" role="status">{{ sentence }}</p>
  </fieldset>
</template>

<style>
.bless-repeat {
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  border: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-repeat__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-repeat__row > :first-child {
  min-inline-size: 6.5rem;
  font-weight: var(--bless-font-weight-bold);
}
.bless-repeat__end {
  align-items: flex-start;
}
.bless-repeat__field {
  min-block-size: 2.1rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-repeat__field:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-repeat__field:disabled {
  opacity: 0.5;
}
.bless-repeat__num {
  inline-size: 4.5rem;
}
.bless-repeat__days {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-repeat__day {
  min-inline-size: 2.6rem;
  min-block-size: 2.1rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
/* a chosen day is filled, not only tinted */
.bless-repeat__day[aria-pressed="true"] {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-repeat__day:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-repeat__ends {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-repeat__choice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-repeat__choice input[type="radio"] {
  accent-color: var(--bless-color-accent);
}
.bless-repeat__summary {
  margin: 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
</style>
