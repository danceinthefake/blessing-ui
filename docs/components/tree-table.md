---
title: TreeTable
---

<script setup>
import TreeTableBasic from "../demos/TreeTableBasic.vue";
</script>

# TreeTable

<p class="bless-lead">Expandable rows on BlessTable</p>

Rows that nest — a folder listing with sizes, a budget with sub-items — shown as a table with expandable rows. For a hierarchy without columns, use [Tree](./tree).

## When to use

A table whose rows can contain rows: file systems, org units, nested accounts. It renders through `BlessTable`, so columns, striping, row headers and cell slots all work the same; the first column (or `treeColumn`) gets the indent and the expand toggle. Control which rows are open with `v-model:expanded`.

For a plain hierarchy without columns, `BlessTree` is lighter. For a flat table, `BlessTable` or `BlessDataTable`.

<Demo title="Basic">
  <TreeTableBasic />
  <template #code>

<<< ../demos/TreeTableBasic.vue

  </template>
</Demo>

- The tree column (`treeColumn`, first by default) carries the indent and a toggle named by the row's value, which says whether it's open.
- `v-model:expanded` (or `defaultExpanded`) holds the open row ids; `childrenKey` names the children field.

## Usage

```ts
import { BlessTreeTable } from "blessing-ui";
```

## API

<PropsTable name="BlessTreeTable" />
