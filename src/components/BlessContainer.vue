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
.bless-container--padded {
  padding-inline: var(--bless-space-4);
}
</style>
