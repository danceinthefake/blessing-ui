<template>
  <section class="bless-evcal" :aria-label="label">
    <header class="bless-evcal__head">
      <div class="bless-evcal__title" aria-live="polite">{{ title }}</div>
      <BlessButton
        size="sm"
        variant="outline"
        @click="
          anchor = today;
          open = undefined;
        "
        >{{ text.today }}</BlessButton
      >
      <BlessButton size="sm" variant="outline" icon :aria-label="text.prev" @click="go(-1)">
        <span aria-hidden="true" class="bless-evcal__arrow">‹</span>
      </BlessButton>
      <BlessButton size="sm" variant="outline" icon :aria-label="text.next" @click="go(1)">
        <span aria-hidden="true" class="bless-evcal__arrow">›</span>
      </BlessButton>
    </header>
    <table class="bless-evcal__grid">
      <thead>
        <tr>
          <th v-for="w in weekdays" :key="w.long" scope="col">
            <abbr :title="w.long">{{ w.short }}</abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]">
          <td
            v-for="d in week"
            :key="d"
            class="bless-evcal__day"
            :class="{
              'bless-evcal__day--out': !inMonth(d),
              'bless-evcal__day--today': d === today,
            }"
          >
            <span class="bless-evcal__num" aria-hidden="true">{{ dayNum(d) }}</span>
            <span class="bless-sr">{{ dayLabel.format(fromISO(d)) }}</span>
            <ul v-if="byDay.get(d)" role="list" class="bless-evcal__events">
              <li v-for="e in shown(d)" :key="e.id">
                <button
                  type="button"
                  class="bless-evcal__event"
                  :class="{ 'bless-evcal__event--allday': e.start === undefined }"
                  :style="{ '--_c': chartColor(e.color, 0) }"
                  @click="emit('select', e)"
                >
                  <span v-if="e.start !== undefined" class="bless-evcal__time">{{
                    fmtTime(e.start, locale)
                  }}</span>
                  {{ e.title }}
                </button>
              </li>
              <li v-if="hidden(d) > 0 || open === d">
                <button
                  type="button"
                  class="bless-evcal__more"
                  @click="open = open === d ? undefined : d"
                >
                  {{ open === d ? text.less : text.more(hidden(d)) }}
                </button>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { addDays, addMonths, fromISO, isoToday, toISO } from "../composables/date";
import { fmtTime, weekOf } from "../composables/schedule";
import { useLabelPack } from "../composables/useLabels";
import { chartColor } from "./chart";
import BlessButton from "./BlessButton.vue";
import "./sr.css";

defineOptions({ name: "BlessEventCalendar" });
const pack = useLabelPack("BlessEventCalendar");

/** An event on one day. With no `start`, it is an event for the whole day. Fits `BlessScheduleEvent`. */
export interface BlessCalendarEvent {
  id: string;
  title: string;
  /** `YYYY-MM-DD` */
  date: string;
  /** minutes after midnight, local time */
  start?: number;
  end?: number;
  /** a token name or any CSS color; default: the first chart color */
  color?: string;
}

const props = withDefaults(
  defineProps<{
    events: BlessCalendarEvent[];
    /** 0 = Sunday, 1 = Monday */
    weekStart?: 0 | 1;
    /** the most events in a day before "+n more" */
    max?: number;
    locale?: string;
    label?: string;
    labels?: Partial<{
      prev: string;
      next: string;
      today: string;
      more: (n: number) => string;
      less: string;
    }>;
  }>(),
  { weekStart: 1, max: 3, locale: "en", label: "Calendar" },
);
const emit = defineEmits<{ select: [event: BlessCalendarEvent] }>();
/** any day in the month shown */
const anchor = defineModel<string | null>("date", { default: null });

const text = computed(() => ({
  prev: "Previous month",
  next: "Next month",
  today: "Today",
  more: (n: number) => `+${n} more`,
  less: "Show less",
  ...pack(),
  ...props.labels,
}));

// the clock is read after mount, so a server-rendered page and its first client render agree
const today = ref("");
onMounted(() => {
  today.value = isoToday();
  if (!anchor.value) anchor.value = props.events[0]?.date ?? today.value;
});
const month = computed(() => (anchor.value ? fromISO(anchor.value) : undefined));
const title = computed(() =>
  month.value
    ? new Intl.DateTimeFormat(props.locale, { month: "long", year: "numeric" }).format(month.value)
    : "",
);
const weekdays = computed(() => {
  const f = new Intl.DateTimeFormat(props.locale, { weekday: "short" });
  const long = new Intl.DateTimeFormat(props.locale, { weekday: "long" });
  // 2026-11-01 is a Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 10, 1 + ((i + props.weekStart) % 7));
    return { short: f.format(d), long: long.format(d) };
  });
});

// whole weeks from the week of the 1st to the week of the last day
const weeks = computed(() => {
  const m = month.value;
  if (!m) return [];
  const first = fromISO(weekOf(toISO(new Date(m.getFullYear(), m.getMonth(), 1)), props.weekStart));
  const last = new Date(m.getFullYear(), m.getMonth() + 1, 0);
  const out: string[][] = [];
  for (let d = first; d <= last; d = addDays(d, 7))
    out.push(Array.from({ length: 7 }, (_, i) => toISO(addDays(d, i))));
  return out;
});
const inMonth = (iso: string) => month.value && fromISO(iso).getMonth() === month.value.getMonth();

const byDay = computed(() => {
  const map = new Map<string, BlessCalendarEvent[]>();
  for (const e of props.events) map.set(e.date, [...(map.get(e.date) ?? []), e]);
  // whole-day events first, then by start time
  for (const list of map.values()) list.sort((a, b) => (a.start ?? -1) - (b.start ?? -1));
  return map;
});
const open = ref<string>();
const shown = (iso: string) => {
  const list = byDay.value.get(iso) ?? [];
  return open.value === iso || list.length <= props.max ? list : list.slice(0, props.max - 1);
};
const hidden = (iso: string) => (byDay.value.get(iso)?.length ?? 0) - shown(iso).length;

function go(n: number) {
  if (month.value) anchor.value = toISO(addMonths(month.value, n));
  open.value = undefined;
}
const dayNum = (iso: string) => fromISO(iso).getDate();
const dayLabel = computed(
  () => new Intl.DateTimeFormat(props.locale, { weekday: "long", day: "numeric", month: "long" }),
);
</script>

<style>
.bless-evcal {
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-evcal__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  margin-block-end: var(--bless-space-3);
}
.bless-evcal__title {
  margin-inline-end: auto;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
[dir="rtl"] .bless-evcal__arrow {
  display: inline-block;
  scale: -1 1;
}
.bless-evcal__grid {
  inline-size: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.bless-evcal__grid th {
  padding: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text-muted);
  text-align: start;
}
.bless-evcal__grid abbr {
  text-decoration: none;
}
.bless-evcal__day {
  block-size: 6.5rem;
  padding: var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
  vertical-align: top;
}
.bless-evcal__day--out {
  background: var(--bless-color-surface-2);
}
.bless-evcal__num {
  display: inline-grid;
  place-items: center;
  min-inline-size: 1.6em;
  block-size: 1.6em;
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
.bless-evcal__day--today .bless-evcal__num {
  border-radius: var(--bless-radius-petal);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-weight: var(--bless-font-weight-bold);
}
.bless-evcal__events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
}
.bless-evcal__event,
.bless-evcal__more {
  display: block;
  inline-size: 100%;
  padding: 1px var(--bless-space-1);
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.bless-evcal__event {
  border-inline-start: 3px solid var(--_c);
}
.bless-evcal__event--allday {
  background: color-mix(in srgb, var(--_c) 18%, var(--bless-color-bg));
}
.bless-evcal__event:hover {
  background: color-mix(in srgb, var(--_c) 28%, var(--bless-color-bg));
}
/* the time takes the text color of the event: muted text fails contrast on a tinted event */
.bless-evcal__time {
  font-variant-numeric: tabular-nums;
}
.bless-evcal__more {
  color: var(--bless-color-text-muted);
}
.bless-evcal__more:hover {
  color: var(--bless-color-text);
  text-decoration: underline;
}
.bless-evcal__event:focus-visible,
.bless-evcal__more:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
@media (max-width: 640px) {
  .bless-evcal__day {
    block-size: 4.5rem;
  }
  .bless-evcal__time {
    display: none;
  }
}
</style>
