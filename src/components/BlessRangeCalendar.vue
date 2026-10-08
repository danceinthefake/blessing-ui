<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId } from "vue";
import { addDays, addMonths, fromISO, isoToday, toISO } from "../composables/date";
import {
  applyRange,
  blocks as blocksOf,
  rangeBetween,
  type DayBlock,
} from "../composables/dayBlocks";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessRangeCalendar" });

const props = withDefaults(
  defineProps<{
    /** 0 = Sunday, 1 = Monday */
    weekStart?: 0 | 1;
    locale?: string;
    min?: string;
    max?: string;
    disabledDates?: (iso: string) => boolean;
    /** month shown first (YYYY-MM); defaults to the first chosen day, else this month */
    month?: string;
    label?: string;
    labels?: Partial<{
      prev: string;
      next: string;
      clear: string;
      summary: (days: number, blocks: number) => string;
      selected: (day: string) => string;
      cleared: (day: string) => string;
      hint: string;
    }>;
  }>(),
  { weekStart: 1, locale: "en", label: "Days" },
);
/** every chosen day, as sorted `YYYY-MM-DD` */
const model = defineModel<string[]>({ default: () => [] });
const emit = defineEmits<{ change: [blocks: DayBlock[]] }>();

const text = computed(() => ({
  prev: "Previous month",
  next: "Next month",
  clear: "Clear all",
  summary: (d: number, b: number) =>
    d ? `${d} day${d === 1 ? "" : "s"} in ${b} block${b === 1 ? "" : "s"}` : "No days chosen",
  selected: (d: string) => `${d} chosen`,
  cleared: (d: string) => `${d} cleared`,
  hint: "Arrow keys move, Space toggles a day, hold Shift and press arrows to paint, Page Up and Down change month.",
  ...props.labels,
}));

const id = useId();
const hint = `${id}-hint`;
// the clock is read after mount, so a server-rendered page and its first client render agree
const shown = ref<Date | null>(
  props.month
    ? fromISO(`${props.month}-01`)
    : model.value[0]
      ? fromISO(`${model.value[0].slice(0, 7)}-01`)
      : null,
);
const today = ref("");
const cursor = ref("");
onMounted(() => {
  today.value = isoToday();
  shown.value ??= fromISO(`${today.value.slice(0, 7)}-01`);
  cursor.value = firstOf(shown.value);
});
const firstOf = (d: Date) => toISO(new Date(d.getFullYear(), d.getMonth(), 1));

const monthFmt = computed(
  () => new Intl.DateTimeFormat(props.locale, { month: "long", year: "numeric" }),
);
const dayFmt = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
);
const weekdayFmt = computed(() => new Intl.DateTimeFormat(props.locale, { weekday: "short" }));
const heads = computed(() =>
  Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.value.format(addDays(new Date(2023, 0, 1 + props.weekStart + i), 0)),
  ),
);
const off = (iso: string) =>
  (props.min != null && iso < props.min) ||
  (props.max != null && iso > props.max) ||
  !!props.disabledDates?.(iso);
const chosen = computed(() => new Set(model.value));

/** the month as weeks of 7 cells; days of other months are blank */
const weeks = computed(() => {
  const s = shown.value;
  if (!s) return [];
  const lead = (new Date(s.getFullYear(), s.getMonth(), 1).getDay() - props.weekStart + 7) % 7;
  const days = new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: days }, (_, i) =>
      toISO(new Date(s.getFullYear(), s.getMonth(), i + 1)),
    ),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
});

// --- painting: a drag marks a stretch of days to add (or remove, if it starts on a chosen day) ---
const paint = ref<{ from: string; to: string; mode: "set" | "clear" } | null>(null);
const preview = computed(() =>
  paint.value ? new Set(rangeBetween(paint.value.from, paint.value.to)) : null,
);
const live = ref("");
function commit(range: string[], mode: "set" | "clear") {
  const next = applyRange(model.value, range, mode, (d) => !off(d));
  if (next.join() === model.value.join()) return;
  model.value = next;
  emit("change", blocksOf(next));
}
const dayAt = (x: number, y: number) =>
  (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>("[data-day]")
    ?.dataset.day;
function down(iso: string, e: PointerEvent) {
  if (e.button || off(iso)) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  cursor.value = iso;
  paint.value = { from: iso, to: iso, mode: chosen.value.has(iso) ? "clear" : "set" };
}
function move(e: PointerEvent) {
  const p = paint.value;
  const iso = p && dayAt(e.clientX, e.clientY);
  if (p && iso) paint.value = { ...p, to: iso };
}
function up() {
  const p = paint.value;
  paint.value = null;
  if (!p) return;
  commit(rangeBetween(p.from, p.to), p.mode);
  live.value = (p.mode === "set" ? text.value.selected : text.value.cleared)(
    p.from === p.to ? dayFmt.value.format(fromISO(p.from)) : `${p.from} – ${p.to}`,
  );
}

// --- keyboard ---
let kbMode: "set" | "clear" | null = null;
const focusDay = (iso: string) => nextTick(() => document.getElementById(`${id}-${iso}`)?.focus());
function goTo(iso: string) {
  const d = fromISO(iso);
  if (
    !shown.value ||
    d.getMonth() !== shown.value.getMonth() ||
    d.getFullYear() !== shown.value.getFullYear()
  )
    shown.value = new Date(d.getFullYear(), d.getMonth(), 1);
  cursor.value = iso;
  focusDay(iso);
}
function onKey(iso: string, e: KeyboardEvent) {
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key as "ArrowLeft"];
  if (step) {
    e.preventDefault();
    const to = toISO(addDays(fromISO(iso), step));
    if (e.shiftKey) {
      // paint as it goes: the first day decides whether this stroke adds or removes. Both days go in
      // one update, since the model only reflects the first after the parent has re-rendered.
      kbMode ??= chosen.value.has(iso) ? "clear" : "set";
      commit([iso, to], kbMode);
    } else kbMode = null;
    goTo(to);
  } else if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (off(iso)) return;
    const mode = chosen.value.has(iso) ? "clear" : "set";
    commit([iso], mode);
    live.value = (mode === "set" ? text.value.selected : text.value.cleared)(
      dayFmt.value.format(fromISO(iso)),
    );
  } else if (e.key === "PageDown" || e.key === "PageUp") {
    e.preventDefault();
    const m = addMonths(fromISO(iso), e.key === "PageDown" ? 1 : -1);
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    goTo(toISO(new Date(m.getFullYear(), m.getMonth(), Math.min(fromISO(iso).getDate(), days))));
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    const back = (fromISO(iso).getDay() - props.weekStart + 7) % 7;
    goTo(toISO(addDays(fromISO(iso), e.key === "Home" ? -back : 6 - back)));
  }
}
const onKeyup = (e: KeyboardEvent) => e.key === "Shift" && (kbMode = null);
const nav = (n: number) => {
  if (!shown.value) return;
  shown.value = addMonths(shown.value, n);
  cursor.value = firstOf(shown.value);
};

const runs = computed(() => blocksOf(model.value));
const summary = computed(() => text.value.summary(model.value.length, runs.value.length));
const stopDay = computed(() =>
  weeks.value.flat().includes(cursor.value) ? cursor.value : firstOf(shown.value ?? new Date()),
);
</script>

<template>
  <div class="bless-range" role="group" :aria-label="label">
    <div class="bless-range__bar">
      <BlessButton size="sm" variant="ghost" :aria-label="text.prev" @click="nav(-1)"
        >‹</BlessButton
      >
      <strong class="bless-range__title" aria-live="polite">{{
        shown ? monthFmt.format(shown) : ""
      }}</strong>
      <BlessButton size="sm" variant="ghost" :aria-label="text.next" @click="nav(1)">›</BlessButton>
    </div>
    <div
      v-if="shown"
      class="bless-range__grid"
      role="grid"
      :aria-label="`${label}, ${monthFmt.format(shown)}`"
      :aria-describedby="hint"
      aria-multiselectable="true"
      @keyup="onKeyup"
    >
      <div class="bless-range__row" role="row">
        <span v-for="h in heads" :key="h" class="bless-range__head" role="columnheader">{{
          h
        }}</span>
      </div>
      <div v-for="(w, wi) in weeks" :key="wi" class="bless-range__row" role="row">
        <template v-for="(iso, ci) in w" :key="ci">
          <span v-if="!iso" class="bless-range__gap" role="gridcell" aria-hidden="true" />
          <button
            v-else
            :id="`${id}-${iso}`"
            type="button"
            role="gridcell"
            class="bless-range__day"
            :class="{
              'bless-range__day--on': chosen.has(iso),
              'bless-range__day--set': paint?.mode === 'set' && preview?.has(iso),
              'bless-range__day--clear': paint?.mode === 'clear' && preview?.has(iso),
              'bless-range__day--today': iso === today,
            }"
            :data-day="iso"
            :aria-selected="chosen.has(iso)"
            :aria-disabled="off(iso) || undefined"
            :aria-label="dayFmt.format(fromISO(iso))"
            :aria-current="iso === today ? 'date' : undefined"
            :tabindex="stopDay === iso ? 0 : -1"
            @pointerdown="down(iso, $event)"
            @pointermove="move"
            @pointerup="up"
            @pointercancel="paint = null"
            @keydown="onKey(iso, $event)"
            @focus="cursor = iso"
          >
            {{ Number(iso.slice(8)) }}
          </button>
        </template>
      </div>
    </div>
    <div class="bless-range__foot">
      <span class="bless-range__summary">
        <slot name="summary" :blocks="runs">{{ summary }}</slot>
      </span>
      <BlessButton
        size="sm"
        variant="outline"
        :disabled="!model.length"
        @click="((model = []), emit('change', []))"
        >{{ text.clear }}</BlessButton
      >
    </div>
    <span :id="hint" hidden>{{ text.hint }}</span>
    <span class="bless-range__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-range {
  position: relative;
  display: grid;
  gap: var(--bless-space-2);
  width: max-content;
  max-width: 100%;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-range__bar,
.bless-range__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-range__title {
  text-transform: capitalize;
}
.bless-range__grid {
  display: grid;
  gap: 2px;
  user-select: none;
}
.bless-range__row {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 2px;
}
.bless-range__head {
  padding: var(--bless-space-1) 0;
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
  text-align: center;
}
.bless-range__day {
  height: 40px;
  padding: 0;
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: inherit;
  font: inherit;
  cursor: pointer;
  touch-action: none;
}
.bless-range__day[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-range__day--today {
  font-weight: var(--bless-font-weight-bold, 700);
  text-decoration: underline;
}
.bless-range__day--on {
  background: var(--bless-color-accent);
  border-color: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-range__day--set {
  border-color: var(--bless-color-accent);
  background: color-mix(in srgb, var(--bless-color-accent) 25%, var(--bless-color-bg));
  color: var(--bless-color-text);
}
.bless-range__day--clear {
  border-style: dashed;
  border-color: var(--bless-color-danger);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
}
.bless-range__day:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
  z-index: 1;
}
.bless-range__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
