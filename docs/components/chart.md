---
title: Chart
---

<script setup>
import ChartBars from "../demos/ChartBars.vue";
import ChartBasic from "../demos/ChartBasic.vue";
</script>

# Chart

<p class="bless-lead">Themed frame for any [Unovis](https://unovis.dev) chart</p>

The frame around a chart from your charting library — title, description, legend, footer — in the system's type and series colours. The plot itself is yours.
<Demo title="Bars">
<ChartBars />
<template #code>

<<< ../demos/ChartBars.vue

  </template>
</Demo>

<Demo title="Basic">
  <ChartBasic />
  <template #code>

<<< ../demos/ChartBasic.vue

  </template>
</Demo>

- It is a `figure` captioned by `title` and `description`. Say the chart's point in the description ("Views doubled after episode 3"), and give the numbers somewhere as text or a [Table](./table): a picture of data can't be read aloud.
- `legend` lists series in `--bless-color-chart-1..5` order; those colours are at least 3:1 on the background in both themes.

## Usage

```ts
import { BlessChart } from "blessing-ui";
```

## API

<PropsTable name="BlessChart" />
