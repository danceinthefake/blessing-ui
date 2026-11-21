---
title: Availability grid
---

# Availability grid

<p class="bless-lead">A week of time cells, to mark when a person is free</p>

Lets a person mark the times when they are free, for example to find a time to record with a guest. A drag over the cells marks them. To pick one free time that you offer, use the [slot picker](./slot-picker).

<Demo title="Basic">
  <AvailabilityGridBasic />
  <template #code>

<<< ../demos/AvailabilityGridBasic.vue

  </template>
</Demo>

- `days` are the columns. They can be any text, for example `Mon` or `2026-11-16`. The rows are the times from `day-start` to `day-end` (default 9 to 18), in cells of `step` minutes (default 30).
- `v-model` is the list of free cells, each as `day HH:MM`, for example `Mon 09:30`. Your app turns it into a time on a date.
- A drag paints the rectangle from the first cell to the current one. If the first cell is busy, the drag marks the cells free. If it is free, the drag marks them busy. A drag works with a finger too.
- The grid has one Tab stop. The arrow keys move between the cells. Home and End go to the first and last day. Space or Enter marks a cell free or busy.
- Screen readers hear the day, the time, and "free" or "busy" for each cell. `locale` shows the times in the format of a language. `disabled` makes the grid read-only.
- Change the words with `labels` or a [label pack](../guide/translating): `label` (the name of the grid), `free`, and `busy`.

## Usage

```ts
import { BlessAvailabilityGrid } from "blessing-ui";
```

## API

<PropsTable name="BlessAvailabilityGrid" />

<script setup>
import AvailabilityGridBasic from "../demos/AvailabilityGridBasic.vue";
</script>
