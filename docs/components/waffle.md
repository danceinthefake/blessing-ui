---
title: Waffle
---

# Waffle

<p class="bless-lead">Parts of a whole as a grid of 100 squares</p>

Shows the share of each part as a count of squares. Each square is one percent, so "28 squares" reads as 28%. It is easier to compare than the slices of a pie. For a ring with the total in the middle, use the [donut chart](./donut-chart).

<Demo title="Basic">
  <WaffleBasic />
  <template #code>

<<< ../demos/WaffleBasic.vue

  </template>
</Demo>

- `data` is a list of parts. Each part has a `label`, a `value`, and an optional `color` (a token name or any CSS color).
- The squares fill row by row from the top, one part after the other. The counts are whole numbers that add up to 100.
- The legend shows the name, the share, and the value of each part. `format` sets the text of a value.
- Set the size of a square with the `--bless-waffle-cell` CSS variable (default `14px`).
- For screen readers, the grid is hidden and the legend is a list. `label` names the chart.

## Usage

```ts
import { BlessWaffle } from "blessing-ui";
```

## API

<PropsTable name="BlessWaffle" />

<script setup>
import WaffleBasic from "../demos/WaffleBasic.vue";
</script>
