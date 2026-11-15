---
title: Marimekko
---

<script setup>
import MarimekkoBasic from "../demos/MarimekkoBasic.vue";
</script>

# Marimekko

<p class="bless-lead">Bars whose width and height both show a share</p>

Shows two levels of shares in one picture. The width of a column is its share of all, and the height of each part is its share of the column. For one level of shares, use the [waffle](./waffle).

<Demo title="Basic">
  <MarimekkoBasic />
  <template #code>

<<< ../demos/MarimekkoBasic.vue

  </template>
</Demo>

- `data` is a list of columns, with a value for each series. `x` names the field with the name of the column.
- `series` takes the same series as the bar chart. The first series is the bottom part. A legend names the series.
- If a part has room, it shows its share as text. A hover on a part shows its value and share.
- `height` sets the height in pixels (default 280), and `format` sets the text of a value.
- For screen readers, the chart is a table with each value, its share, and the share of each column. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `column` and `share`.

## Usage

```ts
import { BlessMarimekko } from "blessing-ui";
```

## API

<PropsTable name="BlessMarimekko" />
