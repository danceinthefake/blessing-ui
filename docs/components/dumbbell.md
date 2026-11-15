---
title: Dumbbell
---

<script setup>
import DumbbellBasic from "../demos/DumbbellBasic.vue";
</script>

# Dumbbell

<p class="bless-lead">Two values for each row, joined by a line</p>

Shows the gap between two values of the same thing, for example before and after, or the plan and the actual. The length of the line is the size of the change. For many points in time, use the [line chart](./line-chart).

<Demo title="Basic">
  <DumbbellBasic />
  <template #code>

<<< ../demos/DumbbellBasic.vue

  </template>
</Demo>

- `data` is a list of rows. Each row has a `label`, a `start` value, and an `end` value.
- The start dot is gray and hollow. The end dot is filled, in `color` (default `chart-1`). A legend above the chart names the two dots.
- The axis starts at zero or at the lowest value, and ends at a round number. `format` sets the text of a value.
- For screen readers, the chart is a table with the two values and the change of each row. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `start` (default "Before"), `end` (default "After"), `row`, and `change`.

## Usage

```ts
import { BlessDumbbell } from "blessing-ui";
```

## API

<PropsTable name="BlessDumbbell" />
