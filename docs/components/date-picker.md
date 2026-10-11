---
title: DatePicker
---

<script setup>
import DatePickerBasic from "../demos/DatePickerBasic.vue";
</script>

# DatePicker

<p class="bless-lead">Calendar in a popover</p>

A date field: a button showing the chosen date, [Calendar](./calendar) in a popover below it. The model is an ISO string, or `[start, end]` with `range`. `locale` only shapes the text shown (the model stays ISO), `min` / `max` pass through to the calendar. Picking a day closes the popover and returns focus to the field. Esc does the same without picking.

On touch devices (`pointer: coarse`), single mode renders the `<input type="date">` of the platform instead. The OS picker is better on a phone than any popover. The component decides this after mount, so server and client agree. `nativeOnTouch="false"` forces the popover everywhere. Inside a `BlessField`, the label of the field names it. For a calendar that lives in the page rather than a field, use `BlessCalendar` directly.

<Demo title="Basic">
  <DatePickerBasic />
  <template #code>

<<< ../demos/DatePickerBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` at a `<div>`. For this reason, a trigger placed inside a paragraph renders differently on the server and the client. Wrap it in a `<span>` or `<div>` instead.
:::

## Usage

```ts
import { BlessDatePicker } from "blessing-ui";
```

## API

<PropsTable name="BlessDatePicker" />
