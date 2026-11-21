<template>
  <div class="bless-avail" :class="{ 'bless-avail--disabled': disabled }">
    <table
      ref="root"
      class="bless-avail__grid"
      role="grid"
      :aria-label="text.label"
      :aria-disabled="disabled || undefined"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @keydown="onKey"
    >
      <thead>
        <tr>
          <td />
          <th v-for="day in days" :key="day" scope="col">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(m, t) in times" :key="m">
          <th scope="row" class="bless-avail__time">
            <span v-if="m % 60 === 0">{{ fmtTime(m, locale) }}</span>
            <span v-else class="bless-sr">{{ fmtTime(m, locale) }}</span>
          </th>
          <td
            v-for="(day, d) in days"
            :key="day"
            role="gridcell"
            class="bless-avail__cell"
            :class="{
              'bless-avail__cell--on': on.has(key(d, t)),
              'bless-avail__cell--hour': m % 60 === 0,
            }"
            :data-cell="`${d},${t}`"
            :aria-selected="on.has(key(d, t))"
            :tabindex="cur.d === d && cur.t === t ? 0 : -1"
            @focus="cur = { d, t }"
          >
            <span class="bless-sr">{{ on.has(key(d, t)) ? text.free : text.busy }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { logicalKey } from "../composables/rtl";
import { fmtTime } from "../composables/schedule";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessAvailabilityGrid" });
const pack = useLabelPack("BlessAvailabilityGrid");

const props = withDefaults(
  defineProps<{
    /** the columns: any text, for example `Mon` or `2026-11-16` */
    days: string[];
    /** the first and the last hour (0–24) */
    dayStart?: number;
    dayEnd?: number;
    /** minutes in one cell */
    step?: number;
    /** shows the times in the format of this locale */
    locale?: string;
    disabled?: boolean;
    labels?: Partial<{ label: string; free: string; busy: string }>;
  }>(),
  { dayStart: 9, dayEnd: 18, step: 30 },
);
/** the free cells, each as `day HH:MM`, for example `Mon 09:30` */
const model = defineModel<string[]>({ default: () => [] });

const text = computed(() => ({
  label: "Free times",
  free: "free",
  busy: "busy",
  ...pack(),
  ...props.labels,
}));
const times = computed(() => {
  const out: number[] = [];
  for (let m = props.dayStart * 60; m < props.dayEnd * 60; m += props.step) out.push(m);
  return out;
});
const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const key = (d: number, t: number) => `${props.days[d]} ${hhmm(times.value[t]!)}`;
const on = computed(() => new Set(model.value));

// a drag paints the rectangle from the first cell to the current one, all free or all busy,
// from the state when the drag started
let drag: { d: number; t: number; free: boolean; before: Set<string> } | undefined;
const at = (e: PointerEvent) => {
  const el = (document.elementFromPoint?.(e.clientX, e.clientY) ?? e.target) as HTMLElement | null;
  const cell = el?.closest<HTMLElement>("[data-cell]");
  if (!cell) return undefined;
  const [d, t] = cell.dataset.cell!.split(",").map(Number);
  return { d: d!, t: t! };
};
function paint(to: { d: number; t: number }) {
  if (!drag) return;
  const next = new Set(drag.before);
  for (let d = Math.min(drag.d, to.d); d <= Math.max(drag.d, to.d); d++)
    for (let t = Math.min(drag.t, to.t); t <= Math.max(drag.t, to.t); t++)
      drag.free ? next.add(key(d, t)) : next.delete(key(d, t));
  model.value = [...next];
}
function onDown(e: PointerEvent) {
  if (props.disabled || e.button !== 0) return;
  const c = at(e);
  if (!c) return;
  e.preventDefault();
  focusCell(c.d, c.t);
  drag = { ...c, free: !on.value.has(key(c.d, c.t)), before: new Set(model.value) };
  paint(c);
}
function onMove(e: PointerEvent) {
  const c = drag && at(e);
  if (c) paint(c);
}
const onUp = () => (drag = undefined);

// keyboard: one Tab stop, arrows move, Space or Enter turns a cell free or busy
const cur = ref({ d: 0, t: 0 });
const root = ref<HTMLElement>();
function focusCell(d: number, t: number) {
  cur.value = { d, t };
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-cell="${d},${t}"]`)?.focus());
}
function onKey(e: KeyboardEvent) {
  const { d, t } = cur.value;
  const lastD = props.days.length - 1;
  const lastT = times.value.length - 1;
  const k = logicalKey(e);
  if (k === "ArrowRight") focusCell(Math.min(lastD, d + 1), t);
  else if (k === "ArrowLeft") focusCell(Math.max(0, d - 1), t);
  else if (k === "ArrowDown") focusCell(d, Math.min(lastT, t + 1));
  else if (k === "ArrowUp") focusCell(d, Math.max(0, t - 1));
  else if (k === "Home") focusCell(0, t);
  else if (k === "End") focusCell(lastD, t);
  else if ((k === " " || k === "Enter") && !props.disabled) {
    const id = key(d, t);
    model.value = on.value.has(id) ? model.value.filter((x) => x !== id) : [...model.value, id];
  } else return;
  e.preventDefault();
}
</script>

<style>
.bless-avail {
  overflow-x: auto;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-avail__grid {
  border-collapse: collapse;
  inline-size: 100%;
  table-layout: fixed;
  touch-action: none;
  user-select: none;
}
.bless-avail__grid th {
  padding: 0 var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-normal);
  white-space: nowrap;
}
.bless-avail__grid thead th {
  padding-block-end: var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
}
.bless-avail__grid thead td,
.bless-avail__time {
  inline-size: 4.5rem;
}
.bless-avail__time {
  text-align: end;
  vertical-align: top;
  line-height: 1;
}
.bless-avail__cell {
  block-size: 18px;
  padding: 0;
  border-inline: var(--bless-border-width) solid var(--bless-color-border);
  border-block-start: var(--bless-border-width) dashed var(--bless-color-border);
  cursor: pointer;
}
.bless-avail__cell--hour {
  border-block-start-style: solid;
}
tbody tr:last-child .bless-avail__cell {
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-avail__cell--on {
  background: color-mix(in srgb, var(--bless-color-success) 55%, var(--bless-color-bg));
}
.bless-avail__cell:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-avail--disabled .bless-avail__cell {
  cursor: not-allowed;
}
</style>
