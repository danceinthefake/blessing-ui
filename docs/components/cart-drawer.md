---
title: Cart drawer
---

# Cart drawer

<p class="bless-lead">The cart in a side panel, with quantities, the subtotal, and checkout</p>

Opens the cart from the side of the screen, so the buyer stays on the page. It uses the [sheet](./sheet). For the totals on the checkout page, use the [order summary](./order-summary).

<Demo title="Basic">
  <CartDrawerBasic />
  <template #code>

<<< ../demos/CartDrawerBasic.vue

  </template>
</Demo>

- `v-model` is the list of lines. Each line has an `id`, a `name`, the `price` of one, and a `quantity`. It can also have an `image` and a `variant`, such as "Black, M".
- `v-model:open` opens and closes the panel. The title counts the items, such as "Cart (4)".
- Each line has − and + buttons and a number field for the quantity. The quantity stays between 1 and `max` (default 99). The ✕ button removes the line.
- Each button has a name with the product, such as "One more USB microphone", so a screen reader user knows which line it changes.
- The footer shows the subtotal and a note that shipping and taxes come later. The checkout button emits `checkout`. If the cart is empty, the button is off.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `empty`, `subtotal`, `note`, `checkout`, and the functions `title`, `remove`, `less`, `more`, and `quantity`.

## Usage

```ts
import { BlessCartDrawer } from "blessing-ui";
```

## API

<PropsTable name="BlessCartDrawer" />

<script setup>
import CartDrawerBasic from "../demos/CartDrawerBasic.vue";
</script>
