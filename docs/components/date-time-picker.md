---
title: DateTimePicker
---

<script setup>
import DateTimePickerBasic from "../demos/DateTimePickerBasic.vue";
</script>

# DateTimePicker

<p class="bless-lead">A date and a time in one field</p>

One field for a moment, such as the start of an event or a delivery slot. It is a [date picker](./date-picker) and a [time picker](./time-picker), fused into one shape (see [fuse when grouped](../design/)). For a date only, use the date picker. For a span of days, use the date picker with `range`.

<Demo title="Basic">
  <DateTimePickerBasic />
  <template #code>

<<< ../demos/DateTimePickerBasic.vue

  </template>
</Demo>

- The value is text in the form `YYYY-MM-DDTHH:MM`, in local time, as `<input type="datetime-local">` holds it. It has no time zone. To send it to a server, read it with your date library in the zone that you need.
- The value is set only when both parts are chosen. When you clear one part, the value becomes `undefined`.
- `min` and `max` use the same form. The days outside them are disabled. The time limits apply only on the first and the last allowed day.
- `step` spaces the suggested times, in minutes (default 15). You can still type any other minute.
- In a [field](./form), the field's label names the date part. The time part is named "Time". Change that word with `labels.time` or a [label pack](../guide/translating).
- On a touch screen, the date part uses the native date input, as the date picker does.

## Usage

```ts
import { BlessDateTimePicker } from "blessing-ui";
```

## API

<PropsTable name="BlessDateTimePicker" />
