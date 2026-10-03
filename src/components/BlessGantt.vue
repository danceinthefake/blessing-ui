<script lang="ts">
export interface BlessGanttTask {
  id: string | number;
  label: string;
  /** ISO dates, `YYYY-MM-DD`; the task covers both days */
  start: string;
  end: string;
  /** 0 to 100 */
  progress?: number;
  /** ids of tasks that must finish first; an arrow runs from each to this one */
  after?: (string | number)[];
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { isoToday } from "../composables/date";

defineOptions({ name: "BlessGantt" });

const props = withDefaults(
  defineProps<{
    /** width of one day in px; under 12 the day numbers are left out */
    dayWidth?: number;
    rowHeight?: number;
    /** first and last day shown; defaults to the span of the tasks */
    from?: string;
    to?: string;
    locale?: string;
    /** width of the label column in px */
    labelWidth?: number;
    /** drag a bar to move it and its ends to resize it; Alt + arrows from the keyboard */
    editable?: boolean;
    label?: string;
  }>(),
  { dayWidth: 28, rowHeight: 36, labelWidth: 160, label: "Schedule" },
);
/** the schedule; with `editable`, moves and resizes come back through here */
const tasks = defineModel<BlessGanttTask[]>("tasks", { required: true });
const selected = defineModel<BlessGanttTask["id"] | null>("selected", { default: null });
const emit = defineEmits<{
  select: [task: BlessGanttTask];
  change: [task: BlessGanttTask, dates: { start: string; end: string }];
}>();

const DAY = 86400000;
const num = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y!, (m ?? 1) - 1, d ?? 1) / DAY;
};
const date = (n: number) => new Date(n * DAY); // UTC midnight
const iso = (n: number) => date(n).toISOString().slice(0, 10);

/** the task being dragged: its days as they would be if let go now */
const drag = ref<{
  id: BlessGanttTask["id"];
  mode: "move" | "start" | "end";
  x0: number;
  s: number;
  e: number;
  delta: number;
} | null>(null);
/** start and end of a task as numbers, with a drag in progress applied */
const span = (t: BlessGanttTask) => {
  let s = num(t.start);
  let e = num(t.end);
  const d = drag.value;
  if (d && d.id === t.id) {
    if (d.mode === "move") ((s = d.s + d.delta), (e = d.e + d.delta));
    else if (d.mode === "start") s = Math.min(d.s + d.delta, d.e);
    else e = Math.max(d.e + d.delta, d.s);
  }
  return { s, e };
};
const first = computed(() =>
  props.from ? num(props.from) : Math.min(...tasks.value.map((t) => span(t).s), num(isoToday())),
);
const last = computed(() =>
  props.to ? num(props.to) : Math.max(...tasks.value.map((t) => span(t).e), first.value),
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
  const v = span(t);
  const s = Math.max(v.s, first.value);
  const e = Math.min(v.e, last.value);
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
const describe = (t: BlessGanttTask) => {
  const v = span(t);
  const waits = (t.after ?? [])
    .map((id) => tasks.value.find((x) => x.id === id)?.label)
    .filter(Boolean);
  return (
    `${t.label}: ${dayFmt.value.format(date(v.s))} to ${dayFmt.value.format(date(v.e))}` +
    (t.progress != null ? `, ${pct(t)}% done` : "") +
    (waits.length ? `, after ${waits.join(" and ")}` : "")
  );
};

/** elbow arrows from the end of each task a task waits for to its start */
const arrows = computed(() => {
  const out: string[] = [];
  const rh = props.rowHeight;
  tasks.value.forEach((t, row) => {
    for (const id of t.after ?? []) {
      const pr = tasks.value.findIndex((x) => x.id === id);
      if (pr < 0) continue;
      const a = bar(tasks.value[pr]!);
      const b = bar(t);
      const x1 = parseFloat(a.left) + parseFloat(a.width);
      const x2 = parseFloat(b.left);
      const y1 = pr * rh + rh / 2;
      const y2 = row * rh + rh / 2;
      const ym = y1 + (y2 > y1 ? rh / 2 : -rh / 2);
      out.push(
        x2 >= x1 + 12
          ? `M${x1} ${y1}H${x1 + 6}V${y2}H${x2 - 1}`
          : `M${x1} ${y1}H${x1 + 6}V${ym}H${x2 - 8}V${y2}H${x2 - 1}`,
      );
    }
  });
  return out;
});

// --- editing: drag the bar to move it, an end to resize it ---
const live = ref("");
let swallow = false;
function down(t: BlessGanttTask, mode: "move" | "start" | "end", e: PointerEvent) {
  if (!props.editable || e.button) return;
  e.stopPropagation();
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  drag.value = { id: t.id, mode, x0: e.clientX, s: num(t.start), e: num(t.end), delta: 0 };
}
function move(e: PointerEvent) {
  const d = drag.value;
  if (!d) return;
  d.delta = Math.round((e.clientX - d.x0) / props.dayWidth);
}
function release() {
  const d = drag.value;
  if (!d) return;
  drag.value = null;
  swallow = d.delta !== 0; // the click that ends a drag must not toggle the selection
  if (d.delta === 0) return;
  const t = tasks.value.find((x) => x.id === d.id)!;
  const v =
    d.mode === "move"
      ? { s: d.s + d.delta, e: d.e + d.delta }
      : d.mode === "start"
        ? { s: Math.min(d.s + d.delta, d.e), e: d.e }
        : { s: d.s, e: Math.max(d.e + d.delta, d.s) };
  commit(t, v.s, v.e);
}
function commit(t: BlessGanttTask, s: number, e: number) {
  const dates = { start: iso(s), end: iso(e) };
  tasks.value = tasks.value.map((x) => (x.id === t.id ? { ...x, ...dates } : x));
  emit("change", { ...t, ...dates }, dates);
  live.value = `${t.label}: ${dayFmt.value.format(date(s))} to ${dayFmt.value.format(date(e))}`;
}

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
            ? tasks.value.length - 1
            : null;
  if (to != null) {
    e.preventDefault();
    const n = Math.min(tasks.value.length - 1, Math.max(0, to));
    stop.value = n;
    root.value?.querySelectorAll<HTMLElement>(".bless-gantt__bar")[n]?.focus();
  } else if (props.editable && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault();
    const t = tasks.value[i]!;
    const d = e.key === "ArrowRight" ? 1 : -1;
    // Alt+arrow moves the task a day; Alt+Shift+arrow moves its end (never before its start)
    if (e.shiftKey) commit(t, num(t.start), Math.max(num(t.start), num(t.end) + d));
    else commit(t, num(t.start) + d, num(t.end) + d);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    pick(tasks.value[i]!);
  }
}
function pick(t: BlessGanttTask) {
  if (swallow) return void (swallow = false);
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
            <svg
              v-if="arrows.length"
              class="bless-gantt__arrows"
              :width="width"
              :height="tasks.length * rowHeight"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="bless-gantt-head"
                  viewBox="0 0 8 8"
                  refX="7"
                  refY="4"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0 0L8 4L0 8z" fill="currentColor" />
                </marker>
              </defs>
              <path v-for="(d, k) in arrows" :key="k" :d="d" marker-end="url(#bless-gantt-head)" />
            </svg>
            <button
              v-for="(t, i) in tasks"
              :key="t.id"
              type="button"
              class="bless-gantt__bar"
              :class="{
                'bless-gantt__bar--on': selected === t.id,
                'bless-gantt__bar--edit': editable,
                'bless-gantt__bar--drag': drag?.id === t.id,
              }"
              :style="{ ...bar(t), top: `${i * rowHeight + 6}px`, height: `${rowHeight - 12}px` }"
              :tabindex="i === stop ? 0 : -1"
              :aria-label="describe(t)"
              :aria-pressed="selected === t.id"
              @click="((stop = i), pick(t))"
              @focus="stop = i"
              @keydown="onKey(i, $event)"
              @pointerdown="down(t, 'move', $event)"
              @pointermove="move"
              @pointerup="release"
              @pointercancel="release"
            >
              <template v-if="editable">
                <span
                  class="bless-gantt__grip bless-gantt__grip--start"
                  aria-hidden="true"
                  @pointerdown="down(t, 'start', $event)"
                  @pointermove="move"
                  @pointerup="release"
                  @pointercancel="release"
                ></span>
                <span
                  class="bless-gantt__grip bless-gantt__grip--end"
                  aria-hidden="true"
                  @pointerdown="down(t, 'end', $event)"
                  @pointermove="move"
                  @pointerup="release"
                  @pointercancel="release"
                ></span>
              </template>
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
    <span class="bless-gantt__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-gantt {
  position: relative;
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
.bless-gantt__arrows {
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: var(--bless-color-text);
}
.bless-gantt__arrows > path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
}
.bless-gantt__bar--edit {
  cursor: grab;
  touch-action: none;
}
.bless-gantt__bar--drag {
  cursor: grabbing;
  opacity: 0.85;
}
.bless-gantt__grip {
  position: absolute;
  inset-block: 0;
  width: 8px;
  cursor: ew-resize;
  background: color-mix(in srgb, var(--bless-color-text) 25%, transparent);
}
.bless-gantt__grip--start {
  inset-inline-start: 0;
}
.bless-gantt__grip--end {
  inset-inline-end: 0;
}
.bless-gantt__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
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
