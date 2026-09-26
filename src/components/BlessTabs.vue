<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { logicalKey } from "../composables/rtl";
import BlessSkew from "./BlessSkew.vue";

defineOptions({ name: "BlessTabs" });

export interface BlessTab {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    tabs: BlessTab[];
    /** activate on arrow key (automatic) or only on Enter/Space (manual) */
    activation?: "automatic" | "manual";
    color?: "text" | "accent" | "danger";
    label?: string;
  }>(),
  { activation: "automatic", color: "accent" },
);

const model = defineModel<string>({ default: "" });
const id = useId();
const enabled = computed(() => props.tabs.filter((t) => !t.disabled));
const current = computed(() =>
  props.tabs.some((t) => t.value === model.value) ? model.value : enabled.value[0]?.value,
);
const focused = ref<string | undefined>();
const btns = ref<HTMLButtonElement[]>([]);
// ids come from the position, not the value: a value with a space would break the id reference
const ix = (t: BlessTab) => props.tabs.indexOf(t);

function focusTab(value: string) {
  focused.value = value;
  const i = props.tabs.findIndex((t) => t.value === value);
  btns.value[i]?.focus();
  if (props.activation === "automatic") model.value = value;
}

function onKey(e: KeyboardEvent) {
  const list = enabled.value;
  const i = list.findIndex((t) => t.value === (focused.value ?? current.value));
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[logicalKey(e)];
  let next: BlessTab | undefined;
  if (step) next = list[(i + step + list.length) % list.length];
  else if (e.key === "Home") next = list[0];
  else if (e.key === "End") next = list[list.length - 1];
  if (!next) return;
  e.preventDefault();
  focusTab(next.value);
}
</script>

<template>
  <div class="bless-tabs">
    <div class="bless-tabs__list" role="tablist" :aria-label="label" @keydown="onKey">
      <BlessSkew
        v-for="t in tabs"
        :key="t.value"
        as="button"
        :ref="
          (el) => {
            if (el) btns[tabs.indexOf(t)] = (el as any).$el;
          }
        "
        type="button"
        role="tab"
        class="bless-tabs__tab"
        :class="{
          'bless-tabs__tab--active': t.value === current,
          [`bless-tabs__tab--${color}`]: true,
        }"
        :color="t.value === current ? color : 'none'"
        :id="`${id}-tab-${ix(t)}`"
        :aria-selected="t.value === current"
        :aria-controls="`${id}-panel-${ix(t)}`"
        :tabindex="t.value === (focused ?? current) ? 0 : -1"
        :disabled="t.disabled"
        @click="
          model = t.value;
          focused = t.value;
        "
        @focus="focused = t.value"
        @blur="focused = undefined"
      >
        <slot name="tab" :tab="t" :active="t.value === current">{{ t.label }}</slot>
      </BlessSkew>
    </div>
    <div
      v-for="t in tabs"
      :key="t.value"
      v-show="t.value === current"
      role="tabpanel"
      class="bless-tabs__panel"
      :id="`${id}-panel-${ix(t)}`"
      :aria-labelledby="`${id}-tab-${ix(t)}`"
      tabindex="0"
    >
      <slot :tab="t" :active="t.value === current" />
    </div>
  </div>
</template>

<style>
.bless-tabs__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
  padding-inline-start: var(--bless-space-1);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-tabs__tab {
  --_c: var(--bless-color-text);
  margin: 0;
  padding: var(--bless-space-2) var(--bless-space-4);
  border: var(--bless-border-width) solid transparent;
  border-bottom: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-none);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    color var(--bless-duration-slow),
    var(--bless-lean-transition);
}
.bless-tabs__tab.bless-skew--none {
  background: transparent;
}
.bless-tabs__tab--accent {
  --_c: var(--bless-color-accent);
}
.bless-tabs__tab--danger {
  --_c: var(--bless-color-danger);
}
.bless-tabs__tab:hover:not(:disabled) {
  opacity: var(--bless-hover-opacity);
}
/* hover is attention, not a choice: ink, never the accent; the active tab keeps its own text */
.bless-tabs__tab:hover:not(:disabled, .bless-tabs__tab--active) {
  color: var(--bless-color-text);
}
.bless-tabs__tab:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-tabs__tab:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-tabs__tab--active {
  color: var(--bless-color-on-accent);
}
.bless-tabs__tab--text.bless-tabs__tab--active {
  color: var(--bless-color-on-text);
}
.bless-tabs__panel {
  padding: var(--bless-space-4) 0;
}
.bless-tabs__panel:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
