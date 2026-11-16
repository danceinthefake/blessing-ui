---
title: Picking list
---

<script setup>
import PickingListBasic from "../demos/PickingListBasic.vue";
</script>

# Picking list

<p class="bless-lead">The items to pick in a warehouse, with the place and a scan to confirm</p>

Guides a picker through the shelves to collect the items of an order, on a phone or a scanner. For two lists that trade items, use the [pick list](./pick-list).

<Demo title="Basic">
  <PickingListBasic />
  <template #code>

<<< ../demos/PickingListBasic.vue

  </template>
</Demo>

- `v-model` is the list of lines. Each line has an `id`, a `sku`, a `name`, a `location`, the `quantity` to pick, and the `picked` count so far.
- The lines sort by location, with numbers in their natural order, so the picker walks one way and does not go back.
- The scan field is a [SKU field](./sku-field). A scan of a code adds one to its line. A code that is not on the list, or one that is already picked in full, shows an error that screen readers hear at once.
- The − and + buttons change a count by hand. Each button has a name with the item.
- A bar and a status line show the progress. When all items are picked, the list says so and emits `complete`.
- `order` names the order on top. Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessPickingList } from "blessing-ui";
```

## API

<PropsTable name="BlessPickingList" />
