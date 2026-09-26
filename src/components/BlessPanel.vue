<script setup lang="ts">
import { useId } from "vue";

defineOptions({ name: "BlessPanel" });
withDefaults(
  defineProps<{
    title?: string;
    toggleable?: boolean;
    surface?: "bg" | "surface";
    /** heading level of the title, to fit the page's outline */
    level?: 2 | 3 | 4 | 5 | 6;
  }>(),
  { surface: "bg", level: 3 },
);
const collapsed = defineModel<boolean>("collapsed", { default: false });
const id = useId();
</script>

<template>
  <section class="bless-panel" :class="`bless-panel--${surface}`" :aria-labelledby="`${id}-t`">
    <header class="bless-panel__header">
      <component :is="`h${level}`" :id="`${id}-t`" class="bless-panel__title">
        <slot name="title">{{ title }}</slot>
      </component>
      <div class="bless-panel__actions">
        <slot name="actions" />
        <button
          v-if="toggleable"
          type="button"
          class="bless-panel__toggle"
          :aria-expanded="!collapsed"
          :aria-controls="id"
          :aria-labelledby="`${id}-t`"
          @click="collapsed = !collapsed"
        >
          <span aria-hidden="true">{{ collapsed ? "+" : "−" }}</span>
        </button>
      </div>
    </header>
    <div v-show="!collapsed" :id class="bless-panel__body"><slot /></div>
    <footer v-if="$slots.footer && !collapsed" class="bless-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style>
.bless-panel {
  border-radius: var(--bless-radius);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-panel--surface {
  background: var(--bless-color-surface);
}
.bless-panel__header {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-panel .bless-panel__title {
  flex: 1;
  margin: 0;
  padding: 0;
  border: 0;
  line-height: var(--bless-leading-normal);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
}
.bless-panel__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-panel__toggle {
  width: 24px;
  height: 24px;
  border: 0;
  background: var(--bless-color-surface);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-panel__toggle:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-panel__toggle > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-panel__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-panel__body {
  padding: var(--bless-space-3);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
}
.bless-panel__footer {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
