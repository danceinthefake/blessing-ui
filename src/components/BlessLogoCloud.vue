<script setup lang="ts">
defineOptions({ name: "BlessLogoCloud" });

export interface BlessLogo {
  /** the name of the company; it is the alt text of the logo */
  name: string;
  src: string;
  href?: string;
}

withDefaults(
  defineProps<{
    logos: BlessLogo[];
    /** a short line on top, for example "Trusted by 2,000 studios" */
    title?: string;
    /** show the logos in gray until the pointer is on them */
    mono?: boolean;
  }>(),
  { mono: true },
);
</script>

<template>
  <section class="bless-logos" :class="{ 'is-mono': mono }" :aria-label="title">
    <div v-if="title" class="bless-logos__title">{{ title }}</div>
    <ul class="bless-logos__list" role="list">
      <li v-for="l in logos" :key="l.name">
        <a v-if="l.href" :href="l.href" class="bless-logos__item">
          <img :src="l.src" :alt="l.name" loading="lazy" />
        </a>
        <span v-else class="bless-logos__item">
          <img :src="l.src" :alt="l.name" loading="lazy" />
        </span>
      </li>
    </ul>
  </section>
</template>

<style>
.bless-logos {
  display: grid;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-logos__title {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  text-align: center;
}
.bless-logos__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--bless-space-4) var(--bless-space-6);
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-logos__item {
  display: grid;
  place-items: center;
  block-size: 3.5rem;
}
.bless-logos__item img {
  max-inline-size: 100%;
  max-block-size: 2.5rem;
  object-fit: contain;
}
.is-mono .bless-logos__item img {
  filter: grayscale(1);
  opacity: 0.75;
  transition:
    filter var(--bless-duration-fast, 0.15s),
    opacity var(--bless-duration-fast, 0.15s);
}
.is-mono a.bless-logos__item:is(:hover, :focus-visible) img {
  filter: none;
  opacity: 1;
}
a.bless-logos__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .is-mono .bless-logos__item img {
    transition: none;
  }
}
</style>
