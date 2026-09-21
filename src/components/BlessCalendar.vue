<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { logicalKey } from "../composables/rtl";
import { addDays, addMonths, fromISO, isoToday, sameDay, toISO } from "../composables/date";

defineOptions({ name: "BlessCalendar" });

const props = withDefaults(
  defineProps<{
    /** range mode: model is [start, end] */
    range?: boolean;
    min?: string;
    max?: string;
    /** 0 = Sunday, 1 = Monday */
    weekStart?: 0 | 1;
    locale?: string;
    disabledDates?: (iso: string) => boolean;
    /** month shown initially (YYYY-MM); defaults to model or today */
    month?: string;
  }>(),
  { weekStart: 1, locale: "ja-JP" },
);

const model = defineModel<string | [string, string] | undefined>();
const id = useId();

const first = computed(() => (Array.isArray(model.value) ? model.value[0] : model.value));
const view = ref(fromISO(props.month ? `${props.month}-01` : (first.value ?? isoToday())));
const focused = ref(first.value ?? isoToday());
const hover = ref<string>();
const pending = ref<string>(); // range start awaiting end

const fmtMonth = computed(() =>
  new Intl.DateTimeFormat(props.locale, { year: "numeric", month: "long" }).format(view.value),
);
const dayNames = computed(() => {
  const f = new Intl.DateTimeFormat(props.locale, { weekday: "short" });
  const base = new Date(2024, 0, 7 + props.weekStart); // a Sunday + offset
  return Array.from({ length: 7 }, (_, i) => f.format(addDays(base, i)));
});
const cells = computed(() => {
  const y = view.value.getFullYear();
  const m = view.value.getMonth();
  const start = new Date(y, m, 1);
  const lead = (start.getDay() - props.weekStart + 7) % 7;
  const out: { iso: string; date: Date; outside: boolean }[] = [];
  for (let i = -lead; out.length < 42; i++) {
    const d = new Date(y, m, 1 + i);
    out.push({ iso: toISO(d), date: d, outside: d.getMonth() !== m });
  }
  return out;
});
const isDisabled = (iso: string) =>
  (props.min && iso < props.min) || (props.max && iso > props.max) || !!props.disabledDates?.(iso);
const rangeSel = computed<[string, string] | null>(() => {
  if (!props.range) return null;
  if (pending.value) {
    const b = hover.value ?? focused.value;
    return b < pending.value ? [b, pending.value] : [pending.value, b];
  }
  return Array.isArray(model.value) ? model.value : null;
});
const isSelected = (iso: string) =>
  props.range ? rangeSel.value?.[0] === iso || rangeSel.value?.[1] === iso : model.value === iso;
const inRange = (iso: string) =>
  !!rangeSel.value && iso > rangeSel.value[0] && iso < rangeSel.value[1];

function select(iso: string) {
  if (isDisabled(iso)) return;
  focused.value = iso;
  if (!props.range) return void (model.value = iso);
  if (!pending.value) pending.value = iso;
  else {
    model.value = iso < pending.value ? [iso, pending.value] : [pending.value, iso];
    pending.value = undefined;
  }
}
function moveFocus(days: number) {
  let d = fromISO(focused.value);
  d = addDays(d, days);
  focused.value = toISO(d);
  if (d.getMonth() !== view.value.getMonth() || d.getFullYear() !== view.value.getFullYear())
    view.value = new Date(d.getFullYear(), d.getMonth(), 1);
  requestAnimationFrame(() => document.getElementById(`${id}-${focused.value}`)?.focus());
}
function onKey(e: KeyboardEvent) {
  const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  if (e.key in map) {
    e.preventDefault();
    moveFocus(map[logicalKey(e)]!);
  } else if (e.key === "PageUp") {
    e.preventDefault();
    shiftMonth(e.shiftKey ? -12 : -1, true);
  } else if (e.key === "PageDown") {
    e.preventDefault();
    shiftMonth(e.shiftKey ? 12 : 1, true);
  } else if (e.key === "Home") {
    e.preventDefault();
    moveFocus(-((fromISO(focused.value).getDay() - props.weekStart + 7) % 7));
  } else if (e.key === "End") {
    e.preventDefault();
    moveFocus(6 - ((fromISO(focused.value).getDay() - props.weekStart + 7) % 7));
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    select(focused.value);
  }
}
function shiftMonth(n: number, keepFocus = false) {
  view.value = addMonths(view.value, n);
  if (keepFocus)
    requestAnimationFrame(() => document.getElementById(`${id}-${focused.value}`)?.focus());
}
watch(first, (v) => v && (view.value = addMonths(fromISO(v), 0)));
// the roving-tabindex cell must be in the visible month, or the grid leaves the Tab order
watch(
  view,
  (v) => {
    const d = fromISO(focused.value);
    if (d.getFullYear() !== v.getFullYear() || d.getMonth() !== v.getMonth())
      focused.value = toISO(new Date(v.getFullYear(), v.getMonth(), Math.min(d.getDate(), 28)));
  },
  { immediate: true },
);
</script>

<template>
  <div class="bless-calendar" role="group" :aria-label="fmtMonth">
    <div class="bless-calendar__head">
      <button
        type="button"
        class="bless-calendar__nav"
        aria-label="Previous month"
        @click="shiftMonth(-1)"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <span class="bless-calendar__month" aria-live="polite">{{ fmtMonth }}</span>
      <button
        type="button"
        class="bless-calendar__nav"
        aria-label="Next month"
        @click="shiftMonth(1)"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
    <div class="bless-calendar__grid" role="grid" @keydown="onKey">
      <div role="row" class="bless-calendar__row bless-calendar__row--head">
        <span v-for="d in dayNames" :key="d" role="columnheader" class="bless-calendar__dow">{{
          d
        }}</span>
      </div>
      <div v-for="w in 6" :key="w" role="row" class="bless-calendar__row">
        <button
          v-for="c in cells.slice((w - 1) * 7, w * 7)"
          :key="c.iso"
          :id="`${id}-${c.iso}`"
          type="button"
          role="gridcell"
          class="bless-calendar__day"
          :class="{
            'bless-calendar__day--outside': c.outside,
            'bless-calendar__day--today': c.iso === isoToday(),
            'bless-calendar__day--selected': isSelected(c.iso),
            'bless-calendar__day--in-range': inRange(c.iso),
            'bless-calendar__day--start': rangeSel?.[0] === c.iso,
            'bless-calendar__day--end': rangeSel?.[1] === c.iso,
          }"
          :tabindex="c.iso === focused ? 0 : -1"
          :aria-selected="isSelected(c.iso) || undefined"
          :aria-disabled="isDisabled(c.iso) || undefined"
          :disabled="isDisabled(c.iso)"
          :aria-label="new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(c.date)"
          @click="select(c.iso)"
          @mouseenter="hover = c.iso"
          @mouseleave="hover = undefined"
          @focus="focused = c.iso"
        >
          {{ c.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.bless-calendar {
  display: inline-block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  user-select: none;
}
.bless-calendar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--bless-space-2);
}
.bless-calendar__month {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-calendar__nav {
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: var(--bless-color-text);
  font-size: var(--bless-text-lg);
  cursor: pointer;
  transition: color var(--bless-duration-slow);
}
.bless-calendar__nav:hover {
  color: var(--bless-color-accent-text);
}
.bless-calendar__nav:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-calendar__row {
  display: grid;
  grid-template-columns: repeat(7, 36px);
}
.bless-calendar__dow {
  padding: var(--bless-space-1) 0;
  text-align: center;
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-calendar__day {
  border-radius: var(--bless-radius);
  position: relative;
  height: 36px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-sm);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    background var(--bless-duration-fast),
    color var(--bless-duration-fast);
}
.bless-calendar__day:hover:not(:disabled) {
  background: var(--bless-color-surface);
}
.bless-calendar__day:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
  z-index: 1;
}
.bless-calendar__day--outside {
  color: var(--bless-color-text-muted);
  font-weight: var(--bless-font-weight-light);
}
.bless-calendar__day--today {
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-accent-text);
}
.bless-calendar__day--today::after {
  content: "";
  position: absolute;
  inset-inline-start: 50%;
  bottom: 4px;
  width: 4px;
  height: 4px;
  margin-inline-start: -2px;
  background: currentColor;
}
.bless-calendar__day--in-range {
  background: var(--bless-color-surface);
}
.bless-calendar__day--selected {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  opacity: 1;
}
.bless-calendar__day--selected::after {
  background: var(--bless-color-on-accent);
}
.bless-calendar__day--start {
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%);
}
.bless-calendar__day--end {
  clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
}
/* can't pick: struck, at reading weight — distinct from the light "outside this month" days */
.bless-calendar__day:disabled {
  color: var(--bless-color-text-muted);
  text-decoration: line-through;
  cursor: not-allowed;
}
.bless-calendar__day--outside:disabled {
  text-decoration: none;
  opacity: 0.5;
}
</style>
