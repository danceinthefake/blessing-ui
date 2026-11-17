<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessApplicationStatus" });
const pack = useLabelPack("BlessApplicationStatus");

export type BlessApplicationState = "progress" | "action" | "approved" | "rejected";
export interface BlessApplicationStep {
  label: string;
  /** the date as text, once the step is done */
  date?: string;
  note?: string;
}

const props = defineProps<{
  /** the name of the service, for example "Business permit" */
  title: string;
  reference: string;
  steps: BlessApplicationStep[];
  /** the index of the step that is going on now */
  current: number;
  state?: BlessApplicationState;
  /** what happens next, in plain words */
  next?: string;
  /** when the person needs to do something: what, and a link to do it */
  action?: string;
  actionHref?: string;
  actionLabel?: string;
  labels?: Partial<
    Record<BlessApplicationState, string> & {
      reference: string;
      steps: string;
      done: string;
      now: string;
      later: string;
      next: string;
    }
  >;
}>();

const text = computed(() => ({
  progress: "In progress",
  action: "We need something from you",
  approved: "Approved",
  rejected: "Not approved",
  reference: "Reference",
  steps: "Steps",
  done: "done",
  now: "now",
  later: "to come",
  next: "What happens next",
  ...pack(),
  ...props.labels,
}));
const state = computed(() => props.state ?? "progress");
const MARK: Record<BlessApplicationState, string> = {
  progress: "◐",
  action: "!",
  approved: "✓",
  rejected: "✕",
};
const when = (i: number) =>
  i < props.current || (i === props.current && ["approved", "rejected"].includes(state.value))
    ? "done"
    : i === props.current
      ? "now"
      : "later";
</script>

<template>
  <section class="bless-appstatus" :aria-label="`${title}, ${reference}`">
    <header class="bless-appstatus__head">
      <div class="bless-appstatus__title">{{ title }}</div>
      <div class="bless-appstatus__ref">{{ text.reference }} <strong>{{ reference }}</strong></div>
    </header>
    <div class="bless-appstatus__state" :class="`is-${state}`" role="status">
      <span aria-hidden="true" class="bless-appstatus__mark">{{ MARK[state] }}</span>
      {{ text[state] }}
    </div>
    <div v-if="action" class="bless-appstatus__action">
      <div>{{ action }}</div>
      <a v-if="actionHref" :href="actionHref">{{ actionLabel ?? action }}</a>
    </div>
    <ol class="bless-stagger bless-appstatus__steps" :aria-label="text.steps">
      <li
        v-for="(s, i) in steps"
        :key="i"
        :class="`is-${when(i)}`"
        :aria-current="when(i) === 'now' ? 'step' : undefined"
      >
        <div class="bless-appstatus__step">
          <span class="bless-appstatus__dot" aria-hidden="true">{{
            when(i) === "done" ? "✓" : i + 1
          }}</span>
          <span class="bless-appstatus__body">
            <span class="bless-appstatus__label">
              {{ s.label }}<span class="bless-sr">{{ `, ${text[when(i)]}` }}</span>
            </span>
            <span v-if="s.date" class="bless-appstatus__date">{{ s.date }}</span>
            <span v-if="s.note" class="bless-appstatus__note">{{ s.note }}</span>
          </span>
        </div>
      </li>
    </ol>
    <div v-if="next" class="bless-appstatus__next">
      <div class="bless-appstatus__label">{{ text.next }}</div>
      <div>{{ next }}</div>
    </div>
  </section>
</template>

<style>
.bless-appstatus {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 36rem;
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-appstatus__head {
  display: grid;
  gap: 2px;
}
.bless-appstatus__title {
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-appstatus__ref strong {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  letter-spacing: 0.04em;
}
.bless-appstatus__state {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 2px solid var(--bless-color-text);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-appstatus__state.is-approved {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-appstatus__state:is(.is-rejected, .is-action) {
  border-color: var(--bless-color-danger);
  color: var(--bless-color-danger-text);
}
.bless-appstatus__mark {
  display: grid;
  place-items: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
}
.bless-appstatus__action {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
  border-inline-start: 4px solid var(--bless-color-danger);
  background: var(--bless-color-surface-2);
}
.bless-appstatus__action a {
  justify-self: start;
  color: inherit;
  font-weight: var(--bless-font-weight-bold);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.bless-appstatus__action a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-appstatus__steps {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-appstatus__step {
  position: relative;
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: var(--bless-space-3);
  padding-block-end: var(--bless-space-4);
}
/* the line between the dots: solid for done steps, dashed for the steps to come */
.bless-appstatus__steps li:not(:last-child) .bless-appstatus__step::before {
  content: "";
  position: absolute;
  inset-block: 2rem 0;
  inset-inline-start: calc(1rem - 1px);
  border-inline-start: 2px solid var(--bless-color-text);
}
.bless-appstatus__steps li:is(.is-now, .is-later) .bless-appstatus__step::before {
  border-inline-start-style: dashed;
  border-inline-start-color: var(--bless-color-border);
}
.bless-appstatus__dot {
  display: grid;
  place-items: center;
  inline-size: 2rem;
  block-size: 2rem;
  box-sizing: border-box;
  border: 2px solid var(--bless-color-text);
  border-radius: 50%;
  background: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
}
.is-done .bless-appstatus__dot {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.is-now .bless-appstatus__dot {
  border-color: var(--bless-color-accent);
  box-shadow: 0 0 0 3px var(--bless-color-accent);
}
.is-later .bless-appstatus__dot {
  border-style: dashed;
}
.bless-appstatus__body {
  display: grid;
  gap: 2px;
  padding-block-start: 0.3rem;
}
.bless-appstatus__label {
  font-weight: var(--bless-font-weight-bold);
}
.bless-appstatus__date,
.bless-appstatus__note {
  font-size: var(--bless-text-xs);
}
.bless-appstatus__next {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-3);
  background: var(--bless-color-surface-2);
}
</style>
