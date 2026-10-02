<script lang="ts">
export interface BlessGanttTask {
  id: string | number;
  label: string;
  /** ISO dates, `YYYY-MM-DD`; the task covers both days */
  start: string;
  end: string;
  /** 0 to 100 */
  progress?: number;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { isoToday } from "../composables/date";

defineOptions({ name: "BlessGantt" });

// ponytail: read-only. Dragging bars to move or resize them comes later, on the same pointer
// approach as BlessCropper; for now `select` is the only interaction.
const props = withDefaults(
  defineProps<{
    tasks: BlessGanttTask[];
    /** width of one day in px; under 12 the day numbers are left out */
    dayWidth?: number;
    rowHeight?: number;
    /** first and last day shown; defaults to the span of the tasks */
    from?: string;
    to?: string;
    locale?: string;
    /** width of the label column in px */
    labelWidth?: number;
    label?: string;
  }>(),
  { dayWidth: 28, rowHeight: 36, labelWidth: 160, label: "Schedule" },
);
const selected = defineModel<BlessGanttTask["id"] | null>("selected", { default: null });
const emit = defineEmits<{ select: [task: BlessGanttTask] }>();

const DAY = 86400000;
const num = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y!, (m ?? 1) - 1, d ?? 1) / DAY;
};
const date = (n: number) => new Date(n * DAY); // UTC midnight
const first = computed(() =>
  props.from ? num(props.from) : Math.min(...props.tasks.map((t) => num(t.start)), num(isoToday())),
);
const last = computed(() =>
  props.to ? num(props.to) : Math.max(...props.tasks.map((t) => num(t.end)), first.value),
);
const days = computed(() => Math.max(1, last.value - first.value + 1));
const width = computed(() => days.value * props.dayWidth);

const fmt = (o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(props.locale, { ...o, timeZone: "UTC" });
const monthFmt = computed(() => fmt({ month: "long", year: "numeric" }));
const dayFmt = computed(() => fmt({ month: "short", day: "numeric" }));

const months = computed(() => {
  const out: { text: string; left: number; width: number }[] = [];
  for (let i = 0; i < days.value; i++) {
    const d = date(first.value + i);
    if (!out.length || d.getUTCDate() === 1)
      out.push({ text: monthFmt.value.format(d), left: i * props.dayWidth, width: 0 });
    out.at(-1)!.width += props.dayWidth;
  }
  return out;
});
const ticks = computed(() =>
  props.dayWidth < 12
    ? []
    : Array.from({ length: days.value }, (_, i) => {
        const d = date(first.value + i);
        const dow = d.getUTCDay();
        return { n: d.getUTCDate(), weekend: dow === 0 || dow === 6 };
      }),
);
const bar = (t: BlessGanttTask) => {
  const s = Math.max(num(t.start), first.value);
  const e = Math.min(num(t.end), last.value);
  return {
    left: `${(s - first.value) * props.dayWidth}px`,
    width: `${Math.max(1, e - s + 1) * props.dayWidth}px`,
  };
};
const todayLeft = computed(() => {
  const n = num(isoToday());
  return n >= first.value && n <= last.value ? (n - first.value + 0.5) * props.dayWidth : null;
});
const pct = (t: BlessGanttTask) => Math.min(100, Math.max(0, t.progress ?? 0));
const describe = (t: BlessGanttTask) =>
  `${t.label}: ${dayFmt.value.format(date(num(t.start)))} to ${dayFmt.value.format(date(num(t.end)))}` +
  (t.progress != null ? `, ${pct(t)}% done` : "");

// one tab stop on the bars, arrows move between them
const root = ref<HTMLElement>();
const stop = ref(0);
function onKey(i: number, e: KeyboardEvent) {
  const to =
    e.key === "ArrowDown"
      ? i + 1
      : e.key === "ArrowUp"
        ? i - 1
        : e.key === "Home"
          ? 0
          : e.key === "End"
            ? props.tasks.length - 1
            : null;
  if (to != null) {
    e.preventDefault();
    const n = Math.min(props.tasks.length - 1, Math.max(0, to));
    stop.value = n;
    root.value?.querySelectorAll<HTMLElement>(".bless-gantt__bar")[n]?.focus();
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    pick(props.tasks[i]!);
  }
}
function pick(t: BlessGanttTask) {
  selected.value = selected.value === t.id ? null : t.id;
  emit("select", t);
}
</script>

<template>
  <div ref="root" class="bless-gantt" role="group" :aria-label="label">
    <div class="bless-gantt__scroll">
      <div class="bless-gantt__body" :style="{ '--bless-gantt-label': `${labelWidth}px` }">
        <div class="bless-gantt__labels">
          <div class="bless-gantt__corner" :style="{ height: '56px' }"></div>
          <div
            v-for="t in tasks"
            :key="t.id"
            class="bless-gantt__label"
            :style="{ height: `${rowHeight}px` }"
            :title="t.label"
          >
            {{ t.label }}
          </div>
        </div>
        <div class="bless-gantt__plot" :style="{ width: `${width}px` }">
          <div class="bless-gantt__head" aria-hidden="true">
            <div class="bless-gantt__months">
              <span
                v-for="m in months"
                :key="m.left"
                class="bless-gantt__month"
                :style="{ left: `${m.left}px`, width: `${m.width}px` }"
                >{{ m.text }}</span
              >
            </div>
            <div v-if="ticks.length" class="bless-gantt__days">
              <span
                v-for="(d, i) in ticks"
                :key="i"
                class="bless-gantt__day"
                :class="{ 'bless-gantt__day--weekend': d.weekend }"
                :style="{ width: `${dayWidth}px` }"
                >{{ d.n }}</span
              >
            </div>
          </div>
          <div
            class="bless-gantt__rows"
            :style="{
              height: `${tasks.length * rowHeight}px`,
              backgroundSize: `${dayWidth}px 100%`,
            }"
          >
            <span
              v-if="todayLeft != null"
              class="bless-gantt__today"
              aria-hidden="true"
              :style="{ left: `${todayLeft}px` }"
            ></span>
            <button
              v-for="(t, i) in tasks"
              :key="t.id"
              type="button"
              class="bless-gantt__bar"
              :class="{ 'bless-gantt__bar--on': selected === t.id }"
              :style="{ ...bar(t), top: `${i * rowHeight + 6}px`, height: `${rowHeight - 12}px` }"
              :tabindex="i === stop ? 0 : -1"
              :aria-label="describe(t)"
              :aria-pressed="selected === t.id"
              @click="((stop = i), pick(t))"
              @focus="stop = i"
              @keydown="onKey(i, $event)"
            >
              <span
                v-if="t.progress != null"
                class="bless-gantt__done"
                :style="{ width: `${pct(t)}%` }"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bless-gantt {
  min-width: 0; /* a flex/grid parent must not stretch to the chart; the scroll box scrolls */
  max-width: 100%;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-gantt__scroll {
  overflow: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-gantt__body {
  display: flex;
  width: max-content;
  min-width: 100%;
}
.bless-gantt__labels {
  position: sticky;
  inset-inline-start: 0;
  z-index: 2;
  flex: none;
  width: var(--bless-gantt-label);
  background: var(--bless-color-bg);
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-gantt__label {
  box-sizing: border-box;
  padding: 0 var(--bless-space-3);
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-gantt__plot {
  position: relative;
  flex: none;
}
.bless-gantt__head {
  height: 56px;
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-gantt__months {
  position: relative;
  height: 28px;
}
.bless-gantt__month {
  position: absolute;
  top: 0;
  box-sizing: border-box;
  padding: var(--bless-space-2) var(--bless-space-2) 0;
  overflow: hidden;
  white-space: nowrap;
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
  height: 100%;
}
.bless-gantt__days {
  display: flex;
  height: 28px;
}
.bless-gantt__day {
  flex: none;
  box-sizing: border-box;
  padding-top: var(--bless-space-2);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.bless-gantt__day--weekend {
  background: var(--bless-color-surface);
}
.bless-gantt__rows {
  position: relative;
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  background-image: linear-gradient(to right, var(--bless-color-border) 1px, transparent 1px);
}
.bless-gantt__today {
  position: absolute;
  inset-block: 0;
  width: 2px;
  background: var(--bless-color-accent);
  pointer-events: none;
}
.bless-gantt__bar {
  position: absolute;
  box-sizing: border-box;
  padding: 0;
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-text);
  background: var(--bless-color-bg);
  cursor: pointer;
}
.bless-gantt__done {
  display: block;
  height: 100%;
  background: var(--bless-color-text);
}
.bless-gantt__bar:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-gantt__bar--on {
  border-color: var(--bless-color-accent);
  outline: 2px solid var(--bless-color-accent);
}
</style>
