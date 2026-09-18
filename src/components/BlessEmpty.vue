<script setup lang="ts">
defineOptions({ name: "BlessEmpty" });

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    /** dashed frame (default) or plain */
    variant?: "outline" | "plain";
  }>(),
  { variant: "outline" },
);
</script>

<template>
  <div class="bless-empty" :class="`bless-empty--${variant}`">
    <span v-if="$slots.icon" class="bless-empty__icon" aria-hidden="true"
      ><slot name="icon"
    /></span>
    <strong v-if="title || $slots.title" class="bless-empty__title"
      ><slot name="title">{{ title }}</slot></strong
    >
    <p v-if="description || $slots.description" class="bless-empty__desc">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="$slots.default" class="bless-empty__actions"><slot /></div>
  </div>
</template>

<style>
.bless-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-12) var(--bless-space-6);
  text-align: center;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-empty--outline {
  border: var(--bless-border-width) dashed var(--bless-color-text-muted);
}
.bless-empty__icon {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: var(--bless-space-2);
  font-size: var(--bless-text-lg);
  color: var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-empty__icon > * {
  transform: skewX(var(--bless-skew-counter));
}
.bless-empty__title {
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-empty__desc {
  margin: 0;
  max-width: 40ch;
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
  color: var(--bless-color-text-muted);
}
.bless-empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-3);
}
</style>
