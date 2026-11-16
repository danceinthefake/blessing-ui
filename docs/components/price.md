---
title: Price
---

<script setup>
import PriceBasic from "../demos/PriceBasic.vue";
</script>

# Price

<p class="bless-lead">A price with the old price, the discount, and a unit price</p>

Shows a price in a shop, in the format of the locale. On a sale, it shows the old price struck through and the percent off. The [product card](./product-card) uses it.

<Demo title="Basic">
  <PriceBasic />
  <template #code>

<<< ../demos/PriceBasic.vue

  </template>
</Demo>

- `amount` is the price.
- `was` is the price before the sale. If it is higher than `amount`, the old price and a tag such as "25% off" show.
- Screen readers hear one sentence for a sale, such as "Now $75.00, was $100.00, 25% off". A struck-through number alone does not say that it is the old price.
- `unitPrice` and `unit` add a line such as "$9.00 / kg". This helps buyers compare packs of different sizes.
- `size` is `sm`, `md` (default), or `lg`.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): the functions `off`, `sale`, and `per`.

## Usage

```ts
import { BlessPrice } from "blessing-ui";
```

## API

<PropsTable name="BlessPrice" />
