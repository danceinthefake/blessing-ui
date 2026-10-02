<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { addDays, fromISO, isoToday, toISO } from "../composables/date";
import { logicalKey } from "../composables/rtl";

defineOptions({ name: "BlessHeatmapCalendar" });

const props = withDefaults(
  defineProps<{
    /** counts by ISO date: `{ "2026-09-27": 4 }`; missing days are 0 */
    data?: Record<string, number>;
    /** last day shown, ISO; defaults to today */
    end?: string;
    weeks?: number;
    /** first row of each column: 0 Sunday, 1 Monday */
    weekStart?: 0 | 1;
    /** intensity steps above zero */
    levels?: number;
    /** the count that fills the darkest step; defaults to the largest value in `data` */
    max?: number;
    locale?: string;
    /** what is counted, singular: "contribution" */
    unit?: string;
    legend?: boolean;
    label?: string;
  }>(),
  {
    data: () => ({}),
    weeks: 53,
    weekStart: 1,
    levels: 4,
    unit: "contribution",
    legend: true,
    label: "Activity",
  },
);
/** the picked day */
const model = defineModel<string | null>({ default: null });

const endDate = computed(() => fromISO(props.end ?? isoToday()));
const firstDate = computed(() => {
  const back = (endDate.value.getDay() - props.weekStart + 7) % 7;
  return addDays(endDate.value, -back - (props.weeks - 1) * 7);
});
const top = computed(() => props.max ?? Math.max(1, ...Object.values(props.data)));
const dayFmt = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
);
const monthFmt = computed(() => new Intl.DateTimeFormat(props.locale, { month: "short" }));
const plural = (n: number) => `${n} ${props.unit}${n === 1 ? "" : "s"}`;

const days = computed(() => {
  const out: { iso: string; v: number; level: number; text: string; shown: boolean }[] = [];
  for (let i = 0; i < props.weeks * 7; i++) {
    const d = addDays(firstDate.value, i);
    const iso = toISO(d);
    const v = props.data[iso] ?? 0;
    out.push({
      iso,
      v,
      level:
        v > 0 ? Math.min(props.levels, Math.max(1, Math.ceil((v / top.value) * props.levels))) : 0,
      text: `${plural(v)} on ${dayFmt.value.format(d)}`,
      shown: d <= endDate.value,
    });
  }
  return out;
});
const total = computed(() => days.value.reduce((a, d) => a + (d.shown ? d.v : 0), 0));
const months = computed(() =>
  Array.from({ length: props.weeks }, (_, w) => {
    const d = addDays(firstDate.value, w * 7);
    const prev = addDays(d, -7);
    return w === 0 || d.getMonth() !== prev.getMonth() ? monthFmt.value.format(d) : "";
  }),
);
const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, r) =>
    r % 2
      ? new Intl.DateTimeFormat(props.locale, { weekday: "short" }).format(
          addDays(firstDate.value, r),
        )
      : "",
  ),
);

const readout = ref("");
const root = ref<HTMLElement>();
const last = computed(() => toISO(endDate.value));
const stop = ref<string | null>(null);
const tab = computed(() => model.value ?? stop.value ?? last.value);
const first = computed(() => toISO(firstDate.value));

function go(iso: string) {
  if (iso < first.value || iso > last.value) return;
  stop.value = iso;
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-date="${iso}"]`)?.focus());
}
function onKey(iso: string, e: KeyboardEvent) {
  const k = logicalKey(e);
  const d = fromISO(iso);
  const step: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
  if (k in step) (e.preventDefault(), go(toISO(addDays(d, step[k]!))));
  else if (k === "Home") (e.preventDefault(), go(first.value));
  else if (k === "End") (e.preventDefault(), go(last.value));
}
</script>

<template>
  <div ref="root" class="bless-heat" role="group" :aria-label="label">
    <div class="bless-heat__scroll">
      <div
        class="bless-heat__grid"
        :style="{ '--bless-heat-weeks': weeks, '--bless-heat-levels': levels }"
      >
        <span
          v-for="(m, w) in months"
          :key="`m${w}`"
          class="bless-heat__month"
          aria-hidden="true"
          :style="{ gridColumn: w + 2, gridRow: 1 }"
          >{{ m }}</span
        >
        <span
          v-for="(n, r) in weekdays"
          :key="`d${r}`"
          class="bless-heat__weekday"
          aria-hidden="true"
          :style="{ gridColumn: 1, gridRow: r + 2 }"
          >{{ n }}</span
        >
        <template v-for="(d, i) in days" :key="d.iso">
          <button
            v-if="d.shown"
            type="button"
            class="bless-heat__cell"
            :class="{ 'bless-heat__cell--on': model === d.iso }"
            :style="{
              gridColumn: Math.floor(i / 7) + 2,
              gridRow: (i % 7) + 2,
              '--bless-heat-l': d.level / levels,
            }"
            :data-date="d.iso"
            :data-level="d.level"
            :tabindex="tab === d.iso ? 0 : -1"
            :aria-label="d.text"
            :aria-pressed="model === d.iso"
            @click="model = model === d.iso ? null : d.iso"
            @keydown="onKey(d.iso, $event)"
            @focus="((stop = d.iso), (readout = d.text))"
            @mouseenter="readout = d.text"
            @mouseleave="readout = ''"
            @blur="readout = ''"
          ></button>
        </template>
      </div>
    </div>
    <div class="bless-heat__foot">
      <span class="bless-heat__readout" aria-live="polite">{{
        readout || `${plural(total)} in ${weeks} weeks`
      }}</span>
      <span v-if="legend" class="bless-heat__legend" aria-hidden="true">
        Less
        <i
          v-for="l in levels + 1"
          :key="l"
          class="bless-heat__cell bless-heat__swatch"
          :style="{ '--bless-heat-l': (l - 1) / levels }"
        ></i>
        More
      </span>
    </div>
  </div>
</template>

<style>
.bless-heat {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-heat__scroll {
  overflow-x: auto;
  padding-bottom: var(--bless-space-1);
}
.bless-heat__grid {
  --bless-heat-size: 12px;
  display: grid;
  grid-template-columns: auto repeat(var(--bless-heat-weeks), var(--bless-heat-size));
  grid-template-rows: auto repeat(7, var(--bless-heat-size));
  gap: 3px;
  width: max-content;
  align-items: center;
}
.bless-heat__month,
.bless-heat__weekday {
  white-space: nowrap;
  line-height: 1;
}
.bless-heat__weekday {
  padding-inline-end: var(--bless-space-2);
}
.bless-heat__cell {
  display: block;
  width: var(--bless-heat-size, 12px);
  height: var(--bless-heat-size, 12px);
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: color-mix(
    in srgb,
    var(--bless-color-text) calc(var(--bless-heat-l) * 85%),
    var(--bless-color-surface)
  );
  cursor: pointer;
}
.bless-heat__cell:focus-visible,
.bless-heat__cell--on {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-heat__swatch {
  display: inline-block;
  cursor: default;
}
.bless-heat__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-2);
}
.bless-heat__legend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.bless-heat__legend .bless-heat__cell {
  --bless-heat-size: 12px;
}
</style>
