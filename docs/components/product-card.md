---
title: Product card
---

# Product card

<p class="bless-lead">A product with an image, the name, the price, the rating, and an add button</p>

Shows one product in a grid of a shop. Put many cards in a CSS grid to make a catalog. For a product page, use the [variant picker](./variant-picker) and the [price](./price).

<Demo title="Basic">
  <ProductCardBasic />
  <template #code>

<<< ../demos/ProductCardBasic.vue

  </template>
</Demo>

- `name` is the name of the product. With `href`, the name is a link to the product page.
- `image` is the picture, and `imageAlt` describes it. If the name says enough, leave `imageAlt` empty.
- `price` and `was` go to the [price](./price), with `currency` and `locale`.
- `rating` (out of 5) and `reviews` show as "★ 4.6 (128)". Screen readers hear "Rated 4.6 out of 5, 128 reviews".
- `badge` is a short tag on the image, such as "New".
- The button emits `add`. Its name ends with the name of the product, so a list of cards does not have many buttons with the same name.
- With `soldOut`, the image turns gray, the tag says "Sold out", and the button is off.
- Change the words with `labels` or a [label pack](../guide/translating): `add`, `soldOut`, and `rated` (a function).

## Usage

```ts
import { BlessProductCard } from "blessing-ui";
```

## API

<PropsTable name="BlessProductCard" />

<script setup>
import ProductCardBasic from "../demos/ProductCardBasic.vue";
</script>
