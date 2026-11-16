<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { moneyFormat } from "../composables/money";

defineOptions({ name: "BlessDeliveryPicker" });
const pack = useLabelPack("BlessDeliveryPicker");

export interface BlessDeliveryWindow {
  id: string;
  /** HH:MM */
  start: string;
  end: string;
  fee: number;
  full?: boolean;
}
export interface BlessDeliveryDay {
  /** YYYY-MM-DD */
  date: string;
  windows: BlessDeliveryWindow[];
}

const props = withDefaults(
  defineProps<{
    days: BlessDeliveryDay[];
    currency?: string;
    locale?: string;
    labels?: Partial<{ day: string; time: string; free: string; full: string }>;
  }>(),
  { currency: "USD", locale: "en" },
);
/** the id of the chosen window */
const selected = defineModel<string>();

const text = computed(() => ({
  day: "Delivery day",
  time: "Delivery time",
  free: "Free",
  full: "Full",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const dayOf = (id?: string) => props.days.find((d) => d.windows.some((w) => w.id === id))?.date;
// the day follows the chosen window; with none, the first day with room
const day = ref(
  dayOf(selected.value) ??
    props.days.find((d) => d.windows.some((w) => !w.full))?.date ??
    props.days[0]?.date,
);
watch(selected, (v) => {
  const d = dayOf(v);
  if (d) day.value = d;
});
const windows = computed(() => props.days.find((d) => d.date === day.value)?.windows ?? []);
const dayFmt = computed(() => ({
  week: new Intl.DateTimeFormat(props.locale, { weekday: "short", timeZone: "UTC" }),
  date: new Intl.DateTimeFormat(props.locale, { day: "numeric", month: "short", timeZone: "UTC" }),
}));
const at = (iso: string) => new Date(`${iso}T00:00:00Z`);
const money = computed(() => moneyFormat(props.locale, props.currency));
const fee = (n: number) => (n === 0 ? text.value.free : money.value.format(n));
const allFull = (d: BlessDeliveryDay) => d.windows.every((w) => w.full);
</script>

<template>
  <div class="bless-delivery">
    <fieldset class="bless-delivery__set">
      <legend class="bless-delivery__legend">{{ text.day }}</legend>
      <div class="bless-delivery__days">
        <label
          v-for="d in days"
          :key="d.date"
          class="bless-delivery__day"
          :class="{ 'is-full': allFull(d) }"
        >
          <input
            v-model="day"
            type="radio"
            :name="`${uid}-day`"
            :value="d.date"
            :disabled="allFull(d)"
          />
          <span class="bless-delivery__week">{{ dayFmt.week.format(at(d.date)) }}</span>{{ " " }}
          <span class="bless-delivery__date">{{ dayFmt.date.format(at(d.date)) }}</span>{{ " " }}
          <span v-if="allFull(d)" class="bless-delivery__tag">{{ text.full }}</span>
        </label>
      </div>
    </fieldset>
    <fieldset class="bless-delivery__set">
      <legend class="bless-delivery__legend">{{ text.time }}</legend>
      <div class="bless-delivery__windows">
        <label
          v-for="w in windows"
          :key="w.id"
          class="bless-delivery__window"
          :class="{ 'is-full': w.full }"
        >
          <input
            v-model="selected"
            type="radio"
            :name="`${uid}-window`"
            :value="w.id"
            :disabled="w.full"
          />
          <span class="bless-delivery__time">{{ w.start }}–{{ w.end }}</span>{{ " " }}
          <span class="bless-delivery__fee">{{ w.full ? text.full : fee(w.fee) }}</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<style>
.bless-delivery {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-delivery__set {
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-delivery__legend {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-delivery__days {
  display: flex;
  gap: var(--bless-space-2);
  overflow-x: auto;
  padding: 3px;
}
.bless-delivery__windows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--bless-space-2);
}
.bless-delivery__day,
.bless-delivery__window {
  position: relative;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  cursor: pointer;
}
.bless-delivery__day {
  display: grid;
  flex: none;
  justify-items: center;
  min-inline-size: 4.5rem;
  padding: var(--bless-space-2);
}
.bless-delivery__window {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
  font-variant-numeric: tabular-nums;
}
/* the native radio stays in the tab order and reads its state; the box shows it */
.bless-delivery__day input,
.bless-delivery__window input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.bless-delivery__day:has(:checked),
.bless-delivery__window:has(:checked) {
  border: 2px solid var(--bless-color-text);
  box-shadow: inset 0 -3px 0 var(--bless-color-accent);
}
.bless-delivery__day:has(:focus-visible),
.bless-delivery__window:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-delivery__week {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-delivery__date,
.bless-delivery__time {
  font-weight: var(--bless-font-weight-bold);
}
.bless-delivery__fee,
.bless-delivery__tag {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-delivery .is-full {
  cursor: not-allowed;
  border-style: dashed;
}
.bless-delivery .is-full .bless-delivery__date,
.bless-delivery .is-full .bless-delivery__time {
  font-weight: var(--bless-font-weight-normal);
  text-decoration: line-through;
}
</style>
