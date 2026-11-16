---
title: Wishlist button
---

<script setup>
import WishlistButtonBasic from "../demos/WishlistButtonBasic.vue";
</script>

# Wishlist button

<p class="bless-lead">A heart that saves a product, with a count and a status message</p>

Lets a buyer keep a product for later. Put it on a [product card](./product-card) or a product page.

<Demo title="Basic">
  <WishlistButtonBasic />
  <template #code>

<<< ../demos/WishlistButtonBasic.vue

  </template>
</Demo>

- `v-model` is true when the product is saved.
- `name` is the name of the product. The button is a toggle named "Save … to the wishlist", so screen readers hear its state as pressed or not pressed.
- A saved heart is filled, and a heart that is not saved is an outline. The shape changes, not only the color.
- After a click, a hidden status line says that the product is in or out of the wishlist. A page load says nothing.
- `count` shows how many people saved the product. Give the new count after a click.
- The heart grows for a moment when the reader saves the product, except under reduced motion.
- Change the words with `labels` or a [label pack](../guide/translating): the functions `save`, `added`, and `removed`.

## Usage

```ts
import { BlessWishlistButton } from "blessing-ui";
```

## API

<PropsTable name="BlessWishlistButton" />
