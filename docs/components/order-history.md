---
title: Order history
---

# Order history

<p class="bless-lead">Past orders with the status, the items, and actions such as buy again</p>

Lists the orders of a buyer on an account page. For where one order is now, use the [shipment tracker](./shipment-tracker).

<Demo title="Basic">
  <OrderHistoryBasic />
  <template #code>

<<< ../demos/OrderHistoryBasic.vue

  </template>
</Demo>

- `orders` is a list of orders. Each order has an `id`, a `number`, a `date` as text, a `status`, a `total`, and `items`. It can also have an `href` to its page.
- The status is `processing`, `shipped`, `delivered`, or `cancelled`. It shows as a mark and a word, such as "✓ Delivered".
- Each item has a `name`, a `quantity`, and an optional `image`. Up to three pictures show, then a count of the rest, such as "+2". Screen readers hear the list of items in place of the pictures.
- With `href`, a "View order" link shows. Every order that is not in progress has a "Buy again" button that emits `again` with the id. Both have the order number in their name.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, the four statuses, `again`, `view`, and the functions `items` and `more`.

## Usage

```ts
import { BlessOrderHistory } from "blessing-ui";
```

## API

<PropsTable name="BlessOrderHistory" />

<script setup>
import OrderHistoryBasic from "../demos/OrderHistoryBasic.vue";
</script>
