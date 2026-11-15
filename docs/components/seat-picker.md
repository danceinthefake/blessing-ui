---
title: Seat picker
---

<script setup>
import SeatPickerBasic from "../demos/SeatPickerBasic.vue";
</script>

# Seat picker

<p class="bless-lead">A map of seats in rows, with prices by zone</p>

Lets a person choose seats for a show, a talk, or a live recording. Each seat shows its state: free, taken, or chosen. Its zone sets the price. For times in place of seats, use the [slot picker](./slot-picker).

<Demo title="Basic">
  <SeatPickerBasic />
  <template #code>

<<< ../demos/SeatPickerBasic.vue

  </template>
</Demo>

- `rows` is a list of rows, front first. Each row has a `label` and a list of `seats`. A `null` in the list is a gap, such as an aisle.
- Each seat has an `id`, and an optional `number`, `zone`, and `taken`. With no number, the seat gets its place among the seats of its row, so a gap does not count.
- `zones` gives each zone a `label`, a `price`, and an optional `color`. A free seat has an outline in the color of its zone. A chosen seat is filled with a check, and a taken seat is gray and crossed out.
- `v-model` is the list of chosen seat ids. `max` sets the most seats in one order (default 0, no limit).
- The line under the legend says how many seats are chosen and the total. `currency` and `locale` set the format of the money.
- Each seat is a toggle button with a full name, such as "Row C, seat 5, Middle, $25". The map has one tab stop, and the arrow keys move between seats, over gaps and to the next row.
- Change the words with `labels` or a [label pack](../guide/translating): `stage`, `free`, `taken`, `chosen`, and the functions `seat` and `summary`.

## Usage

```ts
import { BlessSeatPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessSeatPicker" />
