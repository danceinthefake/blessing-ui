<script setup lang="ts">
import { computed, useId } from "vue";
import { fmtTime } from "../composables/schedule";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSlotPicker" });
const pack = useLabelPack("BlessSlotPicker");

export interface BlessSlot {
  /** `HH:MM`, 24 hours */
  time: string;
  /** a taken slot shows, but cannot be picked */
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    slots: (string | BlessSlot)[];
    /** shows the times in the format of this locale, for example `en` for 9:30 AM */
    locale?: string;
    disabled?: boolean;
    labels?: Partial<{ morning: string; afternoon: string; evening: string; none: string }>;
  }>(),
  {},
);
/** the picked time, `HH:MM` */
const model = defineModel<string | null>({ default: null });

const text = computed(() => ({
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  none: "No free times",
  ...pack(),
  ...props.labels,
}));
const name = useId();
const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
// before noon, before 17:00, and later
const groups = computed(() => {
  const list = props.slots
    .map((s) => (typeof s === "string" ? { time: s } : s))
    .sort((a, b) => minutes(a.time) - minutes(b.time));
  return (
    [
      ["morning", 0, 720],
      ["afternoon", 720, 1020],
      ["evening", 1020, 1440],
    ] as const
  )
    .map(([key, lo, hi]) => ({
      key,
      slots: list.filter((s) => minutes(s.time) >= lo && minutes(s.time) < hi),
    }))
    .filter((g) => g.slots.length);
});
</script>

<template>
  <div class="bless-slots">
    <p v-if="!groups.length" class="bless-slots__none">{{ text.none }}</p>
    <fieldset v-for="g in groups" :key="g.key" class="bless-slots__group" :disabled>
      <legend class="bless-slots__legend">{{ text[g.key] }}</legend>
      <div class="bless-slots__grid">
        <label
          v-for="s in g.slots"
          :key="s.time"
          class="bless-slots__slot"
          :class="{ 'bless-slots__slot--on': model === s.time }"
        >
          <input
            v-model="model"
            type="radio"
            class="bless-slots__input"
            :name
            :value="s.time"
            :disabled="s.disabled"
          />
          {{ fmtTime(minutes(s.time), locale) }}
        </label>
      </div>
    </fieldset>
  </div>
</template>

<style>
.bless-slots {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-slots__none {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-slots__group {
  margin: 0;
  padding: 0;
  border: 0;
  min-inline-size: 0;
}
.bless-slots__legend {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-slots__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
  gap: var(--bless-space-2);
}
.bless-slots__slot {
  position: relative;
  display: grid;
  place-items: center;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-plate);
  font-size: var(--bless-text-sm);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    border-color var(--bless-duration-fast) var(--bless-ease-out),
    background var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-slots__slot:hover:not(:has(:disabled)) {
  border-color: var(--bless-color-text);
}
.bless-slots__slot--on {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  font-weight: var(--bless-font-weight-bold);
}
.bless-slots__slot:has(:disabled) {
  color: var(--bless-color-text-muted);
  text-decoration: line-through;
  cursor: not-allowed;
}
.bless-slots__slot:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* the radio stays in the page for the keyboard and screen readers, over the whole slot */
.bless-slots__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
@media (prefers-reduced-motion: reduce) {
  .bless-slots__slot {
    transition: none;
  }
}
.bless-slots {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
