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
    /**
     * `label` (default): small bold uppercase title + pale skewed watermark — the TV site.
     * `hanging`: one big tracked title hung off the bottom edge of the `#band` slot, with
     * `subtitle` under it — the film site. No watermark.
     */
    headline?: "label" | "hanging";
    /** small tracked line under a hanging headline (e.g. the Japanese reading) */
    subtitle?: string;
  }>(),
  { headingLevel: 2, headline: "label" },
);
</script>

<template>
  <section class="bless-section" :class="`bless-section--${headline}`">
    <div v-if="$slots.band" class="bless-section__band"><slot name="band" /></div>
    <BlessWatermark
      v-if="
        headline === 'label' && (watermark ?? title) !== undefined && (watermark ?? title) !== ''
      "
      :text="watermark ?? title!"
      :position="watermarkPosition"
    />
    <div class="bless-section__body">
      <component :is="`h${headingLevel}`" v-if="title || $slots.title" class="bless-section__title">
        <span class="bless-section__title-text"
          ><slot name="title">{{ title }}</slot></span
        >
        <span v-if="headline === 'hanging' && subtitle" class="bless-section__subtitle">{{
          subtitle
        }}</span>
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
/* band: a full-bleed strip (key visual, colour) the hanging headline hangs off */
.bless-section__band {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.bless-section__band > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bless-section--hanging {
  overflow: visible;
  padding-top: 0;
}
.bless-section--hanging .bless-section__body {
  padding-top: var(--bless-space-16);
}
/* hanging headline: one big tracked word, right-aligned, overlapping the band's bottom edge */
.bless-section--hanging .bless-section__title {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: calc(-1 * var(--bless-space-16) - 0.55em) 0 var(--bless-space-6);
  font-size: var(--bless-text-headline);
  font-weight: var(--bless-font-weight-normal);
  letter-spacing: 0.13em;
  text-align: end;
}
.bless-section--hanging .bless-section__subtitle {
  margin-top: 0.35em;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.5em;
  color: var(--bless-color-text-muted);
}
.bless-section--hanging:not(:has(.bless-section__band)) .bless-section__title {
  margin-top: 0; /* nothing to hang from: sits in flow */
}
</style>
