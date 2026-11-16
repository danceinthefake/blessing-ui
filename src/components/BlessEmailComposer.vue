<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessInputTags from "./BlessInputTags.vue";

defineOptions({ name: "BlessEmailComposer" });
const pack = useLabelPack("BlessEmailComposer");

export interface BlessEmailDraft {
  to: string[];
  cc: string[];
  subject: string;
  body: string;
}

const props = defineProps<{
  labels?: Partial<{
    title: string;
    to: string;
    cc: string;
    addCc: string;
    subject: string;
    body: string;
    send: string;
    discard: string;
    hint: string;
    noRecipient: string;
    bad: (addresses: string) => string;
  }>;
}>();
const draft = defineModel<BlessEmailDraft>({
  default: () => ({ to: [], cc: [], subject: "", body: "" }),
});
const emit = defineEmits<{ send: [draft: BlessEmailDraft]; discard: [] }>();

const text = computed(() => ({
  title: "New email",
  to: "To",
  cc: "Cc",
  addCc: "Add Cc",
  subject: "Subject",
  body: "Message",
  send: "Send",
  discard: "Discard",
  hint: "Press Enter or a comma after each address.",
  noRecipient: "Add at least one recipient.",
  bad: (a: string) => `These addresses are not valid: ${a}`,
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const showCc = ref(draft.value.cc.length > 0);
const tried = ref(false);
// a plain shape check: something@something.something, no spaces
const valid = (a: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a);
const bad = computed(() => [...draft.value.to, ...draft.value.cc].filter((a) => !valid(a)));
const error = computed(() =>
  bad.value.length
    ? text.value.bad(bad.value.join(", "))
    : tried.value && !draft.value.to.length
      ? text.value.noRecipient
      : "",
);
const set = (p: Partial<BlessEmailDraft>) => (draft.value = { ...draft.value, ...p });
function send() {
  tried.value = true;
  if (!error.value) emit("send", draft.value);
}
</script>

<template>
  <form class="bless-compose" :aria-label="text.title" novalidate @submit.prevent="send">
    <div class="bless-compose__row">
      <label class="bless-compose__label" :for="`${uid}-to`">{{ text.to }}</label>
      <div class="bless-compose__tags">
        <BlessInputTags
          :id="`${uid}-to`"
          :label="text.to"
          :model-value="draft.to"
          :invalid="!!error && (draft.to.some((a) => !valid(a)) || !draft.to.length)"
          :aria-describedby="`${uid}-hint ${uid}-err`"
          @update:model-value="set({ to: $event })"
        />
      </div>
      <button v-if="!showCc" type="button" class="bless-compose__cc" @click="showCc = true">
        {{ text.addCc }}
      </button>
    </div>
    <div v-if="showCc" class="bless-compose__row">
      <label class="bless-compose__label" :for="`${uid}-cc`">{{ text.cc }}</label>
      <div class="bless-compose__tags">
        <BlessInputTags
          :id="`${uid}-cc`"
          :label="text.cc"
          :model-value="draft.cc"
          :invalid="draft.cc.some((a) => !valid(a))"
          @update:model-value="set({ cc: $event })"
        />
      </div>
    </div>
    <p :id="`${uid}-hint`" class="bless-compose__hint">{{ text.hint }}</p>
    <div class="bless-compose__row">
      <label class="bless-compose__label" :for="`${uid}-subject`">{{ text.subject }}</label>
      <input
        :id="`${uid}-subject`"
        class="bless-compose__input"
        :value="draft.subject"
        @input="set({ subject: ($event.target as HTMLInputElement).value })"
      />
    </div>
    <textarea
      class="bless-compose__body"
      rows="8"
      :aria-label="text.body"
      :value="draft.body"
      @input="set({ body: ($event.target as HTMLTextAreaElement).value })"
    />
    <p :id="`${uid}-err`" class="bless-compose__error" role="alert">{{ error }}</p>
    <div class="bless-compose__actions">
      <BlessButton type="submit">{{ text.send }}</BlessButton>
      <BlessButton variant="ghost" @click="emit('discard')">{{ text.discard }}</BlessButton>
    </div>
  </form>
</template>

<style>
.bless-compose {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-compose__row {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-compose__label {
  flex: none;
  inline-size: 4.5rem;
  color: var(--bless-color-text-muted);
}
.bless-compose__tags {
  flex: 1;
  min-inline-size: 0;
}
.bless-compose__cc {
  flex: none;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  text-decoration: underline;
  cursor: pointer;
}
.bless-compose__input {
  flex: 1;
  min-block-size: 2.5rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
}
.bless-compose__hint {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-compose__body {
  min-block-size: 10rem;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  line-height: 1.6;
  resize: vertical;
}
.bless-compose__input:focus-visible,
.bless-compose__body:focus-visible,
.bless-compose__cc:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-compose__error {
  margin: 0;
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-compose__error:empty {
  display: none;
}
.bless-compose__actions {
  display: flex;
  gap: var(--bless-space-2);
}
</style>
