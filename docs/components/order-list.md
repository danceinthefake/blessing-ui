---
title: OrderList
---

<script setup>
import OrderListBasic from "../demos/OrderListBasic.vue";
</script>

# OrderList

<p class="bless-lead">Drag / button / Alt+arrow reorder</p>

A list whose order is the setting — a playlist, a priority list, the columns of a table. To move items between two lists, use [PickList](./pick-list).

<Demo title="Basic">
  <OrderListBasic />
  <template #code>

<<< ../demos/OrderListBasic.vue

  </template>
</Demo>

- Three ways to move: drag, the ↑ ↓ buttons, or focus a row and press Alt+↑ / Alt+↓. Each move is announced ("Moved to position 2 of 5") and focus follows the item.
- Pass `rowKey` when items have an id, so rows keep their state (an open menu, an input) as they move.
- `:buttons="false"` hides the buttons; keyboard and drag still work.

## Usage

```ts
import { BlessOrderList } from "blessing-ui";
```

## API

<PropsTable name="BlessOrderList" />
