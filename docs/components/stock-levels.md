---
title: Stock levels
---

# Stock levels

<p class="bless-lead">Stock for each item and place, with a reorder point and a low state</p>

Shows what is in the warehouse in an ERP or a shop back office, and what to order again. The reorder point is the level at which you order more.

<Demo title="Basic">
  <StockLevelsBasic />
  <template #code>

<<< ../demos/StockLevelsBasic.vue

  </template>
</Demo>

- `items` is a list. Each item has a `sku`, a `name`, the stock `onHand`, and the `reorderAt` point. It can also have a `location`, the `reserved` stock, and a `unit`.
- The available stock is on hand less reserved. Reserved stock is promised to orders.
- The state is "Out of stock" at zero available, "Low" at or below the reorder point, and "In stock" above it. Each state has a mark, a word, and an edge.
- The worst items come first, so what needs action is on top. A status line counts the items to reorder.
- The check box shows only the items to reorder.
- `locale` sets the format of the numbers. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `stockState` function gives the free stock and the state of one item. It is exported for your own views.

## Usage

```ts
import { BlessStockLevels } from "blessing-ui";
```

## API

<PropsTable name="BlessStockLevels" />

<script setup>
import StockLevelsBasic from "../demos/StockLevelsBasic.vue";
</script>
