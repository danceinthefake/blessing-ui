<template>
  <section class="bless-plan" :aria-label="title ?? text.summary(done, steps.length)">
    <header class="bless-plan__head">
      <strong v-if="title" class="bless-plan__title">{{ title }}</strong>
      <span class="bless-plan__summary">{{ text.summary(done, steps.length) }}</span>
      <span class="bless-plan__bar" aria-hidden="true">
        <span :style="{ inlineSize: `${(done / Math.max(1, steps.length)) * 100}%` }" />
      </span>
    </header>
    <ol class="bless-stagger bless-plan__list">
      <li
        v-for="s in steps"
        :key="s.id"
        class="bless-plan__step"
        :class="`is-${s.status}`"
        :aria-current="s.status === 'running' ? 'step' : undefined"
      >
        <span class="bless-plan__icon" aria-hidden="true">
          <BlessSpinner v-if="s.status === 'running'" size="sm" label="" />
          <svg v-else-if="ICON[s.status]" viewBox="0 0 16 16" width="14" height="14">
            <path :d="ICON[s.status]" />
          </svg>
          <i v-else class="bless-plan__dot" />
        </span>
        <div class="bless-plan__main">
          <span class="bless-plan__step-title">{{ s.title }}</span>
          <span class="bless-sr">, {{ text[s.status] }}</span>
          <span v-if="s.detail" class="bless-plan__detail">{{ s.detail }}</span>
        </div>
      </li>
    </ol>
    <p class="bless-sr" role="status">{{ current ? `${text.running}: ${current.title}` : "" }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessSpinner from "./BlessSpinner.vue";
import "./sr.css";

defineOptions({ name: "BlessAgentPlan" });
const pack = useLabelPack("BlessAgentPlan");

export type BlessStepStatus = "pending" | "running" | "done" | "failed" | "skipped";
export interface BlessPlanStep {
  id: string | number;
  title: string;
  status: BlessStepStatus;
  /** a short line under the step, for example what it found or why it failed */
  detail?: string;
}

const props = defineProps<{
  steps: BlessPlanStep[];
  /** the goal of the plan, at the top */
  title?: string;
  labels?: Partial<
    Record<BlessStepStatus, string> & {
      /** the line with the progress */ summary: (done: number, total: number) => string;
    }
  >;
}>();

const text = computed(() => ({
  pending: "Waiting",
  running: "Running",
  done: "Done",
  failed: "Failed",
  skipped: "Skipped",
  summary: (d: number, t: number) => `${d} of ${t} steps done`,
  ...pack(),
  ...props.labels,
}));
const done = computed(() => props.steps.filter((s) => s.status === "done").length);
const current = computed(() => props.steps.find((s) => s.status === "running"));
const ICON: Partial<Record<BlessStepStatus, string>> = {
  done: "M3 8.5 6.5 12 13 4.5",
  failed: "M4 4l8 8M12 4l-8 8",
  skipped: "M4 8h8",
};
</script>

<style>
.bless-plan {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-plan__head {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: var(--bless-space-1) var(--bless-space-3);
  margin-block-end: var(--bless-space-3);
}
.bless-plan__summary {
  grid-column: -2;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-plan__bar {
  grid-column: 1 / -1;
  block-size: 3px;
  background: var(--bless-color-surface-2);
}
.bless-plan__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
  transition: inline-size var(--bless-duration-base) var(--bless-ease-out);
}
.bless-plan__list {
  position: relative;
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-plan__step {
  display: flex;
  gap: var(--bless-space-3);
}
.bless-plan__icon {
  display: inline-grid;
  flex: none;
  place-items: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
}
.bless-plan__icon svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-plan__dot {
  inline-size: 8px;
  block-size: 8px;
  border: 1.5px solid var(--bless-color-text-muted);
  border-radius: 50%;
}
.bless-plan__main {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
}
.bless-plan__detail {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
/* each state has its own icon and text weight, so the color is never the only sign */
.is-pending .bless-plan__step-title,
.is-skipped .bless-plan__step-title {
  color: var(--bless-color-text-muted);
}
.is-skipped .bless-plan__step-title {
  text-decoration: line-through;
}
.is-running .bless-plan__step-title {
  font-weight: var(--bless-font-weight-bold);
}
.is-done .bless-plan__icon {
  color: var(--bless-color-success);
}
.is-failed .bless-plan__icon,
.is-failed .bless-plan__detail {
  color: var(--bless-color-danger-text);
}
@media (prefers-reduced-motion: reduce) {
  .bless-plan__bar span {
    transition: none;
  }
}
</style>
