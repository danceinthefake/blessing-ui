---
title: Slot picker
---

# Slot picker

<p class="bless-lead">The free times of a day, as buttons to pick one</p>

Shows the times that are free for a booking, for example a call, so a person picks one with a click. Put a [calendar](./calendar) before it to pick the day. For a free time of any length, use the [time picker](./time-picker).

<Demo title="Basic">
  <SlotPickerBasic />
  <template #code>

<<< ../demos/SlotPickerBasic.vue

  </template>
</Demo>

- `slots` is a list of times as `HH:MM` texts (24 hours), or of `{ time, disabled }`. A slot with `disabled` is taken: it shows with a line through it, but a person cannot pick it.
- The times are sorted and put in three groups: morning (before 12:00), afternoon (before 17:00), and evening. A group with no times does not show.
- `v-model` is the picked time as an `HH:MM` text, or `null`. `locale` shows the times in the format of a language, for example `en` for "1:30 PM". With no locale, the times show as `13:30`.
- Each slot is a native radio button, so the arrow keys move between the times, and screen readers say each group and the picked time. `disabled` turns all slots off.
- With no slots, the picker says that there are no free times.
- Change the words with `labels` or a [label pack](../guide/translating): `morning`, `afternoon`, `evening`, and `none`.

## Usage

```ts
import { BlessSlotPicker, type BlessSlot } from "blessing-ui";
```

## API

<PropsTable name="BlessSlotPicker" />

<script setup>
import SlotPickerBasic from "../demos/SlotPickerBasic.vue";
</script>
