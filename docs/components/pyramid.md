---
title: Pyramid
---

<script setup>
import PyramidBasic from "../demos/PyramidBasic.vue";
</script>

# Pyramid

<p class="bless-lead">Back-to-back bars for two groups on each row</p>

Compares two groups row by row, with one group to the left and one to the right. For example, it shows listeners by age, with men on one side and women on the other. For two values on one line, use the [dumbbell](./dumbbell).

<Demo title="Basic">
  <PyramidBasic />
  <template #code>

<<< ../demos/PyramidBasic.vue

  </template>
</Demo>

- `data` is a list of rows. Each row has a `label`, a `left` value, and a `right` value. The rows show in the order of the list, so put the top row first.
- The two sides use one scale, so equal values have bars of equal length. Each bar has its value at its outer end.
- `colors` sets the two colors, as token names or any CSS colors (default `chart-1` and `chart-2`). `format` sets the text of a value.
- Set the width of the middle column with the `--bless-pyramid-label` CSS variable (default `4.5rem`).
- For screen readers, the chart is a table. `label` names the table. Name the two sides and the rows with `labels` or a [label pack](../guide/translating): `left`, `right`, and `row`.

## Usage

```ts
import { BlessPyramid } from "blessing-ui";
```

## API

<PropsTable name="BlessPyramid" />
