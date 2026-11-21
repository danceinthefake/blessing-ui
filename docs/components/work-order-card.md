---
title: Work order card
---

# Work order card

<p class="bless-lead">A work order with the product, the quantity, the due time, and the state</p>

A work order tells a station what to make, how many, and by when. Put the cards on a board of a line or on the screen of a station.

<Demo title="Basic">
  <WorkOrderCardBasic />
  <template #code>

<<< ../demos/WorkOrderCardBasic.vue

  </template>
</Demo>

- `number`, `product`, and `target` are required. `done` is how many are made, and `unit` is the unit (default `pcs`).
- `station` and `due` show under the product, as text.
- `state` is `queued` (default), `running`, `paused`, `blocked`, or `done`. It shows as a mark and a word. A running order has an accent top edge, and a blocked one is dashed and red.
- The progress is a native `progress` element, named such as "128 of 200 pcs".
- The buttons follow the state: Start for a queued order, Pause for a running one, Resume for a paused or blocked one, and Finish. They emit `start`, `pause`, and `finish`. A done order has no buttons.
- `locale` sets the format of the numbers. Change the words with `labels` or a [label pack](../guide/translating): the five states, `start`, `pause`, `resume`, `finish`, and the functions `due` and `progress`.

## Usage

```ts
import { BlessWorkOrderCard } from "blessing-ui";
```

## API

<PropsTable name="BlessWorkOrderCard" />

<script setup>
import WorkOrderCardBasic from "../demos/WorkOrderCardBasic.vue";
</script>
