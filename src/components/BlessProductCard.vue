<template>
  <article class="bless-product" :class="{ 'is-sold-out': soldOut }">
    <div class="bless-product__media">
      <img v-if="image" class="bless-product__img" :src="image" :alt="imageAlt" loading="lazy" />
      <span v-if="badge || soldOut" class="bless-product__badge">{{
        soldOut ? text.soldOut : badge
      }}</span>
    </div>
    <div class="bless-product__body">
      <h3 class="bless-product__name">
        <a v-if="href" :href="href">{{ name }}</a>
        <template v-else>{{ name }}</template>
      </h3>
      <p v-if="rating !== undefined" class="bless-product__rating">
        <span aria-hidden="true"
          >★ {{ stars }}<template v-if="reviews !== undefined"> ({{ reviews }})</template></span
        >
        <span class="bless-sr">{{ text.rated(stars, reviews ?? 0) }}</span>
      </p>
      <BlessPrice :amount="price" :was :currency :locale />
      <BlessButton class="bless-product__add" size="sm" :disabled="soldOut" @click="emit('add')">
        {{ soldOut ? text.soldOut : text.add }}<span class="bless-sr">: {{ name }}</span>
      </BlessButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessPrice from "./BlessPrice.vue";
import "./sr.css";

defineOptions({ name: "BlessProductCard" });
const pack = useLabelPack("BlessProductCard");

const props = withDefaults(
  defineProps<{
    name: string;
    /** the page of the product */
    href?: string;
    image?: string;
    /** describe the image; leave empty when the name says enough */
    imageAlt?: string;
    price: number;
    was?: number;
    currency?: string;
    locale?: string;
    /** the average rating, out of 5 */
    rating?: number;
    reviews?: number;
    /** a short tag on the image, such as "New" */
    badge?: string;
    soldOut?: boolean;
    labels?: Partial<{
      add: string;
      soldOut: string;
      rated: (value: string, count: number) => string;
    }>;
  }>(),
  { imageAlt: "", currency: "USD", locale: "en" },
);
const emit = defineEmits<{ add: [] }>();

const text = computed(() => ({
  add: "Add to cart",
  soldOut: "Sold out",
  rated: (v: string, n: number) => `Rated ${v} out of 5, ${n} reviews`,
  ...pack(),
  ...props.labels,
}));
const stars = computed(() =>
  props.rating === undefined
    ? ""
    : new Intl.NumberFormat(props.locale, { maximumFractionDigits: 1 }).format(props.rating),
);
</script>

<style>
.bless-product {
  display: grid;
  grid-template-rows: auto 1fr;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-product__media {
  position: relative;
  aspect-ratio: 1;
  background: var(--bless-color-surface-2);
}
.bless-product__img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.is-sold-out .bless-product__img {
  filter: grayscale(1);
  opacity: 0.6;
}
.bless-product__badge {
  position: absolute;
  inset-block-start: var(--bless-space-2);
  inset-inline-start: var(--bless-space-2);
  padding: 0 var(--bless-space-2);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-product__body {
  display: grid;
  align-content: start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-3);
}
.bless-product__name {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  line-height: var(--bless-leading-tight);
}
.bless-product__name a {
  color: inherit;
  text-decoration: none;
}
.bless-product__name a:hover {
  text-decoration: underline;
}
.bless-product__name a:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-product__rating {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-product__add {
  justify-self: start;
  margin-block-start: var(--bless-space-1);
}
.bless-product {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
