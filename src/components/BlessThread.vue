<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import BlessMessage from "./BlessMessage.vue";

defineOptions({ name: "BlessThread" });
const pack = useLabelPack("BlessThread");

export interface BlessThreadComment {
  id: string | number;
  name?: string;
  avatar?: string;
  /** shown text: "2 h ago" */
  time?: string;
  /** machine-readable `time` */
  datetime?: string;
  /** plain text; use the default slot for rich content */
  body?: string;
  replies?: BlessThreadComment[];
  /** start with the replies folded */
  collapsed?: boolean;
}

const props = withDefaults(
  defineProps<{
    comments: BlessThreadComment[];
    /** replies deeper than this stop indenting, so a long chain stays readable on a phone */
    maxDepth?: number;
    labels?: Partial<{ replies: (n: number) => string }>;
    /** @internal nesting level, set by the thread itself */
    depth?: number;
  }>(),
  { maxDepth: 3, depth: 0 },
);
defineSlots<{
  default?(p: { comment: BlessThreadComment; depth: number }): unknown;
  footer?(p: { comment: BlessThreadComment; depth: number }): unknown;
  actions?(p: { comment: BlessThreadComment; depth: number }): unknown;
}>();

const count = (c: BlessThreadComment): number =>
  (c.replies ?? []).reduce((n, r) => n + 1 + count(r), 0);
const words = (n: number) =>
  (
    props.labels?.replies ??
    (pack().replies as ((n: number) => string) | undefined) ??
    ((n: number) => (n === 1 ? "1 reply" : `${n} replies`))
  )(n);
</script>

<template>
  <ol class="bless-stagger bless-thread" :class="{ 'bless-thread--flat': depth > maxDepth }">
    <li v-for="c in comments" :key="c.id" class="bless-thread__item">
      <BlessMessage :name="c.name" :avatar="c.avatar" :time="c.time" :datetime="c.datetime">
        <slot :comment="c" :depth>{{ c.body }}</slot>
        <template v-if="$slots.footer" #footer><slot name="footer" :comment="c" :depth /></template>
        <template v-if="$slots.actions" #actions
          ><slot name="actions" :comment="c" :depth
        /></template>
      </BlessMessage>
      <details v-if="c.replies?.length" class="bless-thread__replies" :open="!c.collapsed">
        <summary class="bless-thread__toggle">{{ words(count(c)) }}</summary>
        <BlessThread :comments="c.replies" :max-depth :labels :depth="depth + 1">
          <template v-if="$slots.default" #default="s"><slot v-bind="s" /></template>
          <template v-if="$slots.footer" #footer="s"><slot name="footer" v-bind="s" /></template>
          <template v-if="$slots.actions" #actions="s"><slot name="actions" v-bind="s" /></template>
        </BlessThread>
      </details>
    </li>
  </ol>
</template>

<style>
.bless-thread {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-thread__replies {
  /* the rule lines up under the avatar (sm 32px), so the reply hangs from its parent */
  margin-block-start: var(--bless-space-2);
  margin-inline-start: 15px;
  padding-inline-start: calc(17px + var(--bless-space-2) - var(--bless-border-width));
  border-inline-start: var(--bless-border-width) solid var(--bless-color-rule);
}
.bless-thread__replies > .bless-thread {
  margin-block-start: var(--bless-space-2);
}
/* past maxDepth: no more indent, the replies sit under the same rule */
.bless-thread--flat > .bless-thread__item > .bless-thread__replies {
  margin-inline-start: 0;
  padding-inline-start: 0;
  border-inline-start: 0;
}
.bless-thread__toggle {
  width: fit-content;
  cursor: pointer;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  color: var(--bless-color-text-muted);
}
.bless-thread__toggle:hover {
  color: var(--bless-color-text);
}
</style>
