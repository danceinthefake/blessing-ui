<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessRuleBuilder" });
const pack = useLabelPack("BlessRuleBuilder");

export interface BlessRuleOption {
  id: string;
  /** reads in a sentence, for example "motion in the hall" */
  label: string;
}
export interface BlessRule {
  /** the event that starts the rule */
  when: string;
  /** conditions that must all hold */
  if: string[];
  /** what happens */
  then: string[];
}

const props = defineProps<{
  triggers: BlessRuleOption[];
  conditions?: BlessRuleOption[];
  actions: BlessRuleOption[];
  labels?: Partial<{
    when: string;
    if: string;
    then: string;
    pick: string;
    addIf: string;
    addThen: string;
    remove: (what: string) => string;
    save: string;
    preview: string;
    sentence: (when: string, ifs: string, thens: string) => string;
    and: string;
  }>;
}>();
const rule = defineModel<BlessRule>({ default: () => ({ when: "", if: [], then: [""] }) });
const emit = defineEmits<{ save: [rule: BlessRule] }>();

const text = computed(() => ({
  when: "When",
  if: "Only if",
  then: "Then",
  pick: "Pick one",
  addIf: "Add a condition",
  addThen: "Add an action",
  remove: (w: string) => `Remove: ${w}`,
  save: "Save the rule",
  preview: "The rule",
  sentence: (w: string, i: string, t: string) => `When ${w}${i ? `, if ${i}` : ""}, then ${t}.`,
  and: "and",
  ...pack(),
  ...props.labels,
}));
const name = (list: BlessRuleOption[] | undefined, id: string) =>
  list?.find((o) => o.id === id)?.label ?? "…";
const join = (parts: string[]) => parts.join(` ${text.value.and} `);
const set = (p: Partial<BlessRule>) => (rule.value = { ...rule.value, ...p });
const setAt = (key: "if" | "then", i: number, v: string) =>
  set({ [key]: rule.value[key].map((x, k) => (k === i ? v : x)) });
const add = (key: "if" | "then") => set({ [key]: [...rule.value[key], ""] });
const drop = (key: "if" | "then", i: number) =>
  set({ [key]: rule.value[key].filter((_, k) => k !== i) });
const picked = computed(() => rule.value.then.filter(Boolean));
const ok = computed(() => !!rule.value.when && picked.value.length > 0);
const sentence = computed(() =>
  text.value.sentence(
    name(props.triggers, rule.value.when),
    join(rule.value.if.filter(Boolean).map((id) => name(props.conditions, id))),
    picked.value.length ? join(picked.value.map((id) => name(props.actions, id))) : "…",
  ),
);
function save() {
  if (ok.value)
    emit("save", { when: rule.value.when, if: rule.value.if.filter(Boolean), then: picked.value });
}
</script>

<template>
  <form class="bless-rule" @submit.prevent="save">
    <fieldset class="bless-rule__part">
      <legend class="bless-rule__legend">{{ text.when }}</legend>
      <select
        class="bless-rule__select"
        :value="rule.when"
        :aria-label="text.when"
        @change="set({ when: ($event.target as HTMLSelectElement).value })"
      >
        <option value="" disabled>{{ text.pick }}</option>
        <option v-for="o in triggers" :key="o.id" :value="o.id">{{ o.label }}</option>
      </select>
    </fieldset>
    <fieldset v-if="conditions?.length" class="bless-rule__part">
      <legend class="bless-rule__legend">{{ text.if }}</legend>
      <div v-for="(id, i) in rule.if" :key="i" class="bless-rule__row">
        <select
          class="bless-rule__select"
          :value="id"
          :aria-label="`${text.if} ${i + 1}`"
          @change="setAt('if', i, ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>{{ text.pick }}</option>
          <option v-for="o in conditions" :key="o.id" :value="o.id">{{ o.label }}</option>
        </select>
        <button
          type="button"
          class="bless-rule__x"
          :aria-label="text.remove(name(conditions, id))"
          @click="drop('if', i)"
        >
          ✕
        </button>
      </div>
      <button type="button" class="bless-rule__add" @click="add('if')">+ {{ text.addIf }}</button>
    </fieldset>
    <fieldset class="bless-rule__part">
      <legend class="bless-rule__legend">{{ text.then }}</legend>
      <div v-for="(id, i) in rule.then" :key="i" class="bless-rule__row">
        <select
          class="bless-rule__select"
          :value="id"
          :aria-label="`${text.then} ${i + 1}`"
          @change="setAt('then', i, ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>{{ text.pick }}</option>
          <option v-for="o in actions" :key="o.id" :value="o.id">{{ o.label }}</option>
        </select>
        <button
          v-if="rule.then.length > 1"
          type="button"
          class="bless-rule__x"
          :aria-label="text.remove(name(actions, id))"
          @click="drop('then', i)"
        >
          ✕
        </button>
      </div>
      <button type="button" class="bless-rule__add" @click="add('then')">
        + {{ text.addThen }}
      </button>
    </fieldset>
    <p class="bless-rule__preview">
      <strong>{{ text.preview }}:</strong> <span aria-live="polite">{{ sentence }}</span>
    </p>
    <BlessButton type="submit" :disabled="!ok">{{ text.save }}</BlessButton>
  </form>
</template>

<style>
.bless-rule {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-3);
  max-inline-size: 36rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-rule__part {
  display: grid;
  gap: var(--bless-space-2);
  inline-size: 100%;
  margin: 0;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-inline-start: 4px solid var(--bless-color-text);
}
.bless-rule__legend {
  padding: 0 var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-rule__row {
  display: flex;
  gap: var(--bless-space-2);
}
.bless-rule__select {
  flex: 1;
  min-inline-size: 0;
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-rule__x {
  inline-size: 2.5rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  cursor: pointer;
}
.bless-rule__add {
  justify-self: start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  text-decoration: underline;
  cursor: pointer;
}
.bless-rule__select:focus-visible,
.bless-rule__x:focus-visible,
.bless-rule__add:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-rule__preview {
  margin: 0;
  padding: var(--bless-space-3);
  inline-size: 100%;
  background: var(--bless-color-surface-2);
  line-height: 1.5;
}
</style>
