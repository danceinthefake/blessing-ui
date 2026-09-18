<script setup lang="ts">
defineOptions({ name: "BlessMarker" });

withDefaults(
  defineProps<{
    /** status = centered pill, note = muted line, separator = labelled rule, border = bordered row */
    variant?: "status" | "note" | "separator" | "border";
    color?: "text" | "accent" | "danger" | "success" | "warning" | "info";
    /** shimmer (pending / streaming) */
    shimmer?: boolean;
  }>(),
  { variant: "status", color: "text" },
);
</script>

<template>
  <div
    class="bless-marker"
    :class="[
      `bless-marker--${variant}`,
      `bless-marker--${color}`,
      { 'bless-marker--shimmer': shimmer },
    ]"
    role="note"
  >
    <span class="bless-marker__content">
      <span v-if="$slots.icon" class="bless-marker__icon" aria-hidden="true"
        ><slot name="icon"
      /></span>
      <slot />
    </span>
  </div>
</template>

<style>
.bless-marker {
  --_c: var(--bless-color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  color: var(--_c);
}
.bless-marker--accent {
  --_c: var(--bless-color-accent);
}
.bless-marker--danger {
  --_c: var(--bless-color-danger);
}
.bless-marker--success {
  --_c: var(--bless-color-success);
}
.bless-marker--warning {
  --_c: var(--bless-color-warning);
}
.bless-marker--info {
  --_c: var(--bless-color-info);
}
.bless-marker__content {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-marker__icon {
  display: inline-flex;
}
.bless-marker--status .bless-marker__content {
  padding: 2px var(--bless-space-3);
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-marker--status .bless-marker__content > * {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-marker--separator::before,
.bless-marker--separator::after {
  content: "";
  flex: 1;
  height: var(--bless-border-width);
  background: var(--bless-color-border);
}
.bless-marker--border {
  justify-content: flex-start;
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  border-left: 3px solid var(--_c);
}
.bless-marker--shimmer .bless-marker__content {
  background-image: linear-gradient(
    90deg,
    transparent 30%,
    rgb(255 255 255 / 0.35) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: bless-marker-shimmer 1.6s var(--bless-ease-linear) infinite;
}
@keyframes bless-marker-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-marker--shimmer .bless-marker__content {
    animation: none;
  }
}
</style>
