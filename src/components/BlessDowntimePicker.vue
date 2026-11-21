<template>
  <form class="bless-downtime" :aria-labelledby="`${uid}-title`" @submit.prevent="save">
    <p :id="`${uid}-title`" class="bless-downtime__title">{{ text.title(machine ?? "") }}</p>
    <fieldset v-for="g in groups" :key="g.key" class="bless-downtime__group" :class="`is-${g.key}`">
      <legend class="bless-downtime__legend">{{ g.title }}</legend>
      <div class="bless-downtime__grid">
        <label v-for="r in g.list" :key="r.id" class="bless-downtime__reason">
          <input v-model="reason" type="radio" :name="`${uid}-reason`" :value="r.id" />
          <span v-if="r.icon" class="bless-downtime__icon" aria-hidden="true">{{ r.icon }}</span>
          <span>{{ r.label }}</span>
        </label>
      </div>
    </fieldset>
    <label class="bless-downtime__note">
      <span>{{ text.note }}</span>
      <input v-model="note" />
    </label>
    <BlessButton type="submit" :disabled="!reason">{{ text.save }}</BlessButton>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessDowntimePicker" });
const pack = useLabelPack("BlessDowntimePicker");

export interface BlessDowntimeReason {
  id: string;
  label: string;
  /** a planned stop, such as a break, or an unplanned one, such as a jam */
  planned?: boolean;
  /** an emoji or a short text */
  icon?: string;
}

const props = defineProps<{
  reasons: BlessDowntimeReason[];
  /** the machine or the station, for the title */
  machine?: string;
  labels?: Partial<{
    title: (machine: string) => string;
    unplanned: string;
    planned: string;
    note: string;
    save: string;
  }>;
}>();
const reason = defineModel<string>();
const emit = defineEmits<{ save: [reason: string, note: string] }>();

const text = computed(() => ({
  title: (m: string) => (m ? `Why did ${m} stop?` : "Why did it stop?"),
  unplanned: "Unplanned",
  planned: "Planned",
  note: "A note (optional)",
  save: "Save the reason",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const note = ref("");
const groups = computed(() =>
  [
    {
      key: "unplanned",
      title: text.value.unplanned,
      list: props.reasons.filter((r) => !r.planned),
    },
    { key: "planned", title: text.value.planned, list: props.reasons.filter((r) => r.planned) },
  ].filter((g) => g.list.length),
);
function save() {
  if (!reason.value) return;
  emit("save", reason.value, note.value.trim());
  note.value = "";
}
</script>

<style>
.bless-downtime {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  color: var(--bless-color-text);
}
.bless-downtime__title {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-downtime__group {
  inline-size: 100%;
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-downtime__legend {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-downtime__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--bless-space-2);
}
/* big targets for gloves; the native radio stays in the tab order and reads its state */
.bless-downtime__reason {
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--bless-space-1);
  min-block-size: 5.5rem;
  padding: var(--bless-space-2);
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
  text-align: center;
  cursor: pointer;
  touch-action: manipulation;
}
.is-planned .bless-downtime__reason {
  border-style: dashed;
}
.bless-downtime__reason input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.bless-downtime__reason:has(:checked) {
  border: 3px solid var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-downtime__reason:has(:focus-visible) {
  outline: 3px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-downtime__icon {
  font-size: var(--bless-text-xl);
}
.bless-downtime__note {
  display: grid;
  gap: var(--bless-space-1);
  inline-size: 100%;
  max-inline-size: 28rem;
  font-size: var(--bless-text-sm);
}
.bless-downtime__note input {
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-downtime__note input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
</style>
