<template>
  <details
    class="bless-reasoning"
    :class="{ 'is-streaming': streaming }"
    :open="shown"
    @toggle="toggle"
  >
    <summary class="bless-reasoning__head">
      <svg
        class="bless-reasoning__icon"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path
          d="M8 1.5a4.5 4.5 0 0 0-2.6 8.2V12h5.2V9.7A4.5 4.5 0 0 0 8 1.5ZM6 14h4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="bless-reasoning__title">{{ head }}</span>
    </summary>
    <div class="bless-reasoning__body" :aria-busy="streaming || undefined">
      <slot>{{ props.text }}</slot>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessReasoning" });
const pack = useLabelPack("BlessReasoning");

const props = defineProps<{
  /** the reasoning text so far; or put it in the default slot */
  text?: string;
  /** the model is still thinking: the panel is open and the head says so */
  streaming?: boolean;
  /** how long the model thought, in seconds; default: the time it was streaming */
  duration?: number;
  labels?: Partial<{
    thinking: string;
    /** the head after the end, with the time in whole seconds */ thought: (
      seconds: number,
    ) => string;
    /** the head when the time is not known */ done: string;
  }>;
}>();

const text = computed(() => ({
  thinking: "Thinking…",
  thought: (s: number) => (s < 1 ? "Thought for a moment" : `Thought for ${s} s`),
  done: "Reasoning",
  ...pack(),
  ...props.labels,
}));

/** open while it streams, and it closes at the end unless the reader opened or closed it */
const open = defineModel<boolean>("open");
const shown = ref(open.value || !!props.streaming);
let touched = false;
let started = 0;
const measured = ref<number>();
watch(
  () => props.streaming,
  (now, before) => {
    if (now) {
      started = Date.now();
      if (!touched) shown.value = true;
    } else if (before) {
      measured.value = Math.round((Date.now() - started) / 1000);
      if (!touched) shown.value = false;
    }
  },
  { immediate: true },
);
watch(open, (v) => (shown.value = !!v));

const seconds = computed(() => props.duration ?? measured.value);
const head = computed(() =>
  props.streaming
    ? text.value.thinking
    : seconds.value !== undefined
      ? text.value.thought(seconds.value)
      : text.value.done,
);
function toggle(e: Event) {
  const now = (e.target as HTMLDetailsElement).open;
  if (now === shown.value) return;
  touched = true;
  shown.value = now;
  open.value = now;
}
</script>

<style>
.bless-reasoning {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-reasoning__head {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding-block: var(--bless-space-1);
  cursor: pointer;
  list-style: none;
}
.bless-reasoning__head::-webkit-details-marker {
  display: none;
}
.bless-reasoning__head::after {
  content: "";
  inline-size: 6px;
  block-size: 6px;
  margin-inline-start: var(--bless-space-1);
  border-inline-end: 1.5px solid currentColor;
  border-block-end: 1.5px solid currentColor;
  rotate: -45deg;
  transition: rotate var(--bless-duration-fast) var(--bless-ease-out);
}
[dir="rtl"] .bless-reasoning__head::after {
  rotate: 135deg;
}
.bless-reasoning[open] > .bless-reasoning__head::after {
  rotate: 45deg;
}
.bless-reasoning__head:hover {
  color: var(--bless-color-text);
}
.bless-reasoning__head:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-reasoning__icon {
  flex: none;
}
/* a soft light runs over the words while the model thinks */
.is-streaming .bless-reasoning__title {
  background: linear-gradient(
      90deg,
      var(--bless-color-text-muted) 40%,
      var(--bless-color-text) 50%,
      var(--bless-color-text-muted) 60%
    )
    0 0 / 300% 100%;
  background-clip: text;
  color: transparent;
  animation: bless-reasoning-shine 2s linear infinite;
}
@keyframes bless-reasoning-shine {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: 0 0;
  }
}
.bless-reasoning__body {
  margin-block-start: var(--bless-space-1);
  padding-inline-start: var(--bless-space-4);
  border-inline-start: 2px solid var(--bless-color-border);
  line-height: 1.6;
  white-space: pre-wrap;
}
@media (prefers-reduced-motion: reduce) {
  .bless-reasoning__head::after {
    transition: none;
  }
  .is-streaming .bless-reasoning__title {
    animation: none;
    color: var(--bless-color-text-muted);
    background: none;
  }
}
.bless-reasoning,
.bless-reasoning[open] .bless-reasoning__body {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
