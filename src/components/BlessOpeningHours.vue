<template>
  <section class="bless-hours" :aria-label="text.title">
    <p v-if="state" class="bless-hours__status" :class="state.open ? 'is-open' : 'is-closed'">
      <span class="bless-hours__dot" aria-hidden="true" />{{ status }}
    </p>
    <dl class="bless-hours__week">
      <div
        v-for="(shifts, d) in hours"
        :key="d"
        class="bless-hours__day"
        :class="{ 'is-today': here?.day === d }"
      >
        <dt>
          {{ dayName(d)
          }}<span v-if="here?.day === d" class="bless-hours__today"> · {{ text.today }}</span>
        </dt>
        <dd>
          <template v-if="shifts.length">
            <span v-for="(s, i) in shifts" :key="i">{{ span(s) }}</span>
          </template>
          <span v-else class="bless-hours__closed">{{ text.closed }}</span>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script lang="ts">
export interface BlessShift {
  /** `HH:MM`, 24-hour */
  open: string;
  /** `HH:MM`; a time at or before `open` closes on the next day */
  close: string;
}
/** the shifts of each day, Monday first; an empty day is closed */
export type BlessWeekHours = BlessShift[][];

const mins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
/**
 * Open or closed at a minute of the week (day 0 is Monday), with the next change:
 * the minute the shift closes, or the day and the minute the next shift opens.
 */
export function hoursState(week: BlessWeekHours, day: number, minute: number) {
  const W = 7 * 1440;
  const now = day * 1440 + minute;
  // every shift as a span of week minutes; a shift that ends after midnight runs into the next day
  const spans = week.flatMap((shifts, d) =>
    shifts.map((s) => {
      const start = d * 1440 + mins(s.open);
      const len = (mins(s.close) - mins(s.open) + 1440) % 1440 || 1440;
      return { start, end: start + len };
    }),
  );
  for (const s of spans)
    for (const shift of [0, -W])
      if (now >= s.start + shift && now < s.end + shift)
        return { open: true as const, closes: (s.end + shift) % 1440 };
  const next = spans.map((s) => (s.start - now + W) % W).reduce((a, b) => Math.min(a, b), Infinity);
  if (next === Infinity) return { open: false as const };
  const at = (now + next) % W;
  return { open: false as const, opensDay: Math.floor(at / 1440), opens: at % 1440 };
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessOpeningHours" });
const pack = useLabelPack("BlessOpeningHours");

const props = withDefaults(
  defineProps<{
    hours: BlessWeekHours;
    /** the time zone of the place, for example `Asia/Jakarta`; default: the zone of the reader */
    timeZone?: string;
    /** the language of the days and times, for example `id` */
    locale?: string;
    /** a fixed moment, for example in a test */
    now?: Date | number;
    labels?: Partial<{
      title: string;
      open: string;
      closed: string;
      closesAt: (time: string) => string;
      opensAt: (day: string, time: string) => string;
      today: string;
    }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  title: "Opening hours",
  open: "Open now",
  closed: "Closed",
  closesAt: (t: string) => `closes at ${t}`,
  opensAt: (d: string, t: string) => `opens ${d} at ${t}`,
  today: "today",
  ...pack(),
  ...props.labels,
}));
// 5 Jan 2026 is a Monday
const dayName = (d: number, weekday: "long" | "short" = "long") =>
  new Intl.DateTimeFormat(props.locale, { weekday, timeZone: "UTC" }).format(
    new Date(Date.UTC(2026, 0, 5 + d)),
  );
const clock = (minute: number) =>
  new Intl.DateTimeFormat(props.locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2026, 0, 5, 0, minute)));
const span = (s: BlessShift) => `${clock(mins(s.open))}–${clock(mins(s.close))}`;

// "now" is known only in the browser, so the status shows after mount, or at once with a fixed `now`
const ms = ref<number>();
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (props.now !== undefined) return;
  ms.value = Date.now();
  timer = setInterval(() => (ms.value = Date.now()), 60_000);
});
onBeforeUnmount(() => clearInterval(timer));
const here = computed(() => {
  const at = props.now !== undefined ? +props.now : ms.value;
  if (at === undefined) return undefined;
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
      timeZone: props.timeZone,
    })
      .formatToParts(new Date(at))
      .map((x) => [x.type, x.value]),
  );
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday!);
  return { day, minute: +p.hour! * 60 + +p.minute! };
});
const state = computed(() =>
  here.value ? hoursState(props.hours, here.value.day, here.value.minute) : undefined,
);
const status = computed(() => {
  const s = state.value;
  if (!s) return "";
  if (s.open) return `${text.value.open} · ${text.value.closesAt(clock(s.closes))}`;
  if (s.opensDay === undefined) return text.value.closed;
  const day = s.opensDay === here.value!.day ? text.value.today : dayName(s.opensDay);
  return `${text.value.closed} · ${text.value.opensAt(day, clock(s.opens))}`;
});
</script>

<style>
.bless-hours {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-hours__status {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  margin: 0 0 var(--bless-space-3);
  font-weight: var(--bless-font-weight-bold);
}
/* open is a filled dot, closed a hollow one, so the state shows without color */
.bless-hours__dot {
  inline-size: 10px;
  block-size: 10px;
  border-radius: 50%;
  background: var(--bless-color-success);
}
.is-closed .bless-hours__dot {
  border: 2px solid var(--bless-color-danger);
  background: none;
}
.bless-hours__week {
  display: grid;
  margin: 0;
}
.bless-hours__day {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-4);
  padding: var(--bless-space-1) var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-hours__day.is-today {
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-hours__day dd {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0 var(--bless-space-3);
  margin: 0;
  font-variant-numeric: tabular-nums;
}
.bless-hours__today {
  font-weight: normal;
}
.bless-hours__closed {
  color: var(--bless-color-text-muted);
}
/* today sits on surface-2, where muted text falls under 4.5:1 */
.bless-hours__day.is-today .bless-hours__closed {
  color: var(--bless-color-text);
}
.bless-hours {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
