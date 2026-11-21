---
title: Room booking
---

# Room booking

<p class="bless-lead">The rooms and the hours of one day, with the booked times and a free time to pick</p>

Lets people find a free meeting room and book it. For the events of a person over many days, use the [scheduler](./scheduler).

<Demo title="Basic">
  <RoomBookingBasic />
  <template #code>

<<< ../demos/RoomBookingBasic.vue

  </template>
</Demo>

- `rooms` is the list of rooms, each with an `id`, a `name`, and optional `seats`.
- `bookings` is the list of booked times. Each has a `room`, a `start` and an `end` as "HH:MM", and an optional `title`.
- `from` and `to` are the first and the last hour of the day (default 8 and 18). Each cell is 30 minutes.
- A booked time fills its cells with stripes and its title. A free cell is a button with the room and the time in its name.
- Click a free cell to pick it. Click a later cell in the same room to make the time longer. If a booking is in between, the click starts a new pick.
- `v-model` is the picked time. The status line says it in words. Book emits `book` with it, and you add it to `bookings`.
- On a narrow screen, the table scrolls sideways. The scroll area takes the focus, so you can scroll it with the keyboard.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessRoomBooking } from "blessing-ui";
```

## API

<PropsTable name="BlessRoomBooking" />

<script setup>
import RoomBookingBasic from "../demos/RoomBookingBasic.vue";
</script>
