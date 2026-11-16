---
title: Price ticker
---

<script setup>
import PriceTickerBasic from "../demos/PriceTickerBasic.vue";
</script>

# Price ticker

<p class="bless-lead">Prices that move across the screen, with the change of each</p>

Shows the latest prices of stocks, coins, or products in a line that scrolls. It uses the [marquee](./marquee), so it has a Pause button and stops while the pointer is over it.

<Demo title="Basic">
  <PriceTickerBasic />
  <template #code>

<<< ../demos/PriceTickerBasic.vue

  </template>
</Demo>

- `items` is a list of prices. Each item has a `symbol`, a `price`, and a `change` in percent.
- Each change has an arrow and a sign: ▲ and "+" for a rise, ▼ and "−" for a fall, and ■ for no change. A fall is also red, but the arrow and the sign carry the meaning.
- With `currency`, the price shows in that currency. Without it, the price is a plain number with two decimals. `locale` sets the format.
- `speed` sets the speed in pixels per second (default 40). If the reader asks for reduced motion, the line does not move.
- The ticker is a region with the name "Prices". Change it with `labels` or a [label pack](../guide/translating): `title`. The Pause and Play words come from the marquee.

## Usage

```ts
import { BlessPriceTicker } from "blessing-ui";
```

## API

<PropsTable name="BlessPriceTicker" />
