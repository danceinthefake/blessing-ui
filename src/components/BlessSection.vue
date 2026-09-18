<script setup lang="ts">
import BlessWatermark from "./BlessWatermark.vue";

defineOptions({ name: "BlessSection" });

withDefaults(
  defineProps<{
    title?: string;
    /** watermark text; defaults to title. Pass "" to hide */
    watermark?: string;
    watermarkPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    headingLevel?: 1 | 2 | 3 | 4;
  }>(),
  { headingLevel: 2 },
);
</script>

<template>
  <section class="bless-section">
    <BlessWatermark
      v-if="(watermark ?? title) !== undefined && (watermark ?? title) !== ''"
      :text="watermark ?? title!"
      :position="watermarkPosition"
    />
    <div class="bless-section__body">
      <component :is="`h${headingLevel}`" v-if="title || $slots.title" class="bless-section__title">
        <slot name="title">{{ title }}</slot>
      </component>
      <slot />
    </div>
  </section>
</template>

<style>
.bless-section {
  position: relative;
  overflow: hidden;
  padding: var(--bless-space-16) 0 var(--bless-space-12);
}
.bless-section__body {
  position: relative;
  z-index: 1;
}
.bless-section__title {
  margin: 0 0 var(--bless-space-6);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  line-height: var(--bless-leading-none);
  text-transform: uppercase;
  color: var(--bless-color-text);
}
</style>
