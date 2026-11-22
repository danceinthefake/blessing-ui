<template>
  <article v-if="product" class="product">
    <BlessBreadcrumb :items="crumbs" />
    <div class="product__top">
      <div class="product__photos">
        <button
          type="button"
          class="product__main"
          :aria-label="`Open photo ${shown + 1} of ${photos.length}`"
          @click="open = shown"
        >
          <img
            :src="photos[shown]"
            :alt="`${product.name}, photo ${shown + 1}`"
            width="600"
            height="600"
          />
        </button>
        <ul role="list" class="product__thumbs">
          <li v-for="(src, i) in photos" :key="src">
            <button
              type="button"
              :aria-label="`Show photo ${i + 1}`"
              :aria-pressed="i === shown"
              @click="shown = i"
            >
              <img :src alt="" width="80" height="80" />
            </button>
          </li>
        </ul>
        <BlessLightbox
          v-model="open"
          :items="photos.map((src, i) => ({ src, alt: `${product!.name}, photo ${i + 1}` }))"
          loop
        />
      </div>
      <div class="product__buy">
        <BlessText as="h1" size="xl" weight="light">{{ product.name }}</BlessText>
        <a href="#reviews" class="product__rating" @click="tab = 'reviews'">
          <BlessRating
            :model-value="average"
            readonly
            size="sm"
            :label="`Rated ${average.toFixed(1)} of 5`"
          />
          <BlessText size="sm" muted>{{ product.reviews.length }} reviews</BlessText>
        </a>
        <BlessPrice
          :amount="product.price"
          :was="product.was"
          currency="IDR"
          locale="en-ID"
          size="lg"
        />
        <BlessVariantPicker v-model="selection" :options />
        <div class="product__cart">
          <BlessInputNumber
            v-model="quantity"
            :min="1"
            :max="9"
            buttons
            label="Quantity"
            class="product__qty"
          />
          <BlessButton :loading="adding" class="product__add" @click="onAdd"
            >Add to cart</BlessButton
          >
          <BlessWishlistButton v-model="saved" :name="product.name" />
        </div>
        <BlessAlert v-if="problem" color="danger">{{ problem }}</BlessAlert>
        <BlessText as="p" size="sm" muted
          >Free delivery in Java over Rp300,000. Returns within 30 days.</BlessText
        >
      </div>
    </div>

    <BlessTabs id="reviews" v-model="tab" :tabs label="About this product" class="product__tabs">
      <template #default="{ tab: t }">
        <BlessText v-if="t.value === 'description'" as="p">{{ product.description }}</BlessText>
        <BlessDescriptions
          v-else-if="t.value === 'details'"
          :items="product.details"
          :columns="1"
        />
        <div v-else class="product__reviews">
          <BlessReviewSummary v-model:filter="stars" :counts filterable locale="en-ID" />
          <ul role="list" class="product__review-list">
            <li v-for="r in reviews" :key="r.id">
              <BlessRating :model-value="r.stars" readonly size="sm" :label="`${r.stars} of 5`" />
              <BlessText as="p" size="sm" weight="bold"
                >{{ r.name }} <BlessText size="xs" muted>· {{ r.date }}</BlessText></BlessText
              >
              <BlessText as="p" size="sm">{{ r.text }}</BlessText>
            </li>
            <li v-if="!reviews.length">
              <BlessText size="sm" muted>No reviews with {{ stars }} stars yet.</BlessText>
            </li>
          </ul>
        </div>
      </template>
    </BlessTabs>

    <section aria-labelledby="product-related">
      <BlessText id="product-related" as="h2" weight="bold">You may also like</BlessText>
      <ul role="list" class="product__related">
        <li v-for="r in related" :key="r.id">
          <BlessProductCard
            :name="r.name"
            href="#"
            :image="r.image"
            :price="r.price"
            :was="r.was"
            currency="IDR"
            locale="en-ID"
            :rating="r.rating"
            :reviews="r.reviews"
            @add="toast({ title: 'Added to cart', description: r.name, color: 'success' })"
          />
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  BlessAlert,
  BlessBreadcrumb,
  BlessButton,
  BlessDescriptions,
  BlessInputNumber,
  BlessLightbox,
  BlessPrice,
  BlessProductCard,
  BlessRating,
  BlessReviewSummary,
  BlessTabs,
  BlessText,
  BlessVariantPicker,
  BlessWishlistButton,
  useToast,
} from "blessing-ui";
import { mockProductApi } from "./api";
import { useProduct } from "./useProduct";

const {
  product,
  related,
  selection,
  options,
  photos,
  counts,
  stars,
  reviews,
  quantity,
  problem,
  adding,
  add,
} = useProduct(mockProductApi, "tee");
const crumbs = [
  { label: "Shop", href: "#" },
  { label: "Clothing", href: "#" },
  { label: "Blessing tee" },
];
const tabs = [
  { value: "description", label: "Description" },
  { value: "details", label: "Details" },
  { value: "reviews", label: "Reviews" },
];
const tab = ref("description");
const shown = ref(0);
const open = ref(-1);
const saved = ref(false);
const average = computed(() => {
  const r = product.value?.reviews ?? [];
  return r.length ? r.reduce((n, x) => n + x.stars, 0) / r.length : 0;
});
watch(
  () => selection.value.color,
  () => (shown.value = 0),
);

const { toast } = useToast();
async function onAdd() {
  if (await add())
    toast({
      title: "Added to cart",
      description: `${quantity.value} × ${product.value!.name}, ${options.value
        .map((o) => o.values.find((v) => v.value === selection.value[o.key])?.label)
        .join(", ")}`,
      color: "success",
    });
}
</script>

<style scoped>
.product {
  display: grid;
  gap: var(--bless-space-8);
  padding: var(--bless-space-6);
}
.product__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--bless-space-8);
}
.product__photos {
  display: grid;
  gap: var(--bless-space-3);
  align-content: start;
}
.product__main,
.product__thumbs button {
  display: block;
  padding: 0;
  border: 1px solid var(--bless-color-border);
  background: none;
  cursor: zoom-in;
}
.product__main img {
  display: block;
  width: 100%;
  height: auto;
}
.product__thumbs {
  display: flex;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.product__thumbs button {
  cursor: pointer;
}
.product__thumbs img {
  display: block;
  width: 64px;
  height: 64px;
}
.product__thumbs button[aria-pressed="true"] {
  border-color: var(--bless-color-text);
  outline: 1px solid var(--bless-color-text);
}
.product__buy {
  display: grid;
  gap: var(--bless-space-4);
  align-content: start;
}
.product__rating {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  justify-self: start;
  color: inherit;
  text-decoration: none;
}
.product__cart {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2);
}
.product__qty {
  width: 8rem;
}
.product__add {
  flex: 1;
}
.product__reviews {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: var(--bless-space-6);
}
.product__review-list {
  display: grid;
  gap: var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.product__related {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--bless-space-4);
  margin: var(--bless-space-4) 0 0;
  padding: 0;
  list-style: none;
}
@media (max-width: 760px) {
  .product {
    padding-inline: var(--bless-space-4);
  }
  .product__top,
  .product__reviews {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
