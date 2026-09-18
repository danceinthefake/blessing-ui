<script setup lang="ts">
defineOptions({ name: "BlessBadge" });

withDefaults(
  defineProps<{
    color?: "badge" | "accent" | "danger" | "warning" | "success" | "info" | "text";
    /** shrink to 0.8 like the source NEW! pill */
    scaled?: boolean;
  }>(),
  { color: "badge", scaled: true },
);
</script>

<template>
  <span class="bless-badge" :class="[`bless-badge--${color}`, { 'bless-badge--scaled': scaled }]">
    <slot>NEW!</slot>
  </span>
</template>

<style>
.bless-badge {
  display: inline-block;
  padding: 2px 4px;
  border-radius: var(--bless-radius-sm);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  line-height: var(--bless-leading-none);
  letter-spacing: var(--bless-tracking-normal);
  color: var(--bless-color-on-accent);
  background: var(--bless-color-badge);
  vertical-align: middle;
  white-space: nowrap;
}
.bless-badge--scaled {
  transform: scale(var(--bless-press-scale));
}
.bless-badge--accent {
  background: var(--bless-color-accent);
}
.bless-badge--danger {
  background: var(--bless-color-danger);
}
.bless-badge--warning {
  background: var(--bless-color-warning);
  color: var(--bless-color-on-light);
}
.bless-badge--success {
  background: var(--bless-color-success);
  color: var(--bless-color-on-light);
}
.bless-badge--info {
  background: var(--bless-color-info);
}
.bless-badge--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
</style>
