<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useRovingFocus } from "../composables/useRovingFocus";
import "./sr.css";

defineOptions({ name: "BlessBulkActionBar" });
const pack = useLabelPack("BlessBulkActionBar");

const props = withDefaults(
  defineProps<{
    /** how many rows are selected; the bar shows when it is more than 0 */
    count: number;
    /** on the bottom of the window, not the bottom of its box */
    fixed?: boolean;
    labels?: Partial<{ label: string; selected: (n: number) => string; clear: string }>;
  }>(),
  {},
);
const emit = defineEmits<{ clear: [] }>();

const text = computed(() => ({
  label: "Selected items",
  selected: (n: number) => `${n} selected`,
  clear: "Clear selection",
  ...pack(),
  ...props.labels,
}));
const bar = ref<HTMLElement>();
useRovingFocus(bar);
</script>

<template>
  <div class="bless-bulkbar" :class="{ 'bless-bulkbar--fixed': fixed }">
    <!-- always in the page, so a change of the count is spoken -->
    <span class="bless-sr" aria-live="polite">{{ count > 0 ? text.selected(count) : "" }}</span>
    <Transition name="bless-bulkbar">
      <div
        v-if="count > 0"
        ref="bar"
        class="bless-bulkbar__bar"
        role="toolbar"
        :aria-label="text.label"
      >
        <strong class="bless-bulkbar__count" aria-hidden="true">{{ text.selected(count) }}</strong>
        <div class="bless-bulkbar__actions"><slot /></div>
        <button
          type="button"
          class="bless-bulkbar__clear"
          :aria-label="text.clear"
          :title="text.clear"
          @click="emit('clear')"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.75" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style>
.bless-bulkbar {
  position: sticky;
  inset-block-end: var(--bless-space-3);
  z-index: var(--bless-z-nav);
  display: flex;
  justify-content: center;
  pointer-events: none;
  font-family: var(--bless-font-sans);
}
.bless-bulkbar--fixed {
  position: fixed;
  inset-inline: 0;
}
.bless-bulkbar__bar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  max-inline-size: calc(100% - 2 * var(--bless-space-3));
  padding-block: var(--bless-space-2);
  padding-inline: var(--bless-space-4) var(--bless-space-2);
  border-radius: var(--bless-radius-plate);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  box-shadow: 0 6px 24px rgb(0 0 0 / 0.25);
  pointer-events: auto;
}
.bless-bulkbar__count {
  font-size: var(--bless-text-sm);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.bless-bulkbar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
/* buttons in the slot sit on the dark bar */
.bless-bulkbar__actions :is(button, a) {
  --_c: var(--bless-color-bg);
  color: inherit;
}
.bless-bulkbar__clear {
  display: inline-grid;
  place-items: center;
  inline-size: 28px;
  block-size: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--bless-radius-plate);
  background: none;
  color: inherit;
  cursor: pointer;
}
.bless-bulkbar__clear:hover {
  background: color-mix(in srgb, var(--bless-color-bg) 20%, transparent);
}
.bless-bulkbar__clear:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-bulkbar-enter-active,
.bless-bulkbar-leave-active {
  transition:
    translate var(--bless-duration-fast) var(--bless-ease-out),
    opacity var(--bless-duration-fast) var(--bless-ease-out);
}
.bless-bulkbar-enter-from,
.bless-bulkbar-leave-to {
  translate: 0 12px;
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .bless-bulkbar-enter-active,
  .bless-bulkbar-leave-active {
    transition: none;
  }
}
</style>
