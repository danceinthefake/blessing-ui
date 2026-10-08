<script lang="ts">
export type { ScheduleEvent as BlessScheduleEvent } from "../composables/schedule";
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId } from "vue";
import { addDays, fromISO, isoToday, toISO } from "../composables/date";
import {
  fmtTime,
  layoutDay,
  moveEvent,
  nextEventId,
  resizeEvent,
  snapTo,
  weekOf,
  type ScheduleEvent,
} from "../composables/schedule";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessScheduler" });

const props = withDefaults(
  defineProps<{
    view?: "day" | "week";
    /** 0 = Sunday, 1 = Monday */
    weekStart?: 0 | 1;
    /** first and last hour shown (0–24) */
    dayStart?: number;
    dayEnd?: number;
    /** minutes events snap to */
    snap?: number;
    /** px per hour */
    hourHeight?: number;
    locale?: string;
    editable?: boolean;
    label?: string;
    labels?: Partial<{
      prev: string;
      next: string;
      today: string;
      add: string;
      remove: string;
      title: string;
      newEvent: string;
      eventName: (title: string, day: string, from: string, to: string) => string;
      moved: (title: string, day: string, from: string, to: string) => string;
      added: (title: string) => string;
      removed: (title: string) => string;
      hint: string;
    }>;
  }>(),
  {
    view: "week",
    weekStart: 1,
    dayStart: 7,
    dayEnd: 20,
    snap: 15,
    hourHeight: 48,
    locale: "en",
    editable: true,
    label: "Schedule",
  },
);
const events = defineModel<ScheduleEvent[]>({ default: () => [] });
/** any day in the period shown */
const anchor = defineModel<string | null>("date", { default: null });
const selected = defineModel<string | null>("selected", { default: null });
const emit = defineEmits<{
  create: [event: ScheduleEvent];
  change: [event: ScheduleEvent];
  remove: [event: ScheduleEvent];
}>();

const text = computed(() => ({
  prev: "Previous",
  next: "Next",
  today: "Today",
  add: "Add event",
  remove: "Remove",
  title: "Title",
  newEvent: "New event",
  eventName: (t: string, d: string, a: string, b: string) => `${t}, ${d}, ${a} to ${b}`,
  moved: (t: string, d: string, a: string, b: string) => `${t}: ${d}, ${a} to ${b}`,
  added: (t: string) => `${t} added`,
  removed: (t: string) => `${t} removed`,
  hint: "Arrow keys move the event, Alt with up or down changes its length, Delete removes it.",
  ...props.labels,
}));

const id = useId();
const hint = `${id}-hint`;
const live = ref("");
const titleInput = ref<HTMLInputElement>();
const cols = ref<HTMLElement>();

// the clock is read after mount, so a server-rendered page and its first client render agree
const first = computed(() => anchor.value ?? events.value[0]?.date ?? null);
const today = ref("");
onMounted(() => {
  today.value = isoToday();
  if (!first.value) anchor.value = today.value;
});

const lo = computed(() => props.dayStart * 60);
const hi = computed(() => props.dayEnd * 60);
const px = (m: number) => ((m - lo.value) / 60) * props.hourHeight;
const height = computed(() => (props.dayEnd - props.dayStart) * props.hourHeight);
const hours = computed(() =>
  Array.from({ length: props.dayEnd - props.dayStart }, (_, i) => props.dayStart + i),
);

const days = computed(() => {
  if (!first.value) return [];
  if (props.view === "day") return [first.value];
  const start = fromISO(weekOf(first.value, props.weekStart));
  return Array.from({ length: 7 }, (_, i) => toISO(addDays(start, i)));
});
const colFmt = computed(
  () => new Intl.DateTimeFormat(props.locale, { weekday: "short", day: "numeric" }),
);
const fullFmt = computed(
  () => new Intl.DateTimeFormat(props.locale, { weekday: "long", day: "numeric", month: "long" }),
);
const rangeFmt = computed(
  () => new Intl.DateTimeFormat(props.locale, { day: "numeric", month: "short", year: "numeric" }),
);
const title = computed(() => {
  const d = days.value;
  if (!d.length) return "";
  return d.length === 1
    ? rangeFmt.value.format(fromISO(d[0]!))
    : `${rangeFmt.value.format(fromISO(d[0]!))} – ${rangeFmt.value.format(fromISO(d.at(-1)!))}`;
});
const t = (m: number) => fmtTime(m, props.locale);
const dayName = (iso: string) => fullFmt.value.format(fromISO(iso));
const onDay = (iso: string) => events.value.filter((e) => e.date === iso);
const lanes = computed(() => new Map(days.value.map((d) => [d, layoutDay(onDay(d))])));
const nameOf = (e: ScheduleEvent) =>
  text.value.eventName(e.title, dayName(e.date), t(e.start), t(e.end));
const current = computed(() => events.value.find((e) => e.id === selected.value));

const patch = (e: ScheduleEvent) => {
  events.value = events.value.map((m) => (m.id === e.id ? e : m));
  emit("change", e);
};
const say = (e: ScheduleEvent) =>
  (live.value = text.value.moved(e.title, dayName(e.date), t(e.start), t(e.end)));

function add(e: Omit<ScheduleEvent, "id" | "title"> & { title?: string }) {
  const ev: ScheduleEvent = { id: nextEventId(events.value), title: text.value.newEvent, ...e };
  events.value = [...events.value, ev];
  selected.value = ev.id;
  emit("create", ev);
  live.value = text.value.added(ev.title);
  nextTick(() => titleInput.value?.select());
}
function addDefault() {
  const day = days.value[0];
  if (!day) return;
  const start = Math.min(lo.value + 60, hi.value - 60);
  add({ date: day, start, end: Math.min(start + 60, hi.value) });
}
function remove(e: ScheduleEvent) {
  const i = events.value.indexOf(e);
  const rest = events.value.filter((m) => m !== e);
  events.value = rest;
  emit("remove", e);
  live.value = text.value.removed(e.title);
  selected.value = rest[Math.min(i, rest.length - 1)]?.id ?? null;
  nextTick(() => (selected.value ? focusEvent(selected.value) : cols.value?.focus()));
}
const focusEvent = (eid: string) =>
  cols.value?.querySelector<HTMLElement>(`[data-event="${CSS.escape(eid)}"]`)?.focus();

// --- pointer: drag empty time to create, drag an event to move it, drag its foot to resize ---
const minuteAt = (y: number) => {
  const r = cols.value!.getBoundingClientRect();
  return Math.min(
    hi.value,
    Math.max(lo.value, snapTo(lo.value + ((y - r.top) / props.hourHeight) * 60, props.snap)),
  );
};
const dayAt = (x: number) => {
  const r = cols.value!.getBoundingClientRect();
  const n = days.value.length;
  return Math.min(n - 1, Math.max(0, Math.floor(((x - r.left) / (r.width || 1)) * n)));
};
type Drag =
  | { kind: "make"; date: string; a: number }
  | { kind: "move"; e: ScheduleEvent; y: number; col: number }
  | { kind: "size"; e: ScheduleEvent; y: number };
let drag: Drag | null = null;
const draft = ref<{ date: string; start: number; end: number } | null>(null);

function colDown(date: string, e: PointerEvent) {
  if (e.button || !props.editable || e.target !== e.currentTarget) {
    return;
  }
  selected.value = null;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  const a = minuteAt(e.clientY);
  drag = { kind: "make", date, a };
  draft.value = { date, start: a, end: a };
}
function eventDown(ev: ScheduleEvent, e: PointerEvent, kind: "move" | "size") {
  if (e.button) return;
  e.stopPropagation();
  selected.value = ev.id;
  if (!props.editable) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  drag =
    kind === "move"
      ? { kind, e: ev, y: e.clientY, col: dayAt(e.clientX) }
      : { kind, e: ev, y: e.clientY };
}
function move(e: PointerEvent) {
  const d = drag;
  if (!d) return;
  if (d.kind === "make") {
    const b = minuteAt(e.clientY);
    draft.value = { date: d.date, start: Math.min(d.a, b), end: Math.max(d.a, b) };
  } else if (d.kind === "move") {
    const dm = snapTo(((e.clientY - d.y) / props.hourHeight) * 60, props.snap);
    patch(moveEvent(d.e, dm, dayAt(e.clientX) - d.col, lo.value, hi.value));
  } else {
    const dm = snapTo(((e.clientY - d.y) / props.hourHeight) * 60, props.snap);
    patch(resizeEvent(d.e, dm, props.snap, hi.value));
  }
}
function up() {
  const was = drag;
  const made = draft.value;
  drag = null;
  draft.value = null;
  if (was?.kind === "make" && made && made.end - made.start >= props.snap) add(made);
  else if (was && was.kind !== "make") {
    const now = events.value.find((m) => m.id === was.e.id);
    if (now) say(now);
  }
}

// --- keyboard on an event ---
function onKey(ev: ScheduleEvent, e: KeyboardEvent) {
  if ((e.target as HTMLElement).closest("input")) return;
  const arrows: Record<string, [number, number]> = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
  };
  const a = arrows[e.key];
  if (a && props.editable) {
    e.preventDefault();
    let next: ScheduleEvent;
    if (e.altKey) next = resizeEvent(ev, a[0] * props.snap, props.snap, hi.value);
    else
      next = moveEvent(ev, a[0] * props.snap, props.view === "week" ? a[1] : 0, lo.value, hi.value);
    // a day outside the shown week would lose the event from view
    if (!days.value.includes(next.date)) next = { ...next, date: ev.date };
    patch(next);
    say(next);
    // a new day is a new column: the element is rebuilt there, so focus has to be put back
    if (next.date !== ev.date) nextTick(() => focusEvent(ev.id));
  } else if ((e.key === "Delete" || e.key === "Backspace") && props.editable) {
    e.preventDefault();
    remove(ev);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selected.value = ev.id;
    nextTick(() => titleInput.value?.focus());
  }
}
const nav = (n: number) => {
  if (!first.value) return;
  anchor.value = toISO(addDays(fromISO(first.value), n * (props.view === "week" ? 7 : 1)));
};
const tab = computed(
  () => selected.value ?? events.value.find((e) => days.value.includes(e.date))?.id,
);
const style = (e: { start: number; end: number }) => ({
  top: `${px(e.start)}px`,
  height: `${px(e.end) - px(e.start)}px`,
});
const lane = (day: string, id: string) => lanes.value.get(day)?.get(id) ?? { lane: 0, lanes: 1 };
</script>

<template>
  <div class="bless-sched" role="group" :aria-label="label">
    <div class="bless-sched__bar">
      <BlessButton size="sm" variant="outline" :aria-label="text.prev" @click="nav(-1)"
        >‹</BlessButton
      >
      <BlessButton size="sm" variant="outline" @click="anchor = isoToday()">{{
        text.today
      }}</BlessButton>
      <BlessButton size="sm" variant="outline" :aria-label="text.next" @click="nav(1)"
        >›</BlessButton
      >
      <strong class="bless-sched__title" aria-live="polite">{{ title }}</strong>
      <BlessButton v-if="editable" size="sm" class="bless-sched__add" @click="addDefault">{{
        text.add
      }}</BlessButton>
    </div>
    <div v-if="days.length" class="bless-sched__scroll">
      <div class="bless-sched__head" :style="{ '--_n': days.length }">
        <span class="bless-sched__corner" />
        <span
          v-for="d in days"
          :key="d"
          class="bless-sched__day"
          :class="{ 'bless-sched__day--today': d === today }"
          >{{ colFmt.format(fromISO(d)) }}</span
        >
      </div>
      <div class="bless-sched__body">
        <div class="bless-sched__gutter" aria-hidden="true" :style="{ height: `${height}px` }">
          <span
            v-for="h in hours"
            :key="h"
            class="bless-sched__hour"
            :style="{ top: `${px(h * 60)}px` }"
            >{{ t(h * 60) }}</span
          >
        </div>
        <div
          ref="cols"
          class="bless-sched__cols"
          :style="{ height: `${height}px`, '--_n': days.length, '--_h': `${hourHeight}px` }"
          tabindex="-1"
          :aria-describedby="hint"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
        >
          <div
            v-for="d in days"
            :key="d"
            class="bless-sched__col"
            role="group"
            :aria-label="dayName(d)"
            @pointerdown="colDown(d, $event)"
          >
            <div
              v-for="e in onDay(d)"
              :key="e.id"
              class="bless-sched__event"
              :class="{ 'bless-sched__event--sel': selected === e.id }"
              :style="{
                ...style(e),
                left: `calc(${(lane(d, e.id).lane / lane(d, e.id).lanes) * 100}% + 1px)`,
                width: `calc(${100 / lane(d, e.id).lanes}% - 3px)`,
              }"
              :data-event="e.id"
              role="button"
              :aria-pressed="selected === e.id"
              :aria-label="nameOf(e)"
              :tabindex="tab === e.id ? 0 : -1"
              @pointerdown="eventDown(e, $event, 'move')"
              @keydown="onKey(e, $event)"
              @focus="selected = e.id"
            >
              <span class="bless-sched__etitle">{{ e.title }}</span>
              <span class="bless-sched__etime">{{ t(e.start) }}–{{ t(e.end) }}</span>
              <span
                v-if="editable"
                class="bless-sched__foot"
                aria-hidden="true"
                @pointerdown="eventDown(e, $event, 'size')"
              />
            </div>
            <div
              v-if="draft && draft.date === d"
              class="bless-sched__event bless-sched__event--draft"
              :style="style(draft)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="current && editable" class="bless-sched__edit">
      <label class="bless-sched__field">
        <span>{{ text.title }}</span>
        <input
          ref="titleInput"
          class="bless-sched__input"
          type="text"
          :value="current.title"
          @input="patch({ ...current, title: ($event.target as HTMLInputElement).value })"
        />
      </label>
      <span class="bless-sched__when"
        >{{ dayName(current.date) }}, {{ t(current.start) }}–{{ t(current.end) }}</span
      >
      <BlessButton size="sm" variant="outline" @click="remove(current)">{{
        text.remove
      }}</BlessButton>
    </div>
    <span :id="hint" hidden>{{ text.hint }}</span>
    <span class="bless-sched__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-sched {
  position: relative;
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sched__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-sched__title {
  margin-inline-start: var(--bless-space-2);
}
.bless-sched__add {
  margin-inline-start: auto;
}
.bless-sched__scroll {
  overflow: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
  max-height: 560px;
}
.bless-sched__head,
.bless-sched__body {
  display: grid;
  grid-template-columns: 56px 1fr;
  min-width: 560px;
}
.bless-sched__head {
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--bless-color-bg);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-sched__head {
  grid-template-columns: 56px repeat(var(--_n), minmax(0, 1fr));
}
.bless-sched__day {
  padding: var(--bless-space-1) var(--bless-space-2);
  text-align: center;
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-sched__day--today {
  color: var(--bless-color-accent-text);
}
.bless-sched__gutter {
  position: relative;
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-sched__hour {
  position: absolute;
  inset-inline-end: var(--bless-space-2);
  translate: 0 -50%;
}
.bless-sched__cols {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--_n), minmax(0, 1fr));
  outline: none;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--bless-color-border) 0 1px,
    transparent 1px var(--_h)
  );
}
.bless-sched__col {
  position: relative;
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
  touch-action: pan-y;
  cursor: crosshair;
}
.bless-sched__event {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 2px var(--bless-space-2);
  background: color-mix(in srgb, var(--bless-color-accent) 20%, var(--bless-color-bg));
  border: var(--bless-border-width) solid var(--bless-color-accent);
  border-inline-start-width: 4px;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.bless-sched__event--sel {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 1px;
  z-index: 2;
}
.bless-sched__event:focus-visible {
  outline: 3px solid var(--bless-color-text);
  outline-offset: 1px;
  z-index: 2;
}
.bless-sched__event--draft {
  left: 1px;
  right: 1px;
  border-style: dashed;
  pointer-events: none;
}
.bless-sched__etitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-sched__etime {
  font-size: var(--bless-text-xs);
}
.bless-sched__foot {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 8px;
  cursor: ns-resize;
}
.bless-sched__edit {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-sched__field {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-sched__input {
  min-height: 32px;
  padding: var(--bless-space-1) var(--bless-space-2);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: inherit;
  font: inherit;
}
.bless-sched__input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-sched__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
