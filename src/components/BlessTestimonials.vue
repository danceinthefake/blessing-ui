<template>
  <section
    class="bless-quotes"
    :class="`bless-quotes--${layout}`"
    :aria-label="text.title"
    :aria-roledescription="layout === 'single' ? 'carousel' : undefined"
  >
    <figure
      v-for="(t, i) in shown"
      :key="t.name + i"
      class="bless-quotes__item"
      :aria-roledescription="layout === 'single' ? 'slide' : undefined"
      :aria-label="layout === 'single' ? text.position(at + 1, items.length) : undefined"
    >
      <p v-if="t.rating" class="bless-quotes__stars">
        <span aria-hidden="true"
          >{{ "★".repeat(Math.round(t.rating)) }}{{ "☆".repeat(5 - Math.round(t.rating)) }}</span
        >
        <span class="bless-sr">{{ text.rating(t.rating) }}</span>
      </p>
      <blockquote class="bless-quotes__quote">{{ t.quote }}</blockquote>
      <figcaption class="bless-quotes__who">
        <BlessAvatar :src="t.avatar" :name="t.name" alt="" size="sm" />
        <span>
          <strong>{{ t.name }}</strong>
          <span v-if="t.role" class="bless-quotes__role">{{ t.role }}</span>
        </span>
      </figcaption>
    </figure>
    <div v-if="layout === 'single' && items.length > 1" class="bless-quotes__nav">
      <button type="button" class="bless-quotes__btn" :aria-label="text.prev" @click="step(-1)">
        ‹
      </button>
      <span class="bless-quotes__pos" aria-live="polite">{{
        text.position(at + 1, items.length)
      }}</span>
      <button type="button" class="bless-quotes__btn" :aria-label="text.next" @click="step(1)">
        ›
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import "./sr.css";

defineOptions({ name: "BlessTestimonials" });
const pack = useLabelPack("BlessTestimonials");

export interface BlessTestimonial {
  quote: string;
  name: string;
  /** for example "Host of Deep Dive" */
  role?: string;
  avatar?: string;
  /** 1 to 5 stars */
  rating?: number;
}

const props = withDefaults(
  defineProps<{
    items: BlessTestimonial[];
    /** `grid` shows all; `single` shows one at a time with buttons */
    layout?: "grid" | "single";
    labels?: Partial<{
      title: string;
      prev: string;
      next: string;
      position: (n: number, total: number) => string;
      rating: (stars: number) => string;
    }>;
  }>(),
  { layout: "grid" },
);

const text = computed(() => ({
  title: "What people say",
  prev: "Previous quote",
  next: "Next quote",
  position: (n: number, t: number) => `${n} of ${t}`,
  rating: (s: number) => `${s} out of 5 stars`,
  ...pack(),
  ...props.labels,
}));
const at = ref(0);
const shown = computed(() =>
  props.layout === "single" ? props.items.slice(at.value, at.value + 1) : props.items,
);
const step = (d: number) => (at.value = (at.value + d + props.items.length) % props.items.length);
</script>

<style>
.bless-quotes {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-quotes--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--bless-space-4);
}
.bless-quotes--single {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 36rem;
}
.bless-quotes__item {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  margin: 0;
  padding: var(--bless-space-6);
  border-radius: var(--bless-radius);
  border-inline-start: 3px solid var(--bless-color-accent);
  background: var(--bless-color-surface);
  box-shadow: var(--bless-shadow-sm);
}
.bless-quotes__stars {
  margin: 0;
  color: var(--bless-color-text);
  letter-spacing: 2px;
}
.bless-quotes__quote {
  flex: 1;
  margin: 0;
  font-family: var(--bless-font-serif);
  font-size: var(--bless-text-md);
  line-height: 1.6;
}
.bless-quotes__quote::before {
  content: "“";
}
.bless-quotes__quote::after {
  content: "”";
}
.bless-quotes--single .bless-quotes__quote {
  font-size: var(--bless-text-lg);
}
.bless-quotes__who {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-quotes__who > span {
  display: flex;
  flex-direction: column;
}
.bless-quotes__role {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-quotes__nav {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-quotes__btn {
  inline-size: 2.2rem;
  block-size: 2.2rem;
  border-radius: var(--bless-radius-pill);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface);
  color: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
  transition:
    background-color var(--bless-duration-fast),
    border-color var(--bless-duration-fast);
}
.bless-quotes__btn:hover {
  border-color: var(--bless-color-text);
  background: var(--bless-color-hover);
}
.bless-quotes__btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-quotes__pos {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-quotes {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
