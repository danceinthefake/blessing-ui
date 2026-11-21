---
title: Order book
---

# Order book

<p class="bless-lead">The bids and asks of a market, with depth bars and the spread</p>

Shows the open orders of a market on a trading screen. A bid is an offer to buy, and an ask is an offer to sell. For the history of the price, use the [candlestick](./candlestick).

<Demo title="Basic">
  <OrderBookBasic />
  <template #code>

<<< ../demos/OrderBookBasic.vue

  </template>
</Demo>

- `bids` and `asks` are lists of levels. Each level has a `price` and a `size`. The order of the lists does not matter.
- The asks are on top and the bids are below. The best price of each side is next to the spread line in the middle.
- Each row shows the price, the size, and the running total from the best price. A bar behind the row grows with the total, so the depth of the market shows at a glance.
- The spread line shows the gap between the best ask and the best bid, and that gap as a percent of the middle price.
- `depth` sets the rows on each side (default 8). `precision` sets the decimals of the price (default 2), and `locale` sets the format.
- The book is a table, and the first cell of each row says "Ask" or "Bid". The color only repeats the side. Change the words with `labels` or a [label pack](../guide/translating): `title`, `price`, `size`, `total`, `ask`, `bid`, and `spread` (a function).

The `bookSides` function sorts and totals the levels. It is exported for your own views.

## Usage

```ts
import { BlessOrderBook } from "blessing-ui";
```

## API

<PropsTable name="BlessOrderBook" />

<script setup>
import OrderBookBasic from "../demos/OrderBookBasic.vue";
</script>
