<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessWorkInstructions" });
const pack = useLabelPack("BlessWorkInstructions");

export interface BlessInstructionStep {
  title: string;
  body: string;
  image?: string;
  /** what the picture shows */
  alt?: string;
  /** a safety or quality warning for this step */
  caution?: string;
}

const props = defineProps<{
  /** the job, for the title */
  job?: string;
  steps: BlessInstructionStep[];
  labels?: Partial<{
    title: string;
    step: (n: number, total: number) => string;
    back: string;
    next: string;
    finish: string;
    caution: string;
  }>;
}>();
/** the index of the step on the screen */
const at = defineModel<number>({ default: 0 });
const emit = defineEmits<{ finish: [] }>();

const text = computed(() => ({
  title: "Work instructions",
  step: (n: number, t: number) => `Step ${n} of ${t}`,
  back: "Back",
  next: "Next step",
  finish: "Finish",
  caution: "Caution",
  ...pack(),
  ...props.labels,
}));
const step = computed(() => props.steps[at.value]);
const last = computed(() => at.value >= props.steps.length - 1);
const root = ref<HTMLElement>();
function go(d: 1 | -1) {
  if (d === 1 && last.value) return emit("finish");
  at.value = Math.min(props.steps.length - 1, Math.max(0, at.value + d));
  nextTick(() => root.value?.querySelector<HTMLElement>(".bless-instructions__title")?.focus());
}
</script>

<template>
  <section ref="root" class="bless-instructions" :aria-label="job ?? text.title">
    <div class="bless-instructions__top">
      <span v-if="job" class="bless-instructions__job">{{ job }}</span>
      <span class="bless-instructions__count">{{ text.step(at + 1, steps.length) }}</span>
    </div>
    <div class="bless-instructions__track" aria-hidden="true">
      <span v-for="(_, i) in steps" :key="i" :class="{ 'is-done': i < at, 'is-now': i === at }" />
    </div>
    <article v-if="step" class="bless-instructions__step">
      <h3 class="bless-instructions__title" tabindex="-1">{{ step.title }}</h3>
      <img
        v-if="step.image"
        class="bless-instructions__img"
        :src="step.image"
        :alt="step.alt ?? ''"
      />
      <p v-if="step.caution" class="bless-instructions__caution" role="note">
        <strong><span aria-hidden="true">⚠ </span>{{ text.caution }}:</strong> {{ step.caution }}
      </p>
      <p class="bless-instructions__body">{{ step.body }}</p>
    </article>
    <div class="bless-instructions__nav">
      <button type="button" class="bless-instructions__btn" :disabled="at === 0" @click="go(-1)">
        ← {{ text.back }}
      </button>
      <BlessButton class="bless-instructions__btn is-next" @click="go(1)"
        >{{ last ? text.finish : text.next }} →</BlessButton
      >
    </div>
  </section>
</template>

<style>
.bless-instructions {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  color: var(--bless-color-text);
}
.bless-instructions__top {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
  font-size: var(--bless-text-sm);
}
.bless-instructions__job {
  font-weight: var(--bless-font-weight-bold);
}
.bless-instructions__track {
  display: flex;
  gap: 3px;
}
.bless-instructions__track span {
  flex: 1;
  block-size: 6px;
  background: var(--bless-color-surface-2);
}
.bless-instructions__track span.is-done {
  background: var(--bless-color-text);
}
.bless-instructions__track span.is-now {
  background: var(--bless-color-accent);
}
.bless-instructions__step {
  display: grid;
  gap: var(--bless-space-3);
}
/* two classes, so the heading styles of a host page do not win */
.bless-instructions .bless-instructions__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-xl);
  line-height: var(--bless-leading-tight);
}
.bless-instructions__title:focus {
  outline: none;
}
.bless-instructions__img {
  inline-size: 100%;
  max-block-size: 22rem;
  object-fit: contain;
  background: var(--bless-color-surface-2);
}
.bless-instructions__caution {
  margin: 0;
  padding: var(--bless-space-3);
  border: 3px solid var(--bless-color-warning);
  background: color-mix(in srgb, var(--bless-color-warning) 14%, var(--bless-color-bg));
}
.bless-instructions__body {
  margin: 0;
  line-height: 1.55;
  white-space: pre-line;
}
.bless-instructions__nav {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--bless-space-3);
}
/* big targets for gloves */
.bless-instructions__btn {
  min-block-size: 3.5rem;
  font-size: var(--bless-text-md);
}
button.bless-instructions__btn:not(.is-next) {
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font-family: inherit;
  cursor: pointer;
}
button.bless-instructions__btn:disabled {
  opacity: 0.4;
  cursor: default;
}
button.bless-instructions__btn:focus-visible {
  outline: 3px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-instructions {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
