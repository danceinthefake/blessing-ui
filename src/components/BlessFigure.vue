<template>
  <figure class="bless-figure" :class="`is-${width}`">
    <img class="bless-figure__img" :src :alt loading="lazy" />
    <figcaption v-if="caption || credit || $slots.default" class="bless-figure__caption">
      <slot>{{ caption }}</slot>
      <span v-if="credit" class="bless-figure__credit">
        <a v-if="creditHref" :href="creditHref">{{ text.credit(credit) }}</a>
        <template v-else>{{ text.credit(credit) }}</template>
      </span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessFigure" });
const pack = useLabelPack("BlessFigure");

const props = withDefaults(
  defineProps<{
    src: string;
    /** what the picture shows; the caption does not replace it */
    alt: string;
    caption?: string;
    /** who made the picture */
    credit?: string;
    /** a link to the source of the picture */
    creditHref?: string;
    /** `wide` grows past the text column a little, `full` takes the whole width */
    width?: "normal" | "wide" | "full";
    labels?: Partial<{ credit: (who: string) => string }>;
  }>(),
  { width: "normal" },
);

const text = computed(() => ({ credit: (w: string) => `Photo: ${w}`, ...pack(), ...props.labels }));
</script>

<style>
.bless-figure {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
/* only on wide screens, so a phone never scrolls sideways */
@media (min-width: 48rem) {
  .bless-figure.is-wide {
    margin-inline: -3rem;
  }
}
.bless-figure.is-full {
  inline-size: 100%;
}
.bless-figure__img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  background: var(--bless-color-surface-2);
}
.bless-figure__caption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--bless-space-1) var(--bless-space-3);
  padding-inline-start: var(--bless-space-2);
  border-inline-start: 3px solid var(--bless-color-accent);
  font-size: var(--bless-text-sm);
  line-height: 1.45;
}
.bless-figure__credit {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-figure__credit a {
  color: inherit;
}
.bless-figure__credit a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
