---
title: Appointment card
---

<script setup>
import AppointmentCardBasic from "../demos/AppointmentCardBasic.vue";
</script>

# Appointment card

<p class="bless-lead">An appointment with the doctor, the place, the time, and actions</p>

Shows one booked visit in a clinic or health app. To book a time, use the [slot picker](./slot-picker).

<Demo title="Basic">
  <AppointmentCardBasic />
  <template #code>

<<< ../demos/AppointmentCardBasic.vue

  </template>
</Demo>

- `title` is what the visit is for. `date` is the day as `YYYY-MM-DD`, and `time` is the time as text.
- The date shows as a block with the month, the day, and the weekday. Screen readers hear the full date with the time.
- `person` has a `name`, and an optional `role` and `avatar`.
- `place` is the address. With `video`, the card says "Video call" and has a "Join the call" button.
- `status` is `confirmed` (default), `pending`, or `cancelled`. It shows as a mark and a word. A cancelled visit has a dashed edge, a struck title, and no buttons.
- The buttons emit `join`, `reschedule`, and `cancel`.
- `locale` sets the format of the date. Change the words with `labels` or a [label pack](../guide/translating): `video`, `join`, `reschedule`, `cancel`, and the three states.

## Usage

```ts
import { BlessAppointmentCard } from "blessing-ui";
```

## API

<PropsTable name="BlessAppointmentCard" />
