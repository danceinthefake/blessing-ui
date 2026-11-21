<template>
  <article class="bless-workorder" :class="`is-${state}`">
    <div class="bless-workorder__top">
      <span class="bless-workorder__number">{{ number }}</span>
      <span class="bless-workorder__state"
        ><span aria-hidden="true">{{ MARK[state] }}</span> {{ text[state] }}</span
      >
    </div>
    <h3 class="bless-workorder__product">{{ product }}</h3>
    <p class="bless-workorder__meta">
      <template v-if="station">{{ station }}</template><template v-if="station && due"> · </template
      ><template v-if="due">{{ text.due(due) }}</template>
    </p>
    <div class="bless-workorder__progress">
      <span class="bless-workorder__count">{{
        text.progress(num.format(done), `${num.format(target)} ${unit}`)
      }}</span>
      <progress
        :value="done"
        :max="target"
        :aria-label="text.progress(num.format(done), `${num.format(target)} ${unit}`)"
      />
      <span class="bless-workorder__pct" aria-hidden="true">{{ Math.round(share * 100) }}%</span>
    </div>
    <div v-if="state !== 'done'" class="bless-workorder__actions">
      <BlessButton v-if="state === 'queued'" size="sm" @click="emit('start')">{{
        text.start
      }}</BlessButton>
      <BlessButton
        v-else-if="state === 'running'"
        size="sm"
        variant="outline"
        @click="emit('pause')"
        >{{ text.pause }}</BlessButton
      >
      <BlessButton v-else size="sm" @click="emit('start')">{{ text.resume }}</BlessButton>
      <BlessButton v-if="state !== 'queued'" size="sm" variant="ghost" @click="emit('finish')">{{
        text.finish
      }}</BlessButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessWorkOrderCard" });
const pack = useLabelPack("BlessWorkOrderCard");

export type BlessWorkOrderState = "queued" | "running" | "paused" | "blocked" | "done";

const props = withDefaults(
  defineProps<{
    number: string;
    product: string;
    /** how many to make */
    target: number;
    /** how many are made */
    done?: number;
    unit?: string;
    /** the due time, as text */
    due?: string;
    /** the station or the line */
    station?: string;
    state?: BlessWorkOrderState;
    locale?: string;
    labels?: Partial<
      Record<BlessWorkOrderState, string> & {
        start: string;
        pause: string;
        resume: string;
        finish: string;
        due: (time: string) => string;
        progress: (done: string, target: string) => string;
      }
    >;
  }>(),
  { done: 0, unit: "pcs", state: "queued", locale: "en" },
);
const emit = defineEmits<{ start: []; pause: []; finish: [] }>();

const text = computed(() => ({
  queued: "Queued",
  running: "Running",
  paused: "Paused",
  blocked: "Blocked",
  done: "Done",
  start: "Start",
  pause: "Pause",
  resume: "Resume",
  finish: "Finish",
  due: (t: string) => `Due ${t}`,
  progress: (d: string, t: string) => `${d} of ${t}`,
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale));
const share = computed(() => (props.target ? Math.min(1, props.done / props.target) : 0));
const MARK: Record<BlessWorkOrderState, string> = {
  queued: "○",
  running: "▶",
  paused: "❚❚",
  blocked: "✕",
  done: "✓",
};
</script>

<style>
.bless-workorder {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3) var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-block-start: 4px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-workorder.is-running {
  border-block-start-color: var(--bless-color-accent);
}
.bless-workorder.is-blocked {
  border: 2px dashed var(--bless-color-danger);
  border-block-start-width: 4px;
}
.bless-workorder.is-done {
  border-block-start-color: var(--bless-color-text);
}
.bless-workorder__top {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-workorder__number {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-workorder__state {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
}
.is-blocked .bless-workorder__state {
  color: var(--bless-color-danger-text);
}
/* two classes, so the heading styles of a host page do not win */
.bless-workorder .bless-workorder__product {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-tight);
}
.bless-workorder__meta {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-workorder__meta:empty {
  display: none;
}
.bless-workorder__progress {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2px var(--bless-space-2);
}
.bless-workorder__count {
  grid-column: 1 / -1;
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-workorder__progress progress {
  inline-size: 100%;
  block-size: 0.6rem;
  accent-color: var(--bless-color-accent);
}
.bless-workorder__pct {
  font-size: var(--bless-text-xs);
  font-variant-numeric: tabular-nums;
}
.bless-workorder__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-workorder {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
