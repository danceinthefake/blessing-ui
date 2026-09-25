---
title: TimePicker
---

<script setup>
import TimePickerBasic from "../demos/TimePickerBasic.vue";
</script>

# TimePicker

<p class="bless-lead">Native time input with quick picks</p>

A time of day. It is the native time input, so phones show their own wheel and the value is always `HH:MM`, whatever the display.

<Demo title="Basic">
  <TimePickerBasic />
  <template #code>

<<< ../demos/TimePickerBasic.vue

  </template>
</Demo>

- `step` spaces the suggested times (every 15 minutes by default). Any other minute can still be typed.
- `min` / `max` bound both the suggestions and validation; `hour12` shows the suggestions as `9:00 AM`; `seconds` adds seconds.
- Inside a [Field](./form) the field's label names it; alone it is called "Time" unless you pass `label`.

## Usage

```ts
import { BlessTimePicker } from "blessing-ui";
```

## API

<PropsTable name="BlessTimePicker" />
