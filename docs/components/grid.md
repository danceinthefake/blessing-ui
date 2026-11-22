---
title: Grid
---

# Grid

<p class="bless-lead">Responsive columns with token gap</p>

<Demo title="Basic">
  <GridBasic />
  <template #code>

<<< ../demos/GridBasic.vue

  </template>
</Demo>

- `min` alone fits as many columns as the width holds. Each column is at least `min` wide (16rem by default).
- `columns` alone is a fixed count. Use it inside a box that you know is wide enough.
- `columns` and `min` together give at most that many columns. When the box gets narrow, the grid drops columns before a column gets narrower than `min`. The demo does this: resize the window to see 3, 2, then 1 column.
- Each column is `minmax(0, 1fr)`, so a wide child such as a table cannot push the grid wider than its box.

## Usage

```ts
import { BlessGrid } from "blessing-ui";
```

## API

<PropsTable name="BlessGrid" />

<script setup>
import GridBasic from "../demos/GridBasic.vue";
</script>
