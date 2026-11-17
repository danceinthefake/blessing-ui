<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessSuggestions" });
const pack = useLabelPack("BlessSuggestions");

export interface BlessSuggestion {
  /** the text on the chip */
  label: string;
  /** the text to send; default: the label */
  prompt?: string;
  /** an emoji or a short sign before the label */
  icon?: string;
}

const props = withDefaults(
  defineProps<{
    items: (string | BlessSuggestion)[];
    /** one row that scrolls to the side, not rows that wrap */
    scroll?: boolean;
    disabled?: boolean;
    labels?: Partial<{ label: string }>;
  }>(),
  {},
);
const emit = defineEmits<{ select: [prompt: string, item: BlessSuggestion] }>();

const text = computed(() => ({ label: "Suggestions", ...pack(), ...props.labels }));
const list = computed(() => props.items.map((it) => (typeof it === "string" ? { label: it } : it)));
</script>

<template>
  <ul
    role="list"
    class="bless-stagger bless-suggestions"
    :class="{ 'bless-suggestions--scroll': scroll }"
    :aria-label="text.label"
  >
    <li v-for="(it, i) in list" :key="i">
      <button
        type="button"
        class="bless-suggestions__chip"
        :disabled
        @click="emit('select', it.prompt ?? it.label, it)"
      >
        <span v-if="it.icon" class="bless-suggestions__icon" aria-hidden="true">{{ it.icon }}</span>
        {{ it.label }}
      </button>
    </li>
  </ul>
</template>

<style>
.bless-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-suggestions--scroll {
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  /* room for the focus ring inside the scroll box */
  padding: 4px;
  margin: -4px;
}
.bless-suggestions--scroll > li {
  flex: none;
}
.bless-suggestions__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-radius: var(--bless-radius-petal);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  text-align: start;
  cursor: pointer;
  transition:
    border-color var(--bless-duration-fast) var(--bless-ease-out),
    background var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-suggestions__chip:hover:not(:disabled) {
  border-color: var(--bless-color-text);
  background: var(--bless-color-surface-2);
}
.bless-suggestions__chip:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-suggestions__chip:disabled {
  cursor: not-allowed;
  color: var(--bless-color-text-muted);
}
@media (prefers-reduced-motion: reduce) {
  .bless-suggestions__chip {
    transition: none;
  }
}
</style>
