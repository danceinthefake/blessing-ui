---
title: Order summary
---

<script setup>
import OrderSummaryBasic from "../demos/OrderSummaryBasic.vue";
</script>

# Order summary

<p class="bless-lead">The lines of an order, then the sums and the total</p>

Shows what a person buys and what they pay, next to a checkout form. For the plans of a service, use the [pricing table](./pricing-table).

<Demo title="Basic">
  <OrderSummaryBasic />
  <template #code>

<<< ../demos/OrderSummaryBasic.vue

  </template>
</Demo>

- `lines` is a list of lines. Each line has an `id`, a `name`, the `price` of one, and a `quantity`. It can also have a `note`, such as the size, and an `image`. The line shows the price times the quantity.
- Under the lines, the summary shows the subtotal, the `discount` with its `discount-label`, the `shipping`, the `tax`, and the total. A `shipping` of 0 shows "Free". With no shipping, discount, or tax, the row does not show.
- The total is the subtotal less the discount (never below zero), plus shipping and tax.
- `currency` is an ISO code (default `USD`), and `locale` sets the format of the money (default `en`).
- The `footer` slot holds your button. It gets `{ total }`.
- The summary is a region named by its title. Change the words with `labels` or a [label pack](../guide/translating): `title`, `subtotal`, `discount`, `shipping`, `free`, `tax`, `total`, and `quantity` (a function of the count).

## Usage

```ts
import { BlessOrderSummary } from "blessing-ui";
```

## API

<PropsTable name="BlessOrderSummary" />
