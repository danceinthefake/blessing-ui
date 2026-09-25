---
title: Range
---

<script setup>
import RangeBasic from "../demos/RangeBasic.vue";
</script>

# Range

<p class="bless-lead">Two-thumb range on native inputs</p>

A span between two values — a price band, a date window, an age range. For one value use [Slider](./slider); when people know the exact numbers, two [InputNumber](./input-number)s are quicker.
<Demo title="Basic">
<RangeBasic />
<template #code>

<<< ../demos/RangeBasic.vue

  </template>
</Demo>

- Two native ranges, each with its own name ("Price minimum", "Price maximum") and keys. A thumb can't pass the other; `gap` keeps a minimum distance.
- `format` sets what's shown and read (`¥1,980`). `name` submits both thumbs, low then high.

## Usage

```ts
import { BlessRange } from "blessing-ui";
```

## API

<PropsTable name="BlessRange" />
