<script setup lang="ts">
defineOptions({ name: "BlessSpinner" });

withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg";
    color?: "text" | "accent" | "current";
    /** screen-reader text (role=status); "" when a parent already announces — then it's decorative */
    label?: string;
  }>(),
  { size: "md", color: "current", label: "Loading" },
);
</script>

<template>
  <span
    class="bless-spinner"
    :class="[`bless-spinner--${size}`, `bless-spinner--${color}`]"
    :role="label ? 'status' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>

<style>
/* skewed outline square, one accent edge, spins */
.bless-spinner {
  --_s: 20px;
  --_c: currentColor;
  display: inline-block;
  width: var(--_s);
  height: var(--_s);
  flex: none;
  border: calc(2 * var(--bless-border-width)) solid var(--_c);
  border-top-color: var(--bless-color-accent);
  opacity: 0.8;
  transform: skewX(var(--bless-skew));
  animation: bless-spin 0.9s var(--bless-ease-linear) infinite;
}
.bless-spinner--sm {
  --_s: 14px;
}
.bless-spinner--lg {
  --_s: 32px;
}
.bless-spinner--text {
  --_c: var(--bless-color-text);
}
.bless-spinner--accent {
  --_c: var(--bless-color-accent-soft);
}
@keyframes bless-spin {
  to {
    transform: skewX(var(--bless-skew)) rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-spinner {
    animation-duration: 2s;
  }
}
</style>
