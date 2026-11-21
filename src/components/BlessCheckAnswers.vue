<template>
  <form class="bless-answers" novalidate @submit.prevent="send">
    <section v-for="g in groups" :key="g.title" class="bless-answers__group">
      <h3 class="bless-answers__title">{{ g.title }}</h3>
      <dl class="bless-answers__list">
        <div v-for="r in g.rows" :key="r.key" class="bless-answers__row">
          <dt>{{ r.label }}</dt>
          <dd class="bless-answers__value">
            <template v-if="lines(r.value).length">
              <div v-for="(l, i) in lines(r.value)" :key="i">{{ l }}</div>
            </template>
            <span v-else class="bless-answers__empty">{{ text.empty }}</span>
          </dd>
          <dd class="bless-answers__action">
            <a v-if="r.href" :href="r.href"
              >{{ text.change }}<span class="bless-sr">{{ ` ${r.label}` }}</span></a
            >
            <button v-else type="button" @click="emit('change', r.key)">
              {{ text.change }}<span class="bless-sr">{{ ` ${r.label}` }}</span>
            </button>
          </dd>
        </div>
      </dl>
    </section>
    <div v-if="declaration" class="bless-answers__declare" :class="{ 'is-error': error }">
      <p class="bless-answers__statement">{{ declaration }}</p>
      <p v-if="error" :id="errorId" class="bless-answers__error">
        {{ text.mustAgree }}
      </p>
      <label class="bless-answers__agree">
        <input
          v-model="agreed"
          type="checkbox"
          :aria-invalid="error || undefined"
          :aria-describedby="error ? errorId : undefined"
          @change="error = false"
        />
        {{ text.agree }}
      </label>
    </div>
    <div>
      <button type="submit" class="bless-answers__send">{{ text.send }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessCheckAnswers" });
const pack = useLabelPack("BlessCheckAnswers");

export interface BlessAnswer {
  key: string;
  label: string;
  /** a list shows one item on each line */
  value: string | string[];
  /** the page to change the answer; without it, the change button emits `change` */
  href?: string;
}
export interface BlessAnswerGroup {
  title: string;
  rows: BlessAnswer[];
}

const props = defineProps<{
  groups: BlessAnswerGroup[];
  /** what the person agrees to before they send, for example that the answers are true */
  declaration?: string;
  labels?: Partial<{
    change: string;
    empty: string;
    agree: string;
    send: string;
    mustAgree: string;
  }>;
}>();
const emit = defineEmits<{ change: [key: string]; submit: [] }>();

const text = computed(() => ({
  change: "Change",
  empty: "Not given",
  agree: "I agree",
  send: "Accept and send",
  mustAgree: "To send, you must agree to the statement.",
  ...pack(),
  ...props.labels,
}));
const errorId = useId();
const agreed = ref(false);
const error = ref(false);
function send() {
  if (props.declaration && !agreed.value) {
    error.value = true;
    return;
  }
  emit("submit");
}
const lines = (v: string | string[]) => (Array.isArray(v) ? v : [v]).filter(Boolean);
</script>

<style>
.bless-answers {
  display: grid;
  gap: var(--bless-space-6);
  max-inline-size: 44rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-answers__group {
  display: grid;
  gap: var(--bless-space-2);
}
/* two classes, so the heading styles of a host page do not win */
.bless-answers .bless-answers__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-answers__list {
  margin: 0;
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-answers__row {
  display: grid;
  grid-template-columns: minmax(8rem, 1fr) minmax(0, 1.5fr) auto;
  gap: var(--bless-space-3);
  padding-block: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
@media (max-width: 36rem) {
  .bless-answers__row {
    grid-template-columns: 1fr auto;
  }
  .bless-answers__value {
    grid-row: 2;
    grid-column: 1 / -1;
  }
}
.bless-answers__row dt {
  font-weight: var(--bless-font-weight-bold);
}
.bless-answers__row dd {
  margin: 0;
}
.bless-answers__empty {
  font-style: italic;
}
.bless-answers__action :is(a, button) {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.bless-answers :is(a, button, input):focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-answers__declare {
  display: grid;
  gap: var(--bless-space-2);
  padding-inline-start: var(--bless-space-3);
  border-inline-start: 4px solid var(--bless-color-border);
}
.bless-answers__declare.is-error {
  border-inline-start-color: var(--bless-color-danger);
}
.bless-answers__statement,
.bless-answers__error {
  margin: 0;
}
.bless-answers__error {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-answers__agree {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-answers__agree input {
  inline-size: 1.4rem;
  block-size: 1.4rem;
  margin: 0;
  accent-color: var(--bless-color-accent);
}
.bless-answers__send {
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-6);
  border: 0;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-answers {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
