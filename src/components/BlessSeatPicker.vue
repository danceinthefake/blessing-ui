<template>
  <div class="bless-seats">
    <div class="bless-seats__stage" aria-hidden="true">{{ text.stage }}</div>
    <div ref="map" class="bless-seats__map" role="group" :aria-label="text.stage">
      <div v-for="(r, ri) in rows" :key="r.label" class="bless-seats__row">
        <span class="bless-seats__label" aria-hidden="true">{{ r.label }}</span>
        <template v-for="(s, ci) in r.seats" :key="s?.id ?? `gap${ci}`">
          <button
            v-if="s"
            type="button"
            class="bless-seats__seat"
            :class="{ 'is-taken': s.taken, 'is-chosen': chosen.includes(s.id) }"
            :style="{ '--_c': color(s) }"
            :data-seat="s.id"
            :tabindex="(focus ?? first) === s.id ? 0 : -1"
            :aria-pressed="chosen.includes(s.id)"
            :aria-disabled="s.taken || (full && !chosen.includes(s.id)) || undefined"
            :aria-label="label(r, s, ci)"
            :title="label(r, s, ci)"
            @click="toggle(s)"
            @focus="focus = s.id"
            @keydown="move($event, ri, ci)"
          />
          <span v-else class="bless-seats__gap" aria-hidden="true" />
        </template>
        <span class="bless-seats__label" aria-hidden="true">{{ r.label }}</span>
      </div>
    </div>
    <ul class="bless-seats__legend" aria-hidden="true">
      <li v-for="(z, i) in zones" :key="z.key">
        <i class="bless-seats__key" :style="{ '--_c': chartColor(z.color, i) }" />{{ z.label }} ·
        {{ money.format(z.price) }}
      </li>
      <li><i class="bless-seats__key is-taken" />{{ text.taken }}</li>
      <li><i class="bless-seats__key is-chosen" />{{ text.chosen }}</li>
    </ul>
    <p class="bless-seats__summary" role="status">
      {{ chosen.length ? text.summary(chosen.length, money.format(total)) : "" }}
    </p>
  </div>
</template>

<script lang="ts">
export interface BlessSeat {
  id: string;
  /** the number on the seat; default: its place in the row, from 1 */
  number?: string | number;
  /** the key of its zone */
  zone?: string;
  taken?: boolean;
}
export interface BlessSeatRow {
  label: string;
  /** the seats from left to right; `null` is a gap, for example an aisle */
  seats: (BlessSeat | null)[];
}
export interface BlessSeatZone {
  key: string;
  label: string;
  price: number;
  color?: string;
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { chartColor } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessSeatPicker" });
const pack = useLabelPack("BlessSeatPicker");

const props = withDefaults(
  defineProps<{
    rows: BlessSeatRow[];
    zones?: BlessSeatZone[];
    /** the most seats in one order; 0 has no limit */
    max?: number;
    currency?: string;
    locale?: string;
    labels?: Partial<{
      stage: string;
      free: string;
      taken: string;
      chosen: string;
      seat: (row: string, number: string, zone: string, price: string) => string;
      summary: (count: number, total: string) => string;
    }>;
  }>(),
  { zones: () => [], max: 0, currency: "USD", locale: "en" },
);
/** the ids of the chosen seats */
const chosen = defineModel<string[]>({ default: () => [] });

const text = computed(() => ({
  stage: "Stage",
  free: "Free",
  taken: "Taken",
  chosen: "Chosen",
  seat: (r: string, n: string, z: string, p: string) =>
    `Row ${r}, seat ${n}${z ? `, ${z}` : ""}${p ? `, ${p}` : ""}`,
  summary: (n: number, t: string) => `${n} ${n === 1 ? "seat" : "seats"} · ${t}`,
  ...pack(),
  ...props.labels,
}));
const money = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      style: "currency",
      currency: props.currency,
      maximumFractionDigits: 0,
    }),
);
const zoneOf = (s: BlessSeat) => props.zones.find((z) => z.key === s.zone);
const color = (s: BlessSeat) => {
  const i = props.zones.findIndex((z) => z.key === s.zone);
  return i < 0 ? "var(--bless-color-text-muted)" : chartColor(props.zones[i]!.color, i);
};
const all = computed(() => props.rows.flatMap((r) => r.seats.filter((s): s is BlessSeat => !!s)));
const total = computed(() =>
  chosen.value.reduce((n, id) => {
    const s = all.value.find((x) => x.id === id);
    return n + (s ? (zoneOf(s)?.price ?? 0) : 0);
  }, 0),
);
const full = computed(() => props.max > 0 && chosen.value.length >= props.max);
function toggle(s: BlessSeat) {
  if (s.taken) return;
  if (chosen.value.includes(s.id)) chosen.value = chosen.value.filter((x) => x !== s.id);
  else if (!full.value) chosen.value = [...chosen.value, s.id];
}
const label = (r: BlessSeatRow, s: BlessSeat, i: number) => {
  const z = zoneOf(s);
  const base = text.value.seat(
    r.label,
    String(s.number ?? r.seats.slice(0, i + 1).filter(Boolean).length),
    z?.label ?? "",
    z ? money.value.format(z.price) : "",
  );
  return s.taken ? `${base}, ${text.value.taken}` : base;
};

// one tab stop for the map; arrow keys move between seats, over gaps
const focus = ref<string>();
const map = ref<HTMLElement>();
const first = computed(() => all.value.find((s) => !s.taken)?.id ?? all.value[0]?.id);
function move(e: KeyboardEvent, r: number, c: number) {
  const d = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[e.key];
  if (!d) return;
  e.preventDefault();
  const rtl = getComputedStyle(map.value!).direction === "rtl";
  const [dr, dc] = [d[0]!, rtl ? -d[1]! : d[1]!];
  let [nr, nc] = [r + dr, c + dc];
  while (nr >= 0 && nr < props.rows.length) {
    const row = props.rows[nr]!.seats;
    // up and down land on the nearest seat of the next row
    if (dr) nc = Math.min(Math.max(0, c), row.length - 1);
    let seat = row[nc];
    if (dr) {
      for (let k = 1; !seat && k < row.length; k++) seat = row[nc - k] ?? row[nc + k];
    }
    if (seat) {
      focus.value = seat.id;
      nextTick(() => map.value?.querySelector<HTMLElement>(`[data-seat="${seat!.id}"]`)?.focus());
      return;
    }
    if (dr) nr += dr;
    else if (nc < 0 || nc >= row.length) return;
    else nc += dc;
  }
}
</script>

<style>
.bless-seats {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-3);
  max-inline-size: 100%;
  overflow-x: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-seats__stage {
  inline-size: min(100%, 22rem);
  padding: var(--bless-space-1);
  background: var(--bless-color-surface-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-align: center;
  text-transform: uppercase;
  color: var(--bless-color-text);
}
.bless-seats__map {
  display: grid;
  gap: 6px;
}
.bless-seats__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.bless-seats__label {
  inline-size: 1.4rem;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  text-align: center;
}
.bless-seats__seat,
.bless-seats__gap,
.bless-seats__key {
  inline-size: 1.4rem;
  block-size: 1.4rem;
}
/* free: an outline in the color of its zone; chosen: filled; taken: gray with a cross */
.bless-seats__seat {
  position: relative;
  padding: 0;
  border: 2px solid var(--_c);
  border-radius: 4px 4px 0 0;
  background: var(--bless-color-bg);
  cursor: pointer;
}
.bless-seats__seat:hover:not([aria-disabled]) {
  background: color-mix(in srgb, var(--_c) 25%, var(--bless-color-bg));
}
.bless-seats__seat.is-chosen {
  background: var(--_c);
}
.bless-seats__seat.is-chosen::after,
.bless-seats__key.is-chosen::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  inline-size: 5px;
  block-size: 9px;
  border: solid var(--bless-color-bg);
  border-width: 0 2px 2px 0;
  rotate: 45deg;
  translate: 0 -1px;
}
.bless-seats__seat.is-taken,
.bless-seats__key.is-taken {
  border-color: var(--bless-color-border);
  background:
    linear-gradient(
      to top right,
      transparent calc(50% - 1px),
      var(--bless-color-text-muted) calc(50% - 1px) calc(50% + 1px),
      transparent calc(50% + 1px)
    ),
    var(--bless-color-surface-2);
  cursor: not-allowed;
}
.bless-seats__seat[aria-disabled]:not(.is-taken) {
  cursor: not-allowed;
}
.bless-seats__seat:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-seats__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
}
.bless-seats__legend li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-seats__key {
  position: relative;
  inline-size: 0.9rem;
  block-size: 0.9rem;
  border: 2px solid var(--_c);
}
.bless-seats__key.is-chosen {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
}
.bless-seats__summary {
  min-block-size: 1.4em;
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
</style>
