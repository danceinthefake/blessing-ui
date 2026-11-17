<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";
import { readJson, writeJson } from "../composables/storage";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessSwitch from "./BlessSwitch.vue";
import "./sr.css";

defineOptions({ name: "BlessConsentBanner" });
const pack = useLabelPack("BlessConsentBanner");

export interface BlessConsentCategory {
  key: string;
  label: string;
  description?: string;
  /** always on, for example the cookies that keep a person signed in */
  required?: boolean;
}

const props = withDefaults(
  defineProps<{
    categories: BlessConsentCategory[];
    /** a `localStorage` key: the choice stays for the next visit, and the banner does not show again */
    persist?: string;
    /** `fixed` sits at the bottom of the window; `static` stays in the flow of the page */
    position?: "fixed" | "static";
    /** a link to the privacy policy */
    policyHref?: string;
    labels?: Partial<{
      title: string;
      message: string;
      accept: string;
      reject: string;
      customize: string;
      save: string;
      policy: string;
      required: string;
    }>;
  }>(),
  { position: "fixed" },
);
/** the choice for each category by key; none until the person decides */
const consent = defineModel<Record<string, boolean> | undefined>();
const emit = defineEmits<{ change: [consent: Record<string, boolean>] }>();

const text = computed(() => ({
  title: "Cookies on this site",
  message: "We use some cookies to make the site work, and others only if you allow them.",
  accept: "Accept all",
  reject: "Only the needed ones",
  customize: "Choose",
  save: "Save my choice",
  policy: "Privacy policy",
  required: "Always on",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
// a stored choice is read after mount; until then the banner waits, so it does not flash
const ready = ref(!props.persist);
onMounted(() => {
  if (props.persist && consent.value === undefined) {
    const saved = readJson<Record<string, boolean>>(props.persist);
    if (saved) consent.value = saved;
  }
  ready.value = true;
});
const open = ref(false);
const draft = ref<Record<string, boolean>>({});
const all = (on: boolean) =>
  Object.fromEntries(props.categories.map((c) => [c.key, c.required ? true : on]));
function choose(value: Record<string, boolean>) {
  consent.value = value;
  if (props.persist) writeJson(props.persist, value);
  emit("change", value);
  open.value = false;
}
// a needed category stays on, whatever the draft says
const save = () =>
  choose({
    ...draft.value,
    ...Object.fromEntries(props.categories.filter((c) => c.required).map((c) => [c.key, true])),
  });
function customize() {
  draft.value = { ...all(false), ...consent.value };
  open.value = true;
}
</script>

<template>
  <section
    v-if="ready && consent === undefined"
    class="bless-consent"
    :class="`bless-consent--${position}`"
    :aria-labelledby="`${uid}-title`"
  >
    <div class="bless-consent__text">
      <p :id="`${uid}-title`" class="bless-consent__title">{{ text.title }}</p>
      <p class="bless-consent__message">
        {{ text.message }}
        <a v-if="policyHref" :href="policyHref">{{ text.policy }}</a>
      </p>
    </div>
    <fieldset v-if="open" class="bless-consent__panel">
      <legend class="bless-sr">{{ text.customize }}</legend>
      <div v-for="c in categories" :key="c.key" class="bless-consent__cat">
        <BlessSwitch
          :model-value="c.required || draft[c.key]"
          :disabled="c.required"
          @update:model-value="(v: boolean) => (draft[c.key] = v)"
        >
          {{ c.label }}<template v-if="c.required"> · {{ text.required }}</template>
        </BlessSwitch>
        <p v-if="c.description" class="bless-consent__desc">{{ c.description }}</p>
      </div>
    </fieldset>
    <div class="bless-consent__actions">
      <template v-if="open">
        <BlessButton size="sm" @click="save">
          {{ text.save }}
        </BlessButton>
      </template>
      <template v-else>
        <BlessButton size="sm" variant="outline" @click="customize">{{
          text.customize
        }}</BlessButton>
      </template>
      <BlessButton size="sm" variant="outline" @click="choose(all(false))">{{
        text.reject
      }}</BlessButton>
      <BlessButton size="sm" @click="choose(all(true))">{{ text.accept }}</BlessButton>
    </div>
  </section>
</template>

<style>
.bless-consent {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
  display: grid;
  gap: var(--bless-space-3);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-consent--fixed {
  position: fixed;
  inset-inline: var(--bless-space-4);
  inset-block-end: var(--bless-space-4);
  z-index: var(--bless-z-modal);
  max-inline-size: 40rem;
  margin-inline: auto;
  box-shadow: 6px 6px 0 var(--bless-color-text);
}
.bless-consent__title {
  margin: 0 0 var(--bless-space-1);
  font-weight: var(--bless-font-weight-bold);
}
.bless-consent__message {
  margin: 0;
  line-height: 1.5;
}
.bless-consent__message a {
  color: inherit;
}
.bless-consent__panel {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
  display: grid;
  gap: var(--bless-space-3);
  margin: 0;
  padding: var(--bless-space-3) 0;
  border: 0;
  border-block: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-consent__desc {
  margin: var(--bless-space-1) 0 0;
  padding-inline-start: 2.75rem;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-consent__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--bless-space-2);
}
</style>
