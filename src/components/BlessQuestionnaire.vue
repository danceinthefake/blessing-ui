<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessCheckbox from "./BlessCheckbox.vue";
import BlessProgress from "./BlessProgress.vue";
import BlessRadio from "./BlessRadio.vue";
import BlessRadioGroup from "./BlessRadioGroup.vue";
import BlessTextarea from "./BlessTextarea.vue";
import type { BlessAnswers, BlessQuestion } from "./questionnaire";

defineOptions({ name: "BlessQuestionnaire" });

const props = withDefaults(
  defineProps<{
    questions: BlessQuestion[];
    /** 1-based shortcut keys for choices */
    shortcuts?: boolean;
    labels?: Partial<{
      next: string;
      previous: string;
      skip: string;
      submit: string;
      required: string;
    }>;
  }>(),
  { shortcuts: true },
);
const answers = defineModel<BlessAnswers>({ default: () => ({}) });
const step = defineModel<number>("step", { default: 0 });
const emit = defineEmits<{ submit: [answers: BlessAnswers]; skip: [question: BlessQuestion] }>();

const L = computed(() => ({
  next: "Next",
  previous: "Back",
  skip: "Skip",
  submit: "Submit",
  required: "Please answer to continue.",
  ...props.labels,
}));
const q = computed(() => props.questions[step.value]);
const last = computed(() => step.value === props.questions.length - 1);
const error = ref("");
watch(step, () => (error.value = ""));

const isAnswered = (x: BlessQuestion) => {
  const v = answers.value[x.name];
  return Array.isArray(v) ? v.length > 0 : !!v?.trim();
};
const set = (v: string | string[] | undefined) =>
  (answers.value = { ...answers.value, [q.value.name]: v });

function next() {
  if (q.value.required !== false && !isAnswered(q.value)) {
    error.value = L.value.required;
    return;
  }
  if (last.value) emit("submit", answers.value);
  else step.value++;
}
function skip() {
  emit("skip", q.value);
  set(undefined);
  if (last.value) emit("submit", answers.value);
  else step.value++;
}
function onKey(e: KeyboardEvent) {
  if (!props.shortcuts || q.value.type === "freeform") return;
  const n = Number(e.key);
  const c = q.value.choices?.[n - 1];
  if (!c) return;
  if (q.value.type === "single") set(c.value);
  else {
    const cur = (answers.value[q.value.name] as string[] | undefined) ?? [];
    set(cur.includes(c.value) ? cur.filter((v) => v !== c.value) : [...cur, c.value]);
  }
}
</script>

<template>
  <form class="bless-questionnaire" novalidate @submit.prevent="next" @keydown="onKey">
    <BlessProgress
      :value="step + 1"
      :max="questions.length"
      size="sm"
      :label="`${step + 1} / ${questions.length}`"
      class="bless-questionnaire__progress"
    />
    <p class="bless-questionnaire__count">{{ step + 1 }} / {{ questions.length }}</p>

    <fieldset :key="q.name" class="bless-questionnaire__item">
      <legend class="bless-questionnaire__title">{{ q.title }}</legend>
      <p v-if="q.description" class="bless-questionnaire__desc">{{ q.description }}</p>

      <BlessRadioGroup
        v-if="q.type === 'single'"
        :model-value="answers[q.name] as string | undefined"
        :name="q.name"
        :invalid="!!error"
        @update:model-value="set($event)"
      >
        <BlessRadio
          v-for="(c, i) in q.choices"
          :key="c.value"
          :value="c.value"
          :description="c.description"
        >
          <kbd v-if="shortcuts" class="bless-questionnaire__key">{{ i + 1 }}</kbd
          >{{ c.label }}
        </BlessRadio>
      </BlessRadioGroup>

      <div v-else-if="q.type === 'multiple'" class="bless-questionnaire__choices">
        <BlessCheckbox
          v-for="(c, i) in q.choices"
          :key="c.value"
          :model-value="(answers[q.name] as string[] | undefined) ?? []"
          :value="c.value"
          :description="c.description"
          :invalid="!!error"
          @update:model-value="set($event as string[])"
        >
          <kbd v-if="shortcuts" class="bless-questionnaire__key">{{ i + 1 }}</kbd
          >{{ c.label }}
        </BlessCheckbox>
      </div>

      <BlessTextarea
        v-else
        :model-value="(answers[q.name] as string | undefined) ?? ''"
        :placeholder="q.placeholder"
        :invalid="!!error"
        @update:model-value="set($event)"
      />

      <p v-if="error" class="bless-questionnaire__error" role="alert">{{ error }}</p>
    </fieldset>

    <div class="bless-questionnaire__actions">
      <BlessButton variant="ghost" size="sm" :disabled="step === 0" @click="step--">
        {{ L.previous }}
      </BlessButton>
      <span class="bless-questionnaire__spacer" />
      <BlessButton v-if="q.skippable" variant="outline" size="sm" @click="skip">
        {{ L.skip }}
      </BlessButton>
      <BlessButton type="submit" color="accent" size="sm">
        {{ last ? L.submit : L.next }}
      </BlessButton>
    </div>
  </form>
</template>

<style>
.bless-questionnaire {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-questionnaire__count {
  margin: calc(-1 * var(--bless-space-3)) 0 0;
  font-size: var(--bless-text-2xs);
  letter-spacing: var(--bless-tracking-wider);
  color: var(--bless-color-text-muted);
}
.bless-questionnaire__item {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}
.bless-questionnaire__title {
  padding: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-light);
  line-height: var(--bless-leading-tight);
}
.bless-questionnaire__desc {
  margin: 0;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-questionnaire__choices {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
}
.bless-questionnaire__key {
  display: inline-block;
  min-width: 1.4em;
  margin-right: var(--bless-space-2);
  font-family: inherit;
  font-size: var(--bless-text-2xs);
  text-align: center;
  color: var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-questionnaire__error {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-danger);
}
.bless-questionnaire__actions {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-questionnaire__spacer {
  flex: 1;
}
</style>
