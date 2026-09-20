<script setup lang="ts">
import { useLink } from "../composables/useLink";
defineOptions({ name: "BlessItem" });
const link = useLink();

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    /** renders <a> when set */
    href?: string;
    variant?: "plain" | "outline" | "surface";
    size?: "sm" | "md";
  }>(),
  { variant: "plain", size: "md" },
);
</script>

<template>
  <component
    :is="link(href, undefined, 'div').is"
    v-bind="link(href, undefined, 'div').attrs"
    class="bless-item"
    :class="[`bless-item--${variant}`, `bless-item--${size}`, { 'bless-item--link': href }]"
  >
    <span v-if="$slots.media" class="bless-item__media"><slot name="media" /></span>
    <span class="bless-item__body">
      <span class="bless-item__title"
        ><slot name="title">{{ title }}</slot></span
      >
      <span v-if="description || $slots.description" class="bless-item__desc"
        ><slot name="description">{{ description }}</slot></span
      >
      <span v-if="$slots.default" class="bless-item__content"><slot /></span>
    </span>
    <span v-if="$slots.actions" class="bless-item__actions"><slot name="actions" /></span>
  </component>
</template>

<style>
.bless-item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  text-decoration: none;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-item--sm {
  gap: var(--bless-space-2);
  padding: var(--bless-space-2);
}
.bless-item--outline {
  border-radius: var(--bless-radius);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-item--surface {
  border-radius: var(--bless-radius);
  background: var(--bless-color-surface);
}
.bless-item--link:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-item--link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-item__media {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  color: var(--bless-color-text-muted);
}
.bless-item__body {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  flex: 1;
  min-width: 0;
}
.bless-item__title {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-tight);
}
.bless-item--sm .bless-item__title {
  font-size: var(--bless-text-xs);
}
.bless-item__desc {
  font-size: var(--bless-text-xs);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text-muted);
}
.bless-item__content {
  font-size: var(--bless-text-sm);
}
.bless-item__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  flex: none;
}
</style>
