<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import "./sr.css";

defineOptions({ name: "BlessDocumentStatus" });
const pack = useLabelPack("BlessDocumentStatus");

export interface BlessDocState {
  id: string;
  label: string;
  /** when the document reached this state, as text */
  time?: string;
}

const props = defineProps<{
  /** the states in order */
  states: BlessDocState[];
  /** the document stopped, for example cancelled; the chain ends with this word */
  stopped?: string;
  labels?: Partial<{
    title: string;
    done: string;
    current: string;
    next: string;
    move: (state: string) => string;
  }>;
}>();
/** the id of the state the document is in */
const current = defineModel<string>();
const emit = defineEmits<{ advance: [id: string] }>();

const text = computed(() => ({
  title: "Document status",
  done: "done",
  current: "current state",
  next: "not yet",
  move: (s: string) => `Mark as ${s}`,
  ...pack(),
  ...props.labels,
}));
const at = computed(() =>
  Math.max(
    0,
    props.states.findIndex((s) => s.id === current.value),
  ),
);
const nextState = computed(() => (props.stopped ? undefined : props.states[at.value + 1]));
const kind = (i: number) => (i < at.value ? "done" : i === at.value ? "current" : "next");
function advance() {
  if (!nextState.value) return;
  current.value = nextState.value.id;
  emit("advance", nextState.value.id);
}
const MARK = { done: "✓", current: "●", next: "○" } as const;
</script>

<template>
  <div class="bless-docstate" :class="{ 'is-stopped': stopped }">
    <ol class="bless-stagger bless-docstate__chain" :aria-label="text.title" role="list">
      <li
        v-for="(s, i) in states"
        :key="s.id"
        class="bless-docstate__state"
        :class="`is-${kind(i)}`"
        :aria-current="kind(i) === 'current' ? 'step' : undefined"
      >
        <span class="bless-docstate__mark" aria-hidden="true">{{ MARK[kind(i)] }}</span>
        <span class="bless-docstate__label">{{ s.label }}</span>
        <span class="bless-sr">, {{ text[kind(i)] }}</span>
        <span v-if="s.time && kind(i) !== 'next'" class="bless-docstate__time">{{ s.time }}</span>
      </li>
      <li v-if="stopped" class="bless-docstate__state is-stop">
        <span class="bless-docstate__mark" aria-hidden="true">✕</span>
        <span class="bless-docstate__label">{{ stopped }}</span>
      </li>
    </ol>
    <BlessButton v-if="nextState" size="sm" @click="advance">{{
      text.move(nextState.label)
    }}</BlessButton>
  </div>
</template>

<style>
.bless-docstate {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-docstate__chain {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-docstate__state {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  margin-inline-end: -1px;
}
/* the space sits on the children, so a list reset of the host page keeps it */
.bless-docstate__state > :first-child {
  margin: var(--bless-space-2) 0 var(--bless-space-2) var(--bless-space-3);
}
.bless-docstate__state > .bless-docstate__label {
  margin-inline-end: var(--bless-space-3);
}
.bless-docstate__time {
  grid-column: 2;
  margin: -6px var(--bless-space-3) var(--bless-space-2) 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-docstate__state.is-done .bless-docstate__label {
  font-weight: var(--bless-font-weight-normal);
}
/* the current state is filled; done states are plain; the next ones are dashed */
.bless-docstate__state.is-current {
  position: relative;
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-docstate__state.is-current .bless-docstate__time {
  color: inherit;
}
.bless-docstate__state.is-next {
  border-style: dashed;
  color: var(--bless-color-text-muted);
}
.bless-docstate__state.is-stop {
  border: 2px solid var(--bless-color-danger);
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.is-stopped .bless-docstate__state.is-next {
  text-decoration: line-through;
}
</style>
