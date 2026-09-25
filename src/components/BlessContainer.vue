<script setup lang="ts">
defineOptions({ name: "BlessContainer" });

withDefaults(defineProps<{ as?: string; size?: "sm" | "md" | "lg" | "full"; padded?: boolean }>(), {
  as: "div",
  size: "lg",
  padded: true,
});
</script>

<template>
  <component
    :is="as"
    class="bless-container"
    :class="[`bless-container--${size}`, { 'bless-container--padded': padded }]"
  >
    <slot />
  </component>
</template>

<style>
.bless-container {
  width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
}
.bless-container--sm {
  max-width: 640px;
}
.bless-container--md {
  max-width: 960px;
}
.bless-container--lg {
  max-width: var(--bless-content-max);
}
/* the gutter grows to clear a notch on a phone held sideways (insets are physical sides) */
.bless-container--padded {
  padding-left: max(var(--bless-space-4), var(--bless-safe-left));
  padding-right: max(var(--bless-space-4), var(--bless-safe-right));
}
</style>
