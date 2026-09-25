---
title: Slider
---

<script setup>
import SliderBasic from "../demos/SliderBasic.vue";
</script>

# Slider

<p class="bless-lead">Native range</p>

One value on a scale where the rough position matters more than the exact number — volume, zoom, a price ceiling. For an exact number use [InputNumber](./input-number); for a span, [Range](./range).
<Demo title="Basic">
<SliderBasic />
<template #code>

<<< ../demos/SliderBasic.vue

  </template>
</Demo>

- A native range: arrows, Page keys and Home/End all work, and phones use their own drag.
- `showValue` prints the value beside the label; `format` sets what's shown and read (`35%`).
- Inside a [Field](./form) it gets the field's id, description and error.

## Usage

```ts
import { BlessSlider } from "blessing-ui";
```

## API

<PropsTable name="BlessSlider" />
