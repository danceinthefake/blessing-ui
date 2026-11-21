<template>
  <div class="bless-presetrange">
    <div class="bless-presetrange__presets" role="group" :aria-label="text.presets">
      <button
        v-for="p in list"
        :key="p.label"
        type="button"
        class="bless-presetrange__preset"
        :aria-pressed="same(p)"
        @click="range = [...p.range]"
      >
        {{ p.label }}
      </button>
    </div>
    <div class="bless-presetrange__main">
      <p class="bless-presetrange__summary" role="status">{{ summary }}</p>
      <BlessCalendar
        :key="month"
        v-model="range as never"
        range
        :month
        :locale
        :week-start="weekStart"
      />
    </div>
  </div>
</template>

<script lang="ts">
export interface BlessRangePreset {
  label: string;
  /** [start, end] as YYYY-MM-DD */
  range: [string, string];
}
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
/** The common presets for a day: today, yesterday, the last 7 and 30 days, this month, and last month. */
export function defaultPresets(
  today: string,
  names: Record<"today" | "yesterday" | "last7" | "last30" | "thisMonth" | "lastMonth", string>,
): BlessRangePreset[] {
  const t = Date.parse(`${today}T00:00:00Z`);
  const day = 86_400_000;
  const d = new Date(t);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  return [
    { label: names.today, range: [today, today] },
    { label: names.yesterday, range: [iso(t - day), iso(t - day)] },
    { label: names.last7, range: [iso(t - 6 * day), today] },
    { label: names.last30, range: [iso(t - 29 * day), today] },
    { label: names.thisMonth, range: [iso(Date.UTC(y, m, 1)), today] },
    { label: names.lastMonth, range: [iso(Date.UTC(y, m - 1, 1)), iso(Date.UTC(y, m, 0))] },
  ];
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessCalendar from "./BlessCalendar.vue";

defineOptions({ name: "BlessPresetRange" });
const pack = useLabelPack("BlessPresetRange");

const props = withDefaults(
  defineProps<{
    /** your own presets in place of the common ones */
    presets?: BlessRangePreset[];
    /** today, as YYYY-MM-DD; default: today of the reader, after mount */
    today?: string;
    locale?: string;
    weekStart?: 0 | 1;
    labels?: Partial<{
      presets: string;
      today: string;
      yesterday: string;
      last7: string;
      last30: string;
      thisMonth: string;
      lastMonth: string;
      none: string;
    }>;
  }>(),
  { locale: "en", weekStart: 1 },
);
/** the range as [start, end], YYYY-MM-DD */
const range = defineModel<[string, string] | undefined>();

const text = computed(() => ({
  presets: "Quick ranges",
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
  thisMonth: "This month",
  lastMonth: "Last month",
  none: "No dates chosen",
  ...pack(),
  ...props.labels,
}));
// today of the reader is known only in the browser
const local = ref<string>();
onMounted(() => {
  const d = new Date();
  local.value = iso(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
});
const day = computed(() => props.today ?? local.value);
const list = computed(
  () => props.presets ?? (day.value ? defaultPresets(day.value, text.value) : []),
);
const same = (p: BlessRangePreset) =>
  range.value?.[0] === p.range[0] && range.value?.[1] === p.range[1];
const summary = computed(() => {
  if (!range.value) return text.value.none;
  // two dates and a dash, not formatRange: Node and the browsers space its output in different ways,
  // so the server render and the page would not agree
  const f = new Intl.DateTimeFormat(props.locale, { dateStyle: "medium", timeZone: "UTC" });
  const [a, b] = range.value.map((x) => f.format(new Date(`${x}T00:00:00Z`)));
  return a === b ? a! : `${a} – ${b}`;
});
// the calendar opens on the month of the start, so a preset in another month shows
const month = computed(() => range.value?.[0].slice(0, 7));
</script>

<style>
.bless-presetrange {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-presetrange__presets {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 9rem;
}
.bless-presetrange__preset {
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  border-inline-start: 3px solid transparent;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.bless-presetrange__preset:hover {
  background: var(--bless-color-surface-2);
}
.bless-presetrange__preset:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
/* the preset that matches the range has a bar and bold words */
.bless-presetrange__preset[aria-pressed="true"] {
  border-inline-start-color: var(--bless-color-accent);
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-presetrange__main {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-presetrange__summary {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
</style>
