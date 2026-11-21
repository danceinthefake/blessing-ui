---
title: Delivery picker
---

# Delivery picker

<p class="bless-lead">A day and a time window for delivery, with the fee of each window</p>

Lets a buyer choose when an order comes, at checkout. For a booking with exact start times, use the [slot picker](./slot-picker).

<Demo title="Basic">
  <DeliveryPickerBasic />
  <template #code>

<<< ../demos/DeliveryPickerBasic.vue

  </template>
</Demo>

- `days` is a list of days. Each day has a `date` as `YYYY-MM-DD` and a list of `windows`. Each window has an `id`, a `start` and an `end` as `HH:MM`, a `fee`, and an optional `full`.
- `v-model` is the id of the chosen window.
- The days and the windows are two groups of native radio buttons, so the arrow keys move inside each group.
- A window with a fee of 0 says "Free". A full window says "Full", has a dashed edge, and is off. If all the windows of a day are full, the day is off too.
- The first day with room shows first. If `v-model` already has a window, its day shows.
- `currency` is an ISO 4217 code (default `USD`), and `locale` sets the format of the money and the days.
- Change the words with `labels` or a [label pack](../guide/translating): `day`, `time`, `free`, and `full`.

## Usage

```ts
import { BlessDeliveryPicker } from "blessing-ui";
```

## API

<PropsTable name="BlessDeliveryPicker" />

<script setup>
import DeliveryPickerBasic from "../demos/DeliveryPickerBasic.vue";
</script>
