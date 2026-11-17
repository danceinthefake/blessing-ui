<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessRouteSteps" });
const pack = useLabelPack("BlessRouteSteps");

export type BlessTurn =
  | "start"
  | "straight"
  | "slight-left"
  | "left"
  | "sharp-left"
  | "slight-right"
  | "right"
  | "sharp-right"
  | "u-turn"
  | "roundabout"
  | "arrive";
export interface BlessRouteStep {
  turn: BlessTurn;
  /** what to do, for example "Turn left onto Jalan Sabang" */
  text: string;
  /** the distance of this step, in meters */
  distance?: number;
  /** the time of this step, in seconds */
  duration?: number;
}

const props = withDefaults(
  defineProps<{
    steps: BlessRouteStep[];
    /** the step that the traveler is on now */
    current?: number;
    locale?: string;
    labels?: Partial<{ route: string; total: (distance: string, time: string) => string }>;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  route: "Route",
  total: (d: string, t: string) => `${d} · ${t}`,
  ...pack(),
  ...props.labels,
}));
// the angle of the arrow for each turn; straight up is 0
const ANGLE: Partial<Record<BlessTurn, number>> = {
  straight: 0,
  "slight-left": -45,
  left: -90,
  "sharp-left": -135,
  "slight-right": 45,
  right: 90,
  "sharp-right": 135,
};
function dist(m?: number) {
  if (m == null) return "";
  const km = m >= 1000;
  return new Intl.NumberFormat(props.locale, {
    style: "unit",
    unit: km ? "kilometer" : "meter",
    maximumFractionDigits: km ? 1 : 0,
  }).format(km ? m / 1000 : Math.round(m / 10) * 10);
}
function time(s?: number) {
  if (s == null) return "";
  const min = Math.max(1, Math.round(s / 60));
  const f = (v: number, unit: "hour" | "minute") =>
    new Intl.NumberFormat(props.locale, { style: "unit", unit, unitDisplay: "short" }).format(v);
  return min >= 60
    ? `${f(Math.floor(min / 60), "hour")} ${min % 60 ? f(min % 60, "minute") : ""}`.trim()
    : f(min, "minute");
}
const total = computed(() =>
  text.value.total(
    dist(props.steps.reduce((a, s) => a + (s.distance ?? 0), 0)),
    time(props.steps.reduce((a, s) => a + (s.duration ?? 0), 0)),
  ),
);
</script>

<template>
  <div class="bless-route">
    <div class="bless-route__total">{{ total }}</div>
    <ol class="bless-route__list" :aria-label="text.route">
      <li
        v-for="(s, i) in steps"
        :key="i"
        :aria-current="current === i ? 'step' : undefined"
        :class="{ 'is-now': current === i, 'is-past': current != null && i < current }"
      >
        <div class="bless-route__step">
          <svg viewBox="0 0 24 24" class="bless-route__icon" aria-hidden="true">
            <circle v-if="s.turn === 'start'" cx="12" cy="12" r="6" />
            <path
              v-else-if="s.turn === 'arrive'"
              d="M12 22s-7-8-7-13a7 7 0 0 1 14 0c0 5-7 13-7 13z"
            />
            <path v-else-if="s.turn === 'u-turn'" d="M8 21V9a4 4 0 0 1 8 0v6m-4-3 4 4 4-4" />
            <g v-else-if="s.turn === 'roundabout'">
              <circle cx="12" cy="10" r="4" />
              <path d="M12 22v-8m4-4h5m-3-3 3 3-3 3" />
            </g>
            <path
              v-else
              d="M12 21V5m-6 6 6-6 6 6"
              :transform="`rotate(${ANGLE[s.turn] ?? 0} 12 12)`"
            />
          </svg>
          <span class="bless-route__text">{{ s.text }}</span>
          <span class="bless-route__dist">{{ dist(s.distance) }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<style>
.bless-route {
  display: grid;
  gap: var(--bless-space-2);
  max-inline-size: 32rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-route__total {
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-route__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-route__step {
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.is-now > .bless-route__step {
  border: 2px solid var(--bless-color-accent);
  font-weight: var(--bless-font-weight-bold);
}
.is-past > .bless-route__step {
  color: var(--bless-color-text-muted);
}
.bless-route__icon {
  inline-size: 1.75rem;
  block-size: 1.75rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-route__dist {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
