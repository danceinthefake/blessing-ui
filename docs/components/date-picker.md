---
title: DatePicker
---

<script setup>
import DatePickerBasic from "../demos/DatePickerBasic.vue";
</script>

# DatePicker

<p class="bless-lead">Calendar in a popover</p>

<Demo title="Basic">
  <DatePickerBasic />
  <template #code>

<<< ../demos/DatePickerBasic.vue

  </template>
</Demo>

::: warning Not inside `<p>`
The floating panel is a `<div>`. HTML closes a `<p>` when it meets a `<div>`, so a trigger placed inside a paragraph renders differently on the server and the client. Wrap with `<span>`/`<div>` instead.
:::

## Usage

```ts
import { BlessDatePicker } from "blessing-ui";
```

## API

<PropsTable name="BlessDatePicker" />
