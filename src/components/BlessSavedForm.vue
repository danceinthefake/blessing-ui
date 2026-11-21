<template>
  <form class="bless-saved" @submit.prevent="submit">
    <div v-if="draft" class="bless-saved__draft" role="alert">
      <span>{{ text.found(time(draft.at)) }}</span>
      <span class="bless-saved__choose">
        <button type="button" class="is-main" @click="resume">{{ text.resume }}</button>
        <button type="button" @click="restart">{{ text.restart }}</button>
      </span>
    </div>
    <slot />
    <div class="bless-saved__foot">
      <button type="submit" class="is-main">{{ text.send }}</button>
      <button type="button" @click="later">{{ text.later }}</button>
      <span class="bless-saved__status" role="status">{{
        savedAt ? text.saved(time(savedAt)) : ""
      }}</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSavedForm" });
const pack = useLabelPack("BlessSavedForm");

type Values = Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    /** the key of the draft in localStorage; make it unique for each form and each person */
    storageKey: string;
    /** the wait after the last change before a save, in milliseconds */
    delay?: number;
    locale?: string;
    labels?: Partial<{
      found: (time: string) => string;
      resume: string;
      restart: string;
      saved: (time: string) => string;
      later: string;
      send: string;
    }>;
  }>(),
  { delay: 600, locale: "en" },
);
const values = defineModel<Values>({ default: () => ({}) });
const emit = defineEmits<{ submit: [values: Values]; later: [values: Values] }>();

const text = computed(() => ({
  found: (t: string) => `You have a draft from ${t}. Do you want to go on with it?`,
  resume: "Go on with the draft",
  restart: "Start again",
  saved: (t: string) => `Draft saved at ${t}`,
  later: "Save and come back later",
  send: "Send",
  ...pack(),
  ...props.labels,
}));
const time = (ms: number) =>
  new Intl.DateTimeFormat(props.locale, { dateStyle: "medium", timeStyle: "short" }).format(ms);
// the browser can block storage, for example in a private window; the form still works then
const read = (): { values: Values; at: number } | undefined => {
  try {
    const raw = localStorage.getItem(props.storageKey);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};
const write = (v?: Values) => {
  try {
    if (v) localStorage.setItem(props.storageKey, JSON.stringify({ values: v, at: Date.now() }));
    else localStorage.removeItem(props.storageKey);
    return true;
  } catch {
    return false;
  }
};
const draft = ref<{ values: Values; at: number }>();
const savedAt = ref<number>();
let timer: ReturnType<typeof setTimeout> | undefined;
let ready = false;
function save() {
  clearTimeout(timer);
  if (write(values.value)) savedAt.value = Date.now();
}
onMounted(() => {
  const d = read();
  if (d && JSON.stringify(d.values) !== JSON.stringify(values.value)) draft.value = d;
  ready = true;
});
onBeforeUnmount(() => clearTimeout(timer));
watch(
  values,
  () => {
    // no save while the person still has to choose about an old draft
    if (!ready || draft.value) return;
    clearTimeout(timer);
    timer = setTimeout(save, props.delay);
  },
  { deep: true },
);
function resume() {
  values.value = { ...draft.value!.values };
  draft.value = undefined;
}
function restart() {
  write();
  draft.value = undefined;
}
function later() {
  save();
  emit("later", values.value);
}
function submit() {
  clearTimeout(timer);
  write();
  savedAt.value = undefined;
  emit("submit", values.value);
}
</script>

<style>
.bless-saved {
  display: grid;
  gap: var(--bless-space-4);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-saved__draft {
  display: grid;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
  border-inline-start: 4px solid var(--bless-color-accent);
  background: var(--bless-color-surface-2);
  font-weight: var(--bless-font-weight-bold);
}
.bless-saved__choose,
.bless-saved__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-saved button {
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-4);
  border: 2px solid var(--bless-color-text);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-saved button.is-main {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-saved button:focus-visible {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 2px;
}
.bless-saved__foot {
  padding-block-start: var(--bless-space-3);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-saved__status {
  font-size: var(--bless-text-xs);
}
</style>
