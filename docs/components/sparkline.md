---
title: Sparkline
---

<script setup>
import SparklineBasic from "../demos/SparklineBasic.vue";
</script>

# Sparkline

<p class="bless-lead">A tiny inline chart for a row, a card or a sentence</p>

A trend drawn at the size of a word: the last days of a metric in a table row, a stat card, a list item. It shows the shape, not the values, so pair it with the number it summarises. For a chart the reader studies — axes, tooltips, several series — use [Chart](./chart).

<Demo title="Line, bar and win/loss">
  <SparklineBasic />
  <template #code>

<<< ../demos/SparklineBasic.vue

  </template>
</Demo>

- `type="line"` (with `fill` and `dot` if wanted), `type="bar"` grows from zero so negatives hang below, `type="winloss"` ignores the size of a value and draws only whether it was up, down or flat.
- It is an image to assistive tech, named with a summary — the count, first and last value, low and high (or wins and losses for win/loss). Give it a `label` so it reads "Visits: 9 values, from 12 to 40…", and a `format` to put units on the numbers.
- Colour is a token name (`chart-2`, `success`, `danger`) or any CSS colour; `negativeColor` colours the values below zero. Colour is never the only signal: the bars sit above or below the line.
- Size is in pixels (`width`, `height`); there is no hover, so nothing to reach by keyboard.

## Usage

```ts
import { BlessSparkline } from "blessing-ui";
```

## API

<PropsTable name="BlessSparkline" />
