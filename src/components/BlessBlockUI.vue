<script setup lang="ts">
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessBlockUI" });
withDefaults(defineProps<{ blocked?: boolean; fullscreen?: boolean; label?: string }>(), {
  label: "Busy",
});
</script>

<template>
  <div class="bless-block" :class="{ 'bless-block--on': blocked, 'bless-block--full': fullscreen }">
    <div class="bless-block__content" :inert="blocked || undefined"><slot /></div>
    <div v-if="blocked" class="bless-block__overlay" role="status" :aria-label="label">
      <slot name="indicator"><BlessSpinner size="lg" /></slot>
    </div>
  </div>
</template>

<style>
.bless-block {
  position: relative;
}
.bless-block__overlay {
  position: absolute;
  inset: 0;
  z-index: var(--bless-z-nav);
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--bless-color-bg) 60%, transparent);
  color: var(--bless-color-text);
  backdrop-filter: blur(1px);
}
.bless-block--full .bless-block__overlay {
  position: fixed;
  z-index: var(--bless-z-modal);
}
.bless-block--on .bless-block__content {
  pointer-events: none;
  user-select: none;
}
</style>
