<script lang="ts">
export interface BlessServicePart {
  name: string;
  status: BlessServiceState;
  description?: string;
}

export type BlessServiceState = "operational" | "maintenance" | "degraded" | "partial" | "major";
// from good to bad: the whole service takes the worst state of its parts
const ORDER: BlessServiceState[] = ["operational", "maintenance", "degraded", "partial", "major"];
export const worstState = (states: BlessServiceState[]): BlessServiceState =>
  states.reduce<BlessServiceState>(
    (w, s) => (ORDER.indexOf(s) > ORDER.indexOf(w) ? s : w),
    "operational",
  );
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSystemStatus" });
const pack = useLabelPack("BlessSystemStatus");

const props = defineProps<{
  parts: BlessServicePart[];
  /** when the states were last checked, as text */
  updated?: string;
  labels?: Partial<
    Record<BlessServiceState, string> & {
      title: string;
      all: string;
      summary: (state: string) => string;
      updated: (when: string) => string;
    }
  >;
}>();

const text = computed(() => ({
  title: "System status",
  operational: "Working",
  maintenance: "Maintenance",
  degraded: "Slow",
  partial: "Partial outage",
  major: "Major outage",
  all: "All systems are working",
  summary: (s: string) => `Some systems have a problem: ${s.toLowerCase()}`,
  updated: (w: string) => `Checked ${w}`,
  ...pack(),
  ...props.labels,
}));
const overall = computed(() => worstState(props.parts.map((p) => p.status)));
const headline = computed(() =>
  overall.value === "operational"
    ? text.value.all
    : overall.value === "maintenance"
      ? text.value.maintenance
      : text.value.summary(text.value[overall.value]),
);
const ICONS: Record<BlessServiceState, string> = {
  operational: "M3 8.5 6.5 12 13 4.5",
  maintenance: "M5 3v4h6V3M8 7v6",
  degraded: "M3 8h10",
  partial: "M8 3v6M8 12.5v.5",
  major: "M4 4l8 8M12 4l-8 8",
};
</script>

<template>
  <section class="bless-status" :aria-label="text.title">
    <p class="bless-status__overall" :class="`is-${overall}`" role="status">
      <span class="bless-status__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16"><path :d="ICONS[overall]" /></svg>
      </span>
      {{ headline }}
    </p>
    <ul class="bless-stagger bless-status__parts">
      <li v-for="p in parts" :key="p.name" class="bless-status__part" :class="`is-${p.status}`">
        <span class="bless-status__name">
          {{ p.name }}
          <span v-if="p.description" class="bless-status__desc">{{ p.description }}</span>
        </span>
        <span class="bless-status__state">
          <span class="bless-status__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14"><path :d="ICONS[p.status]" /></svg>
          </span>
          {{ text[p.status] }}
        </span>
      </li>
    </ul>
    <p v-if="updated" class="bless-status__updated">{{ text.updated(updated) }}</p>
  </section>
</template>

<style>
.bless-status {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-status .is-operational {
  --_c: var(--bless-color-success);
}
.bless-status .is-maintenance {
  --_c: var(--bless-color-info);
}
.bless-status .is-degraded,
.bless-status .is-partial {
  --_c: var(--bless-color-warning);
}
.bless-status .is-major {
  --_c: var(--bless-color-danger);
}
.bless-status__overall {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  margin: 0 0 var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-inline-start: 4px solid var(--_c);
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
/* each state has its own mark in a colored disc, and a word */
.bless-status__icon {
  display: inline-grid;
  flex: none;
  place-items: center;
  inline-size: 1.4rem;
  block-size: 1.4rem;
  border-radius: 50%;
  background: var(--_c);
  color: var(--bless-color-on-light);
}
.bless-status__icon svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-status__parts {
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  list-style: none;
}
.bless-status__part {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
}
.bless-status__part + .bless-status__part {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-status__name {
  display: flex;
  flex-direction: column;
  font-weight: var(--bless-font-weight-bold);
}
.bless-status__desc {
  font-size: var(--bless-text-xs);
  font-weight: normal;
  color: var(--bless-color-text-muted);
}
.bless-status__state {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  white-space: nowrap;
}
.bless-status__state .bless-status__icon {
  inline-size: 1.15rem;
  block-size: 1.15rem;
}
.bless-status__updated {
  margin: var(--bless-space-2) 0 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
