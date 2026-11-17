<script setup lang="ts">
defineOptions({ name: "BlessFeatureGrid" });

export interface BlessFeature {
  title: string;
  text: string;
  /** a link to read more about the feature */
  href?: string;
}

withDefaults(
  defineProps<{
    features: BlessFeature[];
    /** the most columns on a wide screen */
    columns?: 2 | 3 | 4;
  }>(),
  { columns: 3 },
);
defineSlots<{
  /** an icon for each feature, often an SVG */
  icon?: (p: { feature: BlessFeature; index: number }) => unknown;
}>();
</script>

<template>
  <ul class="bless-stagger bless-features" role="list" :style="{ '--_cols': columns }">
    <li v-for="(f, i) in features" :key="f.title" class="bless-features__item">
      <span v-if="$slots.icon" class="bless-features__icon" aria-hidden="true">
        <slot name="icon" :feature="f" :index="i" />
      </span>
      <h3 class="bless-features__title">
        <a v-if="f.href" :href="f.href">{{ f.title }}</a>
        <template v-else>{{ f.title }}</template>
      </h3>
      <div class="bless-features__text">{{ f.text }}</div>
    </li>
  </ul>
</template>

<style>
.bless-features {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(max(14rem, calc(100% / var(--_cols) - 2rem)), 1fr)
  );
  gap: var(--bless-space-6);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-features__item {
  display: grid;
  align-content: start;
  gap: var(--bless-space-2);
}
.bless-features__icon {
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-features__icon svg {
  inline-size: 1.5rem;
  block-size: 1.5rem;
}
/* two classes, so the heading styles of a host page do not win */
.bless-features .bless-features__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-features__title a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.bless-features__title a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-features__text {
  line-height: 1.6;
}
</style>
