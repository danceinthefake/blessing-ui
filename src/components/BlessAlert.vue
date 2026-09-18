<script setup lang="ts">
defineOptions({ name: "BlessAlert" });

withDefaults(
  defineProps<{
    title?: string;
    color?: "text" | "accent" | "danger" | "warning" | "success" | "info";
    /** assertive (role=alert) vs polite (role=status) */
    live?: "alert" | "status" | "none";
    dismissible?: boolean;
    closeLabel?: string;
  }>(),
  { color: "text", live: "status", closeLabel: "Dismiss" },
);

const open = defineModel<boolean>({ default: true });
const emit = defineEmits<{ dismiss: [] }>();
</script>

<template>
  <div
    v-if="open"
    class="bless-alert"
    :class="`bless-alert--${color}`"
    :role="live === 'none' ? undefined : live"
  >
    <span v-if="$slots.icon" class="bless-alert__icon"><slot name="icon" /></span>
    <div class="bless-alert__body">
      <strong v-if="title || $slots.title" class="bless-alert__title"
        ><slot name="title">{{ title }}</slot></strong
      >
      <div class="bless-alert__text"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="bless-alert__close"
      :aria-label="closeLabel"
      @click="
        open = false;
        emit('dismiss');
      "
    >
      <span aria-hidden="true">×</span>
    </button>
  </div>
</template>

<style>
.bless-alert {
  --_c: var(--bless-color-text);
  position: relative;
  display: flex;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-left: 4px solid var(--_c);
  background: var(--bless-color-surface);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text);
}
.bless-alert--accent {
  --_c: var(--bless-color-accent);
}
.bless-alert--danger {
  --_c: var(--bless-color-danger);
}
.bless-alert--warning {
  --_c: var(--bless-color-warning);
}
.bless-alert--success {
  --_c: var(--bless-color-success);
}
.bless-alert--info {
  --_c: var(--bless-color-info);
}
/* skewed edge cut, like a label */
.bless-alert::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--_c);
  transform: skewX(var(--bless-skew));
}
.bless-alert__icon {
  flex: none;
  color: var(--_c);
  display: inline-flex;
  align-items: flex-start;
  padding-top: 1px;
}
.bless-alert__body {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: var(--bless-space-1);
}
.bless-alert__title {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--_c);
}
.bless-alert__text {
  font-size: var(--bless-text-sm);
}
.bless-alert__close {
  flex: none;
  width: 24px;
  height: 24px;
  margin: -4px -8px -4px 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: var(--bless-text-lg);
  line-height: 1;
  cursor: pointer;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-alert__close:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-alert__close:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
