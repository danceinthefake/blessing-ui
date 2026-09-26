<script setup lang="ts">
import { useLink } from "../composables/useLink";
defineOptions({ name: "BlessBottomTabs" });
const link = useLink();

export interface BlessBottomTab {
  label: string;
  value: string;
  icon?: string;
  href?: string;
  badge?: number | boolean;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: BlessBottomTab[];
    /** bar = full-width fixed bottom nav; dock = floating icon strip */
    variant?: "bar" | "dock";
    /** render in place instead of fixed to the viewport (docs / previews) */
    inline?: boolean;
    label?: string;
    /** read after a tab with a badge: a count becomes "3 new", `true` becomes "new" */
    badgeLabel?: string;
  }>(),
  { variant: "bar", label: "Primary", badgeLabel: "new" },
);
const active = defineModel<string>();
const badgeText = (it: BlessBottomTab) =>
  !it.badge ? "" : it.badge === true ? props.badgeLabel : `${it.badge} ${props.badgeLabel}`;
const emit = defineEmits<{ select: [item: BlessBottomTab, e: Event] }>();
</script>

<template>
  <nav
    class="bless-bottom-tabs"
    :class="[`bless-bottom-tabs--${variant}`, { 'bless-bottom-tabs--inline': inline }]"
    :aria-label="label"
  >
    <component
      :is="link(it.href, undefined, 'button').is"
      v-bind="link(it.href, undefined, 'button').attrs"
      v-for="it in items"
      :key="it.value"
      :type="it.href ? undefined : 'button'"
      class="bless-bottom-tabs__item"
      :class="{ 'bless-bottom-tabs__item--active': active === it.value }"
      :aria-current="active === it.value ? 'page' : undefined"
      :aria-label="
        variant === 'dock' ? [it.label, badgeText(it)].filter(Boolean).join(', ') : undefined
      "
      :title="variant === 'dock' ? it.label : undefined"
      :disabled="it.href ? undefined : it.disabled"
      :aria-disabled="it.disabled || undefined"
      @click="
        it.disabled ? $event.preventDefault() : ((active = it.value), emit('select', it, $event))
      "
    >
      <span class="bless-bottom-tabs__icon" aria-hidden="true"
        ><slot name="icon" :item="it">{{ it.icon }}</slot></span
      >
      <span v-if="variant === 'bar'" class="bless-bottom-tabs__label">{{ it.label }}</span>
      <span v-if="it.badge" class="bless-bottom-tabs__badge" aria-hidden="true">{{
        it.badge === true ? "" : it.badge
      }}</span>
      <span v-if="it.badge && variant === 'bar'" class="bless-bottom-tabs__sr">{{
        badgeText(it)
      }}</span>
    </component>
  </nav>
</template>

<style>
.bless-bottom-tabs__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-bottom-tabs {
  display: flex;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text-muted);
  background: var(--bless-color-bg);
  z-index: var(--bless-z-nav);
}
.bless-bottom-tabs--bar {
  position: fixed;
  inset-inline-start: 0;
  inset-inline-end: 0;
  bottom: 0;
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  padding-bottom: var(--bless-safe-bottom);
}
.bless-bottom-tabs--dock {
  border-radius: var(--bless-radius-plate);
  position: fixed;
  inset-inline-start: 50%;
  bottom: var(--bless-space-4);
  translate: -50% 0;
  gap: var(--bless-space-1);
  padding: var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
  transform: skewX(var(--bless-skew));
}
.bless-bottom-tabs--dock .bless-bottom-tabs__item {
  transform: skewX(var(--bless-skew-counter));
}
.bless-bottom-tabs--inline {
  position: static;
  translate: none;
}
.bless-bottom-tabs--dock.bless-bottom-tabs--inline {
  display: inline-flex;
  width: max-content;
  justify-self: start;
}
.bless-bottom-tabs__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  transition:
    color var(--bless-duration-base),
    var(--bless-lean-transition);
}
.bless-bottom-tabs--dock .bless-bottom-tabs__item {
  flex: none;
  width: 44px;
  height: 44px;
  justify-content: center;
}
.bless-bottom-tabs__item:hover {
  color: var(--bless-color-text);
}
.bless-bottom-tabs__item--active {
  color: var(--bless-color-accent-text);
}
.bless-bottom-tabs--bar .bless-bottom-tabs__item--active::before {
  content: "";
  position: absolute;
  top: -1px;
  inset-inline-start: 25%;
  inset-inline-end: 25%;
  height: 2px;
  background: var(--bless-color-accent);
  transform: skewX(var(--bless-skew));
}
.bless-bottom-tabs--dock .bless-bottom-tabs__item--active {
  background: var(--bless-color-surface);
}
.bless-bottom-tabs__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-bottom-tabs__item[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-bottom-tabs__icon {
  font-size: var(--bless-text-md);
  line-height: 1;
}
.bless-bottom-tabs__label {
  font-size: var(--bless-text-2xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-bottom-tabs__badge {
  position: absolute;
  top: 4px;
  inset-inline-start: calc(50% + 6px);
  min-width: 8px;
  height: 8px;
  padding: 0 3px;
  background: var(--bless-color-badge);
  color: var(--bless-color-on-accent);
  font-size: 9px;
  font-weight: var(--bless-font-weight-bold);
  line-height: 8px;
  transform: skewX(var(--bless-skew));
}
.bless-bottom-tabs__badge:not(:empty) {
  height: 14px;
  line-height: 14px;
}
</style>
