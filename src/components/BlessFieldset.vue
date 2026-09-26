<script setup lang="ts">
import { useId } from "vue";

defineOptions({ name: "BlessFieldset" });
defineProps<{ legend?: string; toggleable?: boolean; disabled?: boolean }>();
const collapsed = defineModel<boolean>("collapsed", { default: false });
const id = useId();
</script>

<template>
  <fieldset class="bless-fieldset" :class="{ 'bless-fieldset--collapsed': collapsed }" :disabled>
    <legend class="bless-fieldset__legend">
      <button
        v-if="toggleable"
        type="button"
        class="bless-fieldset__toggle"
        :aria-expanded="!collapsed"
        :aria-controls="id"
        @click="collapsed = !collapsed"
      >
        <span class="bless-fieldset__chevron" aria-hidden="true">›</span>
        <slot name="legend">{{ legend }}</slot>
      </button>
      <span v-else
        ><slot name="legend">{{ legend }}</slot></span
      >
    </legend>
    <div v-show="!collapsed" :id class="bless-fieldset__content"><slot /></div>
  </fieldset>
</template>

<style>
.bless-fieldset {
  border-radius: var(--bless-radius);
  margin: 0;
  padding: var(--bless-space-3) var(--bless-space-4) var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-fieldset--collapsed {
  padding-bottom: var(--bless-space-2);
}
.bless-fieldset__legend {
  padding: 0 var(--bless-space-2);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-tight);
  text-transform: uppercase;
}
.bless-fieldset__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-fieldset__toggle:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-fieldset__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-fieldset__chevron {
  display: inline-block;
  transform: rotate(90deg);
  transition: transform var(--bless-duration-base);
}
.bless-fieldset--collapsed .bless-fieldset__chevron {
  transform: rotate(0);
}
/* collapsed, it points along the line: towards the inline end */
[dir="rtl"] .bless-fieldset--collapsed .bless-fieldset__chevron {
  transform: rotate(180deg);
}
.bless-fieldset__content {
  font-size: var(--bless-text-sm);
}
.bless-fieldset:disabled {
  opacity: 0.4;
}
</style>
