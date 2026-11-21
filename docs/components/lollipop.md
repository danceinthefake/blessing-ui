---
title: Lollipop
---

# Lollipop

<p class="bless-lead">A thin stick with a dot for each category</p>

Compares the values of many categories, as a bar chart does, with less ink. Thin sticks keep a long list easy to read. For bars with series side by side, use the [bar chart](./bar-chart).

<Demo title="Basic">
  <LollipopBasic />
  <template #code>

<<< ../demos/LollipopBasic.vue

  </template>
</Demo>

- `data` is a list of items. Each item has a `label`, a `value`, and an optional `color` that makes it stand out.
- Each stick starts at zero and ends with a dot at the value, and the value shows after the dot. A value below zero goes to the left.
- `sort` puts the items in order of value, high first. Without it, the items keep the order of the list.
- `color` sets the color of the sticks (default `chart-1`), and `format` sets the text of a value.
- For screen readers, the chart is a table. `label` names the table. Change the column names with `labels` or a [label pack](../guide/translating): `item` and `value`.

## Usage

```ts
import { BlessLollipop } from "blessing-ui";
```

## API

<PropsTable name="BlessLollipop" />

<script setup>
import LollipopBasic from "../demos/LollipopBasic.vue";
</script>
