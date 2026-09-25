---
title: Table
---

<script setup>
import TableBasic from "../demos/TableBasic.vue";
</script>

# Table

<p class="bless-lead">Typed table, stacks on mobile</p>

Data to read and compare in rows and columns. When people need to sort, search, page or select, use [DataTable](./data-table).

<Demo title="Basic">
  <TableBasic />
  <template #code>

<<< ../demos/TableBasic.vue

  </template>
</Demo>

- Mark one column `header: true` so each row is named by it (a row header).
- `stack` (on by default) turns rows into label/value pairs under 800px instead of scrolling sideways; the table keeps its table semantics either way.
- `caption` (or `#caption`) names the table; `#cell-<key>` renders one column's cells yourself.

## Usage

```ts
import { BlessTable } from "blessing-ui";
```

## API

<PropsTable name="BlessTable" />
