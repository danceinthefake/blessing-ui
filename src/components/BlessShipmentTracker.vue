<template>
  <section class="bless-ship" :class="{ 'has-problem': problem }" :aria-label="text.title">
    <ol class="bless-stagger bless-ship__stages" :style="{ '--_done': at / (STAGES.length - 1) }">
      <li
        v-for="(s, i) in STAGES"
        :key="s"
        class="bless-ship__stage"
        :class="{ 'is-done': i < at || (i === at && s === 'delivered'), 'is-current': i === at }"
        :aria-current="i === at ? 'step' : undefined"
      >
        <span class="bless-ship__dot" aria-hidden="true">
          <svg v-if="i < at || (i === at && !problem)" viewBox="0 0 16 16" width="12" height="12">
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
          <b v-else-if="i === at">!</b>
        </span>
        <span class="bless-ship__name">{{ text[s] }}</span>
        <span v-if="dates[i] && i <= at" class="bless-ship__date">{{ dates[i] }}</span>
        <span class="bless-sr">{{
          i < at ? `, ${text.done}` : i === at ? `, ${text.current}` : ""
        }}</span>
      </li>
    </ol>
    <p v-if="problem" class="bless-ship__problem" role="alert">{{ problem }}</p>
    <div v-if="events.length" class="bless-ship__latest">
      <span class="bless-ship__label">{{ text.latest }}</span>
      <p>
        <strong>{{ events[0]!.text }}</strong>
        <span class="bless-ship__meta">{{
          [events[0]!.place, events[0]!.time].filter(Boolean).join(" · ")
        }}</span>
      </p>
    </div>
    <details v-if="events.length > 1" class="bless-ship__history">
      <summary>{{ text.history }} ({{ events.length }})</summary>
      <ol>
        <li v-for="(e, i) in events" :key="i">
          <span class="bless-ship__meta">{{ e.time }}</span>
          <span>{{ e.text }}<template v-if="e.place"> · {{ e.place }}</template></span>
        </li>
      </ol>
    </details>
    <p v-if="tracking" class="bless-ship__tracking">
      {{ text.tracking }}<template v-if="carrier"> ({{ carrier }})</template>:
      <a v-if="trackingUrl" :href="trackingUrl">{{ tracking }}</a>
      <code v-else>{{ tracking }}</code>
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessShipmentTracker" });
const pack = useLabelPack("BlessShipmentTracker");

export interface BlessShipmentEvent {
  /** when it happened, as text, for example "14 Nov, 09:12" */
  time: string;
  text: string;
  place?: string;
}

const STAGES = ["ordered", "packed", "shipped", "out", "delivered"] as const;

const props = withDefaults(
  defineProps<{
    /** the stage the order has reached: 0 ordered, 1 packed, 2 shipped, 3 out for delivery, 4 delivered */
    stage: number;
    /** the date of each stage that is done, as text */
    dates?: (string | undefined)[];
    /** the updates of the carrier, newest first */
    events?: BlessShipmentEvent[];
    /** a problem with the delivery: the current stage shows it */
    problem?: string;
    carrier?: string;
    tracking?: string;
    /** a link to the page of the carrier */
    trackingUrl?: string;
    labels?: Partial<
      Record<(typeof STAGES)[number], string> & {
        title: string;
        latest: string;
        history: string;
        tracking: string;
        done: string;
        current: string;
      }
    >;
  }>(),
  { dates: () => [], events: () => [] },
);

const text = computed(() => ({
  title: "Delivery",
  ordered: "Ordered",
  packed: "Packed",
  shipped: "Shipped",
  out: "Out for delivery",
  delivered: "Delivered",
  latest: "Latest update",
  history: "All updates",
  tracking: "Tracking number",
  done: "done",
  current: "current step",
  ...pack(),
  ...props.labels,
}));
const at = computed(() => Math.min(Math.max(0, Math.round(props.stage)), STAGES.length - 1));
</script>

<style>
.bless-ship {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-ship__stages {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* the line under the dots: gray, with the part that is done in the accent color */
.bless-ship__stages::before,
.bless-ship__stages::after {
  content: "";
  position: absolute;
  inset-block-start: 11px;
  inset-inline-start: 10%;
  block-size: 2px;
  inline-size: 80%;
  background: var(--bless-color-border);
}
.bless-ship__stages::after {
  inline-size: calc(80% * var(--_done));
  background: var(--bless-color-accent);
}
.bless-ship__stage {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--bless-space-1);
  text-align: center;
}
.bless-ship__dot {
  display: inline-grid;
  place-items: center;
  inline-size: 24px;
  block-size: 24px;
  border: 2px solid var(--bless-color-border);
  border-radius: 50%;
  background: var(--bless-color-bg);
}
.bless-ship__dot svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.is-done .bless-ship__dot,
.is-current .bless-ship__dot {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.has-problem .is-current .bless-ship__dot {
  border-color: var(--bless-color-danger);
  background: var(--bless-color-danger);
}
.bless-ship__name {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.is-done .bless-ship__name,
.is-current .bless-ship__name {
  color: var(--bless-color-text);
}
.is-current .bless-ship__name {
  font-weight: var(--bless-font-weight-bold);
}
.bless-ship__date,
.bless-ship__meta {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-ship__problem {
  margin: 0;
  padding: var(--bless-space-2) var(--bless-space-3);
  border-inline-start: 3px solid var(--bless-color-danger);
  background: var(--bless-color-surface-2);
}
.bless-ship__latest p {
  display: flex;
  flex-direction: column;
  margin: var(--bless-space-1) 0 0;
}
.bless-ship__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
  color: var(--bless-color-text-muted);
}
.bless-ship__history summary {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  cursor: pointer;
  font-weight: var(--bless-font-weight-bold);
  list-style: none;
}
.bless-ship__history summary::-webkit-details-marker {
  display: none;
}
.bless-ship__history summary::after {
  content: "";
  inline-size: 6px;
  block-size: 6px;
  border-inline-end: 1.5px solid currentColor;
  border-block-end: 1.5px solid currentColor;
  rotate: -45deg;
  transition: rotate var(--bless-duration-fast) var(--bless-ease-out);
}
[dir="rtl"] .bless-ship__history summary::after {
  rotate: 135deg;
}
.bless-ship__history[open] summary::after {
  rotate: 45deg;
}
@media (prefers-reduced-motion: reduce) {
  .bless-ship__history summary::after {
    transition: none;
  }
}
.bless-ship__history summary:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-ship__history ol {
  display: grid;
  gap: var(--bless-space-2);
  margin: var(--bless-space-2) 0 0;
  padding: 0;
  list-style: none;
}
.bless-ship__history li {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: var(--bless-space-3);
}
.bless-ship__tracking {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-ship__tracking a,
.bless-ship__tracking code {
  color: var(--bless-color-text);
  font-family: var(--bless-font-mono);
}
</style>
