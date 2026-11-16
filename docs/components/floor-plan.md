---
title: Floor plan
---

<script setup>
import FloorPlanBasic from "../demos/FloorPlanBasic.vue";
</script>

# Floor plan

<p class="bless-lead">The rooms of a home with the devices in each room</p>

Shows a home as a simple plan in a smart home app. The reader picks a room to see its devices. The plan is a grid of cells, not a drawing to scale.

<Demo title="Basic">
  <FloorPlanBasic />
  <template #code>

<<< ../demos/FloorPlanBasic.vue

  </template>
</Demo>

- `rooms` is a list of rooms. Each room has an `id` and a `name`. `x` and `y` give its place, and `w` and `h` give its size, in grid cells from the top left.
- `columns` is the number of cells across the plan (default 12). Each row of cells is 3rem high.
- `devices` is a list of devices. Each device has an `id`, a `name`, the `room` id, an optional `icon`, and `on`.
- Each room is a button with its name and a count in words, such as "2 devices, 1 on". The icons of devices that are off are gray.
- `v-model` is the id of the open room. A second click closes it. The open room is pressed and has a thick inner edge.
- The `room` slot gets the open `room` and its `devices`. Put [device tiles](./device-tile) in it.
- Change the words with `labels` or a [label pack](../guide/translating): `title` and `devices` (a function).

## Usage

```ts
import { BlessFloorPlan } from "blessing-ui";
```

## API

<PropsTable name="BlessFloorPlan" />
